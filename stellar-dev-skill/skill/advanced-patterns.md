# Patrones avanzados de Soroban

Arquitecturas complejas, multicall, factory pattern, vaults y otros patrones para proyectos Soroban maduros.

---

## Factory Pattern — desplegar contratos desde un contrato

```rust
use soroban_sdk::{Address, BytesN, Env, contractimpl, contract, Symbol, Val, Vec};

#[contract]
pub struct Factory;

#[contractimpl]
impl Factory {
    pub fn inicializar(env: Env, admin: Address, wasm_hash: BytesN<32>) {
        admin.require_auth();
        env.storage().instance().set(&symbol_short!("admin"), &admin);
        env.storage().instance().set(&symbol_short!("wasm"), &wasm_hash);
    }

    pub fn crear_contrato(
        env: Env,
        creador: Address,
        salt: BytesN<32>,
        args_inicializacion: Vec<Val>,
    ) -> Address {
        creador.require_auth();
        
        let wasm_hash: BytesN<32> = env.storage().instance()
            .get(&symbol_short!("wasm"))
            .unwrap();
        
        // Desplegar el nuevo contrato con deployer
        let nuevo_contrato = env
            .deployer()
            .with_address(creador.clone(), salt)
            .deploy(wasm_hash);
        
        // Inicializar el contrato recién desplegado
        env.invoke_contract::<()>(
            &nuevo_contrato,
            &symbol_short!("init"),
            args_inicializacion,
        );
        
        // Registrar en el factory
        let key = symbol_short!("count");
        let count: u32 = env.storage().instance().get(&key).unwrap_or(0);
        env.storage().persistent().set(&count, &nuevo_contrato);
        env.storage().instance().set(&key, &(count + 1));
        
        nuevo_contrato
    }
    
    pub fn obtener_contrato(env: Env, indice: u32) -> Option<Address> {
        env.storage().persistent().get(&indice)
    }
}
```

---

## Vault Pattern — pool de liquidez básico

```rust
#![no_std]
use soroban_sdk::{
    contract, contractimpl, contracttype, symbol_short,
    Address, Env, Map,
};
use soroban_token_sdk::TokenClient;

#[contracttype]
enum Clave {
    Token,
    TotalShares,
    Shares(Address),
    Admin,
}

#[contract]
pub struct Vault;

#[contractimpl]
impl Vault {
    pub fn inicializar(env: Env, admin: Address, token: Address) {
        assert!(!env.storage().instance().has(&Clave::Admin), "ya inicializado");
        env.storage().instance().set(&Clave::Admin, &admin);
        env.storage().instance().set(&Clave::Token, &token);
        env.storage().instance().set(&Clave::TotalShares, &0_i128);
    }

    pub fn depositar(env: Env, usuario: Address, monto: i128) -> i128 {
        usuario.require_auth();
        assert!(monto > 0, "monto inválido");

        let token: Address = env.storage().instance().get(&Clave::Token).unwrap();
        let total_shares: i128 = env.storage().instance()
            .get(&Clave::TotalShares)
            .unwrap_or(0);
        let token_client = TokenClient::new(&env, &token);
        let total_assets = token_client.balance(&env.current_contract_address());

        // Calcular shares a emitir (precio = 1:1 si el vault está vacío)
        let shares = if total_shares == 0 || total_assets == 0 {
            monto
        } else {
            monto * total_shares / total_assets
        };

        // Transferir tokens al vault
        token_client.transfer(&usuario, &env.current_contract_address(), &monto);

        // Emitir shares al usuario
        let shares_usuario: i128 = env.storage().persistent()
            .get(&Clave::Shares(usuario.clone()))
            .unwrap_or(0);
        env.storage().persistent()
            .set(&Clave::Shares(usuario.clone()), &(shares_usuario + shares));
        env.storage().instance()
            .set(&Clave::TotalShares, &(total_shares + shares));

        env.events().publish(
            (symbol_short!("deposit"), usuario),
            (monto, shares),
        );

        shares
    }

    pub fn retirar(env: Env, usuario: Address, shares: i128) -> i128 {
        usuario.require_auth();
        assert!(shares > 0, "shares inválidas");

        let token: Address = env.storage().instance().get(&Clave::Token).unwrap();
        let total_shares: i128 = env.storage().instance()
            .get(&Clave::TotalShares)
            .unwrap();
        let token_client = TokenClient::new(&env, &token);
        let total_assets = token_client.balance(&env.current_contract_address());

        let shares_usuario: i128 = env.storage().persistent()
            .get(&Clave::Shares(usuario.clone()))
            .unwrap_or(0);
        assert!(shares_usuario >= shares, "shares insuficientes");

        // Calcular tokens a retornar
        let monto = shares * total_assets / total_shares;

        // Actualizar estado ANTES de transferir
        env.storage().persistent()
            .set(&Clave::Shares(usuario.clone()), &(shares_usuario - shares));
        env.storage().instance()
            .set(&Clave::TotalShares, &(total_shares - shares));

        // Transferir tokens al usuario
        token_client.transfer(&env.current_contract_address(), &usuario, &monto);

        monto
    }

    pub fn shares_de(env: Env, usuario: Address) -> i128 {
        env.storage().persistent()
            .get(&Clave::Shares(usuario))
            .unwrap_or(0)
    }

    pub fn total_assets(env: Env) -> i128 {
        let token: Address = env.storage().instance().get(&Clave::Token).unwrap();
        TokenClient::new(&env, &token).balance(&env.current_contract_address())
    }
}
```

