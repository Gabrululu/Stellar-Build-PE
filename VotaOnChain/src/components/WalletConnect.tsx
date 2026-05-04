import { useState } from 'react';
import { StellarWalletsKit } from '../lib/kit';

interface WalletConnectProps {
  walletAddress: string | null;
  onConnect: (address: string) => void;
  onDisconnect: () => void;
}

export default function WalletConnect({
  walletAddress,
  onConnect,
  onDisconnect,
}: WalletConnectProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connect = async () => {
    setLoading(true);
    setError(null);
    try {
      const { address } = await StellarWalletsKit.authModal();
      onConnect(address);
    } catch {
      setError('No se pudo conectar. ¿Tienes Freighter instalado en Testnet?');
    } finally {
      setLoading(false);
    }
  };

  const short = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  if (walletAddress) {
    return (
      <div className="flex items-center justify-between p-4 bg-slate-800 rounded-xl mb-8">
        <div>
          <span className="text-green-400 text-sm">● Conectado</span>
          <p className="font-mono text-sm text-slate-300 mt-0.5">
            {short(walletAddress)}
          </p>
        </div>
        <button
          onClick={onDisconnect}
          className="text-sm text-slate-400 hover:text-red-400 transition-colors"
        >
          Desconectar
        </button>
      </div>
    );
  }

  return (
    <div className="mb-8 text-center">
      <button
        onClick={connect}
        disabled={loading}
        className="w-full py-3 px-6 bg-indigo-600 hover:bg-indigo-500
                   disabled:bg-slate-700 disabled:cursor-not-allowed
                   rounded-xl font-semibold transition-colors"
      >
        {loading ? 'Conectando...' : 'Conectar Wallet'}
      </button>
      {error && <p className="mt-2 text-red-400 text-sm">{error}</p>}
      <p className="mt-2 text-slate-500 text-xs">
        Necesitas Freighter configurado en Testnet para votar
      </p>
    </div>
  );
}
