import type { Card, Rank, Suit } from './pokerTypes';

export const RANKS: Rank[] = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
export const SUITS: Suit[] = ['s', 'h', 'd', 'c'];

export const RANK_NAMES: Record<Rank, string> = {
  2: '2',
  3: '3',
  4: '4',
  5: '5',
  6: '6',
  7: '7',
  8: '8',
  9: '9',
  10: 'T',
  11: 'J',
  12: 'Q',
  13: 'K',
  14: 'A'
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

/**
 * Cria um baralho novo com 52 cartas no formato oficial do app.
 */
export const createDeck = (): Card[] => {
  const deck: Card[] = [];
  for (const rank of RANKS) {
    for (const suit of SUITS) {
      deck.push({ rank, suit });
    }
  }
  return deck;
};

/**
 * Algoritmo de Fisher-Yates (Knuth Shuffle)
 * Garante equiprobabilidade perfeita na aleatoriedade do sorteio sem reposição.
 */
export const shuffleDeck = (deck: Card[]): Card[] => {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/**
 * Sorteia aleatoriamente um board completo (Flop, Turn ou River)
 * filtrando cartas já conhecidas (ex: as cartas da mão do Hero).
 */
export const dealRandomBoard = (streetCount: 3 | 4 | 5, knownCards: Card[] = []): Card[] => {
  const fullDeck = createDeck();
  
  // Remove cartas conhecidas do baralho
  const remainingDeck = fullDeck.filter(
    (card) => !knownCards.some((k) => k.rank === card.rank && k.suit === card.suit)
  );

  // Embaralha aleatoriamente usando Fisher-Yates
  const shuffled = shuffleDeck(remainingDeck);

  // Retorna as 'k' primeiras cartas sorteadas
  return shuffled.slice(0, streetCount);
};

export const formatCard = (card: Card): string => {
  return `${RANK_NAMES[card.rank]}${SUIT_SYMBOLS[card.suit]}`;
};