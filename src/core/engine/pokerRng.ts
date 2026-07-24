import type { Card, Rank, Suit, HoleCards } from '../domain/pokerTypes';
import { parseRangeStringToCombos } from './rangeParser';

export const RANKS: Rank[] = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
export const SUITS: Suit[] = ['s', 'h', 'd', 'c'];

export const RANK_NAMES: Record<Rank, string> = {
  2: '2', 3: '3', 4: '4', 5: '5', 6: '6', 7: '7', 8: '8', 9: '9', 10: 'T', 11: 'J', 12: 'Q', 13: 'K', 14: 'A'
};

export const SUIT_SYMBOLS: Record<Suit, string> = {
  s: '♠',
  h: '♥',
  d: '♦',
  c: '♣'
};

export const SUIT_COLORS: Record<Suit, string> = {
  s: '#000000',
  h: '#d9534f',
  d: '#0275d8',
  c: '#5cb85c'
};

export const createDeck = (): Card[] => {
  const deck: Card[] = [];
  for (const rank of RANKS) {
    for (const suit of SUITS) {
      deck.push({ rank, suit });
    }
  }
  return deck;
};

export const shuffleDeck = (deck: Card[]): Card[] => {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const isComboValid = (combo: HoleCards, deadCards: Card[]): boolean => {
  return !combo.some(c =>
    deadCards.some(dc => dc.rank === c.rank && dc.suit === c.suit)
  );
};

export const dealRandomBoard = (streetCount: 3 | 4 | 5, knownCards: Card[] = []): Card[] => {
  const fullDeck = createDeck();
  const remaining = fullDeck.filter(
    (c) => !knownCards.some((kc) => kc.rank === c.rank && kc.suit === c.suit)
  );
  return shuffleDeck(remaining).slice(0, streetCount);
};

export const dealCardsForSpotWithRanges = (
  heroRangeStr: string,
  villainRangeStr: string,
  streetCount: 3 | 4 | 5
): { heroCards: HoleCards; villainCards: HoleCards; board: Card[] } => {
  const heroCombos = parseRangeStringToCombos(heroRangeStr);
  const villainCombos = parseRangeStringToCombos(villainRangeStr);

  const activeHeroCombos = heroCombos.length > 0 ? heroCombos : [
    [{ rank: 14, suit: 's' }, { rank: 13, suit: 's' }] as HoleCards
  ];
  const activeVillainCombos = villainCombos.length > 0 ? villainCombos : [
    [{ rank: 12, suit: 'h' }, { rank: 12, suit: 'd' }] as HoleCards
  ];

  const heroSelection = activeHeroCombos[Math.floor(Math.random() * activeHeroCombos.length)];

  const validVillainCombos = activeVillainCombos.filter(combo => isComboValid(combo, heroSelection));
  
  const villainSelection = validVillainCombos.length > 0
    ? validVillainCombos[Math.floor(Math.random() * validVillainCombos.length)]
    : activeVillainCombos[0];

  const deadCards: Card[] = [...heroSelection, ...villainSelection];
  const board = dealRandomBoard(streetCount, deadCards);

  return {
    heroCards: heroSelection,
    villainCards: villainSelection,
    board
  };
};