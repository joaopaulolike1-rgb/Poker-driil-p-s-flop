import React, { useState } from 'react';
import { ALL_SPOTS } from './pokerSpotGenerator';
import { SpotDefinition, Position, TrainerConfig } from './pokerTrainerTypes';

interface Props {
  onStartSession: (config: TrainerConfig) => void;
}

export const TrainerConfigModal: React.FC<Props> = ({ onStartSession }) => {
  const [selectedStreet, setSelectedStreet] = useState<'FLOP' | 'TURN' | 'RIVER'>('FLOP');
  const [selectedSpot, setSelectedSpot] = useState<SpotDefinition>(ALL_SPOTS[0]);
  const [heroPosition, setHeroPosition] = useState<Position>('IP');
  const [totalHands, setTotalHands] = useState<30 | 50 | 100>(50);

  const filteredSpots = ALL_SPOTS.filter((s) => s.street === selectedStreet);

  const handleSpotSelect = (spot: SpotDefinition) => {
    setSelectedSpot(spot);
    setHeroPosition(spot.defaultPosition);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStartSession({
      spot: selectedSpot,
      heroPosition,
      totalHands
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
      <div className="w-full max-w-lg rounded-2xl border border-yellow-500/30 bg-gradient-to-b from-[#1a0812] to-[#0a0307] p-6 text-white shadow-2xl">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-black tracking-wider text-yellow-400 uppercase">Poker Trainer GTO</h1>
          <p className="text-xs text-gray-400 mt-1">Configuração de Treino Heads-Up (HU)</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Seletor de Street */}
          <div>
            <label className="block text-xs font-bold text-gray-300 uppercase tracking-wide mb-2">1. Selecione a Street</label>
            <div className="grid grid-cols-3 gap-2">
              {(['FLOP', 'TURN', 'RIVER'] as const).map((street) => (
                <button
                  key={street}
                  type="button"
                  onClick={() => {
                    setSelectedStreet(street);
                    const first = ALL_SPOTS.find((s) => s.street === street);
                    if (first) handleSpotSelect(first);
                  }}
                  className={`py-2 rounded-lg font-bold text-sm transition-all border ${
                    selectedStreet === street
                      ? 'bg-yellow-500 text-black border-yellow-400 shadow-lg shadow-yellow-500/20'
                      : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10'
                  }`}
                >
                  {street}
                </button>
              ))}
            </div>
          </div>

          {/* Lista de Spots da Street selecionada */}
          <div>
            <label className="block text-xs font-bold text-gray-300 uppercase tracking-wide mb-2">
              2. Selecione o Spot ({filteredSpots.length})
            </label>
            <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1 custom-scrollbar">
              {filteredSpots.map((spot) => (
                <button
                  key={spot.id}
                  type="button"
                  onClick={() => handleSpotSelect(spot)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-semibold transition-all border flex items-center justify-between ${
                    selectedSpot.id === spot.id
                      ? 'bg-red-950/80 border-yellow-400 text-yellow-300'
                      : 'bg-white/5 border-white/5 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  <span>{spot.label}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-black/40 border border-white/10 font-mono">
                    {spot.defaultPosition}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Posição Relativa e Quantidade de Mãos */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wide mb-2">Posição Hero</label>
              <div className="grid grid-cols-2 gap-2">
                {(['IP', 'OOP'] as Position[]).map((pos) => (
                  <button
                    key={pos}
                    type="button"
                    onClick={() => setHeroPosition(pos)}
                    className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                      heroPosition === pos
                        ? 'bg-yellow-500 text-black border-yellow-400'
                        : 'bg-white/5 text-gray-400 border-white/10'
                    }`}
                  >
                    {pos}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wide mb-2">Qtd. Mãos</label>
              <div className="grid grid-cols-3 gap-1">
                {([30, 50, 100] as const).map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setTotalHands(num)}
                    className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                      totalHands === num
                        ? 'bg-yellow-500 text-black border-yellow-400'
                        : 'bg-white/5 text-gray-400 border-white/10'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Botão de Início */}
          <button
            type="submit"
            className="w-full py-3.5 mt-2 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-600 font-extrabold text-black text-base tracking-wider uppercase shadow-lg shadow-yellow-500/25 hover:brightness-110 active:scale-[0.99] transition-all"
          >
            Iniciar Treinamento
          </button>
        </form>
      </div>
    </div>
  );
};