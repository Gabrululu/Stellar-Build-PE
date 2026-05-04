# Seguridad en Soroban y Stellar

Checklist de seguridad, patrones seguros y errores comunes que debes evitar en tus contratos y aplicaciones Stellar.

---

## Checklist de seguridad — contratos Soroban

### Autorización y autenticación

- [ ] **Toda función que modifica estado requiere `require_auth()`** antes de cualquier lógica
- [ ] **No confiar en el contexto del caller** — siempre verificar autenticación explícitamente
- [ ] **Admin protegido** — las funciones de admin verifican la dirección correcta
- [ ] **Inicialización única** — el constructor verifica que no fue llamado antes
- [ ] **No hay funciones admin sin auth** — incluso en desarrollo

```rust
// MAL — sin verificación de autorización
pub fn transferir(env: Env, desde: Address, hacia: Address, monto: i128) {
    set_balance(&env, &desde, get_balance(&env, &desde) - monto); // PELIGROSO
}

// BIEN — verificar auth antes de cualquier lógica
pub fn transferir(env: Env, desde: Address, hacia: Address, monto: i128) {
    desde.require_auth(); // SIEMPRE primero
    let balance = get_balance(&env, &desde);
    assert!(balance >= monto, "saldo insuficiente");
    set_balance(&env, &desde, balance - monto);
    set_balance(&env, &hacia, get_balance(&env, &hacia) + monto);
}
```

### Manejo de enteros

- [ ] **Usar `i128` para montos** — suficiente para cualquier cantidad financiera
- [ ] **Verificar overflow** — el perfil release tiene `overflow-checks = true`
- [ ] **No dividir antes de multiplicar** — pérdida de precisión
- [ ] **Validar montos positivos** — `assert!(monto > 0)`

```rust
// MAL — puede hacer overflow silencioso en modo debug
let total: u64 = monto1 + monto2;

// BIEN — usar i128 y verificar
let total: i128 = monto1.checked_add(monto2).expect("overflow");

// MAL — pérdida de precisión
let comision = total / 100 * tasa;

// BIEN — multiplicar primero
let comision = total * tasa / 100;
```

### Reentrancy

Soroban tiene protección contra reentrancy a nivel de protocolo, pero hay patrones a seguir:

```rust
// PATRÓN SEGURO: actualizar estado ANTES de llamadas externas
pub fn retirar(env: Env, usuario: Address, monto: i128) {
    usuario.require_auth();
    
    let balance = get_balance(&env, &usuario);
    assert!(balance >= monto, "saldo insuficiente");
    
    // 1. Actualizar estado PRIMERO
    set_balance(&env, &usuario, balance - monto);
    
    // 2. Llamada externa DESPUÉS
    TokenClient::new(&env, &token).transfer(
        &env.current_contract_address(),
        &usuario,
        &monto,
    );
}
```

### Validación de inputs

```rust
pub fn crear_posicion(env: Env, usuario: Address, monto: i128, plazo: u64) {
    usuario.require_auth();
    
    assert!(monto > 0, "monto debe ser positivo");
    assert!(monto <= MAX_MONTO, "monto excede el límite");
    assert!(plazo >= PLAZO_MINIMO, "plazo muy corto");
    assert!(plazo <= PLAZO_MAXIMO, "plazo muy largo");
    
    // Solo después de validar, proceder
}
```

---

## Checklist de seguridad — frontend

- [ ] **Nunca exponer claves privadas** en variables de entorno del cliente
- [ ] **Siempre simular antes de enviar** — `simulateTransaction` para verificar
- [ ] **Mostrar detalles al usuario** antes de pedir firma
- [ ] **Verificar el resultado** de transacciones enviadas
- [ ] **Timeout en transacciones** — siempre usar `setTimeout(30)` mínimo
- [ ] **Validar inputs del usuario** antes de construir transacciones

```typescript
// MAL — exponer clave privada (NUNCA hacer esto)
const PRIVATE_KEY = process.env.NEXT_PUBLIC_SECRET_KEY; // PELIGROSO

// BIEN — usar wallet del usuario para firmar
const { signedTxXdr } = await kit.signTransaction(txXdr);

// BIEN — simular y mostrar al usuario qué va a firmar
const sim = await rpc.simulateTransaction(tx);
console.log(`Esta transacción costará ${sim.minResourceFee} stroops`);
const confirmado = await preguntarUsuario('¿Confirmar transacción?');
if (!confirmado) return;
```

---

## Manejo seguro de claves en desarrollo