---

## Multicall — agrupar múltiples operaciones

```typescript
// Múltiples invocaciones de contrato en una sola transacción

import {
  TransactionBuilder, Contract, SorobanRpc,
  Networks, BASE_FEE, nativeToScVal, Address,
} from '@stellar/stellar-sdk';

async function multicall(
  cuenta: any,
  operaciones: { contractId: string; funcion: string; args: any[] }[],
  firmar: (xdr: string) => Promise<string>,
) {
  const rpc = new SorobanRpc.Server('https://soroban-testnet.stellar.org');
  
  const builder = new TransactionBuilder(cuenta, {
    fee: BASE_FEE,
    networkPassphrase: Networks.TESTNET,
  });

  // Agregar múltiples operaciones de contrato
  for (const op of operaciones) {
    const contrato = new Contract(op.contractId);
    builder.addOperation(contrato.call(op.funcion, ...op.args));
  }

  const tx = builder.setTimeout(30).build();
  
  // Simular para validar todas las operaciones
  const sim = await rpc.simulateTransaction(tx);
  if (SorobanRpc.Api.isSimulationError(sim)) {
    throw new Error(`Error en simulación: ${sim.error}`);
  }

  const txFinal = SorobanRpc.assembleTransaction(tx, sim).build();
  const xdrFirmado = await firmar(txFinal.toXDR());
  const txFirmada = TransactionBuilder.fromXDR(xdrFirmado, Networks.TESTNET);
  
  return rpc.sendTransaction(txFirmada);
}
```

---

## Patrón de escrow genérico

