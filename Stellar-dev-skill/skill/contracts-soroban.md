# Contratos Soroban — Desarrollo en Rust

Referencia completa para escribir, compilar, desplegar e invocar contratos inteligentes en Soroban.

---

## Estructura de un proyecto Soroban

```
mi-contrato/
├── Cargo.toml
└── src/
    └── lib.rs
```

### Cargo.toml mínimo

```toml
[package]
name = "mi-contrato"
version = "0.1.0"
edition = "2021"

[lib]
crate-type = ["cdylib"]

[dependencies]
soroban-sdk = { version = "21", features = ["alloc"] }

[dev-dependencies]
soroban-sdk = { version = "21", features = ["testutils"] }

[profile.release]
opt-level = "z"
overflow-checks = true
debug = 0
strip = "symbols"
debug-assertions = false
panic = "abort"
codegen-units = 1
lto = true

[profile.release-with-logs]
inherits = "release"
debug-assertions = true
```

---

## Tipos de almacenamiento

Soroban tiene tres tipos de almacenamiento con diferentes TTL (tiempo de vida):

| Tipo | Cuándo usar | TTL |
|---|---|---|
| `instance()` | Estado del contrato, configuración global | Mismo TTL que el contrato |
| `persistent()` | Datos de usuarios, balances | Necesita extensión manual |
| `temporary()` | Caché, datos efímeros | Se elimina automáticamente |

```rust
// Instance — persiste mientras el contrato esté activo
env.storage().instance().set(&clave, &valor);
let val = env.storage().instance().get(&clave).unwrap_or_default();

// Persistent — para datos de usuarios (requiere bump manual)
env.storage().persistent().set(&clave, &valor);
env.storage().persistent().extend_ttl(&clave, 100, 200); // min_ledger, max_ledger

// Temporary — se elimina automáticamente
env.storage().temporary().set(&clave, &valor);
```

---

## Tipos de datos en Soroban SDK

```rust
use soroban_sdk::{
    Env, Symbol, symbol_short, String, Bytes, BytesN,
    Address, Map, Vec, contracttype,
};

// Structs serializables
#[contracttype]
pub struct Posicion {
    pub propietario: Address,
    pub monto: i128,
    pub activo: bool,
}

// Enums como keys o valores
#[contracttype]
pub enum Clave {
    Admin,
    Balance(Address),
    Posicion(Address, u64),
}

// Uso
let pos = Posicion {
    propietario: env.current_contract_address(),
    monto: 1000,
    activo: true,
};
env.storage().persistent().set(&Clave::Balance(usuario), &pos);
```

---

## Autenticación y autorización

```rust
use soroban_sdk::{Address, Env};

#[contractimpl]
impl MiContrato {
    pub fn transferir(env: Env, desde: Address, hacia: Address, monto: i128) {
        // SIEMPRE requerir autorización antes de actuar
        desde.require_auth();

        // Ahora es seguro proceder
        let balance = obtener_balance(&env, &desde);
        assert!(balance >= monto, "saldo insuficiente");
        
        set_balance(&env, &desde, balance - monto);
        set_balance(&env, &hacia, obtener_balance(&env, &hacia) + monto);
    }
}
```

---

## Eventos

```rust
use soroban_sdk::{symbol_short, Env, Address};

fn emitir_transferencia(env: &Env, desde: &Address, hacia: &Address, monto: i128) {
    env.events().publish(
        (symbol_short!("transfer"), desde.clone()),
        (hacia.clone(), monto),
    );
}
```

---

## Llamadas a otros contratos (cross-contract)

```rust
use soroban_sdk::{contract, contractimpl, contractclient, Address, Env};

// Definir la interfaz del contrato externo
#[contractclient(name = "TokenClient")]
pub trait Token {
    fn balance(env: Env, id: Address) -> i128;
    fn transfer(env: Env, from: Address, to: Address, amount: i128);
}

#[contractimpl]
impl MiContrato {
    pub fn depositar(env: Env, token: Address, usuario: Address, monto: i128) {
        usuario.require_auth();
        
        let cliente = TokenClient::new(&env, &token);
        cliente.transfer(&usuario, &env.current_contract_address(), &monto);
    }
}
```

---

## Integración con Stellar Asset Contract (SAC)

