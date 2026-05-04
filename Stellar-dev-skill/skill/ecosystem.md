# Ecosistema Stellar — Protocolos, Wallets y Herramientas

Guía del ecosistema actual de Stellar: protocolos DeFi, wallets, herramientas de desarrollo y proyectos de referencia.

---

## Protocolos DeFi

### Blend Protocol — Préstamos y crédito

- **Qué hace:** Protocolo de préstamos descentralizado. Los usuarios proveen liquidez y otros pueden pedir prestado colateralizando activos.
- **Docs:** https://docs.blend.capital
- **SDK:** `@blend-capital/blend-sdk`
- **Casos de uso:** DeFi lending, yield farming, credit scoring on-chain, microfinanzas
- **Relevante para Perú:** Préstamos sin banco, colateralización de activos tokenizados

### Soroswap — DEX y Aggregador

- **Qué hace:** Exchange descentralizado en Soroban con router para encontrar mejores rutas de swap.
- **Docs:** https://docs.soroswap.finance
- **SDK:** `@soroswap/router-sdk`
- **Casos de uso:** Swaps de activos, liquidez, price discovery

### Phoenix DEX

- **Qué hace:** AMM nativo de Soroban para trading de pares de activos.
- **Útil para:** Market making, pools de liquidez, swaps on-chain

### DeFindex — Yield Vaults

- **Qué hace:** Gestión automatizada de estrategias de yield sobre múltiples protocolos.
- **Útil para:** Vaults de ahorro, gestión de portfolios, yield optimization

### Reflector Oracle — Precios on-chain

- **Qué hace:** Oráculo de precios para Soroban. Provee precios de activos directamente en la cadena.
- **Útil para:** Cualquier protocolo que necesite datos de precios (lending, options, swaps)
- **Integración básica:**

```rust
// Interface simplificada del oráculo Reflector
use soroban_sdk::{Address, Env};

pub fn obtener_precio(env: &Env, oracle: &Address, asset: &Address) -> Option<i128> {
    // El oráculo retorna el precio en base points (decimales fijos)
    let precio: Option<i128> = env.invoke_contract(
        oracle,
        &soroban_sdk::symbol_short!("lastprice"),
        soroban_sdk::vec![env, asset.into_val(env)],
    );
    precio
}
```

### Trustless Work — Escrow descentralizado

- **Qué hace:** Escrow como servicio sobre Stellar/Soroban. Permite crear escrows programáticos.
- **Docs:** https://docs.trustlesswork.com
- **Casos de uso:** Marketplaces freelance, pagos condicionales, e-commerce descentralizado
- **Relevante para Perú:** Pagos seguros en trabajo remoto, protección al comprador/vendedor

---

## Wallets

### Freighter

- **Tipo:** Extensión de navegador (Chrome, Firefox, Brave)
- **Instalación:** https://freighter.app
- **SDK:** `@stellar/freighter-api`
- **Mejor para:** Desarrollo, power users
- **Notas:** La wallet más usada por desarrolladores en el ecosistema

```typescript
import freighter from '@stellar/freighter-api';

// Verificar instalación
const { isConnected } = await freighter.isConnected();

// Obtener cuenta
const { publicKey } = await freighter.getPublicKey();

// Firmar transacción
const { signedTxXdr } = await freighter.signTransaction(txXdr, {
  networkPassphrase: 'Test SDF Network ; September 2015',
});
```

### LOBSTR

- **Tipo:** App móvil (iOS, Android) + extensión web
- **Mejor para:** Usuarios finales, trading de activos
- **Soporta:** SEP-10, múltiples activos, exchange integrado

### xBull Wallet

- **Tipo:** PWA + extensión de navegador
- **Mejor para:** Usuarios intermedios, soporte SEP-7 (deep links)
- **SDK:** Compatible con Stellar Wallets Kit

### Rabet

- **Tipo:** Extensión de navegador
- **Mejor para:** Alternativa a Freighter para usuarios finales

### Stellar Wallets Kit — Solución recomendada

Para soportar múltiples wallets con una sola integración:

```typescript
import {
  StellarWalletsKit,
  WalletNetwork,
  FREIGHTER_ID,
  LOBSTR_ID,
  XBULL_ID,
  allowAllModules,
} from '@creit.tech/stellar-wallets-kit';

const kit = new StellarWalletsKit({
  network: WalletNetwork.TESTNET,
  selectedWalletId: FREIGHTER_ID,
  modules: allowAllModules(), // soporta todas las wallets disponibles
});
```

### Smart Accounts con Passkeys (Stellar Wallets)

Las cuentas inteligentes de Stellar permiten autenticación con passkeys (huella, Face ID):

