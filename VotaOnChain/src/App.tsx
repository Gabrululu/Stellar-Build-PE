import { useState, useEffect } from 'react';
import WalletConnect from './components/WalletConnect';
import VoteForm from './components/VoteForm';
import Results from './components/Results';
import { getVotes, checkHasVoted, CONTRACT_ID } from './lib/stellar';

export default function App() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [votes, setVotes] = useState<Record<string, number>>({});
  const [totalVoters, setTotalVoters] = useState(0);
  const [loading, setLoading] = useState(true);

  const loadVotes = async () => {
    try {
      const data = await getVotes();
      setVotes(data);
      setTotalVoters(Object.values(data).reduce((a, b) => a + b, 0));
    } catch (err) {
      console.error('Error cargando votos:', err);
    } finally {
      setLoading(false);
    }
  };

  // Cargar votos al montar y cada 10 segundos
  useEffect(() => {
    loadVotes();
    const interval = setInterval(loadVotes, 10_000);
    return () => clearInterval(interval);
  }, []);

  // Verificar si la wallet ya votó cada vez que cambia
  useEffect(() => {
    if (walletAddress) {
      checkHasVoted(walletAddress).then(setHasVoted);
    } else {
      setHasVoted(false);
    }
  }, [walletAddress]);

  const handleVoteSuccess = () => {
    setHasVoted(true);
    loadVotes();
  };

  const handleDisconnect = () => {
    setWalletAddress(null);
    setHasVoted(false);
  };

  if (!CONTRACT_ID) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <div className="text-center p-8 bg-red-900/30 border border-red-700 rounded-2xl max-w-md">
          <p className="text-red-400 font-semibold mb-2">Contract ID no configurado</p>
          <p className="text-slate-400 text-sm">
            Copia <code className="text-slate-300">.env.example</code> a{' '}
            <code className="text-slate-300">.env.local</code> y agrega tu{' '}
            <code className="text-slate-300">VITE_CONTRACT_ID</code>.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 to-slate-900 text-white">
      <div className="max-w-xl mx-auto px-4 py-12">
        <header className="text-center mb-10">
          <h1 className="text-4xl font-bold tracking-tight mb-2">
            VotaOnChain 🗳️
          </h1>
          <p className="text-slate-400">
            Votación comunitaria registrada en Stellar Testnet
          </p>
        </header>

        <WalletConnect
          walletAddress={walletAddress}
          onConnect={setWalletAddress}
          onDisconnect={handleDisconnect}
        />

        {loading ? (
          <div className="text-center py-12 text-slate-400">
            Cargando votos desde Soroban...
          </div>
        ) : (
          <>
            {walletAddress && !hasVoted && (
              <VoteForm
                walletAddress={walletAddress}
                onVoteSuccess={handleVoteSuccess}
              />
            )}

            {walletAddress && hasVoted && (
              <div className="mb-6 p-4 bg-green-900/30 border border-green-700 rounded-xl text-center">
                <p className="text-green-400 font-medium">
                  ✅ Tu voto fue registrado on-chain
                </p>
              </div>
            )}

            {!walletAddress && (
              <p className="text-center text-slate-500 text-sm mb-6">
                Conecta tu wallet para votar
              </p>
            )}

            <Results votes={votes} totalVoters={totalVoters} />
          </>
        )}

        <footer className="mt-10 text-center text-slate-600 text-xs">
          Buildathon Ethereum Lima × Stellar · Soroban Testnet
        </footer>
      </div>
    </div>
  );
}
