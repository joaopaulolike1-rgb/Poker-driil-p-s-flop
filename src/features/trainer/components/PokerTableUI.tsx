import React from 'react';
import type { Card } from '../../../core/domain/pokerTypes';
import type { GameState } from '../../../core/domain/pokerTrainerTypes';
import { SUIT_COLORS, SUIT_SYMBOLS, RANK_NAMES } from '../../../core/engine/pokerRng';

interface Props {
  gameState: GameState;
}

const RenderCard: React.FC<{ card: Card; size?: 'sm' | 'md' }> = ({ card, size = 'md' }) => {
  const color = SUIT_COLORS[card.suit];
  const symbol = SUIT_SYMBOLS[card.suit];
  const rank = RANK_NAMES[card.rank];

  const dimensions = size === 'sm' ? 'w-9 h-14 text-xs' : 'w-12 h-18 text-sm';

  return (
    <div
      className={`${dimensions} bg-white rounded-lg border-2 border-slate-300 shadow-md flex flex-col justify-between p-1 select-none transform transition-transform hover:-translate-y-1`}
    >
      <div className="font-extrabold leading-none" style={{ color }}>
        {rank}
      </div>
      <div className="text-center font-bold text-base leading-none" style={{ color }}>
        {symbol}
      </div>
      <div className="font-extrabold leading-none text-right" style={{ color }}>
        {rank}
      </div>
    </div>
  );
};

export const PokerTableUI: React.FC<Props> = ({ gameState }) => {
  const isHeroIP = gameState.heroPosition === 'IP';

  return (
    <div className="relative w-full max-w-2xl aspect-[16/9] bg-emerald-900/90 rounded-[100px] border-[12px] border-amber-950/80 shadow-[inset_0_0_80px_rgba(0,0,0,0.8)] flex flex-col justify-between p-6 select-none overflow-hidden">
      {/* Felt Center Pattern */}
      <div className="absolute inset-0 bg-radial from-emerald-600/20 via-transparent to-black/60 pointer-events-none" />

      {/* 1. ASSENTO VILÃO (TOP) */}
      <div className="relative z-10 flex flex-col items-center">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <div className="w-12 h-12 rounded-full border-2 border-slate-600 bg-slate-900 flex items-center justify-center text-slate-300 font-bold text-xs shadow-lg">
              VILÃO
            </div>
            {!isHeroIP && (
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-amber-400 border border-black flex items-center justify-center text-[10px] font-black text-black shadow">
                D
              </div>
            )}
          </div>
        </div>
        <div className="mt-1 bg-black/70 px-2.5 py-0.5 rounded border border-white/10 text-[11px] text-slate-300">
          Position: <span className="font-bold text-amber-400">{isHeroIP ? 'OOP' : 'IP'}</span>
        </div>
      </div>

      {/* 2. CENTRO DA MESA (POTE + BOARD) */}
      <div className="relative z-10 flex flex-col items-center my-auto space-y-3">
        <div className="bg-black/80 px-4 py-1 rounded-full border border-amber-500/40 shadow-xl flex items-center space-x-2">
          <span className="text-xs text-amber-400/80 uppercase font-extrabold tracking-wider">Pot:</span>
          <span className="text-sm font-mono font-black text-amber-300">{gameState.potSize.toFixed(1)} BB</span>
        </div>

        <div className="flex items-center space-x-2 bg-black/40 p-2 rounded-xl border border-white/5 backdrop-blur-sm min-h-[82px]">
          {gameState.board.map((card, idx) => (
            <RenderCard key={`${card.rank}-${card.suit}-${idx}`} card={card} />
          ))}
        </div>
      </div>

      {/* 3. ASSENTO HERO (BOTTOM) */}
      <div className="relative z-10 flex flex-col items-center">
        <div className="flex -space-x-3 mb-1 z-20">
          <RenderCard card={gameState.heroCards[0]} />
          <RenderCard card={gameState.heroCards[1]} />
        </div>

        <div className="relative">
          <div className="w-14 h-14 rounded-full border-2 border-amber-400 bg-amber-950 flex items-center justify-center text-white font-black text-sm shadow-xl ring-4 ring-amber-500/30">
            HERO
          </div>
          {isHeroIP && (
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-amber-400 border border-black flex items-center justify-center text-[10px] font-black text-black shadow">
              D
            </div>
          )}
        </div>

        <div className="mt-1 bg-black/80 px-3 py-0.5 rounded border border-amber-500/30 text-center">
          <span className="text-[11px] font-bold text-amber-400 tracking-wide uppercase">
            {gameState.heroPosition}
          </span>
        </div>
      </div>
    </div>
  );
};