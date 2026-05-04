# Frontend con Stellar SDK

Guía para integrar Stellar y Soroban en aplicaciones web con JavaScript/TypeScript, React y Next.js.

---

## Instalación

```bash
# SDK principal de Stellar (incluye Soroban RPC)
npm install @stellar/stellar-sdk

# Stellar Wallets Kit — para múltiples wallets (recomendado)
npm install @creit.tech/stellar-wallets-kit

# Freighter API — si solo necesitas Freighter
npm install @stellar/freighter-api
```

---

## Conectar wallet con Stellar Wallets Kit

Stellar Wallets Kit soporta múltiples wallets (Freighter, LOBSTR, xBull, etc.) con una sola interfaz.

```typescript
import {
  StellarWalletsKit,
  WalletNetwork,
  FREIGHTER_ID,
  allowAllModules,
} from '@creit.tech/stellar-wallets-kit';

// Inicializar el kit
const kit = new StellarWalletsKit({
  network: WalletNetwork.TESTNET,
  selectedWalletId: FREIGHTER_ID,
  modules: allowAllModules(),
});

// Abrir modal de selección de wallet
await kit.openModal({
  onWalletSelected: async (option) => {
    kit.setWallet(option.id);
    const { address } = await kit.getAddress();
    console.log('Cuenta conectada:', address);
  },
});

// Obtener dirección actual
const { address } = await kit.getAddress();

// Firmar una transacción
const { signedTxXdr } = await kit.signTransaction(txXdr, {
  networkPassphrase: WalletNetwork.TESTNET,
});
```

---

## Conectar con Freighter directamente

```typescript
import freighter from '@stellar/freighter-api';

// Verificar si está instalado
const instalado = await freighter.isConnected();
if (!instalado) {
  alert('Instala la extensión Freighter en tu navegador');
  return;
}

// Solicitar acceso
const acceso = await freighter.requestAccess();
if (acceso.error) {
  console.error('Acceso denegado:', acceso.error);
  return;
}

// Obtener clave pública
const { publicKey } = await freighter.getPublicKey();

// Firmar transacción
const { signedTxXdr } = await freighter.signTransaction(txXdr, {
  networkPassphrase: 'Test SDF Network ; September 2015',
});
```

---

## Cliente RPC para Soroban

```typescript
import { SorobanRpc, Networks } from '@stellar/stellar-sdk';

const RPC_URL = {
  testnet: 'https://soroban-testnet.stellar.org',
  mainnet: 'https://soroban-mainnet.stellar.org',
};

const rpc = new SorobanRpc.Server(RPC_URL.testnet);

// Obtener info de una cuenta
const cuenta = await rpc.getAccount('G...');

// Simular una transacción Soroban (sin enviarla)
const simulacion = await rpc.simulateTransaction(tx);

// Enviar transacción
const resultado = await rpc.sendTransaction(txFirmada);

// Esperar confirmación
async function esperarConfirmacion(hash: string) {
  let intento = 0;
  while (intento < 20) {
    const estado = await rpc.getTransaction(hash);
    if (estado.status !== 'NOT_FOUND') return estado;
    await new Promise(r => setTimeout(r, 1500));
    intento++;
  }
  throw new Error('Tiempo de espera agotado');
}
```

---

## Invocar contrato Soroban desde frontend

```typescript
import {
  Contract,
  SorobanRpc,
  TransactionBuilder,
  Networks,
  BASE_FEE,
  nativeToScVal,
  scValToNative,
  Address,
} from '@stellar/stellar-sdk';

const rpc = new SorobanRpc.Server('https://soroban-testnet.stellar.org');
const CONTRACT_ID = 'C...'; // ID del contrato desplegado

async function invocarContrato(
  publicKey: string,
  nombreFuncion: string,
  args: any[],
  firmar: (xdr: string) => Promise<string>,
) {
  // 1. Cargar cuenta
  const cuenta = await rpc.getAccount(publicKey);

  // 2. Construir transacción
  const contrato = new Contract(CONTRACT_ID);
  const tx = new TransactionBuilder(cuenta, {
    fee: BASE_FEE,
    networkPassphrase: Networks.TESTNET,
  })
    .addOperation(contrato.call(nombreFuncion, ...args))
    .setTimeout(30)
    .build();

  // 3. Simular para obtener fee exacto y datos de retorno
  const simulacion = await rpc.simulateTransaction(tx);
  if (SorobanRpc.Api.isSimulationError(simulacion)) {
    throw new Error(`Error en simulación: ${simulacion.error}`);
  }

  // 4. Preparar con fee calculado
  const txPreparada = SorobanRpc.assembleTransaction(tx, simulacion).build();

  // 5. Firmar con wallet
  const xdrFirmado = await firmar(txPreparada.toXDR());
  const txFirmada = TransactionBuilder.fromXDR(xdrFirmado, Networks.TESTNET);

  // 6. Enviar
  const { hash } = await rpc.sendTransaction(txFirmada);

  // 7. Esperar resultado
  const resultado = await esperarConfirmacion(hash);
  if (resultado.status === 'SUCCESS') {
    return scValToNative(resultado.returnValue);
  }
  throw new Error(`Transacción fallida: ${resultado.resultXdr}`);
}

// Ejemplo de uso
const saldo = await invocarContrato(
  publicKey,
  'balance',
  [new Address(publicKey).toScVal()],
  (xdr) => kit.signTransaction(xdr, { networkPassphrase: Networks.TESTNET }).then(r => r.signedTxXdr),
);
```

