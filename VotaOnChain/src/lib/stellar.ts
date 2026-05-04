import {
  Account,
  Address,
  Contract,
  Networks,
  rpc,
  Transaction,
  TransactionBuilder,
  scValToNative,
  nativeToScVal,
} from '@stellar/stellar-sdk';

const RPC_URL = 'https://soroban-testnet.stellar.org';
export const CONTRACT_ID = import.meta.env.VITE_CONTRACT_ID ?? '';
const NETWORK_PASSPHRASE = Networks.TESTNET;

export const server = new rpc.Server(RPC_URL);

// Lazy — evita el crash si CONTRACT_ID está vacío al cargar la página
function getContract(): Contract {
  if (!CONTRACT_ID) throw new Error('CONTRACT_ID no configurado. Crea .env.local con VITE_CONTRACT_ID.');
  return new Contract(CONTRACT_ID);
}

// Cuenta dummy para simular llamadas de solo lectura.
// La simulación de Soroban no valida balance ni secuencia del source account.
const DUMMY_ACCOUNT = new Account(
  'GBYLYPVE5WIRYS7WIISE3TLKMW6FMIK377HXLLJDE7VHUM4YMIMK7WDK',
  '0'
);

export const VOTE_OPTIONS = [
  { id: 'Opcion_A', label: 'Construir parque vecinal' },
  { id: 'Opcion_B', label: 'Reparar pistas y veredas' },
  { id: 'Opcion_C', label: 'Centro cultural comunitario' },
];

// Lee el mapa completo de votos desde el contrato (get_votes no recibe args)
export async function getVotes(): Promise<Record<string, number>> {
  try {
    const tx = new TransactionBuilder(DUMMY_ACCOUNT, {
      fee: '100',
      networkPassphrase: NETWORK_PASSPHRASE,
    })
      .addOperation(getContract().call('get_votes'))
      .setTimeout(30)
      .build();

    const sim = await server.simulateTransaction(tx);

    if (rpc.Api.isSimulationError(sim)) return {};

    const retval = (sim as rpc.Api.SimulateTransactionSuccessResponse).result?.retval;
    if (!retval) return {};

    // scValToNative convierte ScvMap a objeto plano { opcion: votos }
    const native = scValToNative(retval) as Record<string, number>;
    return native ?? {};
  } catch {
    return {};
  }
}

// Verifica si una wallet ya votó
export async function checkHasVoted(walletAddress: string): Promise<boolean> {
  try {
    const tx = new TransactionBuilder(DUMMY_ACCOUNT, {
      fee: '100',
      networkPassphrase: NETWORK_PASSPHRASE,
    })
      .addOperation(
        getContract().call('has_voted', new Address(walletAddress).toScVal())
      )
      .setTimeout(30)
      .build();

    const sim = await server.simulateTransaction(tx);
    if (rpc.Api.isSimulationError(sim)) return false;

    const retval = (sim as rpc.Api.SimulateTransactionSuccessResponse).result?.retval;
    return retval ? (scValToNative(retval) as boolean) : false;
  } catch {
    return false;
  }
}

// Construye y prepara la transacción de voto (lista para firmar)
export async function buildVoteTx(walletAddress: string, optionId: string): Promise<string> {
  const accountData = await server.getAccount(walletAddress);
  const tx = new TransactionBuilder(accountData, {
    fee: '1000',
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(
      getContract().call(
        'vote',
        new Address(walletAddress).toScVal(),
        nativeToScVal(optionId, { type: 'symbol' })
      )
    )
    .setTimeout(60)
    .build();

  // prepareTransaction agrega las entradas de auth necesarias
  const prepared = await server.prepareTransaction(tx);
  return prepared.toXDR();
}

// Envía la transacción firmada y espera la confirmación on-chain
export async function submitSignedTx(signedXDR: string): Promise<string> {
  const tx = TransactionBuilder.fromXDR(signedXDR, NETWORK_PASSPHRASE) as Transaction;
  const response = await server.sendTransaction(tx);

  if (response.status === 'ERROR') {
    throw new Error('La transacción fue rechazada por la red');
  }

  // Polling hasta confirmar el resultado
  let result: rpc.Api.GetTransactionResponse;
  let attempts = 0;
  do {
    await new Promise((r) => setTimeout(r, 1000));
    result = await server.getTransaction(response.hash);
    attempts++;
  } while (result.status === 'NOT_FOUND' && attempts < 30);

  if (result.status === 'FAILED') throw new Error('La transacción falló en la red');
  if (attempts >= 30) throw new Error('Timeout esperando confirmación');

  return response.hash;
}
