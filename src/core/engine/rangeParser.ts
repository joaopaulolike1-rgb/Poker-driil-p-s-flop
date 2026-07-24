import type { Rank, Suit, HoleCards } from '../domain/pokerTypes';

export const RANKS: Rank[] = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
export const SUITS: Suit[] = ['s', 'h', 'd', 'c'];

const RANK_MAP: Record<string, Rank> = {
  'A': 14, 'K': 13, 'Q': 12, 'J': 11, 'T': 10,
  '9': 9, '8': 8, '7': 7, '6': 6, '5': 5, '4': 4, '3': 3, '2': 2
};

const parseRank = (char: string): Rank => {
  const rank = RANK_MAP[char.toUpperCase()];
  if (!rank) throw new Error(`Rank inválido no parser de range: ${char}`);
  return rank;
};

const generatePairCombos = (rank: Rank): HoleCards[] => {
  const combos: HoleCards[] = [];
  for (let i = 0; i < SUITS.length; i++) {
    for (let j = i + 1; j < SUITS.length; j++) {
      combos.push([
        { rank, suit: SUITS[i] },
        { rank, suit: SUITS[j] }
      ]);
    }
  }
  return combos;
};

const generateSuitedCombos = (highRank: Rank, lowRank: Rank): HoleCards[] => {
  return SUITS.map(suit => [
    { rank: highRank, suit },
    { rank: lowRank, suit }
  ]);
};

const generateOffsuitCombos = (highRank: Rank, lowRank: Rank): HoleCards[] => {
  const combos: HoleCards[] = [];
  for (const suit1 of SUITS) {
    for (const suit2 of SUITS) {
      if (suit1 !== suit2) {
        combos.push([
          { rank: highRank, suit: suit1 },
          { rank: lowRank, suit: suit2 }
        ]);
      }
    }
  }
  return combos;
};

/**
 * Converte strings de notação padrão (ex: "66+, A3s+, AJo+, 77-22") para matrizes de HoleCards.
 */
export const parseRangeStringToCombos = (rangeStr: string): HoleCards[] => {
  if (!rangeStr || rangeStr.trim() === '') return [];

  const combos: HoleCards[] = [];
  const tokens = rangeStr.split(',').map(t => t.trim()).filter(Boolean);

  for (const token of tokens) {
    // 1. Pares com + (ex: "66+")
    if (token.length === 3 && token[0] === token[1] && token[2] === '+') {
      const startRank = parseRank(token[0]);
      for (let r = startRank; r <= 14; r++) {
        combos.push(...generatePairCombos(r as Rank));
      }
    }
    // 2. Pares com hífen (ex: "77-22" ou "JJ-TT")
    else if (token.includes('-') && token.length === 5 && token[0] === token[1] && token[3] === token[4]) {
      const rankA = parseRank(token[0]);
      const rankB = parseRank(token[3]);
      const minRank = Math.min(rankA, rankB);
      const maxRank = Math.max(rankA, rankB);
      for (let r = minRank; r <= maxRank; r++) {
        combos.push(...generatePairCombos(r as Rank));
      }
    }
    // 3. Par simples (ex: "AA")
    else if (token.length === 2 && token[0] === token[1]) {
      combos.push(...generatePairCombos(parseRank(token[0])));
    }
    // 4. Suited com + (ex: "A3s+", "K9s+")
    else if (token.length === 4 && token.toLowerCase().endsWith('s+')) {
      const high = parseRank(token[0]);
      const lowStart = parseRank(token[1]);
      for (let low = lowStart; low < high; low++) {
        combos.push(...generateSuitedCombos(high, low as Rank));
      }
    }
    // 5. Suited com hífen (ex: "KJs-KTs")
    else if (token.includes('-') && token.toLowerCase().endsWith('s') && token.length === 7) {
      const parts = token.split('-');
      const high = parseRank(parts[0][0]);
      const lowA = parseRank(parts[0][1]);
      const lowB = parseRank(parts[1][1]);
      const minLow = Math.min(lowA, lowB);
      const maxLow = Math.max(lowA, lowB);
      for (let low = minLow; low <= maxLow; low++) {
        combos.push(...generateSuitedCombos(high, low as Rank));
      }
    }
    // 6. Suited simples (ex: "AKs")
    else if (token.length === 3 && token.toLowerCase().endsWith('s')) {
      combos.push(...generateSuitedCombos(parseRank(token[0]), parseRank(token[1])));
    }
    // 7. Offsuit com + (ex: "AJo+", "KQo+")
    else if (token.length === 4 && token.toLowerCase().endsWith('o+')) {
      const high = parseRank(token[0]);
      const lowStart = parseRank(token[1]);
      for (let low = lowStart; low < high; low++) {
        combos.push(...generateOffsuitCombos(high, low as Rank));
      }
    }
    // 8. Offsuit com hífen (ex: "QJo-JTo")
    else if (token.includes('-') && token.toLowerCase().endsWith('o') && token.length === 7) {
      const parts = token.split('-');
      const high = parseRank(parts[0][0]);
      const lowA = parseRank(parts[0][1]);
      const lowB = parseRank(parts[1][1]);
      const minLow = Math.min(lowA, lowB);
      const maxLow = Math.max(lowA, lowB);
      for (let low = minLow; low <= maxLow; low++) {
        combos.push(...generateOffsuitCombos(high, low as Rank));
      }
    }
    // 9. Offsuit simples (ex: "AKo")
    else if (token.length === 3 && token.toLowerCase().endsWith('o')) {
      combos.push(...generateOffsuitCombos(parseRank(token[0]), parseRank(token[1])));
    }
  }

  return combos;
};;