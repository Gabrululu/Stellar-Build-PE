/**
 * Script de deploy del contrato VotaOnChain en Stellar Testnet.
 *
 * Uso:
 *   node deploy.mjs [SECRET_KEY]
 *
 * Si no pasas SECRET_KEY, genera una cuenta nueva y la fondea con Friendbot.
 * El WASM debe estar en target/wasm32v1-none/release/vota_onchain.wasm
 */

import { readFileSync } from 'fs';
import pkg from '@stellar/stellar-sdk';

const {
  Keypair, rpc, TransactionBuilder, Networks, BASE_FEE,
  xdr, Operation, Address, Contract, scValToNative,
} = pkg;

const RPC_URL = 'https://soroban-testnet.stellar.org';
const NETWORK = Networks.TESTNET;
const WASM_PATH = new URL('./target/wasm32v1-none/release/vota_onchain.wasm', import.meta.url);
const OPTIONS = ['Opcion_A', 'Opcion_B', 'Opcion_C'];

const server = new rpc.Server(RPC_URL);

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function esperarTx(hash) {
  for (let i = 0; i < 30; i++) {
    const estado = await server.getTransaction(hash);
    if (estado.status !== 'NOT_FOUND') return estado;
    await sleep(1500);
  }
  throw new Error('Timeout esperando transacción');
}

async function enviarTx(tx, keypair) {
  tx.sign(keypair);
  const resp = await server.sendTransaction(tx);
  if (resp.status === 'ERROR') {
    throw new Error(`Error al enviar: ${JSON.stringify(resp.errorResult)}`);
  }
  console.log(`  Hash: ${resp.hash}`);
  const resultado = await esperarTx(resp.hash);
  if (resultado.status === 'FAILED') throw new Error('Transacción fallida');
  return resultado;
}

async function simYPrep(tx) {
  const sim = await server.simulateTransaction(tx);
  if (rpc.Api.isSimulationError(sim)) throw new Error(`Simulación falló: ${sim.error}`);
  return rpc.assembleTransaction(tx, sim).build();
}

async function main() {
  let keypair;
  if (process.argv[2]) {
    keypair = Keypair.fromSecret(process.argv[2]);
    console.log(`Cuenta: ${keypair.publicKey()}`);
  } else {
    keypair = Keypair.random();
    console.log(`Nueva cuenta: ${keypair.publicKey()}`);
    console.log(`Secret key:   ${keypair.secret()}`);
    console.log('Fondeando con Friendbot...');
    const r = await fetch(`https://friendbot.stellar.org?addr=${keypair.publicKey()}`);
    if (!r.ok) throw new Error('Error con Friendbot');
    console.log('Cuenta fondeada. Esperando confirmación...');
    await sleep(4000);
  }

  // 1. Subir WASM
  console.log('\n[1/3] Subiendo WASM...');
  let cuenta = await server.getAccount(keypair.publicKey());
  const wasm = readFileSync(WASM_PATH);

  const uploadTx = new TransactionBuilder(cuenta, { fee: BASE_FEE, networkPassphrase: NETWORK })
    .addOperation(Operation.uploadContractWasm({ wasm }))
    .setTimeout(60).build();
  const uploadPrep = await simYPrep(uploadTx);
  const uploadResult = await enviarTx(uploadPrep, keypair);
  const wasmHash = uploadResult.returnValue.bytes();
  console.log(`  WASM hash: ${Buffer.from(wasmHash).toString('hex')}`);

  // 2. Deploy
  console.log('\n[2/3] Deployando contrato...');
  cuenta = await server.getAccount(keypair.publicKey());
  const salt = Buffer.from(Array.from({ length: 32 }, () => Math.floor(Math.random() * 256)));

  const deployTx = new TransactionBuilder(cuenta, { fee: BASE_FEE, networkPassphrase: NETWORK })
    .addOperation(Operation.createCustomContract({
      wasmHash,
      address: new Address(keypair.publicKey()),
      salt,
    }))
    .setTimeout(60).build();
  const deployPrep = await simYPrep(deployTx);
  const deployResult = await enviarTx(deployPrep, keypair);

  let contractId;
  try {
    contractId = Address.fromScAddress(deployResult.returnValue.address()).toString();
  } catch {
    contractId = String(scValToNative(deployResult.returnValue));
  }
  console.log(`  Contract ID: ${contractId}`);

  // 3. Inicializar
  console.log('\n[3/3] Inicializando opciones de voto...');
  cuenta = await server.getAccount(keypair.publicKey());
  const contrato = new Contract(contractId);
  const opcionesScVal = xdr.ScVal.scvVec(OPTIONS.map(o => xdr.ScVal.scvSymbol(o)));

  const initTx = new TransactionBuilder(cuenta, { fee: BASE_FEE, networkPassphrase: NETWORK })
    .addOperation(contrato.call('init', opcionesScVal))
    .setTimeout(60).build();
  const initPrep = await simYPrep(initTx);
  await enviarTx(initPrep, keypair);
  console.log('  Opciones:', OPTIONS.join(', '));

  console.log('\n✅ Deploy completado!\n');
  console.log('Copia esto en VotaOnChain/.env.local:');
  console.log('─'.repeat(45));
  console.log(`VITE_CONTRACT_ID=${contractId}`);
  console.log('─'.repeat(45));
}

main().catch(err => { console.error('\n❌ Error:', err.message); process.exit(1); });
