# Lendara Protocol — Guía para la Hackathon

Lendara es un protocolo de inversión reutilizable sobre Stellar/Soroban que usa Trustless Work como infraestructura de escrow. Permite crear pools de inversión tokenizados donde los inversores aportan capital, un operador lo usa, un verificador aprueba, y la ganancia vuelve a los inversores.

## Links rápidos

| Recurso | Link |
|---|---|
| npm | `npm install @lendara/sdk` |
| Documentación | https://lendaraprotocol.gitbook.io/lendara |

---

## Qué problema resuelve

Construir un producto de inversión tokenizado requiere resolver muchas cosas:

- **¿Dónde se guarda el dinero de forma segura?** → Escrow automático (Trustless Work)
- **¿Quién administra y quién verifica?** → Roles separados y predefinidos
- **¿Cómo se calcula la parte de cada inversor?** → Cálculo automático, proporcional
- **¿Qué pasa si hay una disputa?** → Árbitro predefinido en las reglas

Lendara empaqueta todo esto en un SDK que se instala con un comando.

---

## Cómo funciona

Toda inversión sigue el mismo patrón:

1. **Inversores aportan capital** (compran tokens de participación)
2. **Un operador lo usa** (compra propiedad, exporta, presta)
3. **Un verificador confirma** que se ejecutó correctamente
4. **La ganancia vuelve a los inversores** (claim desde vault)

Lo que cambia entre sectores son los detalles: cuántas etapas, qué porcentajes, qué roles. Lendara maneja eso con templates.

---

## 5 Templates disponibles

| Template | Caso de uso | Etapas | ROI sugerido | Inversión mínima | Max inversores |
|---|---|---|---|---|---|
| `real-estate-rental` | Renta inmobiliaria | 7 | 8-12% | 100 USDC | 100 |
| `trade-finance` | Importación/exportación | 2 | 5-8% | 500 USDC | 20 |
| `agricultural-lending` | Financiamiento agrícola | 3 | 10-15% | 50 USDC | 200 |
| `microfinance` | Micropréstamos | 4 | 12-18% | 10 USDC | 500 |
| `event-finance` | Producción de eventos | 3 | 15-25% | 25 USDC | 300 |

---

## Instalación

```bash
npm install @lendara/sdk
```

Eso es todo. Funciona offline — no necesitas API key ni conexión a blockchain para explorar templates y prototipar.

---

## Quickstart (3 minutos)

### 1. Explorar templates

```typescript
import { TemplateEngine, formatUsdc } from "@lendara/sdk";

const engine = new TemplateEngine();
const templates = engine.getTemplates();

for (const t of templates) {
  console.log(`${t.name} (${t.id})`);
  console.log(`  ROI: ${t.tokenization.suggestedRoiMin}-${t.tokenization.suggestedRoiMax}%`);
  console.log(`  Min: ${formatUsdc(t.timing.minInvestment)} USDC`);
  console.log(`  Milestones: ${t.milestones.length}`);
}
```

### 2. Generar configuración de escrow

```typescript
import { TemplateEngine, parseUsdc } from "@lendara/sdk";
import type { RoleAddresses } from "@lendara/sdk";

const engine = new TemplateEngine();

const addresses: RoleAddresses = {
  operator: "GOPERATOR...",
  verificationAgent: "GVERIFIER...",
  poolManager: "GMANAGER...",
  arbitrator: "GARBITRATOR...",
  platform: "GPLATFORM...",
};

const { roles, warnings } = engine.generateRoleMapping("microfinance", addresses);

const config = engine.generateEscrowConfig(
  "microfinance",
  parseUsdc("10000"),   // monto total
  parseUsdc("11500"),   // retorno esperado (15% ROI)
  roles,
  addresses.operator,
  "GVAULT..."
);

console.log(`Milestones: ${config.milestones.length}`);
config.milestones.forEach((m, i) => {
  console.log(`  [${i}] ${m.description}`);
});
```

### 3. Deploy en testnet (necesita API key de Trustless Work)

```typescript
import { LendaraClient, parseUsdc } from "@lendara/sdk";

const client = new LendaraClient({
  network: "testnet",
  trustlessWorkApiKey: process.env.TW_API_KEY,
});

const project = await client.createProject({
  templateId: "microfinance",
  name: "Micropréstamos Lima",
  description: "Pool de micropréstamos para emprendedores locales",
  totalAmount: parseUsdc("10000"),
  roiPercentage: 15,
  addresses,
});

const escrow = await client.createEscrow(
  project,
  parseUsdc("10000"),
  parseUsdc("11500"),
  addresses,
  addresses.operator,
  "GVAULT..."
);

console.log(`Escrow deployed: ${escrow.escrowContractId}`);
```

---

## Arquitectura

```
Developer App
     |
     v
Lendara SDK (TypeScript)
     |
     +---> Trustless Work API -----> TW Escrow Contract (USDC)
     |
     +---> Lendara Contracts
           |        |        |
         Token    Token    Vault
         Factory  Sale   (distribuye ROI)
           |        |        ^
           |        |        |
           mint    buy    Operador deposita retornos

Activity Reporter (reportes on-chain, no controla fondos)
```

