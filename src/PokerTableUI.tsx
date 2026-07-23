import React from 'react';
import type { Card } from './pokerTypes';
import type { GameState } from './pokerTrainerTypes';

interface Props {
  gameState: GameState;
}

const SUIT_COLORS = {
  s: '#111111', // Spades (Preto)
  h: '#D32F2F', // Hearts (Vermelho)
  d: '#1976D2', // Diamonds (Azul)
  c: '#388E3C'  // Clubs (Verde)
};

const SUIT_SYMBOLS = { s: '♠', h: '♥', d: '♦', c: '♣' };
const RANK_LABELS: Record<number, string> = {
  2:'2', 3:'3', 4:'4', 5:'5', 6:'6', 7:'7', 8:'8', 9:'9', 10:'T', 11:'J', 12:'Q', 13:'K', 14:'A'
};

const RenderCard: React.FC<{ card: Card; size?: 'sm' | 'md' }> = ({ card, size = 'md' }) => {
  const color = SUIT_COLORS[card.suit];
  const symbol = SUIT_SYMBOLS[card.suit];
  const rank = RANK_LABELS[card.rank];

  const dimensions = size === 'sm' ? 'w-8 h-12 text-xs' : 'w-11 h-16 text-sm';

  return (
    <div className={`${dimensions} bg-white rounded-md border border-black/20 shadow-lg flex flex-col justify-between p-1 font-black select-none`} style={{ color }}>
      <div className="leading-none">{rank}</div>
      <div className="text-center text-base leading-none">{symbol}</div>
      <div className="leading-none text-right self-end">{rank}</div>
    </div>
  );
};

export const PokerTableUI: React.FC<Props> = ({ gameState }) => {
  return (
    <div className="relative w-full max-w-sm aspect-[9/16] mx-auto bg-black rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between p-3 select-none">
      
      {/* 1. MESA DE POKER EM PÍLULA COM MOLDURA BARROCA */}
      <div className="absolute inset-3 rounded-[120px] border-[6px] border-[#2d2926] shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col items-center justify-between p-4"
           style={{
             background: 'radial-gradient(circle, #811D4C 0%, #510F2F 100%)',
             boxShadow: '0 0 0 2px #d4af37, inset 0 0 15px #000'
           }}>
        
        {/* Marca d'água central do feltro */}
        <div className="absolute inset-0 flex flex-col items-center justify-center opacity-25 pointer-events-none text-center">
          <p className="text-[10px] font-bold text-white tracking-widest uppercase">GTO TRAINER HU</p>
          <p className="text-[8px] text-white">0.50 / 1.00 NLHE</p>
          <p className="text-[7px] text-emerald-400 mt-1">GPS & IP PROTECTED</p>
        </div>

        {/* 2. ASSENTO OPONENTE (TOP-CENTER - VILÃO) */}
        <div className="relative z-10 flex flex-col items-center mt-2">
          {/* Cartas do Vilão (Fechadas) */}
          <div className="flex -space-x-3 mb-1">
            <div className="w-7 h-10 bg-gradient-to-br from-blue-900 to-indigo-950 rounded border border-white/20 shadow" />
            <div className="w-7 h-10 bg-gradient-to-br from-blue-900 to-indigo-950 rounded border border-white/20 shadow" />
          </div>

          {/* Avatar com Anel Metalizado e Badge */}
          <div className="relative">
            <div className="w-12 h-12 rounded-full border-2 border-slate-400 bg-slate-800 flex items-center justify-center text-white font-black text-xs shadow-md">
              VILÃO
            </div>
            {gameState.heroPosition === 'OOP' && (
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-yellow-400 border border-black flex items-center justify-center text-[10px] font-black text-black">
                D
              </div>
            )}
          </div>

          {/* Info Box Vilão */}
          <div className="mt-1 bg-black/75 px-2.5 py-0.5 rounded border border-white/10 text-center">
            <p className="text-[9px] font-semibold text-white">Villain</p>
            <p className="text-[10px] font-bold text-yellow-400">${gameState.villainStack.toFixed(2)}</p>
          </div>
        </div>

        {/* 3. DISPLAY DO POTE & CARTAS COMUNITÁRIAS (CENTER) */}
        <div className="relative z-10 flex flex-col items-center my-auto space-y-2">
          {/* Pot Display */}
          <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-black/50 border border-white/10 shadow-inner">
            <div className="w-3.5 h-3.5 rounded-full bg-red-600 border border-yellow-400 shadow" />
            <span className="text-xs font-black text-white tracking-wide">
              POT: <span className="text-yellow-400">${gameState.potSize.toFixed(2)}</span>
            </span>
          </div>

          {/* Community Cards */}
          <div className="flex items-center space-x-1.5 min-h-[68px]">
            {gameState.boardCards.map((card, idx) => (
              <RenderCard key={idx} card={card} />
            ))}
          </div>
        </div>

        {/* 4. ASSENTO HERO (BOTTOM-CENTER) */}
        <div className="relative z-10 flex flex-col items-center mb-2">
          {/* Cartas do Hero */}
          <div className="flex -space-x-2 mb-1 z-20">
            <RenderCard card={gameState.heroCards[0]} />
            <RenderCard card={gameState.heroCards[1]} />
          </div>

          {/* Avatar Hero com Turn Timer Ring */}
          <div className="relative">
            <div className="w-14 h-14 rounded-full border-2 border-yellow-400 bg-amber-950 flex items-center justify-center text-white font-black text-sm shadow-xl ring-4 ring-yellow-500/40 animate-pulse">
              HERO
            </div>
            {gameState.heroPosition === 'IP' && (
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-yellow-400 border border-black flex items-center justify-center text-[10px] font-black text-black">
                D
              </div>
            )}
          </div>

          {/* Info Box Hero */}
          <div className="mt-1 bg-black/80 px-3 py-0.5 rounded border border-yellow-500/30 text-center">
            <p className="text-[10px] font-semibold text-white">Hero ({gameState.heroPosition})</p>
            <p className="text-[11px] font-black text-yellow-400">${gameState.heroStack.toFixed(2)}</p>
          </div>
        </div>

      </div>
    </div>
  );
};