```rust
use soroban_sdk::{Address, Env};
use soroban_token_sdk::TokenClient;

pub fn obtener_balance_token(env: &Env, token: &Address, cuenta: &Address) -> i128 {
    let cliente = TokenClient::new(env, token);
    cliente.balance(cuenta)
}

pub fn transferir_token(
    env: &Env,
    token: &Address,
    desde: &Address,
    hacia: &Address,
    monto: i128,
) {
    let cliente = TokenClient::new(env, token);
    cliente.transfer(desde, hacia, &monto);
}
```

---

## Constructor e inicialización

```rust
#[contractimpl]
impl MiContrato {
    pub fn inicializar(env: Env, admin: Address, config: Config) {
        // Verificar que no se haya inicializado antes
        assert!(
            !env.storage().instance().has(&Clave::Admin),
            "ya inicializado"
        );
        
        env.storage().instance().set(&Clave::Admin, &admin);
        env.storage().instance().set(&Clave::Config, &config);
    }
    
    fn require_admin(env: &Env) -> Address {
        let admin: Address = env.storage().instance()
            .get(&Clave::Admin)
            .expect("no inicializado");
        admin.require_auth();
        admin
    }
}
```

---

## Compilar y optimizar

```bash
# Build estándar
cargo build --target wasm32-unknown-unknown --release

# Build optimizado (recomendado para deploy)
soroban contract build

# Verificar tamaño (< 64 KB idealmente)
ls -la target/wasm32-unknown-unknown/release/*.wasm

# Optimizar con wasm-opt
wasm-opt -Oz -o optimizado.wasm mi_contrato.wasm
```

---

## Deploy y gestión de contratos

```bash
# Deploy con Soroban CLI
soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/mi_contrato.wasm \
  --source MI_CLAVE_SECRETA \
  --network testnet

# Obtener el WASM de un contrato existente
soroban contract fetch --id <CONTRACT_ID> --network testnet

# Ver el ABI / interfaz del contrato
soroban contract bindings typescript \
  --id <CONTRACT_ID> \
  --network testnet \
  --output-dir ./bindings

# Invocar una función
soroban contract invoke \
  --id <CONTRACT_ID> \
  --source MI_CLAVE_SECRETA \
  --network testnet \
  -- \
  mi_funcion \
  --param1 "valor" \
  --param2 42
```

---

## Upgrade de contratos (upgradeability)

```rust
use soroban_sdk::{Address, BytesN, Env};

#[contractimpl]
impl MiContrato {
    pub fn upgrade(env: Env, nuevo_wasm_hash: BytesN<32>) {
        // Solo el admin puede upgradear
        let admin: Address = env.storage().instance().get(&Clave::Admin).unwrap();
        admin.require_auth();
        
        env.deployer().update_current_contract_wasm(nuevo_wasm_hash);
    }
}
```

```bash
# Subir nuevo WASM y obtener hash
soroban contract install \
  --wasm target/wasm32-unknown-unknown/release/mi_contrato_v2.wasm \
  --source mi-wallet \
  --network testnet

# Invocar upgrade con el nuevo hash
soroban contract invoke \
  --id <CONTRACT_ID> \
  --source mi-wallet \
  --network testnet \
  -- upgrade --nuevo_wasm_hash <WASM_HASH>
```

---

## TTL y extensión de vida útil

Los contratos y sus datos en Soroban tienen una vida útil limitada (en ledgers). Para que no expiren:

```rust
// En el contrato — extender TTL de datos persistent
pub fn refrescar_ttl(env: Env, usuario: Address) {
    let clave = Clave::Balance(usuario);
    env.storage().persistent().extend_ttl(&clave, 50000, 100000);
}

// Extender TTL del propio contrato (instance)
env.storage().instance().extend_ttl(50000, 100000);
```

```typescript
// Desde el cliente JS — extender TTL antes de que expire
import { SorobanRpc } from '@stellar/stellar-sdk';

const rpc = new SorobanRpc.Server('https://soroban-testnet.stellar.org');
const ledgerEntry = await rpc.getLedgerEntries(contractDataKey);
console.log('TTL restante:', ledgerEntry.entries[0].liveUntilLedgerSeq);
```

---

## Checklist antes de desplegar

- [ ] El contrato tiene `inicializar` protegida contra doble llamada
- [ ] Toda función que modifica estado requiere `require_auth()`
- [ ] No hay enteros que puedan hacer overflow (usar `checked_add`, `i128`)
- [ ] El almacenamiento `persistent` tiene TTL extendido donde corresponde
- [ ] Hay eventos emitidos para acciones importantes
- [ ] Existe función de upgrade (o se decidió conscientemente no tenerla)
- [ ] El WASM compilado pesa menos de 64 KB
