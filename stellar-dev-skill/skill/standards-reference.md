# Referencia de SEPs y CAPs

Guía rápida de los Stellar Ecosystem Proposals (SEPs) y Core Advancement Proposals (CAPs) más relevantes para builders.

---

## SEPs — Stellar Ecosystem Proposals

Los SEPs definen estándares de interoperabilidad entre aplicaciones y servicios del ecosistema Stellar.

### SEP-0001 — stellar.toml

Define el archivo de configuración que los emisores de activos y anchors publican en su dominio para comunicar información sobre sus activos y servicios.

```toml
# https://tu-dominio.com/.well-known/stellar.toml

NETWORK_PASSPHRASE="Test SDF Network ; September 2015"
FEDERATION_SERVER="https://federation.tu-dominio.com"

[[CURRENCIES]]
code="PENPE"
issuer="G...TU_ISSUER..."
display_decimals=2
name="Sol Peruano Digital"
desc="Token respaldado 1:1 con PEN para demos en Stellar"
is_asset_anchored=true
anchor_asset_type="fiat"
anchor_asset="PEN"
redemption_instructions="Contacta a soporte@tu-dominio.com"

[[PRINCIPALS]]
name="Tu Nombre"
email="contacto@tu-dominio.com"
```

**Cuándo usarlo:** Siempre que emitas un activo o tengas un anchor. Los exploradores como stellar.expert leen este archivo.

---

### SEP-0002 — Federation Protocol

Permite mapear nombres legibles (`usuario*tu-dominio.com`) a direcciones Stellar (`G...`).

```typescript
import { FederationServer } from '@stellar/stellar-sdk';

// Resolver un nombre de federación
const { account_id } = await FederationServer.resolve('usuario*dominio.com');
console.log('Dirección:', account_id); // G...

// Resolver inverso (dirección → nombre)
const record = await FederationServer.createForDomain('dominio.com')
  .then(server => server.resolveAccountId('G...'));
```

---

### SEP-0006 — Transferencias (Anchor/Cliente)

API para anchos que permite depositar y retirar activos. Versión más antigua, SEP-24 es el reemplazo recomendado.

---

### SEP-0010 — Autenticación Web (SEP-10)

Estándar para que wallets y aplicaciones se autentiquen con servidores usando su clave Stellar.

```typescript
// En el cliente — obtener challenge y firmarlo
import { Stellar } from '@stellar/stellar-sdk';

// 1. Obtener challenge del servidor
const resp = await fetch(`https://tu-servidor.com/auth?account=${publicKey}`);
const { transaction } = await resp.json();

// 2. El usuario firma con su wallet
const { signedTxXdr } = await kit.signTransaction(transaction, {
  networkPassphrase: Networks.TESTNET,
});

// 3. Enviar al servidor para obtener JWT
const authResp = await fetch('https://tu-servidor.com/auth', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ transaction: signedTxXdr }),
});
const { token } = await authResp.json();
// Usar el JWT para llamadas autenticadas
```

---

### SEP-0024 — Transferencias Interactivas (Anchor/Cliente)

El estándar moderno para on/off ramps con anchors. Usa una interfaz web interactiva.

```typescript
import { Anchor, Networks } from '@stellar/stellar-sdk';

const anchor = new Anchor({
  networkPassphrase: Networks.TESTNET,
  homeDomain: 'anchor.ejemplo.com',
});

// Obtener info del anchor
const info = await anchor.getInfo();
console.log('Activos soportados:', info.deposit);

// Iniciar depósito (on-ramp)
const { url } = await anchor.sep24().deposit({
  authToken: jwtToken,
  assetCode: 'USDC',
  lang: 'es',
});

// Abrir la interfaz del anchor en un popup o iframe
window.open(url, 'sep24-deposit', 'width=500,height=700');
```

---

### SEP-0031 — Transferencias Directas (Cross-border)

Permite pagos directos entre instituciones (B2B), sin interfaz de usuario.

```
Remitente → Sending Anchor → Stellar Network → Receiving Anchor → Beneficiario
```

---

### SEP-0038 — Cotizaciones (Quotes)

API para obtener cotizaciones de tipo de cambio antes de una transferencia.

```typescript
// Obtener cotización antes del on-ramp
const cotizacion = await fetch(
  'https://anchor.ejemplo.com/quotes?' +
  `sell_asset=iso4217:PEN&` +
  `buy_asset=stellar:USDC:G...ISSUER&` +
  `sell_amount=1000`
).then(r => r.json());

console.log(`1000 PEN = ${cotizacion.buy_amount} USDC`);
console.log(`Tasa: ${cotizacion.price}`);
console.log(`Expira: ${cotizacion.expires_at}`);
```

---

### SEP-0041 — Interfaz de Token Soroban

Define la interfaz estándar que deben implementar los tokens en Soroban (equivalente a ERC-20 en Ethereum). El SAC implementa este estándar.

```rust
// La interfaz SEP-41 que deben implementar todos los tokens Soroban:
pub trait TokenInterface {
    fn allowance(env: Env, from: Address, spender: Address) -> i128;
    fn approve(env: Env, from: Address, spender: Address, amount: i128, expiration_ledger: u32);
    fn balance(env: Env, id: Address) -> i128;
    fn transfer(env: Env, from: Address, to: Address, amount: i128);
    fn transfer_from(env: Env, spender: Address, from: Address, to: Address, amount: i128);
    fn burn(env: Env, from: Address, amount: i128);
    fn burn_from(env: Env, spender: Address, from: Address, amount: i128);
    fn decimals(env: Env) -> u32;
    fn name(env: Env) -> String;
    fn symbol(env: Env) -> String;
}
```

---

## CAPs — Core Advancement Proposals

Los CAPs son cambios al protocolo central de Stellar. Para builders, lo más relevante es conocer los CAPs activos que definen capacidades de Soroban.

### CAPs relevantes para Soroban

| CAP | Descripción | Relevancia para builders |
|---|---|---|
| CAP-0046 | Soroban Smart Contracts — base | Fundamento de todos los contratos |
| CAP-0052 | Soroban Storage | Los 3 tipos de almacenamiento (instance/persistent/temporary) |
| CAP-0053 | Soroban TTL | Cómo funciona la vida útil de los datos |
| CAP-0054 | Fee model de Soroban | Cómo se calculan los fees de contratos |

---

## Tabla de referencia rápida

| Estoy construyendo... | SEP relevante |
|---|---|
| Un activo con emisor verificado | SEP-1 (stellar.toml) |
| Sistema de login con wallet Stellar | SEP-10 |
| On-ramp / off-ramp para usuarios | SEP-24 |
| Pagos internacionales B2B | SEP-31 |
| Cotizador de tipo de cambio | SEP-38 |
| Un token en Soroban | SEP-41 |
| Nombres de usuario legibles | SEP-2 (federación) |

---

## Recursos oficiales

- SEPs: https://github.com/stellar/stellar-protocol/tree/master/ecosystem
- CAPs: https://github.com/stellar/stellar-protocol/tree/master/core
- Stellar Anchors: https://developers.stellar.org/docs/anchoring-assets
