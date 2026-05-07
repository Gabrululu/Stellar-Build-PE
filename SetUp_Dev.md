# Guía de Setup para Desarrollo Stellar/Soroban

Todo lo que necesitas configurar antes y durante la buildathon para trabajar con Stellar y Soroban.

---

## Pre-requisitos

```bash
# Rust 1.84.0+ (necesario para Soroban)
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
rustup target add wasm32v1-none   # nueva target requerida desde Rust 1.84

# Stellar CLI
curl -fsSL https://github.com/stellar/stellar-cli/raw/main/install.sh | sh

# Node.js 18+ (para frontend)
# Recomendado: usar nvm
nvm install 20
nvm use 20

# Verificar todo
stellar version
rustc --version
node --version
```

> **Haz esto antes del evento.** La compilación inicial de Rust y la instalación de Stellar CLI pueden tomar 10-15 minutos dependiendo de tu conexión.

---

## Stellar CLI — Configuración de red

```bash
# Configurar testnet
stellar network add testnet \
  --rpc-url https://soroban-testnet.stellar.org \
  --network-passphrase "Test SDF Network ; September 2015"

# Crear una identidad de desarrollo
stellar keys generate mi-wallet --network testnet

# Fondear con Friendbot (testnet)
stellar keys fund mi-wallet --network testnet

# Verificar balance
stellar keys address mi-wallet
# Usa la dirección en https://horizon-testnet.stellar.org/accounts/{address}
```

### Comandos útiles del día a día

```bash
# Ver todas tus identidades
stellar keys ls

# Ver dirección de una identidad
stellar keys address mi-wallet

# Invocar un contrato desplegado
stellar contract invoke \
  --id CONTRACT_ID \
  --source mi-wallet \
  --network testnet \
  -- nombre_funcion --param1 valor1

# Ver los eventos emitidos por un contrato
stellar events \
  --network testnet \
  --contract-id CONTRACT_ID
```

---

## Freighter Wallet (para tu app)

Los usuarios de tu app necesitarán una wallet. Freighter es la más usada en Stellar.

1. Instalar extensión: https://freighter.app
2. Crear cuenta o importar una existente
3. Cambiar a **Testnet** en la configuración
4. Fondear con Friendbot desde la interfaz de Freighter

### Integración en código

```typescript
import { requestAccess, signTransaction, isConnected } from '@stellar/freighter-api';

// Verificar si Freighter está instalado
const connected = await isConnected();
if (!connected) {
  alert("Instala Freighter desde freighter.app");
  return;
}

// Conectar wallet
const publicKey = await requestAccess();
console.log("Wallet conectada:", publicKey);

// Firmar transacción
const signedXDR = await signTransaction(txXDR, {
  networkPassphrase: 'Test SDF Network ; September 2015',
});
```

### Hook de React para Freighter

```typescript
import { useState, useEffect } from "react";
import { requestAccess, isConnected } from "@stellar/freighter-api";

export function useFreighter() {
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const connect = async () => {
    setLoading(true);
    try {
      const connected = await isConnected();
      if (!connected) throw new Error("Freighter no está instalado");
      const key = await requestAccess();
      setPublicKey(key);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return { publicKey, connect, loading };
}
```

---

## Soroban — Tu primer contrato

```bash
# Crear proyecto
stellar contract init mi-contrato
cd mi-contrato

# Estructura generada:
# ├── Cargo.toml
# ├── src/
# │   └── lib.rs        ← Tu contrato
# └── test/
#     └── test.rs       ← Tests

# Compilar
stellar contract build

# Correr tests
cargo test

# Deploy a testnet
stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/mi_contrato.wasm \
  --network testnet \
  --source mi-wallet
```

### Estructura mínima de un contrato Soroban

