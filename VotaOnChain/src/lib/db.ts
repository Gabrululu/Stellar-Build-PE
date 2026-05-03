import { neon } from '@neondatabase/serverless';

const DATABASE_URL = import.meta.env.VITE_DATABASE_URL ?? '';

// Si no hay URL configurada, el cliente es null y todas las funciones son no-op
function getDb() {
  if (!DATABASE_URL) return null;
  return neon(DATABASE_URL);
}

export async function saveVote(
  walletAddress: string,
  optionVoted: string,
  txHash: string
): Promise<void> {
  const sql = getDb();
  if (!sql) return;

  await sql`
    INSERT INTO votes (wallet_address, option_voted, tx_hash)
    VALUES (${walletAddress}, ${optionVoted}, ${txHash})
  `;
}

export async function getTotalVotes(): Promise<number> {
  const sql = getDb();
  if (!sql) return 0;

  const result = await sql`SELECT COUNT(*) AS count FROM votes`;
  return Number(result[0]?.count ?? 0);
}

/*
  Schema de Neon (ejecutar una vez en el SQL Editor de neon.tech):

  create table votes (
    id uuid default gen_random_uuid() primary key,
    wallet_address text not null,
    option_voted text not null,
    tx_hash text,
    created_at timestamp with time zone default now()
  );

  create index on votes(wallet_address);
  create index on votes(option_voted);
*/
