# APIs de Stellar: RPC y Horizon

Guía para consultar datos de la red Stellar usando Stellar RPC (para Soroban) y Horizon (para operaciones clásicas).

---

## Cuándo usar cada API

| Tarea | API recomendada | Por qué |
|---|---|---|
| Invocar contratos Soroban | **RPC** | Es la única forma |
| Simular transacciones Soroban | **RPC** | Incluye fee y datos de retorno |
| Pagos clásicos XLM/activos | Horizon | Más simple, streaming disponible |
| Leer saldos de cuentas | Horizon o RPC | Horizon es más conveniente |
| Historial de transacciones | **Horizon** | RPC no tiene historial |
| Precio de gas/fee | **RPC** | `getFeeStats` más preciso |
| Leer estado de contrato | **RPC** | `getLedgerEntries` |
| Streaming de eventos | **Horizon** | SSE disponible |

---

## Stellar RPC

### URLs de RPC

| Red | URL |
|---|---|
| Testnet | `https://soroban-testnet.stellar.org` |
| Mainnet | `https://soroban-mainnet.stellar.org` |
| Local | `http://localhost:8000/soroban/rpc` |

### Métodos principales del RPC

```typescript
import { SorobanRpc } from '@stellar/stellar-sdk';

const rpc = new SorobanRpc.Server('https://soroban-testnet.stellar.org');

// Obtener información de cuenta
const cuenta = await rpc.getAccount('G...');
console.log('Sequence:', cuenta.sequenceNumber());

// Simular transacción (sin enviar)
const sim = await rpc.simulateTransaction(tx);
if (SorobanRpc.Api.isSimulationError(sim)) {
  console.error('Error:', sim.error);
} else {
  console.log('Fee estimado:', sim.minResourceFee);
  console.log('Resultado:', sim.result?.retval);
}

// Enviar transacción
const envio = await rpc.sendTransaction(txFirmada);
console.log('Hash:', envio.hash, 'Estado:', envio.status);

// Obtener estado de transacción
const estado = await rpc.getTransaction(hash);
// estados: SUCCESS | FAILED | NOT_FOUND

// Obtener entradas del ledger (leer estado de contrato)
const clave = xdr.LedgerKey.contractData(
  new xdr.LedgerKeyContractData({
    contract: new Address(CONTRACT_ID).toScAddress(),
    key: xdr.ScVal.scvSymbol('mi_clave'),
    durability: xdr.ContractDataDurability.persistent(),
  })
);
const entradas = await rpc.getLedgerEntries(clave);
console.log('Valor:', scValToNative(entradas.entries[0].val));

// Estadísticas de fees
const fees = await rpc.getFeeStats();
console.log('Fee recomendado:', fees.sorobanInclusionFee.p90);

// Estado actual de la red
const ledger = await rpc.getLatestLedger();
console.log('Ledger actual:', ledger.sequence);
```

### Obtener eventos de contrato

```typescript
// Obtener eventos emitidos por un contrato
const eventos = await rpc.getEvents({
  startLedger: ledger.sequence - 1000,
  filters: [{
    type: 'contract',
    contractIds: [CONTRACT_ID],
    topics: [
      ['*'], // cualquier topic en posición 0
    ],
  }],
  limit: 100,
});

for (const evento of eventos.events) {
  console.log('Ledger:', evento.ledger);
  console.log('Topics:', evento.topic.map(scValToNative));
  console.log('Valor:', scValToNative(evento.value));
}
```

---

## Horizon API

### URLs de Horizon

| Red | URL |
|---|---|
| Testnet | `https://horizon-testnet.stellar.org` |
| Mainnet | `https://horizon.stellar.org` |

### Uso básico con JS SDK

```typescript
import { Horizon, Asset } from '@stellar/stellar-sdk';

const horizon = new Horizon.Server('https://horizon-testnet.stellar.org');

// Cargar cuenta
const cuenta = await horizon.loadAccount('G...');
console.log('Saldos:', cuenta.balances);

// Historial de transacciones
const txs = await horizon.transactions()
  .forAccount('G...')
  .order('desc')
  .limit(10)
  .call();

for (const tx of txs.records) {
  console.log('Hash:', tx.hash, 'Fecha:', tx.created_at);
}

// Pagos de una cuenta
const pagos = await horizon.payments()
  .forAccount('G...')
  .order('desc')
  .limit(20)
  .call();

// Historial de un activo
const historial = await horizon.payments()
  .forAsset(new Asset('USDC', 'G...ISSUER'))
  .order('desc')
  .limit(10)
  .call();

// Order book de par de activos
const orderbook = await horizon.orderbook(
  new Asset('USDC', 'G...ISSUER'),
  Asset.native()
).call();
console.log('Ofertas de compra:', orderbook.bids);
console.log('Ofertas de venta:', orderbook.asks);
```