```rust
#![no_std]
use soroban_sdk::{contract, contractimpl, Env, Symbol, symbol_short};

#[contract]
pub struct MiContrato;

#[contractimpl]
impl MiContrato {
    pub fn hola(env: Env, nombre: Symbol) -> Symbol {
        symbol_short!("hola")
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use soroban_sdk::Env;

    #[test]
    fn test_hola() {
        let env = Env::default();
        let contract_id = env.register_contract(None, MiContrato);
        let client = MiContratoClient::new(&env, &contract_id);
        // assert...
    }
}
```

---

## OpenZeppelin para Soroban — Contratos seguros

Si tu proyecto necesita tokens, ownership, pausable o upgradeable, usá los contratos auditados de OpenZeppelin en vez de implementarlos desde cero.

**Docs:** https://docs.openzeppelin.com/stellar-contracts · **GitHub:** https://github.com/OpenZeppelin/stellar-contracts · **Wizard (generador de código):** https://wizard.openzeppelin.com/stellar

### Estructura de workspace (recomendada con OZ)

`stellar contract init my_project` genera un workspace donde cada contrato vive en `contracts/*/`:

```
my_project/
├── Cargo.toml           ← workspace root
└── contracts/
    └── my_contract/
        ├── Cargo.toml   ← dependencias del contrato
        └── src/
            └── lib.rs
```

### Dependencias en Cargo.toml

Consultá la versión actual en el repo de stellar-contracts antes de añadir. **Pinear con `=` porque la librería está en desarrollo activo.**

`Cargo.toml` (raíz del workspace):
```toml
[workspace.dependencies]
stellar-tokens          = "=<VERSION>"
stellar-access          = "=<VERSION>"
stellar-contract-utils  = "=<VERSION>"
stellar-macros          = "=<VERSION>"
```

`contracts/my_contract/Cargo.toml`:
```toml
[dependencies]
soroban-sdk             = { workspace = true }
stellar-tokens          = { workspace = true }
stellar-access          = { workspace = true }
stellar-contract-utils  = { workspace = true }
stellar-macros          = { workspace = true }
```

Crates disponibles: `stellar-access`, `stellar-accounts`, `stellar-contract-utils`, `stellar-fee-abstraction`, `stellar-governance`, `stellar-macros`, `stellar-tokens`. Solo añadir los que el contrato realmente usa.

### Patrones de código

Imports usan guiones bajos como raíz del crate (convención Rust):

```rust
use stellar_tokens::fungible::{Base, FungibleToken};
use stellar_tokens::fungible::burnable::FungibleBurnable;
use stellar_access::ownable::Ownable;
use stellar_contract_utils::pausable::Pausable;
use stellar_macros::when_not_paused;
```

Estructura del contrato con macros de guarda:

```rust
use soroban_sdk::{contract, contractimpl, Env};

#[contract]
pub struct MyToken;

#[contractimpl]
impl MyToken {
    // cada trait es un impl block separado
}

#[contractimpl]
impl FungibleToken for MyToken {
    #[when_not_paused]
    fn transfer(env: Env, from: Address, to: Address, amount: i128) {
        // ...
    }
}
```

Macros de guarda disponibles: `#[when_not_paused]`, `#[only_owner]`, `#[derive(Upgradeable)]`.

### Notas de plataforma

- **Las lecturas son gratis en Stellar** — optimizá para minimizar escrituras; lecturas y cómputo son baratos.
- **TTL de instance storage** es responsabilidad del contrato. OpenZeppelin extiende TTL para otras entradas de storage, pero el contrato debe extender su propia instance storage para evitar expiración.

---

## Assets importantes en Stellar Testnet

| Asset | Issuer (testnet) | Notas |
|---|---|---|
| XLM | Nativo | Gas y transferencias |
| USDC | `GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5` | Circle testnet issuer |

### Establecer trustline para USDC

```typescript
import { Asset, Operation, TransactionBuilder, Networks } from '@stellar/stellar-sdk';

const USDC_ISSUER = 'GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5';
const usdc = new Asset('USDC', USDC_ISSUER);

const tx = new TransactionBuilder(account, {
  fee: '100',
  networkPassphrase: Networks.TESTNET,
})
  .addOperation(Operation.changeTrust({ asset: usdc }))
  .setTimeout(30)
  .build();
```