---

## Smart Contracts

| Contrato | Qué hace | Métodos clave |
|---|---|---|
| Token Factory | Emite tokens de participación | `mint()`, `transfer()`, `burn()` |
| Token Sale | Inversores compran tokens con USDC | `buy()`, `open_round()`, `refund()` |
| Vault | Distribuye ROI a holders de tokens | `deposit()`, `claim()`, `preview_claim()` |
| Activity Reporter | Registra evidencia on-chain | `submit_report()`, `verify_report()` |

---

## Mapeo de roles

| Rol Lendara | Rol Trustless Work | Quién es |
|---|---|---|
| Activity Operator | Service Provider | El que ejecuta (compra depto, exporta, presta) |
| Verification Agent | Approver | El que verifica (auditor, plataforma) |
| Pool Manager | Release Signer | El que libera fondos (plataforma o DAO) |
| Platform Arbitrator | Dispute Resolver | El que resuelve disputas |
| Lendara Platform | Platform Address | Cobro de fees del protocolo |

---

## Qué funciona offline vs qué necesita API

### Offline (sin API key, sin blockchain)

- Explorar los 5 templates
- Generar configuraciones de escrow
- Mapear roles
- Utilidades (`formatUsdc`, `parseUsdc`, `computeEvidenceHash`)
- Validar conflictos de roles

### Necesita API key de Trustless Work

- `createEscrow()` — Desplegar escrows en Stellar testnet
- `updateMilestoneStatus()` — Actualizar milestones
- `approveMilestone()` — Aprobar milestones
- `releaseMilestoneFunds()` — Liberar fondos
- `previewClaim()` — Preview de claims

> Puedes prototipar y presentar toda la lógica de negocio sin API key. Solo necesitas la key cuando quieras hacer transacciones reales en testnet.

---

## Ideas para la hackathon (contexto peruano)

| Idea | Template | Descripción |
|---|---|---|
| Crowdfunding inmobiliario | `real-estate-rental` | Tokenizar inversiones en propiedades de Lima, Cusco o Arequipa |
| Financiamiento de cosechas | `agricultural-lending` | Que productores de café, cacao o quinua de regiones como Junín, Puno o San Martín consigan financiamiento |
| Micro-inversiones en eventos | `event-finance` | Financiar festivales, conciertos o eventos culturales peruanos |
| Micropréstamos comunitarios | `microfinance` | Pool de préstamos con verificación de comunidad o cooperativa local |
| Trade finance para exportadores | `trade-finance` | Financiar exportaciones peruanas: café, espárragos, textiles, minería |

---

## Prompts listos para usar con Claude Code

### Explorar templates y elegir el mejor

```
Estoy en la Buildathon de Stellar PE y quiero usar Lendara Protocol.
Mi idea de proyecto es: [describe tu idea].

Tengo instalado @lendara/sdk. Ayúdame a:
1. Determinar qué template se adapta mejor a mi idea
2. Correr el quickstart de exploración de templates
3. Entender qué milestones tiene ese template
4. Generar una configuración de escrow de ejemplo con datos mock
```

### Construir el frontend sobre Lendara

```
Quiero construir un frontend en Next.js + TypeScript + Tailwind que use
@lendara/sdk con el template [nombre del template].

El flujo que quiero mostrar en la demo es:
1. Página de detalle del pool con información del proyecto
2. Formulario para invertir (conectar Freighter, ingresar monto)
3. Panel del operador para avanzar milestones
4. Panel del inversor para ver su claim disponible

Empieza con la arquitectura de componentes y el modelo de datos.
Usa Stellar testnet. No necesito el deploy real del escrow todavía,
puedo mockear esa parte para la demo.
```

### Debugging de integración con Trustless Work

```
Estoy usando @lendara/sdk y al llamar createEscrow() recibo este error:
[pega el error exacto]

Mi código está en [archivo]. Mi TW_API_KEY está en .env.local.
Revisa si el problema es en la configuración del cliente, en los
parámetros del escrow, o en el mapeo de roles. Muéstrame el fix.
```

### Demo completa con datos reales de testnet

```
Quiero armar una demo completa de Lendara en testnet para la hackathon.
El template que uso es [template]. Necesito:

1. Crear 3-4 wallets de testnet con roles distintos (operator, verifier,
   investor) usando friendbot para fondearlas
2. Desplegar un escrow real en testnet con createEscrow()
3. Simular el flujo completo: inversión → milestone → verificación → claim
4. Mostrar cada paso en el frontend

Guíame paso a paso. Tengo TW_API_KEY disponible.
```

---

## Correr los ejemplos

```bash
npm install @lendara/sdk

# Explorar templates (no necesita API key)
npx tsx quickstart/explore-templates.ts

# Lifecycle completo (necesita TW_API_KEY)
TW_API_KEY=your-key npx tsx microfinance/lifecycle.ts
```
