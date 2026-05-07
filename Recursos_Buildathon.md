# Recursos para la Buildathon

Repos de referencia, documentación, videos y herramientas útiles para Stellar Build PE.

---

## Documentación oficial

| Recurso | Link | Para qué |
|---|---|---|
| Stellar Docs | https://developers.stellar.org | Documentación completa de Stellar |
| Soroban Docs | https://soroban.stellar.org | Smart contracts en Stellar |
| Stellar SDK (JS) | https://stellar.github.io/js-stellar-sdk/ | SDK para frontend/backend |
| Stellar Laboratory | https://laboratory.stellar.org | Herramienta interactiva para testear operaciones |
| Freighter API | https://docs.freighter.app | Integración con wallet Freighter |

---

## Proyectos en Stellar — Para inspirarte

| Recurso | Link | Para qué |
|---|---|---|
| **Stellar Ecosystem** | https://stellar.org/ecosystem | Directorio de proyectos y apps construidas sobre Stellar |
| **Community Fund Projects** | https://communityfund.stellar.org/projects | Proyectos financiados por la comunidad Stellar — casos de uso reales |

---

## Protocolos DeFi en Stellar

### Blend Protocol — Lending/Borrowing
- **Qué es:** Protocolo de préstamos descentralizado en Stellar
- **Docs:** https://docs.blend.capital
- **Útil para:** Proyectos de DeFi, yield, credit scoring

### Soroswap — DEX Aggregator
- **Qué es:** Agregador de exchanges descentralizados en Soroban
- **Docs:** https://docs.soroswap.finance
- **Útil para:** Swaps, liquidez, price feeds

### Phoenix DEX
- **Qué es:** Exchange descentralizado nativo de Soroban
- **Útil para:** Trading, market making

### DeFindex — Yield Vaults
- **Qué es:** Gestión de vaults y estrategias DeFi
- **Útil para:** Automatización de yield, gestión de portfolios

### Reflector Oracle
- **Qué es:** Oráculo de precios para Soroban
- **Útil para:** Cualquier proyecto que necesite datos de precios on-chain

### Trustless Work — Escrow as a Service
- **Qué es:** Escrow descentralizado sobre Stellar
- **Útil para:** Marketplaces, freelancing, pagos condicionales

### Lendara Protocol — Inversiones Tokenizadas
- **Qué es:** Protocolo de inversión reutilizable sobre Stellar/Soroban que usa Trustless Work como capa de escrow. Permite crear pools de inversión tokenizados para distintos sectores (inmobiliaria, comercio, agricultura, microfinanzas, eventos).
- **SDK:** `npm install @lendara/sdk`
- **Docs:** https://lendaraprotocol.gitbook.io/lendara
- **Guía completa:** [Lendara_Protocol.md](./Lendara_Protocol.md)
- **Útil para:** Tokenización de activos reales, crowdfunding, pools de inversión, DeFi con activos del mundo real

---

## Anchors y On/Off Ramps

| Servicio | Región | Moneda | Notas |
|---|---|---|---|
| MoneyGram Access | Global | Múltiples | Cash in/out vía MoneyGram |
| Beans App | LatAm | Múltiples | Wallet con soporte Stellar |

> **Nota para Perú:** El ecosistema de anchors directos PEN↔Stellar está en desarrollo. Para la buildathon, usa testnet y simula el flujo de on/off ramp. Plataformas como Bitso, Buda.com o Binance P2P permiten comprar XLM/USDC pero no son anchors SEP-24 formales. Yape y Plin pueden usarse como punto de entrada simulado para demos de on-ramp.

---

## Repos de ejemplo y starters

### Contratos Soroban
- **soroban-examples** — Ejemplos oficiales de contratos Soroban
- **OpenZeppelin Stellar** — Librería de contratos seguros para Soroban · [Docs](https://docs.openzeppelin.com/stellar-contracts) · [GitHub](https://github.com/OpenZeppelin/stellar-contracts) · [Wizard](https://wizard.openzeppelin.com/stellar)

### Frontend
- **Starter con Next.js + Stellar SDK** — Template básico de app web con Stellar
- **Soroban React Dapp** — Ejemplo de dApp React con integración Soroban

### Full Stack
- **Stellar Demo Wallet** — Wallet de referencia que implementa SEPs

---

## Herramientas para grabar demos y pitch

| Herramienta | Link | Para qué |
|---|---|---|
| **OpenVid** | https://openvid.dev | Grabar demos de producto — pantalla + cámara, sin instalar nada |

---

## Videos y tutoriales

- **Stellar Developer Workshops** — Talleres oficiales en YouTube
- **Soroban Quick Start** — Tutorial paso a paso para tu primer contrato
- **Building DeFi on Stellar** — Serie sobre protocolos DeFi

---

## Herramientas de desarrollo

| Herramienta | Uso |
|---|---|
| Stellar Laboratory | Crear y enviar transacciones manualmente |
| Stellar Expert | Block explorer para testnet y mainnet |
| Friendbot | Fondear cuentas en testnet |
| Soroban CLI | Compilar, deployar y llamar contratos |

---

## Checklist de recursos

- [ ] Leí la documentación de Soroban (al menos el quickstart)
- [ ] Probé Stellar Laboratory para entender las operaciones
- [ ] Me uní al Discord de Stellar para soporte durante la buildathon
- [ ] Identifiqué qué protocolos DeFi son relevantes para mi proyecto
- [ ] Tengo los repos de ejemplo clonados por si necesito referencia offline