- **Repositorio de referencia:** https://github.com/stellar/launchtube
- **Ventaja:** Usuarios sin extensiones de navegador, UX nativo de móvil

---

## Herramientas de desarrollo

### Soroban CLI

```bash
# Instalación
cargo install --locked soroban-cli --features opt

# Comandos principales
soroban contract build          # compilar
soroban contract deploy         # desplegar
soroban contract invoke         # invocar función
soroban contract bindings       # generar bindings TypeScript
soroban keys generate           # crear keypair
soroban keys fund               # fondear en testnet
soroban network add             # configurar red
```

### Stellar Laboratory

- **URL:** https://laboratory.stellar.org
- **Para qué:** Crear y enviar transacciones manualmente, explorar la XDR, probar operaciones

### Stellar Expert

- **URL:** https://stellar.expert
- **Para qué:** Block explorer completo para testnet y mainnet

### Friendbot

- **Testnet:** https://friendbot.stellar.org?addr=<PUBLIC_KEY>
- **Futurenet:** https://friendbot-futurenet.stellar.org?addr=<PUBLIC_KEY>
- **Para qué:** Fondear cuentas en redes de prueba (10,000 XLM gratis)

### Stellar Quest

- **URL:** https://quest.stellar.org
- **Para qué:** Aprender Stellar resolviendo desafíos — gamificado con NFTs

---

## Librerías y SDKs

### JavaScript / TypeScript

| Paquete | Uso |
|---|---|
| `@stellar/stellar-sdk` | SDK principal — transacciones, RPC, Horizon |
| `@creit.tech/stellar-wallets-kit` | Integración con múltiples wallets |
| `@stellar/freighter-api` | Solo para Freighter |
| `@blend-capital/blend-sdk` | Integración con Blend Protocol |
| `@soroswap/router-sdk` | Routing de swaps con Soroswap |

### Rust (contratos)

| Crate | Uso |
|---|---|
| `soroban-sdk` | SDK base para contratos |
| `soroban-token-sdk` | Interacción con tokens SAC |
| `soroban-auth` | Helpers de autenticación |

### Python

```bash
pip install stellar-sdk
```

```python
from stellar_sdk import Server, Keypair, TransactionBuilder, Network, Asset

server = Server("https://horizon-testnet.stellar.org")
keypair = Keypair.from_secret("S...")
account = server.load_account(keypair.public_key)

tx = (
    TransactionBuilder(
        source_account=account,
        network_passphrase=Network.TESTNET_NETWORK_PASSPHRASE,
        base_fee=100,
    )
    .append_payment_op(
        destination="G...",
        asset=Asset.native(),
        amount="10",
    )
    .set_timeout(30)
    .build()
)
tx.sign(keypair)
response = server.submit_transaction(tx)
```

---

## Proyectos de referencia en GitHub

| Proyecto | Descripción | Link |
|---|---|---|
| soroban-examples | Ejemplos oficiales de contratos Soroban | stellar/soroban-examples |
| OpenZeppelin Stellar | Contratos auditados y seguros | OpenZeppelin/stellar-contracts |
| Soroban React Dapp | Template de dApp con React + Soroban | kaankacar/soroban-react-dapp |
| Stellar Demo Wallet | Wallet de referencia que implementa SEPs | stellar/demo-wallet |
| launchtube | Smart accounts con passkeys | stellar/launchtube |

---

## Canales de la comunidad

| Canal | Para qué |
|---|---|
| Discord de Stellar | Soporte técnico, anuncios, comunidad general |
| Stellar Stack Exchange | Preguntas técnicas con respuestas indexadas |
| GitHub Discussions | Propuestas y discusión de protocolo |
| SDF Blog | Anuncios oficiales y actualizaciones |

---

## Contexto del ecosistema para Perú y LATAM

### Proyectos relevantes activos

- **Lendara Protocol** — Inversiones tokenizadas para LATAM (inmobiliaria, comercio, agricultura)
- **Bitso** — Exchange con soporte para XLM/USDC en México, Argentina, Brasil
- **Buda.com** — Exchange en Chile, Colombia, Perú — soporta compra de XLM con PEN
- **Beans App** — Wallet con on/off ramp para LATAM

### Casos de uso con tracción en LATAM

1. **Remesas** — Envío de dinero desde EE.UU., España, Chile a Perú con USDC
2. **Pagos freelance** — Cobro en USDC sin cuenta bancaria USD
3. **Microfinanzas** — Préstamos colateralizados sin historial crediticio tradicional
4. **Tokenización de activos** — Fraccionamiento de bienes raíces o activos productivos
5. **Ahorro en dólares** — USDC como cobertura frente a depreciación del PEN