```bash
# MAL — guardar clave en variable de entorno plana
export STELLAR_SECRET=S...

# BIEN — usar archivo ignorado por git
echo "STELLAR_SECRET=S..." > .env.local
echo ".env.local" >> .gitignore
echo ".env*.local" >> .gitignore

# Verificar que no se commitea ninguna clave
git secrets --scan  # si tienes git-secrets instalado
grep -r "^S[A-Z2-7]\{55\}" . --include="*.ts" --include="*.js" --include="*.env"
```

---

## Auditoría de contratos — qué revisar

### Lógica de negocio

```rust
// Verificar invariantes — el total nunca debe cambiar en transferencias
pub fn transferir(env: Env, desde: Address, hacia: Address, monto: i128) {
    desde.require_auth();
    
    let balance_desde = get_balance(&env, &desde);
    let balance_hacia = get_balance(&env, &hacia);
    let total_antes = balance_desde + balance_hacia;
    
    assert!(balance_desde >= monto, "saldo insuficiente");
    
    set_balance(&env, &desde, balance_desde - monto);
    set_balance(&env, &hacia, balance_hacia + monto);
    
    // En un test, verificar que la invariante se mantiene
    debug_assert_eq!(
        get_balance(&env, &desde) + get_balance(&env, &hacia),
        total_antes
    );
}
```

### Funciones peligrosas a revisar

```rust
// Cualquier función que:
// 1. Modifica balances sin require_auth() → VULNERABILIDAD CRÍTICA
// 2. Llama contratos externos antes de actualizar estado → POSIBLE REENTRANCY
// 3. Usa división sin verificar divisor != 0 → PANIC
// 4. Permite inicialización múltiple → VULNERABILIDAD CRÍTICA
// 5. No tiene límites en inputs → POSIBLE OVERFLOW
```

---

## Proteger la clave de admin

```rust
#[contracttype]
enum Clave { Admin, PendingAdmin }

#[contractimpl]
impl MiContrato {
    // Patrón de transferencia de admin en 2 pasos (más seguro)
    pub fn proponer_nuevo_admin(env: Env, nuevo_admin: Address) {
        Self::require_admin(&env);
        env.storage().instance().set(&Clave::PendingAdmin, &nuevo_admin);
    }
    
    pub fn aceptar_admin(env: Env) {
        let pending: Address = env.storage().instance()
            .get(&Clave::PendingAdmin)
            .expect("no hay admin pendiente");
        pending.require_auth();
        
        env.storage().instance().set(&Clave::Admin, &pending);
        env.storage().instance().remove(&Clave::PendingAdmin);
    }
}
```

---

## Manejo de errores explícito

```rust
use soroban_sdk::{contracterror, Env};

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
pub enum Error {
    NoInicializado = 1,
    YaInicializado = 2,
    SaldoInsuficiente = 3,
    MontoInvalido = 4,
    NoAutorizado = 5,
    PlazoInvalido = 6,
}

#[contractimpl]
impl MiContrato {
    pub fn retirar(env: Env, usuario: Address, monto: i128) -> Result<i128, Error> {
        usuario.require_auth();
        
        if monto <= 0 {
            return Err(Error::MontoInvalido);
        }
        
        let balance = get_balance(&env, &usuario);
        if balance < monto {
            return Err(Error::SaldoInsuficiente);
        }
        
        set_balance(&env, &usuario, balance - monto);
        Ok(balance - monto)
    }
}
```

---

## Herramientas de seguridad

```bash
# Análisis estático de Rust
cargo clippy -- -D warnings

# Verificar dependencias con vulnerabilidades conocidas
cargo audit

# Buscar patrones peligrosos en el código
grep -n "unwrap()" src/lib.rs  # Revisar cada unwrap — pueden causar panic

# Verificar que el WASM resultante no tiene symbols innecesarios
wasm-objdump -x target/wasm32-unknown-unknown/release/mi_contrato.wasm | grep Export
```

---

## Resumen de riesgos por severidad

| Severidad | Patrón | Ejemplo |
|---|---|---|
| CRÍTICO | Falta de `require_auth()` | Cualquier función que mueve fondos |
| CRÍTICO | Inicialización múltiple sin protección | `inicializar` sin verificar estado |
| ALTO | Aritmética sin control de overflow | `u64` en sumas de montos |
| ALTO | Estado actualizado después de llamada externa | Patrón incorrecto de withdraw |
| MEDIO | Inputs sin validar | Montos negativos o cero |
| MEDIO | Admin sin transferencia en 2 pasos | Un error = pérdida de control |
| BAJO | `unwrap()` en datos de storage | Panic si el dato no existe |
| BAJO | TTL no extendido en datos persistent | Datos que expiran inesperadamente |
