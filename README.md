
# Stellar Build PE — Guía para Builders

Guía práctica para desarrolladores que participan en el **Buildathon Ethereum Lima × Stellar** (2 de mayo, 2026), organizado por Ethereum Lima con colaboración de BAF y el programa StarMaker.

El objetivo es que cada participante — sin importar su experiencia con Stellar, acceso a herramientas de AI pagas, o hardware — pueda construir algo funcional y enviarlo antes del 7 de mayo.

---

## Orden de lectura recomendado

| # | Archivo | Qué vas a encontrar |
|---|---|---|
| 0 | [Reglas_Buildathon.md](./Reglas_Buildathon.md) | Lee esto primero — Fechas, entregables, premios y criterios de evaluación |
| 1 | [SetUp_AI.md](./SetUp_AI.md) | Opciones de AI sin tarjeta de crédito ni suscripción |
| 2 | [Guia_Claude_Code.md](./Guia_Claude_Code.md) | Workflows con Claude Code: plan mode, agentes paralelos, CLAUDE.md |
| 3 | [SetUp_Dev.md](./SetUp_Dev.md) | Testnet, configuración de Soroban, Freighter, errores comunes |
| 4 | [Prompts_Iniciales.md](./Prompts_Iniciales.md) | Prompts listos para copiar y pegar en tu sesión de Claude Code |
| 5 | [Recursos_Buildathon.md](./Recursos_Buildathon.md) | Repos de referencia, documentación oficial, videos y herramientas |
| 6 | [Herramientas_AI.md](./Herramientas_AI.md) | Tools de AI para Stellar, asistentes de código, frameworks multi-agente |
| 7 | [Lendara_Protocol.md](./Lendara_Protocol.md) | Protocolo de inversiones tokenizadas — SDK listo para usar con 5 templates |

---

## Proyectos de ejemplo incluidos

### VotaOnChain

Mini dApp de votación comunitaria on-chain — ejemplo de referencia para builders.

**Stack:** React + TypeScript + Tailwind · Soroban (contrato en Rust) · Stellar Wallets Kit · Neon PostgreSQL (opcional)

```
VotaOnChain/
├── contract/          # Contrato Soroban en Rust — votación on-chain con 4 tests
└── src/
    ├── components/    # WalletConnect · VoteForm · Results
    └── lib/           # stellar.ts (RPC) · kit.ts (wallets) · db.ts (Neon)
```

Flujo: el usuario conecta Freighter → vota → el voto se registra en Soroban → los resultados se leen en tiempo real desde la cadena.

Ver [VotaOnChain/README.md](./VotaOnChain/README.md) para setup completo y [VotaOnChain/GUIA.md](./VotaOnChain/GUIA.md) para el paso a paso detallado.

---

## Skill de AI — Stellar Development (Español)

Skill para asistentes de AI con conocimiento profundo del ecosistema Stellar, escrito en español peruano.

```
stellar-dev-skill/
└── skill/
    ├── SKILL.md                # Guía principal — arquitectura, conceptos core, contexto Perú
    ├── contracts-soroban.md    # Contratos Rust: storage, auth, deploy, upgrade, TTL
    ├── frontend-stellar-sdk.md # React/Next.js, Stellar Wallets Kit, bindings TypeScript
    ├── testing.md              # Tests unitarios, testnet, Docker Quickstart
    ├── stellar-assets.md       # Activos clásicos, SAC, emisión, trustlines
    ├── api-rpc-horizon.md      # RPC vs Horizon, streaming, fees, errores
    ├── security.md             # Checklists, require_auth, auditoría
    ├── common-pitfalls.md      # Errores frecuentes y soluciones
    ├── advanced-patterns.md    # Factory, vaults, multicall, escrow, circuit breaker
    ├── standards-reference.md  # SEP-1/10/24/38/41 con código
    ├── ecosystem.md            # Blend, Soroswap, wallets, herramientas, LATAM
    ├── zk-proofs.md            # ZK proofs en Soroban
    └── resources.md            # Links y documentación oficial
```

Basado en [stellar/stellar-dev-skill](https://github.com/stellar/stellar-dev-skill), adaptado con contexto peruano.

**Instalación en Claude Code:**
```bash
cp -r stellar-dev-skill/skill ~/.claude/skills/stellar-dev/
```

Ver [stellar-dev-skill/README.md](./stellar-dev-skill/README.md) para más opciones de instalación.

---

## Contexto del evento

El **Buildathon Ethereum Lima × Stellar** es un evento intensivo de un día enfocado en la creación de soluciones tecnológicas sobre la blockchain de Stellar, dirigido a desarrolladores, diseñadores, builders y entusiastas Web3 de todos los niveles.

- **Evento presencial:** 2 de mayo, 4:00 p.m. – 8:00 p.m.
- **Plazo de entrega:** 7 de mayo, 11:59 PM (5 días post-evento para desarrollar)
- **Formato:** Individual o equipos de hasta 3 personas
- **Requisito:** Asistir presencialmente el 2 de mayo para ser participante válido
- **Premios:** $300 USD en total ($150 / $100 / $50)
- **Presentacion del evento:** [Ver en Canva](https://canva.link/yegtdzcdycbnsmd)
- **Chat de comunicacion y soporte:** [Grupo de WhatsApp](https://chat.whatsapp.com/JB5clEPH9uK2iwzeHkMPOJ)

---

## Rails de pago en Perú

A diferencia de otras guías enfocadas en SPEI (México) o PIX (Brasil), esta se enfoca en las opciones disponibles para Perú:

- **Transferencias bancarias (CCI):** El estándar local para on/off ramps — Código de Cuenta Interbancario usado por BCP, Interbank, BBVA, Scotiabank
- **Yape / Plin:** Billeteras móviles con adopción masiva en Perú, ideales para simular flujos de on-ramp en demos
- **USDC en Stellar:** El puente más directo entre crypto y fiat vía exchanges como Bitso, Buda.com y Binance P2P
- **Anchors Stellar:** Servicios que conectan la red Stellar con el sistema financiero peruano
- **Remesas entrantes:** Caso de uso muy relevante para Perú — muchas familias reciben envíos desde EE.UU., España y Chile

---

## Filosofía de esta guía

- **Práctica y opinada** — Te decimos qué funciona, qué rompe, y en qué orden hacer las cosas.
- **Accesible** — Todo lo que recomendamos tiene una opción gratuita.
- **Contextualizada** — Los ejemplos y casos de uso son relevantes para Perú y LATAM.
- **Bilingüe cuando importa** — Documentación en español, código y comandos en inglés (como corresponde).

---

## Armada por la comunidad

**Ethereum Lima · StarMaker by BAF · Stellar**

---

## Contribuir

Si encuentras un error o quieres agregar algo, abre un issue o un PR. Esta guía es de la comunidad.

---

## Licencia

MIT

---

> Inspirada en [stellar-guide-vendimia-tech](https://github.com/BuenDia-Builders/stellar-guide-vendimia-tech) (Argentina), que a su vez se inspiró en [stellar-ai-guide-mx](https://github.com/kaankacar/stellar-ai-guide-mx) (México). Adaptada para el contexto peruano.
