export type Suit = 's' | 'h' | 'd' | 'c';
export type Rank = 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14;

export interface Card {
  suit: Suit;
  rank: Rank;
}

export type HoleCards = [Card, Card];

export type Street = 'FLOP' | 'TURN' | 'RIVER';

export interface BoardTexture {
  suitStructure: 'MONOTONE' | 'TWO_TONE' | 'RAINBOW' | 'FOUR_FLUSH';
  isConnected: boolean;
  isPaired: boolean;
  highestRank: Rank;
}

export type FlushDrawType =
  | 'NUT_FLUSH_DRAW'
  | 'SECOND_NUT_FLUSH_DRAW'
  | 'FLUSH_DRAW'
  | 'BACKDOOR_FLUSH'
  | 'NONE';

export type StraightDrawType =
  | 'OESD'
  | 'GUTSHOT'
  | 'DOUBLE_GUTSHOT'
  | 'BACKDOOR_STRAIGHT'
  | 'NONE';

export interface DrawAnalysis {
  flushDraw: FlushDrawType;
  straightDraw: StraightDrawType;
  isComboDraw: boolean;
  totalOuts: number;
}

export type OvercardClassification =
  | 'OVERCARDS_COMBO_BD'
  | 'OVERCARDS_BDFD'
  | 'OVERCARDS_BDSD'
  | 'OVERCARDS_ONLY'
  | 'NONE';

export interface OvercardsAnalysis {
  overcardsCount: number;
  hasBDFD: boolean;
  hasBDSD: boolean;
  classification: OvercardClassification;
}

export type HandCategory =
  | 'NUT_MADE'
  | 'STRONG_VALUE'
  | 'MEDIUM_VALUE'
  | 'BLUFF_CATCHER'
  | 'STRONG_DRAW'
  | 'WEAK_DRAW'
  | 'AIR';