import { VOTE_OPTIONS } from '../lib/stellar';

interface ResultsProps {
  votes: Record<string, number>;
  totalVoters: number;
}

export default function Results({ votes, totalVoters }: ResultsProps) {
  const maxVotes = Math.max(...Object.values(votes), 1);

  return (
    <div className="p-6 bg-slate-800/50 rounded-2xl border border-slate-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Resultados en tiempo real</h2>
        <span className="text-slate-400 text-sm">
          {totalVoters} {totalVoters === 1 ? 'voto' : 'votos'}
        </span>
      </div>

      <div className="space-y-5">
        {VOTE_OPTIONS.map((option) => {
          const count = votes[option.id] ?? 0;
          const percentage =
            totalVoters > 0 ? Math.round((count / totalVoters) * 100) : 0;
          const barWidth =
            totalVoters > 0 ? (count / maxVotes) * 100 : 0;

          return (
            <div key={option.id}>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-slate-300">{option.label}</span>
                <span className="text-slate-400 tabular-nums">
                  {count} ({percentage}%)
                </span>
              </div>
              <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-500 rounded-full transition-all duration-700"
                  style={{ width: `${barWidth}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {totalVoters === 0 && (
        <p className="text-center text-slate-500 text-sm mt-5">
          Aún no hay votos. ¡Sé el primero!
        </p>
      )}

      <p className="mt-5 text-center text-slate-600 text-xs">
        Actualiza cada 10 segundos · Datos on-chain desde Stellar Testnet
      </p>
    </div>
  );
}