### Fondear una cuenta con USDC en testnet

```bash
# Fondear XLM con Friendbot
curl "https://friendbot.stellar.org?addr=TU_ADDRESS"

# Para USDC en testnet, usa la interfaz de Stellar Laboratory
# o el faucet oficial de Circle para testnet
```

---

## Errores comunes y cómo resolverlos

### 1. "Transaction simulation failed"

**Causa:** El contrato tiene un error o los parámetros son incorrectos.

**Solución:** Siempre usa `simulateTransaction` antes de `sendTransaction`:

```typescript
const sim = await server.simulateTransaction(tx);
if ('error' in sim) {
  console.error('Simulación falló:', sim.error);
  // No envíes la transacción — revisa el error primero
  return;
}
```

### 2. "Auth required" / Error de autorización

**Causa:** El contrato requiere autorización y no se incluyó en la transacción.

**Solución:** Después de simular, prepara la transacción para que incluya las entradas de auth:

```typescript
const prepared = await server.prepareTransaction(tx);
// Esto agrega automáticamente las entradas de auth necesarias
const signed = await kit.signTransaction(prepared.toXDR());
```

### 3. "Account not found"

**Causa:** La cuenta no existe en la red (nunca fue fondeada).

**Solución:** Fondear con Friendbot en testnet:

```bash
curl "https://friendbot.stellar.org?addr=TU_ADDRESS"
```

O desde código:

```typescript
await fetch(`https://friendbot.stellar.org?addr=${publicKey}`);
```

### 4. Polling de transacciones

Nunca hagas fire-and-forget con `sendTransaction`. Siempre consulta el resultado:

```typescript
const response = await server.sendTransaction(tx);

if (response.status === 'PENDING') {
  let result;
  do {
    await new Promise(r => setTimeout(r, 1000));
    result = await server.getTransaction(response.hash);
  } while (result.status === 'NOT_FOUND');

  if (result.status === 'SUCCESS') {
    console.log('Transacción exitosa');
  } else {
    console.error('Transacción falló:', result);
  }
}
```

### 5. SDK version mismatch

Asegúrate de usar versiones compatibles entre sí:

```json
{
  "dependencies": {
    "@stellar/stellar-sdk": "^12.0.0",
    "@stellar/freighter-api": "^2.0.0"
  }
}
```

### 6. Contrato no encontrado tras deploy

**Causa:** El contract ID se perdió o el deploy falló silenciosamente.

**Solución:** Guarda el contract ID inmediatamente después del deploy:

```bash
# El deploy imprime el contract ID — guárdalo en .env.local
stellar contract deploy ... 2>&1 | tee deploy.log
# Revisa deploy.log para recuperar el ID si lo perdiste
```

---

## Variables de entorno para tu proyecto

```bash
# .env.local
NEXT_PUBLIC_NETWORK=testnet
NEXT_PUBLIC_RPC_URL=https://soroban-testnet.stellar.org
NEXT_PUBLIC_NETWORK_PASSPHRASE="Test SDF Network ; September 2015"
NEXT_PUBLIC_USDC_ISSUER=GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5
NEXT_PUBLIC_CONTRACT_ID=tu-contract-id-aqui
```

---

## Checklist pre-buildathon

- [ ] Rust 1.84+ + target `wasm32v1-none` instalado
- [ ] Stellar CLI instalado y configurado con testnet
- [ ] Identidad de testnet creada y fondeada con XLM
- [ ] Freighter instalado en el navegador y configurado en testnet
- [ ] Node.js 18+ instalado
- [ ] Compilaste y deployaste un contrato de prueba
- [ ] Probaste `simulateTransaction` + `sendTransaction` + polling
- [ ] Guardaste el contract ID del contrato de prueba en `.env.local`
