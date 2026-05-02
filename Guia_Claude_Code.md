# Guía de Claude Code para la Hackathon

Claude Code es una CLI que te permite trabajar con Claude directamente desde tu terminal. Es especialmente útil en hackathons porque te deja iterar rápido sin salir de tu flujo de desarrollo.

## Instalación

```bash
# Requiere Node.js 18+
npm install -g @anthropic-ai/claude-code

# Verificar instalación
claude --version

# Iniciar en tu proyecto
cd mi-proyecto
claude
```

## Plan Mode — Planifica antes de codear

Antes de escribir código, usa Plan Mode para que Claude analice tu idea y te proponga una arquitectura.

```
> /plan Quiero construir una app que permita enviar remesas PEN→USDC
> usando Stellar, con una interfaz simple en Next.js
```

Esto te da:

- Estructura de archivos propuesta
- Dependencias necesarias
- Pasos de implementación ordenados
- Riesgos técnicos identificados

> **Pro tip:** Guardá el plan en un archivo `PLAN.md` y usalo como referencia durante toda la hackathon.

## CLAUDE.md — Tu contexto persistente

Creá un archivo `CLAUDE.md` en la raíz de tu proyecto con contexto importante:

```markdown
# CLAUDE.md

## Proyecto
App de remesas PERU usando Stellar/Soroban.
Buildathon x Stellar

## Stack
- Frontend: Next.js 15 + TypeScript
- Blockchain: Stellar SDK + Soroban
- Styling: Tailwind CSS

## Decisiones técnicas
- Usar Stellar testnet (no mainnet)
- USDC como stablecoin principal
- Freighter wallet para auth

## Convenciones
- Español para UI, inglés para código
- Componentes en PascalCase
- Funciones en camelCase
```

Claude lee este archivo automáticamente y mantiene el contexto entre sesiones.

## Agentes paralelos — Multiplicá tu velocidad

Claude Code puede lanzar agentes en paralelo para tareas independientes. Esto reduce el tiempo de build significativamente.

### Ejemplo: Setup inicial del proyecto

En vez de hacer todo secuencial, podés pedir:

```
> Necesito que en paralelo:
> 1. Configures el proyecto Next.js con TypeScript y Tailwind
> 2. Investigues cómo integrar Stellar SDK en el frontend
> 3. Busques ejemplos de contratos Soroban para pagos
```

### Cuándo usar agentes paralelos
- Investigación de múltiples temas independientes
- Setup de diferentes partes del proyecto
- Testing de distintos componentes
- Búsqueda en la documentación

### Cuándo NO usar agentes paralelos
- Cuando una tarea depende del resultado de otra
- Para editar el mismo archivo desde múltiples agentes
- Cuando necesitás razonamiento secuencial

## Workflows para la hackathon

### Día 1 — Setup y MVP
```
1. /plan [describe tu idea completa]
2. Revisa y ajusta el plan
3. "Implementa el paso 1 del plan"
4. Itera paso por paso
```

### Día 2 — Features y integración
```
1. "Revisa el estado actual del proyecto y dime qué falta"
2. "Implementa [feature específica]"
3. "Corre los tests y arregla lo que falle"
```

### Día 3 — Polish y demo
```
1. "Revisa el código buscando bugs obvios"
2. "Mejora la UI para la demo"
3. "Escribeme un script de demo de 3 minutos"
```

## Tips clave

- **Sé específico:** "Crea un componente que muestre el balance de USDC del usuario conectado con Freighter" > "Haz el frontend"
- **Itera en pequeño:** Pide cambios incrementales, no reescrituras completas
- **Usa el contexto:** Referenciá archivos específicos cuando pidas cambios
- **Confia pero verifica:** Siempre revisá el código generado, especialmente interacciones con blockchain
- **Commitea seguido:** Pedile a Claude que haga commits descriptivos después de cada feature funcional
