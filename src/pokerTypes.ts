export type Suit = 's' | 'h' | 'd' | 'c';
export type Rank = 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14; // 14 = Ás

export interface Card { 
  suit: string;
  rank: string;
}

export type Street = 'FLOP' | 'TURN' | 'RIVER';


export interface BoardTexture {
  suitStructure: 'MONOTONE' | 'TWO_TONE' | 'RAINBOW' | 'FOUR_FLUSH'; // [cite: 164-165, 167, 192]
  isConnected: boolean;
  isPaired: boolean;
  highestRank: Rank;
}

export type FlushDrawType = 'NUT_FLUSH_DRAW' | 'SECOND_NUT_FLUSH_DRAW' | 'FLUSH_DRAW' | 'BACKDOOR_FLUSH' | 'NONE';
export type StraightDrawType = 'OESD' | 'GUTSHOT' | 'DOUBLE_GUTSHOT' | 'BACKDOOR_STRAIGHT' | 'NONE';

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
  | 'NUT_MADE'        // Sets, Straights, Flushes, Full Houses [cite: 193-194]
  | 'STRONG_VALUE'    // Overpairs, TPTK em boards secos [cite: 195-196]
  | 'MEDIUM_VALUE'    // Middle Pair, Weak TP, Top Pair em board muito conectado [cite: 197-198]
  | 'STRONG_DRAW'     // NFD, OESD, Combo Draws [cite: 199-201]
  | 'WEAK_DRAW'       // Gutshots, Overcards + BDFD/BDSD [cite: 202, 248]
  | 'BLUFF_CATCHER'   // Mãos de valor médio transformadas no River/Turn [cite: 207, 219-220]
  | 'AIR';            // Sem par, sem draw (Trash) [cite: 203, 221-222]