```rust
#[contracttype]
pub struct Escrow {
    pub depositante: Address,
    pub beneficiario: Address,
    pub arbitro: Address,
    pub token: Address,
    pub monto: i128,
    pub estado: EstadoEscrow,
    pub vencimiento: u64, // ledger de vencimiento
}

#[contracttype]
pub enum EstadoEscrow {
    Pendiente,
    Completado,
    Cancelado,
    EnDisputa,
}

#[contractimpl]
impl ContratoEscrow {
    pub fn crear(
        env: Env,
        depositante: Address,
        beneficiario: Address,
        arbitro: Address,
        token: Address,
        monto: i128,
        duracion_ledgers: u64,
    ) -> u64 {
        depositante.require_auth();

        let ledger_actual = env.ledger().sequence() as u64;
        let id = ledger_actual; // usar ledger como ID único

        let escrow = Escrow {
            depositante: depositante.clone(),
            beneficiario,
            arbitro,
            token: token.clone(),
            monto,
            estado: EstadoEscrow::Pendiente,
            vencimiento: ledger_actual + duracion_ledgers,
        };

        // Transferir fondos al contrato
        TokenClient::new(&env, &token).transfer(
            &depositante,
            &env.current_contract_address(),
            &monto,
        );

        env.storage().persistent().set(&id, &escrow);
        env.storage().persistent().extend_ttl(&id, 50000, 100000);

        id
    }

    pub fn liberar(env: Env, id: u64) {
        let escrow: Escrow = env.storage().persistent().get(&id).unwrap();
        
        // El depositante o el árbitro pueden liberar
        match env.invoker() {
            _ => {
                escrow.depositante.require_auth(); // o arbitro
            }
        }
        
        assert!(
            matches!(escrow.estado, EstadoEscrow::Pendiente),
            "escrow no está pendiente"
        );

        let mut escrow_actualizado = escrow.clone();
        escrow_actualizado.estado = EstadoEscrow::Completado;
        env.storage().persistent().set(&id, &escrow_actualizado);

        TokenClient::new(&env, &escrow.token).transfer(
            &env.current_contract_address(),
            &escrow.beneficiario,
            &escrow.monto,
        );
    }
}
```

---

## Rate limiting — límite de velocidad en contratos

```rust
#[contracttype]
struct LimiteVelocidad {
    pub monto_periodo: i128,
    pub ledger_inicio: u32,
    pub duracion_ledgers: u32,
}

fn verificar_limite(env: &Env, usuario: &Address, monto: i128) {
    let clave = (symbol_short!("ratelim"), usuario.clone());
    let ledger_actual = env.ledger().sequence();
    
    let mut limite: LimiteVelocidad = env.storage().temporary()
        .get(&clave)
        .unwrap_or(LimiteVelocidad {
            monto_periodo: 0,
            ledger_inicio: ledger_actual,
            duracion_ledgers: 720, // ~1 hora
        });
    
    // Resetear si el período expiró
    if ledger_actual >= limite.ledger_inicio + limite.duracion_ledgers {
        limite.monto_periodo = 0;
        limite.ledger_inicio = ledger_actual;
    }
    
    assert!(
        limite.monto_periodo + monto <= MAX_POR_PERIODO,
        "límite de velocidad excedido"
    );
    
    limite.monto_periodo += monto;
    env.storage().temporary().set(&clave, &limite);
}
```

---

## Pausa de emergencia (circuit breaker)

```rust
#[contractimpl]
impl MiProtocolo {
    pub fn pausar(env: Env) {
        Self::require_admin(&env);
        env.storage().instance().set(&symbol_short!("paused"), &true);
        env.events().publish((symbol_short!("pause"),), ());
    }
    
    pub fn reanudar(env: Env) {
        Self::require_admin(&env);
        env.storage().instance().set(&symbol_short!("paused"), &false);
        env.events().publish((symbol_short!("resume"),), ());
    }
    
    fn verificar_no_pausado(env: &Env) {
        let pausado: bool = env.storage().instance()
            .get(&symbol_short!("paused"))
            .unwrap_or(false);
        assert!(!pausado, "protocolo pausado");
    }
    
    pub fn depositar(env: Env, usuario: Address, monto: i128) {
        Self::verificar_no_pausado(&env);
        usuario.require_auth();
        // ...
    }
}
```

---

## Integración con Blend Protocol (préstamos)

```typescript
// Ejemplo conceptual — revisar docs actuales de Blend
import { BlendPoolClient } from '@blend-capital/blend-sdk';

const blendPool = new BlendPoolClient({
  rpcUrl: 'https://soroban-testnet.stellar.org',
  contractId: BLEND_POOL_ADDRESS,
  networkPassphrase: Networks.TESTNET,
  publicKey,
  signTransaction: firmar,
});

// Proveer liquidez
await blendPool.supply({
  asset: USDC_ADDRESS,
  amount: BigInt(1000_0000000), // 1000 USDC (7 decimales)
  from: publicKey,
});

// Solicitar préstamo (colateral previo requerido)
await blendPool.borrow({
  asset: XLM_ADDRESS,
  amount: BigInt(100_0000000),
  to: publicKey,
});
```
