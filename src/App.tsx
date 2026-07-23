 import React, { useState } from 'react';
 import type { GameState, TrainerConfig, ActionOption, ActionFeedback } from './pokerTrainerTypes';
import { generateHandForSpot } from './pokerSpotGenerator';
import { classifyHandComplete } from './pokerEngine';
import { evaluateUserAction } from './pokerGtoEngine';
import { TrainerConfigModal } from './TrainerConfigModal';
import { PokerTableUI } from './PokerTableUI';
import { ActionPanel } from './ActionPanel';
import { GtoFeedbackModal } from './GtoFeedbackModal';

export default function App() {
  const [config, setConfig] = useState<TrainerConfig | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [currentHandIndex, setCurrentHandIndex] = useState<number>(1);
  const [feedback, setFeedback] = useState<ActionFeedback | null>(null);

  // 1. Inicia a sessão de treino
  const handleStartSession = (newConfig: TrainerConfig) => {
    setConfig(newConfig);
    setCurrentHandIndex(1);
    setFeedback(null);

    const initialHand = generateHandForSpot(
      newConfig.spot,
      newConfig.heroPosition,
      1,
      newConfig.totalHands
    );
    setGameState(initialHand);
  };

  // 2. Processa a tomada de ação do Hero
  const handleSelectAction = (option: ActionOption) => {
    if (!gameState) return;

    // Classifica a força da mão do Hero no board atual
    const handCategory = classifyHandComplete(
      gameState.heroCards,
      gameState.boardCards,
      gameState.street
    );

    // Avalia a jogada em relação ao banco GTO
    const result = evaluateUserAction(gameState, option, handCategory);
    setFeedback(result);
  };

  // 3. Avança para a próxima mão da sessão
  const handleNextHand = () => {
    if (!config) return;

    if (currentHandIndex >= config.totalHands) {
      // Fim da sessão - Reinicia para a tela de configurações
      setConfig(null);
      setGameState(null);
      setFeedback(null);
      return;
    }

    const nextIndex = currentHandIndex + 1;
    setCurrentHandIndex(nextIndex);
    setFeedback(null);

    const nextHand = generateHandForSpot(
      config.spot,
      config.heroPosition,
      nextIndex,
      config.totalHands
    );
    setGameState(nextHand);
  };

  // Exibe a modal de configuração inicial se a sessão não começou
  if (!config || !gameState) {
    return <TrainerConfigModal onStartSession={handleStartSession} />;
  }

  return (
    <div className="min-h-screen bg-[#0a050c] text-white flex flex-col justify-between overflow-hidden select-none">
      {/* Cabeçalho da Sessão */}
      <header className="bg-black/40 border-b border-white/10 px-4 py-2.5 flex justify-between items-center text-xs">
        <div>
          <span className="text-yellow-500 font-extrabold uppercase tracking-wide">
            {gameState.spot.label}
          </span>
          <span className="text-gray-400 ml-2">({gameState.heroPosition})</span>
        </div>
        <div className="font-mono bg-white/10 px-2.5 py-1 rounded-full text-gray-300">
          Mão {gameState.currentHandIndex} / {gameState.totalHands}
        </div>
      </header>

      {/* Mesa do Jogo */}
      <main className="flex-1 flex items-center justify-center p-2 relative">
        <PokerTableUI gameState={gameState} />
      </main>

      {/* Painel Inferior de Ações */}
      <footer className="w-full">
        <ActionPanel
          gameState={gameState}
          onSelectAction={handleSelectAction}
          disabled={feedback !== null}
        />
      </footer>

      {/* Modal de Feedback GTO */}
      {feedback && (
        <GtoFeedbackModal feedback={feedback} onNextHand={handleNextHand} />
      )}
    </div>
  );
}