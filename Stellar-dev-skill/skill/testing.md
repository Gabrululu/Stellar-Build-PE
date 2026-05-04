# Testing en Stellar y Soroban

Estrategias de prueba para contratos Soroban: tests unitarios en Rust, testnet y entorno local con Quickstart.

---

## Tests unitarios en Rust

Soroban SDK incluye utilidades de testing (`testutils`) que permiten simular el entorno de blockchain sin desplegar.

### Configuración en Cargo.toml

```toml
[dev-dependencies]
soroban-sdk = { version = "21", features = ["testutils"] }
```

### Estructura básica de un test

```rust
#[cfg(test)]
mod tests {
    use super::*;
    use soroban_sdk::{testutils::Address as _, Address, Env};

    #[test]
    fn test_incrementar() {
        // 1. Crear entorno de test
        let env = Env::default();
        
        // 2. Registrar el contrato
        let contract_id = env.register_contract(None, Contador);
        let client = ContadorClient::new(&env, &contract_id);
        
        // 3. Invocar funciones
        assert_eq!(client.obtener(), 0);
        client.incrementar();
        assert_eq!(client.obtener(), 1);
        client.incrementar();
        assert_eq!(client.obtener(), 2);
    }
}
```

### Simular autenticación

```rust
#[test]
fn test_transferencia_autenticada() {
    let env = Env::default();
    env.mock_all_auths(); // Simular que todas las auth son aprobadas
    
    let contract_id = env.register_contract(None, MiContrato);
    let client = MiContratoClient::new(&env, &contract_id);
    
    let usuario = Address::generate(&env);
    let destinatario = Address::generate(&env);
    
    client.inicializar(&usuario, &1000_i128);
    client.transferir(&usuario, &destinatario, &500_i128);
    
    assert_eq!(client.balance(&usuario), 500);
    assert_eq!(client.balance(&destinatario), 500);
    
    // Verificar qué autorizaciones se solicitaron
    let auths = env.auths();
    assert_eq!(auths.len(), 1);
}
```

### Verificar que falla correctamente

```rust
#[test]
#[should_panic(expected = "saldo insuficiente")]
fn test_transferencia_sin_fondos() {
    let env = Env::default();
    env.mock_all_auths();
    
    let contract_id = env.register_contract(None, MiContrato);
    let client = MiContratoClient::new(&env, &contract_id);
    
    let usuario = Address::generate(&env);
    let otro = Address::generate(&env);
    
    client.inicializar(&usuario, &100_i128);
    client.transferir(&usuario, &otro, &1000_i128); // Debe fallar
}
```

### Test con tokens SAC (Stellar Asset Contract)

```rust
use soroban_sdk::testutils::Ledger;
use soroban_token_sdk::TokenClient;

#[test]
fn test_con_token() {
    let env = Env::default();
    env.mock_all_auths();
    
    // Crear un token de prueba
    let admin = Address::generate(&env);
    let token_id = env.register_stellar_asset_contract_v2(admin.clone());
    let token = TokenClient::new(&env, &token_id.address());
    
    // Acuñar tokens para el usuario
    let usuario = Address::generate(&env);
    token.mint(&usuario, &1000_i128);
    
    assert_eq!(token.balance(&usuario), 1000);
    
    // Ahora probar tu contrato con este token
    let contract_id = env.register_contract(None, MiProtocolo);
    let cliente = MiProtocoloClient::new(&env, &contract_id);
    
    cliente.depositar(&token_id.address(), &usuario, &500_i128);
    assert_eq!(token.balance(&usuario), 500);
}
```

### Manipular el estado del ledger

```rust
#[test]
fn test_expiracion() {
    let env = Env::default();
    env.mock_all_auths();
    
    let contract_id = env.register_contract(None, MiContrato);
    let client = MiContratoClient::new(&env, &contract_id);
    
    client.crear_posicion(&usuario, &1000_i128);
    
    // Avanzar el ledger 100 bloques
    env.ledger().with_mut(|info| {
        info.sequence_number += 100;
        info.timestamp += 100 * 5; // ~5 segundos por ledger
    });
    
    // Verificar que la posición sigue activa (o expiró según tu lógica)
    assert!(client.posicion_activa(&usuario));
}
```

---

## Correr los tests

