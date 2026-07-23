import { Card, Suit } from './pokerTypes';
import { createDeck } from './pokerRng';

type SuitMapping = Record<Suit, Suit>;

// Ordem numérica auxiliar para ordenação determinística de naipes
const SUIT_ORDER: Record<Suit, number> = { s: 0, h: 1, d: 2, c: 3 };

/**
 * Gera recursivamente as 24 permutações de naipes (4! = 24)
 */
const generateSuitPermutations = (): SuitMapping[] => {
  const result: SuitMapping[] = [];
  const suits: Suit[] = ['s', 'h', 'd', 'c'];

  const permute = (arr: Suit[], m: Suit[] = []) => {
    if (arr.length === 0) {
      result.push({
        s: m[0],
        h: m[1],
        d: m[2],
        c: m[3]
      });
    } else {
      for (let i = 0; i < arr.length; i++) {
        const curr = [...arr];
        const next = curr.splice(i, 1);
        permute(curr, m.concat(next));
      }
    }
  };

  permute(suits);
  return result;
};

const SUIT_PERMUTATIONS = generateSuitPermutations();

/**
 * Mapeia qualquer board sorteado aleatoriamente para sua FORMA CANÔNICA (Isomórfica).
 * Testa as 24 permutações e extrai a menor combinação lexicográfica.
 */
export const getCanonicalBoard = (board: Card[]): { canonicalCards: Card[]; canonicalKey: string } => {
  let bestKey: string | null = null;
  let bestBoard: Card[] = [];

  for (const perm of SUIT_PERMUTATIONS) {
    // Aplica o remapeamento de naipes segundo a permutação
    const remapped: Card[] = board.map((card) => ({
      rank: card.rank,
      suit: perm[card.suit],
    }));

    // Reordena as cartas por Rank (decrescente) e depois por ordem de Naipe
    remapped.sort((a, b) => b.rank - a.rank || SUIT_ORDER[a.suit] - SUIT_ORDER[b.suit]);

    const key = remapped.map((c) => `${c.rank.toString(16)}:${c.suit}`).join('-');

    if (bestKey === null || key < bestKey) {
      bestKey = key;
      bestBoard = remapped;
    }
  }

  return {
    canonicalCards: bestBoard,
    canonicalKey: bestKey!,
  };
};

/**
 * Função utilitária para verificar a contagem total de universos isomórficos.
 */
export const countIsomorphicUniverse = (k: 3 | 4 | 5): number => {
  const deck = createDeck();
  const uniqueBoards = new Set<string>();

  const combine = (start: number, combo: Card[]) => {
    if (combo.length === k) {
      const { canonicalKey } = getCanonicalBoard(combo);
      uniqueBoards.add(canonicalKey);
      return;
    }
    for (let i = start; i < deck.length; i++) {
      combo.push(deck[i]);
      combine(i + 1, combo);
      combo.pop();
    }
  };

  combine(0, []);
  return uniqueBoards.size;
};