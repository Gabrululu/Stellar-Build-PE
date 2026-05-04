# Activos Stellar y Stellar Asset Contract (SAC)

Guía para emitir activos nativos de Stellar, crear trustlines y usar el Stellar Asset Contract en Soroban.

---

## Activos nativos de Stellar (Classic)

Stellar tiene un sistema de activos nativo en la capa de protocolo, separado de Soroban.

### Tipos de activos

| Tipo | Descripción | Ejemplo |
|---|---|---|
| Native | XLM, la moneda nativa | `Asset.native()` |
| Credit Alphanum 4 | Código de 1-4 caracteres | `USDC`, `PEN`, `BTC` |
| Credit Alphanum 12 | Código de 5-12 caracteres | `EURC`, `NGNC` |

### Emitir un activo

Para emitir un activo en Stellar necesitas:
1. Una **cuenta emisora** (issuer) con el activo
2. Una **cuenta de distribución** (opcional pero recomendado)
3. Las cuentas receptoras deben crear una **trustline**

```typescript
import {
  Keypair, Asset, TransactionBuilder, Operation,
  Networks, BASE_FEE, Horizon,
} from '@stellar/stellar-sdk';

const horizon = new Horizon.Server('https://horizon-testnet.stellar.org');

// Cuentas
const emisor = Keypair.fromSecret('S...EMISOR...');
const distribuidor = Keypair.fromSecret('S...DIST...');

// Definir el activo
const SOL_PE = new Asset('SOLPE', emisor.publicKey());

// 1. Crear trustline desde el distribuidor al emisor
async function crearTrustline(cuentaSecret: string, activo: Asset) {
  const cuenta = await horizon.loadAccount(Keypair.fromSecret(cuentaSecret).publicKey());
  const tx = new TransactionBuilder(cuenta, {
    fee: BASE_FEE,
    networkPassphrase: Networks.TESTNET,
  })
    .addOperation(Operation.changeTrust({
      asset: activo,
      limit: '1000000000', // límite máximo a mantener
    }))
    .setTimeout(30)
    .build();
  
  tx.sign(Keypair.fromSecret(cuentaSecret));
  return horizon.submitTransaction(tx);
}

// 2. Emitir (mint) tokens desde el emisor
async function emitir(destino: string, monto: string) {
  const cuentaEmisor = await horizon.loadAccount(emisor.publicKey());
  const tx = new TransactionBuilder(cuentaEmisor, {
    fee: BASE_FEE,
    networkPassphrase: Networks.TESTNET,
  })
    .addOperation(Operation.payment({
      destination: destino,
      asset: SOL_PE,
      amount: monto,
    }))
    .setTimeout(30)
    .build();
  
  tx.sign(emisor);
  return horizon.submitTransaction(tx);
}
```

---

## Stellar Asset Contract (SAC)

El SAC permite que los activos nativos de Stellar sean usados en contratos Soroban. Cada activo tiene una dirección SAC derivada de su código e issuer.

### Obtener la dirección SAC de un activo

```typescript
import { Asset, Contract } from '@stellar/stellar-sdk';

// Obtener el ID del contrato SAC para un activo
const USDC_ISSUER = 'GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZXXX';
const usdc = new Asset('USDC', USDC_ISSUER);

// En testnet
const sacAddress = usdc.contractId('Test SDF Network ; September 2015');
console.log('SAC address:', sacAddress);

// En mainnet
const sacAddressMainnet = usdc.contractId('Public Global Stellar Network ; September 2015');
```

### Usar SAC desde un contrato Soroban

```rust
use soroban_sdk::{Address, Env, contractimpl};
use soroban_token_sdk::TokenClient;

#[contractimpl]
impl MiProtocolo {
    // Depositar tokens en el protocolo
    pub fn depositar(env: Env, token: Address, usuario: Address, monto: i128) {
        usuario.require_auth();
        
        let token_client = TokenClient::new(&env, &token);
        
        // Transferir del usuario al contrato
        token_client.transfer(
            &usuario,
            &env.current_contract_address(),
            &monto,
        );
        
        // Registrar en el estado interno
        let balance_actual = obtener_balance(&env, &usuario, &token);
        establecer_balance(&env, &usuario, &token, balance_actual + monto);
    }

    // Retirar tokens
    pub fn retirar(env: Env, token: Address, usuario: Address, monto: i128) {
        usuario.require_auth();
        
        let balance = obtener_balance(&env, &usuario, &token);
        assert!(balance >= monto, "saldo insuficiente");
        
        establecer_balance(&env, &usuario, &token, balance - monto);
        
        let token_client = TokenClient::new(&env, &token);
        token_client.transfer(
            &env.current_contract_address(),
            &usuario,
            &monto,
        );
    }

    // Leer saldo externo
    pub fn saldo_token(env: Env, token: Address, cuenta: Address) -> i128 {
        TokenClient::new(&env, &token).balance(&cuenta)
    }
}
```