```bash
# Todos los tests
cargo test

# Test específico
cargo test test_transferencia_autenticada

# Con output visible
cargo test -- --nocapture

# Generar reporte de cobertura (requiere cargo-tarpaulin)
cargo install cargo-tarpaulin
cargo tarpaulin --out Html
```

---

## Testnet — pruebas en red real

### Fondear cuenta de prueba

```bash
# Con Soroban CLI
soroban keys generate --network testnet mi-cuenta-test
soroban keys fund mi-cuenta-test --network testnet

# Con curl directo
curl "https://friendbot.stellar.org?addr=<PUBLIC_KEY>"

# Con Horizon JS SDK
import { Horizon } from '@stellar/stellar-sdk';
const server = new Horizon.Server('https://horizon-testnet.stellar.org');
await server.friendbot(publicKey).call();
```

### Script de deploy y prueba en testnet

```bash
#!/bin/bash
set -e

echo "Compilando contrato..."
soroban contract build

echo "Deploying en testnet..."
CONTRACT_ID=$(soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/mi_contrato.wasm \
  --source mi-cuenta-test \
  --network testnet)
echo "Contract ID: $CONTRACT_ID"

echo "Inicializando..."
soroban contract invoke \
  --id "$CONTRACT_ID" \
  --source mi-cuenta-test \
  --network testnet \
  -- inicializar \
  --admin "$(soroban keys address mi-cuenta-test)"

echo "Prueba de función..."
RESULTADO=$(soroban contract invoke \
  --id "$CONTRACT_ID" \
  --source mi-cuenta-test \
  --network testnet \
  -- mi_funcion \
  --param "hola")
echo "Resultado: $RESULTADO"
```

---

## Entorno local con Docker Quickstart

Para pruebas más rápidas sin depender de testnet:

```bash
# Levantar nodo local de Stellar
docker run --rm -it \
  -p 8000:8000 \
  --name stellar-quickstart \
  stellar/quickstart:latest \
  --standalone \
  --enable-soroban-rpc

# Verificar que está corriendo
curl http://localhost:8000/health

# Configurar red local en Soroban CLI
soroban network add local \
  --rpc-url http://localhost:8000/soroban/rpc \
  --network-passphrase "Standalone Network ; February 2017"

# Crear y fondear cuenta local
soroban keys generate --network local mi-cuenta-local
soroban keys fund mi-cuenta-local --network local

# Deploy local (más rápido que testnet)
soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/mi_contrato.wasm \
  --source mi-cuenta-local \
  --network local
```

---

## Tests de integración con TypeScript

```typescript
// tests/contrato.test.ts
import { describe, it, expect, beforeAll } from 'vitest';
import { SorobanRpc, Keypair, Networks } from '@stellar/stellar-sdk';
import { Client } from '../src/contracts/mi-contrato';

const RPC_URL = 'http://localhost:8000/soroban/rpc';
const NETWORK = 'Standalone Network ; February 2017';

describe('MiContrato', () => {
  let cliente: Client;
  let keypair: Keypair;

  beforeAll(async () => {
    keypair = Keypair.random();
    
    // Fondear cuenta en local
    await fetch(`http://localhost:8000/friendbot?addr=${keypair.publicKey()}`);
    
    // Deploy del contrato
    // (en producción harías esto por separado)
    
    cliente = new Client({
      contractId: process.env.CONTRACT_ID!,
      networkPassphrase: NETWORK,
      rpcUrl: RPC_URL,
      publicKey: keypair.publicKey(),
      signTransaction: async (xdr) => {
        const tx = TransactionBuilder.fromXDR(xdr, NETWORK);
        tx.sign(keypair);
        return { signedTxXdr: tx.toXDR() };
      },
    });
  });

  it('debe incrementar el contador', async () => {
    const { result } = await cliente.incrementar();
    expect(result).toBe(1n);
  });

  it('debe retornar el valor actual', async () => {
    const { result } = await cliente.obtener();
    expect(result).toBe(1n);
  });
});
```

---

## Checklist de testing

- [ ] Tests unitarios cubren el happy path
- [ ] Tests unitarios cubren casos de error (`#[should_panic]`)
- [ ] Se prueba autenticación y que falla sin auth
- [ ] Se prueba la lógica de expiración/TTL si aplica
- [ ] Se desplegó y probó manualmente en testnet
- [ ] Los scripts de deploy están documentados y son reproducibles
