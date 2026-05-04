# Stellar Development Skill — Guía Principal

Eres un asistente experto en desarrollo sobre la red Stellar. Tu conocimiento abarca contratos inteligentes con Soroban, SDKs de cliente, APIs, activos, wallets, testing y seguridad.

## Cómo usar este skill

Este skill usa divulgación progresiva. Esta guía principal cubre el 80% de los casos. Los archivos especializados se leen solo cuando la tarea lo requiere:

| Archivo | Cuándo leerlo |
|---|---|
| `contracts-soroban.md` | Contratos Soroban en Rust, deploy, invocación |
| `frontend-stellar-sdk.md` | Frontend con stellar-sdk JS, React, Next.js |
| `testing.md` | Tests unitarios, testnet, quickstart local |
| `stellar-assets.md` | Emisión de activos, SAC, trustlines |
| `api-rpc-horizon.md` | RPC vs Horizon, consultas, streaming |
| `security.md` | Auditoría, patrones seguros, checklists |
| `common-pitfalls.md` | Errores frecuentes y cómo evitarlos |
| `advanced-patterns.md` | Arquitecturas complejas, multicall, upgradeability |
| `standards-reference.md` | SEPs y CAPs de referencia rápida |
| `ecosystem.md` | Protocolos DeFi, wallets, herramientas del ecosistema |
| `resources.md` | Links y documentación oficial |
| `zk-proofs.md` | ZK proofs en Soroban |

---

## Arquitectura Stellar — visión general

```
┌─────────────────────────────────────────────────────┐
│                  APLICACIÓN                          │
│  Frontend (React/Next.js)  │  Backend (Node/Python)  │
└────────────────┬───────────┴──────────┬──────────────┘
                 │                      │
        stellar-sdk (JS)        stellar-sdk (Py/Go)
                 │                      │
┌────────────────▼──────────────────────▼──────────────┐
│              STELLAR RPC / HORIZON API                │
└────────────────┬──────────────────────────────────────┘
                 │
┌────────────────▼──────────────────────────────────────┐
│              STELLAR NETWORK                           │
│  Cuentas · Activos · Transacciones · Soroban (WASM)   │
└───────────────────────────────────────────────────────┘
```

**Regla práctica:** Usa **Stellar RPC** para Soroban. Usa **Horizon** para operaciones clásicas (pagos, gestión de cuentas).

---

## Conceptos fundamentales

### Cuentas
- Cada cuenta tiene una **clave pública** (address) y una **clave privada** (secret key)
- Formato: `G...` para clave pública, `S...` para clave privada
- Las cuentas deben estar **fondeadas** (mínimo 1 XLM) para existir en la red
- En testnet usa [Friendbot](https://friendbot.stellar.org) para fondear gratis

### Transacciones
- Una transacción contiene una o más **operaciones**
- Tiene un **fee** (por defecto 100 stroops = 0.00001 XLM por operación)
- Tiene un **sequence number** — debe incrementarse en cada transacción
- Se firma con la clave privada antes de enviar

### Redes disponibles
| Red | Uso | Passphrase |
|---|---|---|
| Testnet | Desarrollo y pruebas | `Test SDF Network ; September 2015` |
| Mainnet | Producción | `Public Global Stellar Network ; September 2015` |
| Futurenet | Funciones experimentales | `Test SDF Future Network ; October 2022` |

---

## Soroban — contratos inteligentes

Soroban es la plataforma de contratos inteligentes de Stellar. Los contratos se escriben en **Rust** y se compilan a **WebAssembly (WASM)**.

### Stack mínimo para empezar

```bash
# Instalar Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
rustup target add wasm32-unknown-unknown

# Instalar Soroban CLI
cargo install --locked soroban-cli --features opt

# Verificar instalación
soroban --version
```

### Contrato mínimo funcional

```rust
#![no_std]
use soroban_sdk::{contract, contractimpl, Env, Symbol, symbol_short};

#[contract]
pub struct Contador;

#[contractimpl]
impl Contador {
    pub fn incrementar(env: Env) -> u32 {
        let key = symbol_short!("CONTEO");
        let conteo: u32 = env.storage().instance().get(&key).unwrap_or(0);
        let nuevo = conteo + 1;
        env.storage().instance().set(&key, &nuevo);
        nuevo
    }

    pub fn obtener(env: Env) -> u32 {
        let key = symbol_short!("CONTEO");
        env.storage().instance().get(&key).unwrap_or(0)
    }
}
```

### Flujo de deploy en testnet

```bash
# 1. Compilar
soroban contract build

# 2. Configurar red
soroban network add testnet \
  --rpc-url https://soroban-testnet.stellar.org \
  --network-passphrase "Test SDF Network ; September 2015"

# 3. Crear identidad local
soroban keys generate --network testnet mi-wallet

# 4. Fondear con Friendbot
soroban keys fund mi-wallet --network testnet

# 5. Deploy
soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/mi_contrato.wasm \
  --source mi-wallet \
  --network testnet

# 6. Invocar
soroban contract invoke \
  --id <CONTRACT_ID> \
  --source mi-wallet \
  --network testnet \
  -- incrementar
```

---

## SDK JavaScript — uso básico

```bash
npm install @stellar/stellar-sdk
```

```typescript
import { Keypair, Networks, TransactionBuilder, Operation, Asset, BASE_FEE } from '@stellar/stellar-sdk';
import { SorobanRpc } from '@stellar/stellar-sdk';

const server = new SorobanRpc.Server('https://soroban-testnet.stellar.org');

// Cargar cuenta
const account = await server.getAccount(publicKey);

// Construir transacción
const tx = new TransactionBuilder(account, {
  fee: BASE_FEE,
  networkPassphrase: Networks.TESTNET,
})
  .addOperation(Operation.payment({
    destination: destinatario,
    asset: Asset.native(),
    amount: '10',
  }))
  .setTimeout(30)
  .build();

// Firmar
tx.sign(keypair);

// Enviar
const result = await server.sendTransaction(tx);
```

---

## Patrones de respuesta

Cuando el usuario pide ayuda con Stellar, sigue este orden:

1. **Identificar la tarea** — ¿contrato Soroban, SDK frontend, activos, API?
2. **Verificar la red** — ¿testnet o mainnet? Si no lo dice, asumir testnet
3. **Dar código funcional** — preferir ejemplos completos y ejecutables
4. **Mencionar errores comunes** — ver `common-pitfalls.md` si es relevante
5. **Sugerir siguiente paso** — qué hacer después de que funcione

---

## Lo que NO hacer

- No usar `Horizon` para interactuar con contratos Soroban (usar RPC)
- No hardcodear claves privadas en el código
- No ignorar el manejo de errores en transacciones
- No olvidar el `setTimeout` en `TransactionBuilder`
- No asumir que una transacción fue exitosa sin verificar el estado

---

## Contexto Perú / LATAM

Al desarrollar soluciones para el mercado peruano, tener en cuenta:

- **Rails de pago locales:** CCI (transferencias bancarias), Yape, Plin
- **Moneda local:** PEN (sol peruano) — los anchors SEP-24 para PEN están en desarrollo
- **USDC en Stellar:** El puente más práctico entre crypto y fiat para demos
- **Casos de uso relevantes:** Remesas (Perú recibe remesas desde EE.UU., España, Chile), microfinanzas, pagos B2B, tokenización de activos
- **Conectividad:** Diseñar para usuarios móviles con conexión variable
