# Herramientas de AI Recomendadas

Tools de AI específicamente útiles para desarrollar sobre Stellar, asistentes de código, y frameworks para agentes.

## Asistentes de código

### Claude Code
- **Qué es:** Herramienta oficial de Anthropic para programar con Claude — disponible como CLI, desktop app, web (claude.ai/code) e IDE extensions (VS Code, JetBrains)
- **Por qué usarlo:** Plan mode, agentes paralelos, contexto persistente con CLAUDE.md, modelos Claude 4.x
- **Setup:** `npm install -g @anthropic-ai/claude-code`
- **Costo:** Free tier disponible
- **Ideal para:** Desarrollo completo durante la hackathon (ver [Guia_Claude_Code.md](./Guia_Claude_Code.md))

### GitHub Copilot
- **Qué es:** Autocompletado de código integrado en VS Code
- **Por qué usarlo:** Sugerencias inline mientras escribís
- **Costo:** Gratis para estudiantes y open source
- **Ideal para:** Completar código boilerplate, escribir tests

### Cursor
- **Qué es:** Editor de código con AI integrada
- **Por qué usarlo:** Chat + edición directa en el editor
- **Costo:** Free tier limitado
- **Ideal para:** Si prefieres una interfaz visual sobre CLI

### Windsurf
- **Qué es:** Editor AI con "flows" para tareas complejas (adquirido por OpenAI en 2025)
- **Costo:** Free tier disponible
- **Ideal para:** Alternativa a Cursor — tener en cuenta la integración con el ecosistema OpenAI tras la adquisición

## Herramientas Stellar-specific con AI

### Stellar Turrets
- Funciones serverless para operaciones Stellar
- Útil para lógica de negocio que interactúa con la red

### Soroban Copilot (comunidad)
- Prompts y templates específicos para desarrollo Soroban
- Patrones comunes pre-configurados

## Frameworks multi-agente

Si tu proyecto involucra agentes de AI que interactúan con blockchain:

### LangChain / LangGraph
- **Qué es:** Framework para construir aplicaciones con LLMs
- **Útil para:** Agentes que necesitan tool calling, RAG, memoria
- **Con Stellar:** Podés crear tools que consulten Horizon API o ejecuten transacciones

### CrewAI
- **Qué es:** Framework para orquestar múltiples agentes
- **Útil para:** Proyectos donde querés que varios agentes colaboren
- **Ejemplo:** Un agente analiza el mercado, otro ejecuta trades en Soroswap

### Vercel AI SDK
- **Qué es:** SDK para integrar AI en aplicaciones Next.js
- **Útil para:** Chatbots e interfaces conversacionales
- **Con Stellar:** Chat que permite consultar balances o enviar transacciones vía lenguaje natural

## Combinaciones recomendadas para la hackathon

| Tipo de proyecto | Stack sugerido |
|---|---|
| **DeFi** | Claude Code + Stellar SDK + Vercel AI SDK (UI conversacional) |
| **Pagos** | Claude Code + Stellar SDK + GitHub Copilot (autocompletado) |
| **Agentes AI** | Claude Code + LangChain + Stellar SDK (ejecución on-chain) |
| **Sin costo / offline** | Ollama local + VS Code + Stellar CLI → 100% offline, 0 costo |

## Tips para usar AI efectivamente en hackathons

- **No dependas de un solo servicio:** Ten siempre un backup (ej: si Claude está caído, usa Gemini)
- **Cachea respuestas útiles:** Guardá snippets que funcionen en un archivo `snippets.md`
- **Usa AI para lo tedioso:** Boilerplate, tests, CSS — guarda tu creatividad para la lógica de negocio
- **No pelees con la AI:** Si después de 3 intentos no te da lo que quieres, hazlo manual y continua
- **Documenta con AI:** Al final, pídele que te escriba el README basado en el código actual
