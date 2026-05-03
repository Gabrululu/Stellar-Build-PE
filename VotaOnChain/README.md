# VotaOnChain 🗳️

Mini dApp de votación comunitaria on-chain. Los usuarios conectan su wallet Stellar, votan por una opción, el voto queda registrado en un contrato Soroban, y los resultados se muestran en tiempo real.

## Stack

| Capa | Tecnología |
|---|---|
| Frontend | React + TypeScript + Tailwind (Vite) |
| Wallet | Stellar Wallets Kit (Freighter) |
| Blockchain | Soroban Testnet |
| API | Horizon Testnet |
| Base de datos | Neon PostgreSQL (metadata, opcional) |

## Arquitectura

```
Usuario → Freighter (firma) → Soroban (registra voto on-chain)
                                    ↓
                         Horizon API (confirma tx)
                                    ↓
                         Neon (wallet + timestamp + opción)
                                    ↓
                         React (resultados en tiempo real)
```

## Setup

### 1. Instalar dependencias

```bash
npm install
```

### 2. Desplegar el contrato Soroban

```bash
cd contract

# Compilar (requiere rustup target add wasm32v1-none)
stellar contract build

# Deploy en testnet
stellar contract deploy \
  --wasm target/wasm32v1-none/release/vota_onchain.wasm \
  --network testnet \
  --source mi-wallet
# → Anota el Contract ID que imprime este comando
```

### 3. Inicializar el contrato

```bash
stellar contract invoke \
  --id TU_CONTRACT_ID \
  --source mi-wallet \
  --network testnet \
  -- init \
  --options '["Opcion_A","Opcion_B","Opcion_C"]'
```

### 4. Configurar `.env.local`

```bash
cp .env.example .env.local
```

```
VITE_CONTRACT_ID=TU_CONTRACT_ID
VITE_DATABASE_URL=postgresql://user:pass@ep-xxx.neon.tech/neondb?sslmode=require
```

> **Neon es opcional.** La dApp funciona sin él — los votos se leen directamente desde Soroban.

### 5. Correr el proyecto

```bash
npm run dev
```

## Schema de Neon (opcional)

Ejecutar en el SQL Editor de [neon.tech](https://neon.tech):

```sql
create table votes (
  id uuid default gen_random_uuid() primary key,
  wallet_address text not null,
  option_voted text not null,
  tx_hash text,
  created_at timestamp with time zone default now()
);

create index on votes(wallet_address);
create index on votes(option_voted);
```

## Tests del contrato

```bash
cd contract
cargo test
```

## Estructura del proyecto

```
VotaOnChain/
├── contract/
│   ├── .cargo/config.toml   # target = wasm32v1-none
│   ├── Cargo.toml
│   └── src/lib.rs           # contrato + 4 tests
└── src/
    ├── components/
    │   ├── WalletConnect.tsx
    │   ├── VoteForm.tsx
    │   └── Results.tsx
    ├── lib/
    │   ├── db.ts             # saveVote / getTotalVotes via Neon (opcional)
    │   ├── kit.ts            # StellarWalletsKit singleton
    │   └── stellar.ts        # getVotes / checkHasVoted / buildVoteTx / submitSignedTx
    └── App.tsx
```

## Adaptar a tu idea

Edita `src/lib/stellar.ts`:

```typescript
export const VOTE_OPTIONS = [
  { id: 'opcion_a', label: 'Tu primera opción' },
  { id: 'opcion_b', label: 'Tu segunda opción' },
  { id: 'opcion_c', label: 'Tu tercera opción' },
];
```

Y al inicializar el contrato, usa los mismos IDs:

```bash
-- init --options '["opcion_a","opcion_b","opcion_c"]'
```

Los IDs deben ser strings de máximo 10 caracteres (limitación del tipo `Symbol` en Soroban).

---

Para la guía completa paso a paso, ver [GUIA.md](./GUIA.md).