### Emitir SAC desde un contrato (para emisores autorizados)

```rust
use soroban_token_sdk::TokenClient;

pub fn acunar_tokens(env: Env, token: Address, hacia: Address, monto: i128) {
    // Solo el contrato admin del token puede hacer mint
    // Esto requiere que el contrato sea el admin del SAC
    let token_client = TokenClient::new(&env, &token);
    token_client.mint(&hacia, &monto);
}
```

---

## Crear tu propio token ERC-20 estilo en Soroban

Para un token completamente en Soroban (sin activo clásico subyacente):

```rust
#![no_std]
use soroban_sdk::{
    contract, contractimpl, contracttype, symbol_short,
    Address, Env, Symbol,
};

#[contracttype]
enum Clave {
    Nombre,
    Simbolo,
    Decimales,
    Admin,
    Balance(Address),
    Aprobacion(Address, Address), // (propietario, gastador)
}

#[contract]
pub struct Token;

#[contractimpl]
impl Token {
    pub fn inicializar(
        env: Env,
        admin: Address,
        nombre: soroban_sdk::String,
        simbolo: soroban_sdk::String,
        decimales: u32,
    ) {
        assert!(!env.storage().instance().has(&Clave::Admin), "ya inicializado");
        env.storage().instance().set(&Clave::Admin, &admin);
        env.storage().instance().set(&Clave::Nombre, &nombre);
        env.storage().instance().set(&Clave::Simbolo, &simbolo);
        env.storage().instance().set(&Clave::Decimales, &decimales);
    }

    pub fn acunar(env: Env, hacia: Address, monto: i128) {
        let admin: Address = env.storage().instance().get(&Clave::Admin).unwrap();
        admin.require_auth();
        assert!(monto > 0, "monto inválido");
        
        let balance: i128 = env.storage().persistent()
            .get(&Clave::Balance(hacia.clone()))
            .unwrap_or(0);
        env.storage().persistent()
            .set(&Clave::Balance(hacia.clone()), &(balance + monto));
        
        env.events().publish(
            (symbol_short!("mint"), hacia.clone()),
            monto,
        );
    }

    pub fn transferir(env: Env, desde: Address, hacia: Address, monto: i128) {
        desde.require_auth();
        assert!(monto > 0, "monto inválido");
        
        let balance_desde: i128 = env.storage().persistent()
            .get(&Clave::Balance(desde.clone()))
            .unwrap_or(0);
        assert!(balance_desde >= monto, "saldo insuficiente");
        
        let balance_hacia: i128 = env.storage().persistent()
            .get(&Clave::Balance(hacia.clone()))
            .unwrap_or(0);
        
        env.storage().persistent().set(&Clave::Balance(desde.clone()), &(balance_desde - monto));
        env.storage().persistent().set(&Clave::Balance(hacia.clone()), &(balance_hacia + monto));
        
        env.events().publish(
            (symbol_short!("transfer"), desde.clone()),
            (hacia.clone(), monto),
        );
    }

    pub fn balance(env: Env, cuenta: Address) -> i128 {
        env.storage().persistent()
            .get(&Clave::Balance(cuenta))
            .unwrap_or(0)
    }
}
```

---

## Casos de uso para Perú

### Token PEN simulado para demos

```typescript
// Para demos en testnet — emitir un "PENPE" que simule soles peruanos
const PEN_TESTNET = new Asset('PENPE', emisorPubKey);

// Flujo típico para demo de on-ramp:
// 1. Usuario "deposita" PEN (simulado con Yape/Plin)
// 2. El sistema emite PENPE en testnet
// 3. El usuario puede transferir PENPE a otros
// 4. El sistema quema PENPE en el off-ramp
```

### Remesas con USDC en Stellar

```typescript
// USDC en Stellar Testnet
const USDC_TESTNET = new Asset(
  'USDC',
  'GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5'
);

// Flujo de remesa:
// 1. Remitente (EE.UU.) envía USDC a Stellar
// 2. Transferencia instantánea a < $0.01
// 3. Receptor (Perú) hace off-ramp a PEN via anchor
```

---

## Herramientas útiles

```bash
# Ver activos de una cuenta en testnet
curl https://horizon-testnet.stellar.org/accounts/<PUBLIC_KEY>

# Ver transacciones de un activo
curl "https://horizon-testnet.stellar.org/assets?asset_code=PENPE&asset_issuer=<ISSUER>"

# Stellar Laboratory — crear trustlines y pagos manualmente
# https://laboratory.stellar.org
```