### Streaming con Horizon (SSE)

```typescript
// Escuchar pagos en tiempo real
const cerrar = horizon.payments()
  .forAccount('G...')
  .cursor('now')
  .stream({
    onmessage: (pago) => {
      console.log('Nuevo pago recibido:', pago);
    },
    onerror: (error) => {
      console.error('Error en stream:', error);
    },
  });

// Para detener el stream
// cerrar();

// Escuchar transacciones en tiempo real
const cerrarTxStream = horizon.transactions()
  .forAccount('G...')
  .cursor('now')
  .stream({
    onmessage: (tx) => {
      console.log('Nueva transacción:', tx.hash);
    },
  });
```

---

## Horizon API directa (HTTP)

```bash
# Estado de una cuenta
curl https://horizon-testnet.stellar.org/accounts/G...

# Saldos de una cuenta
curl https://horizon-testnet.stellar.org/accounts/G... | jq '.balances'

# Últimas 10 transacciones
curl "https://horizon-testnet.stellar.org/accounts/G.../transactions?order=desc&limit=10"

# Información de un activo
curl "https://horizon-testnet.stellar.org/assets?asset_code=USDC&asset_issuer=G..."

# Estado del ledger actual
curl https://horizon-testnet.stellar.org/ledgers?order=desc&limit=1

# Paths de pago (para encontrar ruta más barata)
curl "https://horizon-testnet.stellar.org/paths/strict-send?source_asset_type=native&source_amount=10&destination_account=G..."
```

---

## Manejo de errores

```typescript
import { SorobanRpc, Horizon } from '@stellar/stellar-sdk';

// Errores de RPC
try {
  const resultado = await rpc.sendTransaction(tx);
  if (resultado.status === 'ERROR') {
    const xdr = resultado.errorResult;
    console.error('Error de red:', xdr);
  }
} catch (e) {
  if (e instanceof SorobanRpc.Api.SimulationError) {
    console.error('Error en simulación:', e.error);
  }
}

// Errores de Horizon
try {
  await horizon.submitTransaction(tx);
} catch (e: any) {
  if (e.response?.data?.extras?.result_codes) {
    const codes = e.response.data.extras.result_codes;
    console.error('Código de error de transacción:', codes.transaction);
    console.error('Códigos de error de operaciones:', codes.operations);
  }
}
```

### Códigos de error comunes de Horizon

| Código | Significado |
|---|---|
| `tx_bad_seq` | Sequence number incorrecto — recargar cuenta |
| `tx_insufficient_fee` | Fee muy bajo — incrementar fee |
| `op_underfunded` | Saldo insuficiente |
| `op_no_trust` | Destinatario no tiene trustline |
| `op_line_full` | Trustline del destinatario está llena |
| `tx_too_late` | Expiró el timeout de la transacción |

---

## Calcular fees dinámicos

```typescript
import { SorobanRpc } from '@stellar/stellar-sdk';

async function calcularFeeOptimo(): Promise<string> {
  const rpc = new SorobanRpc.Server('https://soroban-testnet.stellar.org');
  const stats = await rpc.getFeeStats();
  
  // Usar el percentil 90 para alta probabilidad de inclusión
  const feeRecomendado = parseInt(stats.sorobanInclusionFee.p90);
  
  // Agregar 10% de margen
  return Math.ceil(feeRecomendado * 1.1).toString();
}

// Para transacciones clásicas (no Soroban)
const fee = (await horizon.fetchBaseFee()).toString();
```

---

## Horizon vs RPC — comparación de respuestas

```typescript
// Leer cuenta con Horizon
const cuentaHorizon = await horizon.loadAccount(pubKey);
// Retorna: id, sequence, balances[], signers[], flags, etc.

// Leer cuenta con RPC
const cuentaRpc = await rpc.getAccount(pubKey);
// Retorna: id, sequence — más limitado pero más rápido para Soroban

// Recomendación: para apps que usan solo Soroban, usa RPC para todo.
// Para apps que mezclan clásico + Soroban, conecta ambas APIs.
```
