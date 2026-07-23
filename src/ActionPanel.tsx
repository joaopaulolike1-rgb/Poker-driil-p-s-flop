import React from 'react';
import { useActionButtons } from './useActionButtons';
import type { ActionOption, GameState } from './pokerTrainerTypes';

interface Props {
  gameState: GameState;
  onSelectAction: (option: ActionOption) => void;
  disabled?: boolean;
}

export const ActionPanel: React.FC<Props> = ({ gameState, onSelectAction, disabled }) => {
  const { isFacingBet, options } = useActionButtons(gameState);

  return (
    <div className="w-full bg-black/60 backdrop-blur-md p-3 border-t border-white/10">
      <div className="max-w-md mx-auto grid grid-cols-2 gap-2">
        {!isFacingBet ? (
          <>
            {/* Botão CHECK principal */}
            <button
              disabled={disabled}
              onClick={() => onSelectAction(options[0])}
              className="col-span-2 py-3 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 disabled:opacity-50 text-white font-extrabold rounded-xl shadow-lg transition-all text-sm tracking-wider uppercase"
            >
              {options[0].label}
            </button>

            {/* Opções de BET */}
            {options.slice(1).map((opt, idx) => (
              <button
                key={idx}
                disabled={disabled}
                onClick={() => onSelectAction(opt)}
                className="py-2.5 bg-amber-600 hover:bg-amber-500 active:bg-amber-700 disabled:opacity-50 text-white font-bold rounded-lg shadow transition-all text-xs"
              >
                {opt.label}
              </button>
            ))}
          </>
        ) : (
          <>
            {/* FOLD & CALL */}
            <button
              disabled={disabled}
              onClick={() => onSelectAction(options[0])}
              className="py-3 bg-red-700 hover:bg-red-600 active:bg-red-800 disabled:opacity-50 text-white font-extrabold rounded-xl shadow-lg transition-all text-sm tracking-wider uppercase"
            >
              {options[0].label}
            </button>
            <button
              disabled={disabled}
              onClick={() => onSelectAction(options[1])}
              className="py-3 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 disabled:opacity-50 text-white font-extrabold rounded-xl shadow-lg transition-all text-sm tracking-wider uppercase"
            >
              {options[1].label}
            </button>

            {/* Opções de RAISE */}
            {options.slice(2).map((opt, idx) => (
              <button
                key={idx}
                disabled={disabled}
                onClick={() => onSelectAction(opt)}
                className="py-2.5 bg-purple-700 hover:bg-purple-600 active:bg-purple-800 disabled:opacity-50 text-white font-bold rounded-lg shadow transition-all text-xs"
              >
                {opt.label}
              </button>
            ))}
          </>
        )}
      </div>
    </div>
  );
};