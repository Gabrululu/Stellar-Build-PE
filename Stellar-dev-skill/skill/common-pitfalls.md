# Errores comunes y cómo evitarlos

Problemas frecuentes al desarrollar en Stellar y Soroban, con sus soluciones.

---

## Errores de cuenta y transacciones

### `tx_bad_seq` — Sequence number incorrecto

**Problema:** La transacción tiene un sequence number que no corresponde al estado actual de la cuenta.

```typescript
// MAL — reutilizar la misma cuenta cargada para múltiples txs seguidas
const cuenta = await rpc.getAccount(publicKey);
const tx1 = new TransactionBuilder(cuenta, ...).build();
const tx2 = new TransactionBuilder(cuenta, ...).build(); // mismo sequence!

// BIEN — recargar la cuenta antes de cada transacción
const cuenta1 = await rpc.getAccount(publicKey);
const tx1 = new TransactionBuilder(cuenta1, ...).build();
await enviarYEsperar(tx1);

const cuenta2 = await rpc.getAccount(publicKey); // recargar
const tx2 = new TransactionBuilder(cuenta2, ...).build();
```

### `tx_insufficient_fee` — Fee muy bajo

```typescript
// MAL — usar BASE_FEE para transacciones Soroban complejas
const tx = new TransactionBuilder(cuenta, {
  fee: BASE_FEE, // 100 stroops — puede ser insuficiente para Soroban
}).build();

// BIEN — simular primero para obtener el fee real
const sim = await rpc.simulateTransaction(txSinFee);
const txConFee = SorobanRpc.assembleTransaction(txSinFee, sim).build();
```

### Transacción expirada

```typescript
// MAL — timeout demasiado corto o no configurado
const tx = new TransactionBuilder(cuenta, { fee: BASE_FEE })
  .addOperation(...)
  .build(); // sin setTimeout — usa el mínimo por defecto

// BIEN — dar tiempo suficiente para firmar y enviar
const tx = new TransactionBuilder(cuenta, { fee: BASE_FEE })
  .addOperation(...)
  .setTimeout(300) // 5 minutos — suficiente para flujo con wallet
  .build();
```

---

## Errores de Soroban

### Simulación exitosa pero transacción fallida

```typescript
// Causa: los datos del ledger cambiaron entre simulación y envío
// Solución: siempre usar assembleTransaction y enviar rápido

const sim = await rpc.simulateTransaction(tx);
if (SorobanRpc.Api.isSimulationError(sim)) {
  throw new Error(sim.error);
}

// assembleTransaction actualiza el footprint con los datos de la simulación
const txFinal = SorobanRpc.assembleTransaction(tx, sim).build();
// Firmar y enviar inmediatamente después
```

### Contrato no encontrado después de deploy

```bash
# Problema: el deploy tardó más de lo esperado en confirmarse
# Verificar el estado de la transacción de deploy

soroban tx status <DEPLOY_HASH> --network testnet

# Si está en NOT_FOUND, esperar un poco más
# Si está en FAILED, ver el error

# Verificar que el contrato existe
soroban contract info --id <CONTRACT_ID> --network testnet
```

### `require_auth` falla en tests

```rust
// Problema: no se configuró mock_all_auths en el entorno de test

// MAL
#[test]
fn test_transferir() {
    let env = Env::default(); // sin mock de auth
    let client = MiContratoClient::new(&env, &id);
    client.transferir(&usuario, &otro, &100); // FALLA — no hay auth simulada
}

// BIEN
#[test]
fn test_transferir() {
    let env = Env::default();
    env.mock_all_auths(); // simular todas las auth
    let client = MiContratoClient::new(&env, &id);
    client.transferir(&usuario, &otro, &100); // funciona
}
```

### Error de TTL — datos expirados

```rust
// Problema: datos persistent sin TTL extendido expiran después de ~1 semana en testnet

// BIEN — extender TTL al escribir
pub fn actualizar_posicion(env: Env, usuario: Address, monto: i128) {
    usuario.require_auth();
    let clave = Clave::Posicion(usuario);
    env.storage().persistent().set(&clave, &monto);
    // Extender TTL: min 50000 ledgers (~7 días), max 100000 ledgers (~14 días)
    env.storage().persistent().extend_ttl(&clave, 50000, 100000);
}

// También extender el TTL del contrato
env.storage().instance().extend_ttl(50000, 100000);
```

---

## Errores de SDK JavaScript

### `Account not found` al cargar cuenta

```typescript
// Problema: la cuenta no está fondeada o no existe en la red

// Verificar si existe primero
async function verificarOCrearCuenta(publicKey: string) {
  try {
    await rpc.getAccount(publicKey);
  } catch (e) {
    if (e.message.includes('Not Found')) {
      // En testnet, fondear con Friendbot
      await fetch(`https://friendbot.stellar.org?addr=${publicKey}`);
      await new Promise(r => setTimeout(r, 2000)); // esperar confirmación
    } else {
      throw e;
    }
  }
}
```

### El resultado de `scValToNative` es incorrecto

```typescript
// Problema: el tipo de ScVal no coincide con lo esperado

