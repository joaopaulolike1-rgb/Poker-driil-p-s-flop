import React from 'react';
import { useActionButtons } from '../hooks/useActionButtons';
import { useTrainerStore } from '../../../store/useTrainerStore';
import type { ActionOption } from '../../../core/domain/pokerTrainerTypes';

export const ActionPanel: React.FC = () => {
  const gameState = useTrainerStore((state) => state.gameState);
  const submitAction = useTrainerStore((state) => state.submitAction);
  const isProcessing = useTrainerStore((state) => state.isProcessingAction);
  const feedback = useTrainerStore((state) => state.feedback);

  const { isFacingBet, options } = useActionButtons(gameState);

  if (!gameState) return null;

  const isDisabled = isProcessing || feedback !== null;

  const checkOption = options.find((opt) => opt.action === 'CHECK');
  const foldOption = options.find((opt) => opt.action === 'FOLD');
  const callOption = options.find((opt) => opt.action === 'CALL');
  const betOptions = options.filter((opt) => opt.action === 'BET');
  const raiseOptions = options.filter((opt) => opt.action === 'RAISE');

  const handleSelect = (option: ActionOption) => {
    submitAction(option);
  };

  return (
    <div className="w-full bg-black/70 backdrop-blur-md p-4 border-t border-white/10 select-none">
      <div className="max-w-lg mx-auto grid grid-cols-2 gap-2.5">
        {!isFacingBet ? (
          <>
            {/* CHECK */}
            {checkOption && (
              <button
                disabled={isDisabled}
                onClick={() => handleSelect(checkOption)}
                className="col-span-2 py-3.5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 disabled:opacity-40 text-white font-black rounded-xl shadow-lg transition-all text-sm tracking-wider uppercase"
              >
                {checkOption.label}
              </button>
            )}

            {/* BETS */}
            {betOptions.map((opt, idx) => (
              <button
                key={idx}
                disabled={isDisabled}
                onClick={() => handleSelect(opt)}
                className="py-2.5 bg-amber-600 hover:bg-amber-500 active:bg-amber-700 disabled:opacity-40 text-white font-bold rounded-xl shadow transition-all text-xs"
              >
                {opt.label}
              </button>
            ))}
          </>
        ) : (
          <>
            {/* FOLD & CALL */}
            {foldOption && (
              <button
                disabled={isDisabled}
                onClick={() => handleSelect(foldOption)}
                className="py-3.5 bg-red-700 hover:bg-red-600 active:bg-red-800 disabled:opacity-40 text-white font-black rounded-xl shadow-lg transition-all text-sm tracking-wider uppercase"
              >
                {foldOption.label}
              </button>
            )}
            {callOption && (
              <button
                disabled={isDisabled}
                onClick={() => handleSelect(callOption)}
                className="py-3.5 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 disabled:opacity-40 text-white font-black rounded-xl shadow-lg transition-all text-sm tracking-wider uppercase"
              >
                {callOption.label}
              </button>
            )}

            {/* RAISES */}
            {raiseOptions.map((opt, idx) => (
              <button
                key={idx}
                disabled={isDisabled}
                onClick={() => handleSelect(opt)}
                className="py-2.5 bg-purple-700 hover:bg-purple-600 active:bg-purple-800 disabled:opacity-40 text-white font-bold rounded-xl shadow transition-all text-xs"
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