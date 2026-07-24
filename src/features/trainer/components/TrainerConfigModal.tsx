import React, { useState } from 'react';
import { useTrainerStore } from '../../../store/useTrainerStore';
import type { SpotDefinition, Position, Street } from '../../../core/domain/pokerTrainerTypes';

const ALL_SPOTS: SpotDefinition[] = [
  // FLOP
  { id: 'FLOP_CBET_IP', street: 'FLOP', label: 'C-Bet Flop (IP)', defaultPosition: 'IP', scenarioLine: 'CBET_FLOP', isFacingBet: false },
  { id: 'FLOP_CBET_OOP', street: 'FLOP', label: 'C-Bet Flop (OOP)', defaultPosition: 'OOP', scenarioLine: 'CBET_FLOP', isFacingBet: false },
  { id: 'FLOP_DEFENSE_VS_CBET_IP', street: 'FLOP', label: 'Defesa vs C-Bet Flop (IP)', defaultPosition: 'IP', scenarioLine: 'DEFENSE_VS_CBET_FLOP', isFacingBet: true },
  { id: 'FLOP_DEFENSE_VS_CBET_OOP', street: 'FLOP', label: 'Defesa vs C-Bet Flop (OOP)', defaultPosition: 'OOP', scenarioLine: 'DEFENSE_VS_CBET_FLOP', isFacingBet: true },
  { id: 'FLOP_STAB_IP', street: 'FLOP', label: 'Stab Flop (IP)', defaultPosition: 'IP', scenarioLine: 'STAB_FLOP', isFacingBet: false },
  // TURN
  { id: 'TURN_CBET_2ND_BARREL', street: 'TURN', label: '2nd Barrel (Turn)', defaultPosition: 'IP', scenarioLine: '2ND_BARREL', isFacingBet: false },
  { id: 'TURN_DEFENSE_VS_2ND_BARREL_75_IP', street: 'TURN', label: 'Defesa vs 2nd Barrel 75% (IP)', defaultPosition: 'IP', scenarioLine: 'DEFENSE_VS_2ND_BARREL', isFacingBet: true },
  // RIVER
  { id: 'RIVER_CBET_3RD_BARREL', street: 'RIVER', label: '3rd Barrel (River)', defaultPosition: 'IP', scenarioLine: '3RD_BARREL', isFacingBet: false },
  { id: 'RIVER_DEFENSE_VS_3RD_BARREL_OOP', street: 'RIVER', label: 'Defesa vs 3rd Barrel (OOP)', defaultPosition: 'OOP', scenarioLine: 'DEFENSE_VS_3RD_BARREL', isFacingBet: true }
];

export const TrainerConfigModal: React.FC = () => {
  const startSession = useTrainerStore((state) => state.startSession);

  const [selectedStreet, setSelectedStreet] = useState<Street>('FLOP');
  const [selectedSpot, setSelectedSpot] = useState<SpotDefinition>(ALL_SPOTS[0]);
  const [heroPosition, setHeroPosition] = useState<Position>('IP');
  const [totalHands, setTotalHands] = useState<30 | 50 | 100>(50);

  const filteredSpots = ALL_SPOTS.filter((s) => s.street === selectedStreet);

  const handleStreetSelect = (street: Street) => {
    setSelectedStreet(street);
    const firstSpotInStreet = ALL_SPOTS.find((s) => s.street === street);
    if (firstSpotInStreet) {
      setSelectedSpot(firstSpotInStreet);
      setHeroPosition(firstSpotInStreet.defaultPosition);
    }
  };

  const handleSpotSelect = (spot: SpotDefinition) => {
    setSelectedSpot(spot);
    setHeroPosition(spot.defaultPosition);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startSession({
      spot: selectedSpot,
      heroPosition,
      totalHands
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 select-none">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#120810] p-6 text-white shadow-2xl space-y-5">
        <div className="text-center space-y-1">
          <h2 className="text-xl font-black tracking-wider text-amber-400 uppercase">Configurar Sessão de Treino</h2>
          <p className="text-xs text-slate-400">Selecione o cenário pós-flop que deseja praticar</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Seleção de Street */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wide mb-2">Street</label>
            <div className="grid grid-cols-3 gap-2">
              {(['FLOP', 'TURN', 'RIVER'] as const).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => handleStreetSelect(st)}
                  className={`py-2 text-xs font-black rounded-lg border transition-all ${
                    selectedStreet === st
                      ? 'bg-amber-500 text-black border-amber-400 shadow-md'
                      : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/10'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Seleção de Spot */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wide mb-2">Cenário (Spot)</label>
            <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
              {filteredSpots.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => handleSpotSelect(s)}
                  className={`w-full text-left px-3 py-2 text-xs rounded-lg border transition-all flex justify-between items-center ${
                    selectedSpot.id === s.id
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/60 font-bold'
                      : 'bg-white/5 text-slate-300 border-white/5 hover:bg-white/10'
                  }`}
                >
                  <span>{s.label}</span>
                  <span className="text-[10px] opacity-70 font-mono">({s.defaultPosition})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Posição & Volume */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wide mb-2">Posição do Hero</label>
              <div className="grid grid-cols-2 gap-1">
                {(['IP', 'OOP'] as const).map((pos) => (
                  <button
                    key={pos}
                    type="button"
                    onClick={() => setHeroPosition(pos)}
                    className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                      heroPosition === pos
                        ? 'bg-amber-500 text-black border-amber-400 font-extrabold'
                        : 'bg-white/5 text-slate-400 border-white/10'
                    }`}
                  >
                    {pos}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wide mb-2">Total de Mãos</label>
              <div className="grid grid-cols-3 gap-1">
                {([30, 50, 100] as const).map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setTotalHands(num)}
                    className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                      totalHands === num
                        ? 'bg-amber-500 text-black border-amber-400 font-extrabold'
                        : 'bg-white/5 text-slate-400 border-white/10'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Botão Start */}
          <button
            type="submit"
            className="w-full py-3.5 mt-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 font-black text-black text-sm tracking-wider uppercase shadow-lg shadow-amber-500/25 hover:brightness-110 active:scale-[0.99] transition-all"
          >
            Iniciar Treino
          </button>
        </form>
      </div>
    </div>
  );
};