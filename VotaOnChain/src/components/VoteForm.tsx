import { useState } from 'react';
import { WalletNetwork } from '@creit-tech/stellar-wallets-kit';
import { VOTE_OPTIONS, buildVoteTx, submitSignedTx } from '../lib/stellar';
import { saveVote } from '../lib/db';
import { kit } from '../lib/kit';

interface VoteFormProps {
  walletAddress: string;
  onVoteSuccess: () => void;
}

export default function VoteForm({ walletAddress, onVoteSuccess }: VoteFormProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [step, setStep] = useState<'idle' | 'building' | 'signing' | 'submitting'>('idle');

  const handleVote = async () => {
    if (!selected) return;
    setLoading(true);
    setError(null);
    setTxHash(null);

    try {
      setStep('building');
      const txXDR = await buildVoteTx(walletAddress, selected);

      setStep('signing');
      const { signedTxXdr } = await kit.signTransaction(txXDR, {
        networkPassphrase: WalletNetwork.TESTNET,
      });

      setStep('submitting');
      const hash = await submitSignedTx(signedTxXdr);
      setTxHash(hash);

      await saveVote(walletAddress, selected, hash);
      onVoteSuccess();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Error al votar. Intenta de nuevo.'
      );
    } finally {
      setLoading(false);
      setStep('idle');
    }
  };

  const stepLabel: Record<string, string> = {
    building: 'Preparando transacción...',
    signing: 'Esperando firma en Freighter...',
    submitting: 'Enviando a Stellar...',
  };

  return (
    <div className="mb-6 p-6 bg-slate-800/50 rounded-2xl border border-slate-700">
      <h2 className="text-xl font-semibold mb-1">
        ¿Qué proyecto priorizarías en tu comunidad?
      </h2>
      <p className="text-slate-400 text-sm mb-6">
        Tu voto quedará registrado en Stellar Testnet
      </p>

      <div className="space-y-3 mb-6">
        {VOTE_OPTIONS.map((option) => (
          <button
            key={option.id}
            onClick={() => !loading && setSelected(option.id)}
            className={`w-full p-4 rounded-xl text-left transition-all border ${
              selected === option.id
                ? 'bg-indigo-600 border-indigo-500 text-white'
                : 'bg-slate-700/50 border-slate-600 text-slate-300 hover:border-slate-400'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      <button
        onClick={handleVote}
        disabled={!selected || loading}
        className="w-full py-3 bg-indigo-600 hover:bg-indigo-500
                   disabled:bg-slate-700 disabled:cursor-not-allowed
                   rounded-xl font-semibold transition-colors"
      >
        {loading && step !== 'idle' ? stepLabel[step] : 'Votar'}
      </button>

      {error && (
        <p className="mt-3 text-red-400 text-sm text-center">{error}</p>
      )}

      {txHash && (
        <p className="mt-3 text-green-400 text-xs text-center font-mono break-all">
          TX: {txHash}
        </p>
      )}
    </div>
  );
}
