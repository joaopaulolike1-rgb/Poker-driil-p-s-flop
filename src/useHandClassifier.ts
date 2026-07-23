import { useMemo } from 'react';
import { Card, Street, BoardTexture, HandCategory, DrawAnalysis, OvercardsAnalysis } from './pokerTypes';
import {
  analyzeBoard,
  analyzeDraws,
  analyzeOvercardsAndBackdoors,
  classifyHandComplete
} from './pokerEngine';

interface UseHandClassifierProps {
  holeCards: [Card, Card];
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
    if (board.length === 4) street = 'TURN'; // [cite: 204]
    else if (board.length === 5) street = 'RIVER'; // [cite: 214]

    const texture = analyzeBoard(board); // [cite: 228]
    const draws = analyzeDraws(holeCards, board, street); // [cite: 235]
    const overcards = analyzeOvercardsAndBackdoors(holeCards, board, street); // 
    const category = classifyHandComplete(holeCards, board, street); // [cite: 229, 247-248]

    return {
      street,
      texture,
      draws,
      overcards,
      category
    };
  }, [holeCards, board]);
}