import React from 'react';
import { useTrainerStore } from './store/useTrainerStore';
import { PokerTableUI } from './features/trainer/components/PokerTableUI';
import { ActionPanel } from './features/trainer/components/ActionPanel';
import { TrainerConfigModal } from './features/trainer/components/TrainerConfigModal';
import { GtoFeedbackModal } from './features/trainer/components/GtoFeedbackModal';

export default function App() {
  const isSessionActive = useTrainerStore((state) => state.isSessionActive);
  const gameState = useTrainerStore((state) => state.gameState);
  const score = useTrainerStore((state) => state.score);
  const currentHandIndex = useTrainerStore((state) => state.currentHandIndex);
  const resetSession = useTrainerStore((state) => state.resetSession);

  if (!isSessionActive || !gameState) {
    return <TrainerConfigModal />;
  }

  return (
    <div className="min-h-screen bg-[#0a050c] text-white flex flex-col justify-between overflow-hidden select-none">
      {/* Header com Status da Sessão e Pontuação */}
      <header className="bg-black/60 border-b border-white/10 px-6 py-3 flex justify-between items-center text-xs backdrop-blur-md">
        <div className="flex items-center space-x-3">
          <span className="text-amber-400 font-black uppercase tracking-wider text-sm">
            {gameState.spot.label}
          </span>
          <span className="bg-white/10 px-2 py-0.5 rounded text-[10px] text-slate-300 font-mono">
            {gameState.heroPosition}
          </span>
        </div>

        {/* HUD de Mãos e Score */}
        <div className="flex items-center space-x-4 font-mono">
          <div className="flex items-center space-x-2 text-[11px]">
            <span className="text-emerald-400 font-bold">✓ {score.excellent}</span>
            <span className="text-amber-400 font-bold">! {score.inaccuracy}</span>
            <span className="text-red-400 font-bold">✗ {score.blunder}</span>
          </div>

          <div className="bg-white/10 px-3 py-1 rounded-full text-slate-200 text-xs font-bold">
            Mão {currentHandIndex} / {gameState.totalHands}
          </div>

          <button
            onClick={resetSession}
            className="text-slate-400 hover:text-white transition-colors text-xs underline font-sans"
          >
            Encerrar
          </button>
        </div>
      </header>

      {/* Área Principal da Mesa */}
      <main className="flex-1 flex items-center justify-center p-4 relative">
        <PokerTableUI gameState={gameState} />
      </main>

      {/* Painel Inferior de Ações */}
      <footer className="w-full">
        <ActionPanel />
      </footer>

      {/* Modal de Feedback GTO */}
      <GtoFeedbackModal />
    </div>
  );
}