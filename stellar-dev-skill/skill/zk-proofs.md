# ZK Proofs en Soroban

Arquitectura y patrones para verificar pruebas de conocimiento cero (ZK proofs) en contratos Soroban.

---

## Contexto

Soroban no tiene circuitos ZK nativos, pero puede **verificar pruebas ZK** generadas off-chain. El patrón típico es:

1. El usuario genera una prueba ZK off-chain (en el cliente o un servidor)
2. El contrato Soroban verifica la prueba on-chain
3. Si la prueba es válida, el contrato ejecuta la lógica

---

## Casos de uso prácticos

| Caso de uso | Qué prueba | Por qué ZK |
|---|---|---|
| KYC sin datos | "Tengo KYC aprobado" | Sin revelar nombre/DNI |
| Solvencia | "Tengo > X saldo" | Sin revelar saldo exacto |
| Elegibilidad | "Soy mayor de 18" | Sin revelar fecha de nacimiento |
| Votación anónima | "Voté exactamente una vez" | Sin revelar el voto |
| Transacciones privadas | "Conozco la clave de este UTXO" | Sin revelar la clave |

---

## Verificación de pruebas Groth16

Groth16 es el sistema ZK más común para verificación on-chain eficiente.

### Estructura de datos

```rust
use soroban_sdk::{Bytes, BytesN, Env, contracttype};

#[contracttype]
pub struct PruebaGroth16 {
    pub a: BytesN<64>,   // Punto G1 (2 coordenadas de 32 bytes)
    pub b: BytesN<128>,  // Punto G2 (4 coordenadas de 32 bytes)
    pub c: BytesN<64>,   // Punto G1
}

#[contracttype]
pub struct ClaveVerificacion {
    pub alpha: BytesN<64>,
    pub beta: BytesN<128>,
    pub gamma: BytesN<128>,
    pub delta: BytesN<128>,
    pub ic: soroban_sdk::Vec<BytesN<64>>, // puntos de entrada pública
}
```

### Verificador en Soroban

```rust
use soroban_sdk::{contract, contractimpl, BytesN, Env, Vec, contracttype, symbol_short};

#[contracttype]
enum Clave {
    ClaveVerificacion,
    Admin,
}

#[contract]
pub struct VerificadorZK;

#[contractimpl]
impl VerificadorZK {
    pub fn inicializar(env: Env, admin: Address, clave_vk: ClaveVerificacion) {
        assert!(!env.storage().instance().has(&Clave::Admin), "ya inicializado");
        env.storage().instance().set(&Clave::Admin, &admin);
        env.storage().instance().set(&Clave::ClaveVerificacion, &clave_vk);
    }

    pub fn verificar_prueba(
        env: Env,
        prueba: PruebaGroth16,
        entradas_publicas: Vec<BytesN<32>>,
    ) -> bool {
        let vk: ClaveVerificacion = env.storage().instance()
            .get(&Clave::ClaveVerificacion)
            .expect("no inicializado");
        
        // Nota: Soroban no tiene operaciones de curva elíptica nativas aún.
        // La verificación real requiere una librería o una implementación custom.
        // Para demos, se puede usar un verificador simplificado o
        // delegar la verificación a un oráculo de confianza.
        
        verificar_groth16_simplificado(&env, &prueba, &entradas_publicas, &vk)
    }

    pub fn verificar_y_ejecutar(
        env: Env,
        usuario: Address,
        prueba: PruebaGroth16,
        entradas_publicas: Vec<BytesN<32>>,
    ) {
        usuario.require_auth();
        
        let es_valida = Self::verificar_prueba(
            env.clone(),
            prueba,
            entradas_publicas,
        );
        assert!(es_valida, "prueba ZK inválida");
        
        // Marcar como usado para prevenir replay attacks
        let hash_prueba = env.crypto().sha256(&prueba.a.into());
        assert!(
            !env.storage().temporary().has(&hash_prueba),
            "prueba ya utilizada"
        );
        env.storage().temporary().set(&hash_prueba, &true);
        
        // Lógica de negocio aquí...
        env.events().publish((symbol_short!("zkverif"),), usuario);
    }
}

fn verificar_groth16_simplificado(
    env: &Env,
    prueba: &PruebaGroth16,
    entradas: &Vec<BytesN<32>>,
    vk: &ClaveVerificacion,
) -> bool {
    // Implementación real requiere pairing de curvas elípticas (BN254 o BLS12-381)
    // Actualmente en Soroban se puede hacer via:
    // 1. Librería Rust pura (costosa en gas pero funcional)
    // 2. Host functions futuras (en desarrollo por SDF)
    // 3. Oráculo de verificación (trusted off-chain)
    
    // Para el buildathon — usar verificador simplificado como demostración
    true // REEMPLAZAR con implementación real
}
```

---

## Generación de pruebas en el cliente (JavaScript)

