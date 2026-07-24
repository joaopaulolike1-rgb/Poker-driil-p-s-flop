import { useMemo } from 'react';
import type { Card, Street, BoardTexture, HandCategory, DrawAnalysis, OvercardsAnalysis, HoleCards } from '../../../core/domain/pokerTypes';
import {
  analyzeBoard,
  analyzeDraws,
  analyzeOvercardsAndBackdoors,
  classifyHandComplete
} from '../../../core/engine/pokerEngine';

interface UseHandClassifierProps {
  holeCards: HoleCards;
  board: Card[];
}

interface UseHandClassifierResult {
  street: Street;
  texture: BoardTexture;
  draws: DrawAnalysis;
  overcards: OvercardsAnalysis;
  category: HandCategory;
}

export function useHandClassifier({ holeCards, board }: UseHandClassifierProps): UseHandClassifierResult {
  return useMemo(() => {
    let street: Street = 'FLOP';
    if (board.length === 4) street = 'TURN';
    else if (board.length === 5) street = 'RIVER';

    const texture = analyzeBoard(board);
    const draws = analyzeDraws(holeCards, board, street);
    const overcards = analyzeOvercardsAndBackdoors(holeCards, board, street);
    const category = classifyHandComplete(holeCards, board, street);

    return {
      street,
      texture,
      draws,
      overcards,
      category
    };
  }, [holeCards, board]);
}