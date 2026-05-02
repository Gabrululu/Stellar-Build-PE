# Setup de AI Gratis

No necesitas una suscripción paga para construir con AI en la buildathon. Aquí van las mejores opciones gratuitas, ordenadas por facilidad de setup.

---

## APIs en la nube (sin tarjeta de crédito)

### Tier 1 — Las más útiles para la buildathon

| Servicio | Modelo destacado | Límite gratis | Ideal para |
|---|---|---|---|
| Google AI Studio | Gemini 2.5 Pro | Generoso free tier | Razonamiento largo, análisis de código |
| Groq | Llama 3.3 70B, DeepSeek R1 | Rate limit alto | Iteración rápida, respuestas muy veloces |
| Mistral | Mistral Large, Codestral | Free tier con API key | Generación de código, debugging |

> **Consejo:** Regístrate en los tres antes del evento. Si uno se cae o llega al límite, tienes backup inmediato.

### Tier 2 — Alternativas sólidas

| Servicio | Modelo destacado | Notas |
|---|---|---|
| Anthropic | Claude Sonnet 4 | Free tier limitado pero muy capaz |
| OpenRouter | Acceso a múltiples modelos | Algunos modelos gratis, otros con créditos |
| HuggingFace Inference | Modelos open source | Ideal para experimentar con modelos especializados |
| Cohere | Command R+ | Free tier con API key, bueno para RAG y búsqueda semántica |
| Together AI | Llama 3.1, Mistral | Créditos gratuitos al registrarse |

---

## Modelos locales (en tu propia laptop)

Si tienes una laptop con 16 GB de RAM o más, puedes correr modelos locales sin depender de internet. Muy útil cuando la WiFi del venue está saturada.

### Setup con Ollama

```bash
# Instalar Ollama (Linux/macOS)
curl -fsSL https://ollama.com/install.sh | sh

# Modelos recomendados para coding
ollama pull qwen2.5-coder:7b        # 4.7 GB — Excelente para código
ollama pull deepseek-coder-v2:lite  # Liviano y capaz
ollama pull llama3.1:8b             # General purpose

# Verificar que corre bien
ollama run qwen2.5-coder:7b "Hola, escribe un hello world en Rust"
```

### Modelos recomendados según tu RAM

| RAM disponible | Modelo sugerido | Tamaño | Capacidad |
|---|---|---|---|
| 8 GB | `qwen2.5-coder:3b` | ~2 GB | Autocompletado básico |
| 16 GB | `qwen2.5-coder:7b` | ~4.7 GB | Generación de código sólida |
| 32 GB | `deepseek-coder-v2:16b` | ~9 GB | Razonamiento técnico avanzado |
| 64 GB+ | `qwen2.5-coder:32b` | ~20 GB | Casi al nivel de modelos cloud |

### Cuándo usar modelos locales vs nube

- **Local:** Cuando la WiFi del venue está saturada (pasa seguido en hackathons), o cuando quieres respuestas instantáneas sin latencia de red
- **Nube:** Cuando necesitas razonamiento complejo, contexto largo (archivos grandes) o los últimos modelos
- **Combo ideal:** Modelo local para autocompletado + API en nube para consultas grandes

---

## Alquilar GPU (si tu laptop no da)

Para modelos más grandes (30B+), puedes alquilar una GPU por el fin de semana a bajo costo:

| Servicio | Costo aprox. | GPU disponible | Notas |
|---|---|---|---|
| RunPod | ~$10-20 USD/fin de semana | A40, A100 | Buena interfaz, fácil de usar |
| Vast.ai | ~$5-15 USD/fin de semana | Variado, subasta | Más barato, más configuración |
| Lambda | ~$15-25 USD/fin de semana | A100, H100 | Muy estable, buena documentación |
| Google Colab Pro | ~$10 USD/mes | T4, A100 | Alternativa si solo necesitas un notebook |

> **Tips para alquiler de GPU:**
> - Reserva antes de la buildathon — la demanda sube durante eventos grandes
> - Usa spot instances si puedes tolerar interrupciones ocasionales
> - Ten un script de setup listo (`setup.sh`) para no perder tiempo configurando el entorno
> - Considera Google Colab si solo necesitas correr un script puntual

---

## Integrar AI en tu proyecto Stellar

### Con Vercel AI SDK (Next.js)

```bash
npm install ai @ai-sdk/google @ai-sdk/groq
```

```typescript
import { generateText } from "ai";
import { google } from "@ai-sdk/google";

const { text } = await generateText({
  model: google("gemini-2.5-pro"),
  prompt: "Explica esta transacción Stellar: " + txData,
});
```

### Con la API de Groq directamente

```typescript
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const response = await groq.chat.completions.create({
  model: "llama-3.3-70b-versatile",
  messages: [{ role: "user", content: "Analiza este contrato Soroban..." }],
});
```

### Variables de entorno para múltiples proveedores

```bash
# .env.local
GOOGLE_GENERATIVE_AI_API_KEY=tu-key-aqui
GROQ_API_KEY=tu-key-aqui
MISTRAL_API_KEY=tu-key-aqui
ANTHROPIC_API_KEY=tu-key-aqui
```

> Nunca pongas las keys directamente en el código. Usa siempre `.env.local` y agrega ese archivo a `.gitignore`.

---

## Setup rápido recomendado para la buildathon

**Opción A — Minimalista (0 configuración):**
```
Google AI Studio + Groq → sin costo, listo en 5 minutos
```

**Opción B — Con laptop potente:**
```
Ollama + qwen2.5-coder:7b + Groq como backup → sin costo, funciona offline
```

**Opción C — Máxima potencia gratis:**
```
Claude Code free tier + Google AI Studio + Mistral API → sin costo, 3 modelos con distintas fortalezas
```

**Opción D — Para proyectos con AI integrada:**
```
Vercel AI SDK + Groq (velocidad) + Gemini (razonamiento) → sin costo, cambia de modelo con una línea
```

---

## Checklist pre-buildathon

- [ ] Crear cuenta en Google AI Studio y obtener API key
- [ ] Crear cuenta en Groq y obtener API key
- [ ] Crear cuenta en Mistral y obtener API key
- [ ] (Opcional) Instalar Ollama y descargar al menos un modelo
- [ ] Testear que cada API key funciona antes del evento
- [ ] Guardar las keys en un archivo `.env.local` (nunca en el código)
- [ ] Agregar `.env.local` al `.gitignore`
- [ ] Tener un modelo local como backup por si falla el internet