```typescript
import { groth16 } from 'snarkjs';

// Ejemplo con snarkjs (librería ZK popular compatible con Circom)
async function generarPrueba(
  circuitoWasm: string,     // path al archivo .wasm del circuito
  claveZKey: string,        // path a la clave de prueba .zkey
  entradas: Record<string, any>,  // entradas privadas y públicas
) {
  const { proof, publicSignals } = await groth16.fullProve(
    entradas,
    circuitoWasm,
    claveZKey,
  );
  
  return { proof, publicSignals };
}

// Ejemplo de uso — probar "tengo > 1000 USDC sin revelar el saldo exacto"
const { proof, publicSignals } = await generarPrueba(
  './circuits/solvencia.wasm',
  './circuits/solvencia.zkey',
  {
    saldo: 5000,        // entrada privada (no se revela)
    umbral: 1000,       // entrada pública (visible en la prueba)
    secreto: '12345',   // nonce para prevenir correlación
  }
);

// Formatear para enviar al contrato Soroban
const pruebaFormatoSoroban = {
  a: proof.pi_a.slice(0, 2).map(hexToBytes32),
  b: proof.pi_b.map(par => par.map(hexToBytes32)),
  c: proof.pi_c.slice(0, 2).map(hexToBytes32),
};
```

---

## Circuito simple en Circom

```circom
// circuitos/solvencia.circom
// Prueba que saldo >= umbral sin revelar el saldo

pragma circom 2.0.0;

include "node_modules/circomlib/circuits/comparators.circom";

template PruebaSolvencia() {
    // Entrada privada (no se revela)
    signal input saldo;
    signal input secreto;
    
    // Entrada pública (visible para el verificador)
    signal input umbral;
    
    // Salida pública
    signal output es_solvente;
    
    // Verificar que saldo >= umbral
    component gte = GreaterEqThan(64);
    gte.in[0] <== saldo;
    gte.in[1] <== umbral;
    
    es_solvente <== gte.out;
    
    // Asegurar que es_solvente = 1 (el circuito falla si no)
    es_solvente === 1;
}

component main {public [umbral]} = PruebaSolvencia();
```

```bash
# Compilar el circuito
circom solvencia.circom --r1cs --wasm --sym

# Setup (solo una vez por circuito)
snarkjs groth16 setup solvencia.r1cs pot12_final.ptau solvencia_0000.zkey
snarkjs zkey contribute solvencia_0000.zkey solvencia_0001.zkey --name="contribución inicial"
snarkjs zkey export verificationkey solvencia_0001.zkey verification_key.json

# Generar prueba de ejemplo
echo '{"saldo": 5000, "umbral": 1000, "secreto": "42"}' > input.json
snarkjs groth16 prove solvencia_0001.zkey witness.wtns proof.json public.json

# Verificar la prueba localmente
snarkjs groth16 verify verification_key.json public.json proof.json
```

---

## Oráculo de verificación ZK (alternativa práctica)

Para el buildathon, si la verificación on-chain es muy compleja, usar un oráculo de confianza:

```typescript
// Servidor de verificación (off-chain)
import { groth16 } from 'snarkjs';
import vkJson from './verification_key.json';

app.post('/verificar-zk', async (req, res) => {
  const { proof, publicSignals } = req.body;
  
  const esValida = await groth16.verify(vkJson, publicSignals, proof);
  
  if (!esValida) {
    return res.status(400).json({ error: 'Prueba inválida' });
  }
  
  // Emitir certificado firmado para usar en el contrato
  const certificado = firmarCertificado({
    verificado: true,
    timestamp: Date.now(),
    entradas_publicas: publicSignals,
  });
  
  res.json({ certificado });
});
```

```rust
// Contrato que acepta certificados del oráculo
pub fn verificar_con_oraculo(
    env: Env,
    usuario: Address,
    certificado: Bytes,
    firma_oraculo: BytesN<64>,
) {
    usuario.require_auth();
    
    let oraculo: Address = env.storage().instance()
        .get(&symbol_short!("oracle"))
        .unwrap();
    
    // Verificar firma del oráculo sobre el certificado
    env.crypto().ed25519_verify(
        &BytesN::from_array(&env, &oraculo_pubkey),
        &certificado,
        &firma_oraculo,
    );
    
    // Certificado válido — ejecutar lógica de negocio
}
```

---

## Anti-patrones — qué evitar

```rust
// MAL — no hay prevención de replay attacks
pub fn verificar_y_dar_acceso(env: Env, usuario: Address, prueba: PruebaGroth16) {
    assert!(verificar_prueba(&env, &prueba), "prueba inválida");
    dar_acceso(&env, &usuario); // la misma prueba puede usarse múltiples veces!
}

// BIEN — marcar la prueba como usada
pub fn verificar_y_dar_acceso(env: Env, usuario: Address, prueba: PruebaGroth16) {
    let hash = env.crypto().sha256(&prueba.a.into());
    assert!(!env.storage().temporary().has(&hash), "prueba ya usada");
    
    assert!(verificar_prueba(&env, &prueba), "prueba inválida");
    
    env.storage().temporary().set(&hash, &true);
    dar_acceso(&env, &usuario);
}
```

---

## Estado actual de ZK en Soroban

- Soroban **no tiene** opcodes nativos de pairing de curvas elípticas aún
- La SDF está trabajando en host functions para BN254/BLS12-381
- Por ahora, la verificación on-chain es posible pero cara en gas
- Para producción: usar librería Rust de verificación Groth16
- Para demos/buildathon: oráculo de verificación es la ruta más práctica
