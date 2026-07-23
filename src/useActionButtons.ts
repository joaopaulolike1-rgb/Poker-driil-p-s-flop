useActionButtons.ts
import { useMemo } from 'react';
import { ActionOption, GameState } from './pokerTrainerTypes';

export function useActionButtons(gameState: GameState): {
  isFacingBet: boolean;
  options: ActionOption[];
} {
  return useMemo(() => {
    const isFacingBet = gameState.currentBetToCall > 0;
    const pot = gameState.potSize;

    if (!isFacingBet) {
      // POTE EM CHAPA (CHECK): Apenas Check e Bets
      const options: ActionOption[] = [
        { action: 'CHECK', label: 'CHECK' },
        { action: 'BET', sizing: '33%', label: `BET ${Math.round(pot * 0.33 * 10) / 10} (33%)` },
        { action: 'BET', sizing: '50%', label: `BET ${Math.round(pot * 0.5 * 10) / 10} (50%)` },
        { action: 'BET', sizing: '75%', label: `BET ${Math.round(pot * 0.75 * 10) / 10} (75%)` },
        { action: 'BET', sizing: '125%', label: `BET ${Math.round(pot * 1.25 * 10) / 10} (125%)` }
      ];
      return { isFacingBet: false, options };
    } else {
      // ENFRENTANDO APOSTA: Apenas Fold, Call e Raises
      const callVal = gameState.currentBetToCall;
      const options: ActionOption[] = [
        { action: 'FOLD', label: 'FOLD' },
        { action: 'CALL', label: `CALL ${callVal}` },
        { action: 'RAISE', sizing: '2.5x', label: `RAISE ${Math.round(callVal * 2.5 * 10) / 10}` },
        { action: 'RAISE', sizing: '3x', label: `RAISE ${Math.round(callVal * 3.0 * 10) / 10}` },
        { action: 'RAISE', sizing: 'ALL-IN', label: 'ALL-IN' }
      ];
      return { isFacingBet: true, options };
    }
  }, [gameState.currentBetToCall, gameState.potSize]);
}