# Recursos de referencia — Stellar y Soroban

Links curados de documentación oficial, tutoriales, herramientas y comunidad.

---

## Documentación oficial

| Recurso | URL | Para qué |
|---|---|---|
| Stellar Developers | https://developers.stellar.org | Punto de entrada principal |
| Soroban Docs | https://soroban.stellar.org | Smart contracts en Rust |
| Stellar SDK (JS) | https://stellar.github.io/js-stellar-sdk/ | Referencia API del SDK JS |
| Stellar SDK (Python) | https://stellar-sdk.readthedocs.io | Referencia API del SDK Python |
| Stellar Laboratory | https://laboratory.stellar.org | Herramienta interactiva |
| Freighter API | https://docs.freighter.app | Integración con wallet Freighter |
| Stellar Wallets Kit | https://stellarwalletskit.dev | Multi-wallet integration |

---

## Soroban — referencia técnica

| Recurso | URL |
|---|---|
| Getting Started con Soroban | https://developers.stellar.org/docs/build/smart-contracts/getting-started |
| soroban-sdk (docs.rs) | https://docs.rs/soroban-sdk |
| Ejemplos de contratos | https://github.com/stellar/soroban-examples |
| OpenZeppelin para Stellar | https://github.com/OpenZeppelin/stellar-contracts |
| Soroban CLI referencia | https://developers.stellar.org/docs/tools/developer-tools/cli |

---

## Protocolos DeFi

| Protocolo | Docs |
|---|---|
| Blend Protocol | https://docs.blend.capital |
| Soroswap | https://docs.soroswap.finance |
| Trustless Work | https://docs.trustlesswork.com |
| Lendara Protocol | https://lendaraprotocol.gitbook.io/lendara |

---

## Herramientas de desarrollo

| Herramienta | URL | Uso |
|---|---|---|
| Stellar Laboratory | https://laboratory.stellar.org | Test de transacciones |
| Stellar Expert | https://stellar.expert | Block explorer |
| Friendbot (testnet) | https://friendbot.stellar.org | Fondear cuentas de prueba |
| Stellar Quest | https://quest.stellar.org | Aprendizaje gamificado |
| Stellar Dashboard | https://dashboard.stellar.org | Estado de la red |

---

## Estándares SEP

| SEP | Descripción | Link |
|---|---|---|
| SEP-1 | stellar.toml | https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0001.md |
| SEP-10 | Auth web | https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0010.md |
| SEP-24 | Transferencias interactivas | https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0024.md |
| SEP-38 | Cotizaciones | https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0038.md |
| SEP-41 | Token interface Soroban | https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0041.md |

---

## Repositorios de referencia

```
stellar/stellar-sdk              → SDK oficial JavaScript
stellar/java-stellar-sdk         → SDK oficial Java
stellar/py-stellar-base          → SDK oficial Python
stellar/go                       → SDK oficial Go
stellar/soroban-examples         → Contratos de ejemplo
stellar/launchtube               → Smart accounts con passkeys
stellar/demo-wallet              → Wallet de referencia con SEPs
kaankacar/soroban-react-dapp    → Template React + Soroban
```

---

## Comunidad y soporte

| Canal | URL | Para qué |
|---|---|---|
| Discord Stellar | https://discord.gg/stellardev | Soporte técnico, comunidad |
| Stack Exchange | https://stellar.stackexchange.com | Preguntas con respuestas indexadas |
| GitHub Issues (SDK) | https://github.com/stellar/js-stellar-sdk/issues | Bugs del SDK |
| SDF Blog | https://stellar.org/blog | Anuncios oficiales |
| Reddit r/Stellar | https://reddit.com/r/Stellar | Comunidad general |

---

## Tutoriales y cursos

| Recurso | Formato | Nivel |
|---|---|---|
| Stellar Quest | Gamificado, desafíos on-chain | Básico → Avanzado |
| Soroban Getting Started | Tutorial oficial paso a paso | Básico |
| Stellar Developer Workshops | Videos en YouTube | Intermedio |
| SDF Examples | Código en GitHub | Intermedio → Avanzado |

---

## Contexto para Perú

| Recurso | URL / Descripción |
|---|---|
| Buda.com | Exchange con soporte PEN — compra XLM con transferencia bancaria |
| Binance P2P | Compra USDC/XLM con Yape o transferencia bancaria |
| Stellar Anchor List | https://www.stellar.org/ecosystem/anchors — anchors verificados por SDF |
| Guía Stellar Build PE | Este repositorio — contexto local para la buildathon |

---

## Instalación rápida

```bash
# Rust + target WASM
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
rustup target add wasm32-unknown-unknown

# Soroban CLI
cargo install --locked soroban-cli --features opt

# SDK JavaScript
npm install @stellar/stellar-sdk

# Stellar Wallets Kit
npm install @creit.tech/stellar-wallets-kit

# Configurar testnet
soroban network add testnet \
  --rpc-url https://soroban-testnet.stellar.org \
  --network-passphrase "Test SDF Network ; September 2015"

# Crear keypair y fondear
soroban keys generate --network testnet mi-wallet
soroban keys fund mi-wallet --network testnet
```

---

## Versiones actuales (mayo 2026)

| Componente | Versión | Notas |
|---|---|---|
| soroban-sdk | 21.x | Verificar en crates.io |
| stellar-sdk (JS) | 12.x | Verificar en npm |
| Soroban CLI | 21.x | Verificar con `soroban --version` |
| Protocol Stellar | 22 | Incluye Soroban V2 |

> **Nota:** El ecosistema Stellar evoluciona rápido. Siempre verificar las versiones actuales en los repositorios oficiales antes de empezar un proyecto.