import { scValToNative, xdr } from '@stellar/stellar-sdk';

// Verificar el tipo antes de convertir
const retval = sim.result?.retval;
if (retval) {
  console.log('Tipo de ScVal:', retval.switch().name);
  const valor = scValToNative(retval);
  console.log('Valor nativo:', valor);
}

// Tipos comunes:
// scvI128 → bigint
// scvU32 → number
// scvBool → boolean
// scvAddress → string (StrKey)
// scvMap → object
// scvVec → array
```

### Freighter no detectado en el navegador

```typescript
// Problema: Freighter no está instalado o el script cargó antes que la extensión

// BIEN — verificar después de que la página cargue
useEffect(() => {
  const verificar = async () => {
    // Esperar un momento para que las extensiones inicialicen
    await new Promise(r => setTimeout(r, 100));
    const conectado = await freighter.isConnected();
    setFreighterDisponible(conectado.isConnected);
  };
  verificar();
}, []);
```

---

## Errores de compilación Rust

### `wasm32-unknown-unknown` no instalado

```bash
# Error: error[E0463]: can't find crate for `std`
# Solución:
rustup target add wasm32-unknown-unknown
```

### Contrato demasiado grande

```bash
# Error: WasmDeploymentSizeTooBig — el WASM supera el límite (64 KB ~ 100 KB)
# Soluciones:

# 1. Verificar el tamaño
ls -la target/wasm32-unknown-unknown/release/*.wasm

# 2. Compilar con optimizaciones
soroban contract build  # usa --release automáticamente

# 3. Optimizar con wasm-opt
cargo install wasm-opt
wasm-opt -Oz \
  target/wasm32-unknown-unknown/release/mi_contrato.wasm \
  -o optimizado.wasm

# 4. Reducir dependencias en Cargo.toml
# Usar features mínimas de soroban-sdk

# 5. Eliminar código muerto
cargo build --target wasm32-unknown-unknown --release 2>&1 | grep "unused"
```

### Error de no_std

```rust
// Error: cannot find macro `println` in this scope
// Los contratos Soroban usan #![no_std], sin acceso a std::

// MAL — no disponible en no_std
println!("Debug: {}", valor);

// BIEN — usar eventos para logging
env.events().publish((symbol_short!("debug"),), valor);

// O usar el macro de Soroban SDK en tests
#[cfg(test)]
use std::println; // solo en tests se puede usar std
```

---

## Errores de configuración y red

### Passphrase de red incorrecta

```typescript
// Error: tx_bad_auth — firma inválida porque la passphrase no coincide

// BIEN — verificar passphrase según la red
const NETWORK_PASSPHRASE = {
  testnet: 'Test SDF Network ; September 2015',
  mainnet: 'Public Global Stellar Network ; September 2015',
  local: 'Standalone Network ; February 2017',
  futurenet: 'Test SDF Future Network ; October 2022',
};

// En TransactionBuilder
const tx = new TransactionBuilder(cuenta, {
  fee: BASE_FEE,
  networkPassphrase: NETWORK_PASSPHRASE.testnet, // NO hardcodear en producción
}).build();
```

### RPC timeout en Quickstart local

```bash
# Problema: el Docker de Quickstart tarda en inicializar

# Verificar que está listo
curl http://localhost:8000/health

# Esperar hasta que responda 200
until curl -s http://localhost:8000/health | grep -q '"status":"healthy"'; do
  sleep 2
  echo "Esperando que Quickstart inicialice..."
done
echo "Quickstart listo!"
```

---

## Gotchas de Soroban que sorprenden

### Los tipos se serializan diferente de lo esperado

```rust
// i128 en Soroban se serializa como ScVal::ScvI128
// En JavaScript se recibe como BigInt, no como number

// TypeScript
const resultado = scValToNative(retval); // es BigInt
console.log(resultado); // 1000n (no 1000)
const numero = Number(resultado); // convertir si necesitas number
```

### address.require_auth() con sub-invocaciones

```rust
// Si tu contrato llama a otro contrato que a su vez hace require_auth
// del mismo usuario, la auth del usuario debe abarcar toda la cadena

// El usuario debe firmar una auth que incluya la sub-invocación
// Esto se maneja automáticamente con assembleTransaction en el SDK JS
```

### Storage persistent vs instance en upgrades

```rust
// Después de un upgrade, el instance storage se mantiene
// pero los datos persistent de la versión anterior siguen accesibles

// Si cambias el esquema de datos en un upgrade, migrar explícitamente:
pub fn migrar_v2(env: Env) {
    let admin: Address = env.storage().instance().get(&Clave::Admin).unwrap();
    admin.require_auth();
    
    // Migrar datos del formato v1 al formato v2
    // ...
    
    env.storage().instance().set(&Clave::Version, &2_u32);
}
```