---

## Hook React para conexión de wallet

```typescript
// hooks/useStellarWallet.ts
import { useState, useCallback } from 'react';
import { StellarWalletsKit, WalletNetwork, allowAllModules } from '@creit.tech/stellar-wallets-kit';

const kit = new StellarWalletsKit({
  network: WalletNetwork.TESTNET,
  modules: allowAllModules(),
});

export function useStellarWallet() {
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [conectando, setConectando] = useState(false);

  const conectar = useCallback(async () => {
    setConectando(true);
    try {
      await kit.openModal({
        onWalletSelected: async (opcion) => {
          kit.setWallet(opcion.id);
          const { address } = await kit.getAddress();
          setPublicKey(address);
        },
      });
    } finally {
      setConectando(false);
    }
  }, []);

  const desconectar = useCallback(() => {
    setPublicKey(null);
  }, []);

  const firmar = useCallback(async (txXdr: string) => {
    const { signedTxXdr } = await kit.signTransaction(txXdr, {
      networkPassphrase: WalletNetwork.TESTNET,
    });
    return signedTxXdr;
  }, []);

  return { publicKey, conectando, conectar, desconectar, firmar };
}
```

---

## Componente de conexión de wallet (React)

```tsx
// components/WalletConnect.tsx
import { useStellarWallet } from '../hooks/useStellarWallet';

export function WalletConnect() {
  const { publicKey, conectando, conectar, desconectar } = useStellarWallet();

  const direccionCorta = (addr: string) =>
    `${addr.slice(0, 4)}...${addr.slice(-4)}`;

  if (publicKey) {
    return (
      <div className="flex items-center gap-2">
        <span className="font-mono text-sm">{direccionCorta(publicKey)}</span>
        <button
          onClick={desconectar}
          className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
        >
          Desconectar
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={conectar}
      disabled={conectando}
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
    >
      {conectando ? 'Conectando...' : 'Conectar Wallet'}
    </button>
  );
}
```

---

## Leer saldo XLM de una cuenta

```typescript
import { Horizon } from '@stellar/stellar-sdk';

const horizon = new Horizon.Server('https://horizon-testnet.stellar.org');

async function obtenerSaldoXLM(publicKey: string): Promise<string> {
  const cuenta = await horizon.loadAccount(publicKey);
  const saldoNativo = cuenta.balances.find(
    (b) => b.asset_type === 'native'
  );
  return saldoNativo?.balance ?? '0';
}

// Leer todos los saldos
async function obtenerSaldos(publicKey: string) {
  const cuenta = await horizon.loadAccount(publicKey);
  return cuenta.balances.map((b) => ({
    activo: b.asset_type === 'native' ? 'XLM' : `${b.asset_code}:${b.asset_issuer}`,
    saldo: b.balance,
  }));
}
```

---

## Generar bindings TypeScript para un contrato

Los bindings permiten llamar funciones del contrato con tipos TypeScript completos:

```bash
# Generar desde la CLI de Soroban
soroban contract bindings typescript \
  --id <CONTRACT_ID> \
  --network testnet \
  --output-dir ./src/contracts/mi-contrato

# Instalar el paquete generado
cd ./src/contracts/mi-contrato && npm install && npm run build
```

```typescript
// Uso de los bindings generados
import { Client as MiContratoClient } from './contracts/mi-contrato';

const cliente = new MiContratoClient({
  contractId: CONTRACT_ID,
  networkPassphrase: Networks.TESTNET,
  rpcUrl: 'https://soroban-testnet.stellar.org',
  publicKey,
  signTransaction: async (xdr) => {
    const { signedTxXdr } = await kit.signTransaction(xdr);
    return { signedTxXdr };
  },
});

// Invocar con tipos completos
const resultado = await cliente.mi_funcion({ parametro: 'valor' });
```

---

## Variables de entorno para Next.js

```bash
# .env.local
NEXT_PUBLIC_STELLAR_NETWORK=testnet
NEXT_PUBLIC_RPC_URL=https://soroban-testnet.stellar.org
NEXT_PUBLIC_HORIZON_URL=https://horizon-testnet.stellar.org
NEXT_PUBLIC_CONTRACT_ID=C...
```

```typescript
// lib/config.ts
export const CONFIG = {
  network: process.env.NEXT_PUBLIC_STELLAR_NETWORK as 'testnet' | 'mainnet',
  rpcUrl: process.env.NEXT_PUBLIC_RPC_URL!,
  horizonUrl: process.env.NEXT_PUBLIC_HORIZON_URL!,
  contractId: process.env.NEXT_PUBLIC_CONTRACT_ID!,
  networkPassphrase:
    process.env.NEXT_PUBLIC_STELLAR_NETWORK === 'mainnet'
      ? 'Public Global Stellar Network ; September 2015'
      : 'Test SDF Network ; September 2015',
} as const;
```
