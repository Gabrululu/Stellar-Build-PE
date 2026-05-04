# Stellar Development Skill — Español Peruano

Skill de AI para desarrollo moderno en Stellar, con mejores prácticas actuales.

Traducción y adaptación al español de [stellar/stellar-dev-skill](https://github.com/stellar/stellar-dev-skill), con ejemplos y contexto relevante para Perú y LATAM.

> **Nota:** Este skill forma parte de [Stellar Build PE](https://github.com/Stellar-Build-PE) — guía comunitaria para el Buildathon Ethereum Lima × Stellar.

---

## Qué incluye

```
skill/
├── SKILL.md                 # Guía principal — conceptos core y arquitectura
├── contracts-soroban.md     # Contratos Soroban en Rust: tipos, storage, auth, deploy
├── frontend-stellar-sdk.md  # Frontend: React, Next.js, Stellar Wallets Kit
├── testing.md               # Tests unitarios Rust, testnet, Quickstart local
├── stellar-assets.md        # Activos Stellar clásicos y Stellar Asset Contract (SAC)
├── api-rpc-horizon.md       # API RPC (Soroban) y Horizon (clásico)
├── security.md              # Seguridad: checklists, patrones seguros, auditoría
├── common-pitfalls.md       # Errores frecuentes y sus soluciones
├── advanced-patterns.md     # Factory, vaults, multicall, escrow, circuit breaker
├── standards-reference.md   # SEPs y CAPs de referencia rápida
├── ecosystem.md             # DeFi, wallets, herramientas, contexto LATAM
├── zk-proofs.md             # ZK proofs: arquitectura, Circom, verificación Soroban
└── resources.md             # Links de documentación oficial y comunidad
```

El skill usa **divulgación progresiva**: `SKILL.md` cubre el 80% de los casos, y el AI lee los archivos especializados solo cuando la tarea lo requiere.

---

## Instalación

### Con Claude Code

```bash
# Opción 1: Clonar y copiar
git clone https://github.com/Stellar-Build-PE/Stellar-dev-skill
cp -r Stellar-dev-skill/skill ~/.claude/skills/stellar-dev/

# Opción 2: Desde este repo (si estás en el proyecto Stellar Build PE)
# Los archivos ya están en /Stellar-dev-skill/skill/
```

### Con npx skills

```bash
npx skills add https://github.com/Stellar-Build-PE/Stellar-dev-skill
```

---

## Ejemplos de prompts

```
"Escríbeme un contrato Soroban en Rust para un sistema de escrow básico"
"Cómo conecto Freighter en mi app React con Stellar Wallets Kit"
"Cómo despliego un contrato a Stellar Testnet paso a paso"
"Revisa este contrato para encontrar problemas de seguridad"
"Cómo hago un test unitario para verificar que require_auth funciona"
"Qué SEP necesito implementar para hacer un on-ramp con anchor"
"Cómo emito un activo personalizado en Stellar para un demo de Yape"
"Explícame la diferencia entre storage instance, persistent y temporary"
```

---

## Contexto

Este skill incluye ejemplos y casos de uso relevantes para Perú:

- **Rails de pago:** CCI (transferencias bancarias), Yape, Plin
- **USDC en Stellar:** El puente más práctico entre crypto y fiat para demos
- **Remesas:** Envío de dinero desde EE.UU., España y Chile hacia Perú
- **Anchors:** Contexto de proveedores en LATAM
- **Microfinanzas:** Préstamos sin banco con Blend Protocol

---

## Compatibilidad

| Agente | Directorio de skills |
|---|---|
| Claude Code | `~/.claude/skills/` |
| OpenCode | `~/.config/opencode/skill/` |
| OpenAI Codex | `~/.codex/skills/` |

---

## Contribuir

Si encuentras información desactualizada o quieres agregar ejemplos:

1. Fork del repositorio
2. Crea una rama con tu cambio
3. Abre un PR con descripción clara
4. Verifica que el código de ejemplo funcione en testnet

### Guías para contribuciones

- Mantener información actualizada (Soroban evoluciona rápido)
- Preferir ejemplos completos y ejecutables
- Incluir notas sobre versiones cuando aplique
- Citar documentación oficial cuando sea posible

---

## Créditos

- Basado en [stellar/stellar-dev-skill](https://github.com/stellar/stellar-dev-skill) (Apache-2.0)
- Inspirado en [solana-foundation/solana-dev-skill](https://github.com/solana-foundation/solana-dev-skill)
- Adaptado para la comunidad que construye en Stellar por[Minted In Peru](https://mintedinpe.com)

---

## Licencia

Apache-2.0 — ver `LICENSE` para detalles.

---

> Parte de **Stellar Build PE** — guía comunitaria para el Buildathon Ethereum Lima × Stellar.
> Hecha con amor para la comunidad peruana Web3.
