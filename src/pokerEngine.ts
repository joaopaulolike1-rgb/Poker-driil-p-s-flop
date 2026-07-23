import type {
  Card,
  Rank,
  Suit,
  Street,
  BoardTexture,
  FlushDrawType,
  StraightDrawType,
  DrawAnalysis,
  OvercardsAnalysis,
  HandCategory
} from './pokerTypes';

// --- AVALIADOR AUXILIAR DE MÃOS DE POKER DE 5/7 CARTAS ---
type HandRank =
  | 'STRAIGHT_FLUSH'
  | 'FOUR_OF_A_KIND'
  | 'FULL_HOUSE'
  | 'FLUSH'
  | 'STRAIGHT'
  | 'THREE_OF_A_KIND'
  | 'TWO_PAIR'
  | 'ONE_PAIR'
  | 'HIGH_CARD';

interface HandEvaluation {
  rank: HandRank;
  kickers: number[];
}

function evaluateBest5CardHand(cards: Card[]): HandEvaluation {
  if (cards.length < 5) {
    // Trata situações pontuais com menos de 5 cartas
    const ranks = cards.map(c => c.rank).sort((a, b) => b - a);
    return { rank: 'HIGH_CARD', kickers: ranks };
  }

  // Agrupamento por Naipe e por Rank
  const suitCounts: Record<string, Card[]> = {};
  const rankCounts: Record<number, number> = {};

  cards.forEach(card => {
    suitCounts[card.suit] = suitCounts[card.suit] || [];
    suitCounts[card.suit].push(card);
    rankCounts[card.rank] = (rankCounts[card.rank] || 0) + 1;
  });

  // 1. Flush & Straight Flush
  let flushSuit: Suit | null = null;
  for (const s in suitCounts) {
    if (suitCounts[s].length >= 5) {
      flushSuit = s as Suit;
      break;
    }
  }

  if (flushSuit) {
    const flushCards = suitCounts[flushSuit];
    let flushRanks = Array.from(new Set(flushCards.map(c => c.rank))).sort((a, b) => b - a);
    if (flushRanks.includes(14)) flushRanks.push(1); // Trata Ás como 1 para Wheel

    // Checa Straight Flush
    for (let i = 0; i < flushRanks.length; i++) {
      const top = flushRanks[i];
      if (
        flushRanks.includes(top) &&
        flushRanks.includes(top - 1) &&
        flushRanks.includes(top - 2) &&
        flushRanks.includes(top - 3) &&
        flushRanks.includes(top - 4)
      ) {
        return { rank: 'STRAIGHT_FLUSH', kickers: [top] };
      }
    }

    // Se é apenas Flush
    const topFlushRanks = Array.from(new Set(flushCards.map(c => c.rank)))
      .sort((a, b) => b - a)
      .slice(0, 5);
    return { rank: 'FLUSH', kickers: topFlushRanks };
  }

  // 2. Straight (Sem ser Flush)
  let uniqueRanks = Array.from(new Set(cards.map(c => c.rank))).sort((a, b) => b - a);
  if (uniqueRanks.includes(14)) uniqueRanks.push(1);

  for (let i = 0; i < uniqueRanks.length; i++) {
    const top = uniqueRanks[i];
    if (
      uniqueRanks.includes(top) &&
      uniqueRanks.includes(top - 1) &&
      uniqueRanks.includes(top - 2) &&
      uniqueRanks.includes(top - 3) &&
      uniqueRanks.includes(top - 4)
    ) {
      return { rank: 'STRAIGHT', kickers: [top] };
    }
  }

  // Contagem de Pares, Trincas, Quadras
  const counts = Object.entries(rankCounts).map(([rank, count]) => ({
    rank: Number(rank),
    count
  }));
  counts.sort((a, b) => b.count - a.count || b.rank - a.rank);

  // 3. Quadra
  if (counts[0].count === 4) {
    return { rank: 'FOUR_OF_A_KIND', kickers: [counts[0].rank] };
  }

  // 4. Full House
  if (counts[0].count === 3 && counts.length > 1 && counts[1].count >= 2) {
    return { rank: 'FULL_HOUSE', kickers: [counts[0].rank, counts[1].rank] };
  }

  // 5. Trinca (Three of a Kind)
  if (counts[0].count === 3) {
    return { rank: 'THREE_OF_A_KIND', kickers: [counts[0].rank] };
  }

  // 6. Dois Pares
  if (counts[0].count === 2 && counts.length > 1 && counts[1].count === 2) {
    return { rank: 'TWO_PAIR', kickers: [counts[0].rank, counts[1].rank] };
  }

  // 7. Um Par
  if (counts[0].count === 2) {
    return { rank: 'ONE_PAIR', kickers: [counts[0].rank] };
  }

  // 8. Carta Alta
  return { rank: 'HIGH_CARD', kickers: uniqueRanks.slice(0, 5) };
}


// --- 1. ANÁLISE DE TEXTURA DO BOARD ---
export function analyzeBoard(board: Card[]): BoardTexture {
  const suitCounts: Record<string, number> = {};
  const rankCounts: Record<number, number> = {};
  let highestRank: Rank = 2;

  board.forEach(card => {
    suitCounts[card.suit] = (suitCounts[card.suit] || 0) + 1;
    rankCounts[card.rank] = (rankCounts[card.rank] || 0) + 1;
    if (card.rank > highestRank) highestRank = card.rank;
  });

  const maxSuitCount = Math.max(...Object.values(suitCounts), 0);
  const isPaired = Object.values(rankCounts).some(count => count >= 2);

  let suitStructure: BoardTexture['suitStructure'] = 'RAINBOW';
  if (maxSuitCount >= 4) suitStructure = 'FOUR_FLUSH';
  else if (maxSuitCount === 3) suitStructure = 'MONOTONE';
  else if (maxSuitCount === 2) suitStructure = 'TWO_TONE';

  // Conectividade real (3 cartas dentro de um espaço de 5 ranks)
  let isConnected = false;
  let ranks = Array.from(new Set(board.map(c => c.rank))).sort((a, b) => a - b);
  if (ranks.includes(14)) ranks = [1, ...ranks]; // Trata A de 1 a 14

  if (ranks.length >= 3) {
    for (let i = 0; i <= ranks.length - 3; i++) {
      if (ranks[i + 2] - ranks[i] <= 4) {
        isConnected = true;
        break;
      }
    }
  }

  return { suitStructure, isConnected, isPaired, highestRank };
}

// --- 2. DETECTOR DE FLUSH DRAWS E BACKDOORS ---
export function analyzeFlushDraw(holeCards: Card[], board: Card[], street: Street): FlushDrawType {
  const allCards = [...holeCards, ...board];
  const suitCounts: Record<Suit, Card[]> = { s: [], h: [], d: [], c: [] };

  allCards.forEach(card => suitCounts[card.suit].push(card));

  for (const s in suitCounts) {
    const suit = s as Suit;
    const cardsInSuit = suitCounts[suit];
    const holeInSuit = holeCards.filter(c => c.suit === suit);

    if (holeInSuit.length === 0) continue;

    if (cardsInSuit.length === 4) {
      if (holeInSuit.some(c => c.rank === 14)) return 'NUT_FLUSH_DRAW';
      if (holeInSuit.some(c => c.rank === 13)) return 'SECOND_NUT_FLUSH_DRAW';
      return 'FLUSH_DRAW';
    }

    if (street === 'FLOP' && cardsInSuit.length === 3 && holeInSuit.length >= 1) {
      return 'BACKDOOR_FLUSH';
    }
  }

  return 'NONE';
}

// --- 3. DETECTOR DE STRAIGHT DRAWS E BACKDOORS ---
export function analyzeStraightDraw(holeCards: Card[], board: Card[], street: Street): StraightDrawType {
  const allCards = [...holeCards, ...board];
  let ranks = Array.from(new Set(allCards.map(c => c.rank))).sort((a, b) => a - b);
  if (ranks.includes(14)) ranks = [1, ...ranks];

  let hasOESD = false;
  const missingGutshotRanks = new Set<number>();

  for (let r = 1; r <= 10; r++) {
    const windowRanks = [r, r + 1, r + 2, r + 3, r + 4];
    const matching = windowRanks.filter(rank => ranks.includes(rank as Rank | 1));

    if (matching.length === 4) {
      const missing = windowRanks.find(rank => !ranks.includes(rank as Rank | 1))!;
      if (missing === r || missing === r + 4) {
        if (r === 1 || r === 10) missingGutshotRanks.add(missing);
        else hasOESD = true;
      } else {
        missingGutshotRanks.add(missing);
      }
    }
  }

  if (hasOESD) return 'OESD';
  if (missingGutshotRanks.size >= 2) return 'DOUBLE_GUTSHOT';
  if (missingGutshotRanks.size === 1) return 'GUTSHOT';

  if (street === 'FLOP') {
    for (let r = 1; r <= 10; r++) {
      const windowRanks = [r, r + 1, r + 2, r + 3, r + 4];
      const matching = windowRanks.filter(rank => ranks.includes(rank as Rank | 1));
      if (matching.length === 3) return 'BACKDOOR_STRAIGHT';
    }
  }

  return 'NONE';
}

// --- 4. AGREGADOR DE DRAWS ---
export function analyzeDraws(holeCards: Card[], board: Card[], street: Street): DrawAnalysis {
  const flushDraw = analyzeFlushDraw(holeCards, board, street);
  const straightDraw = analyzeStraightDraw(holeCards, board, street);

  const isStrongFD = flushDraw === 'NUT_FLUSH_DRAW' || flushDraw === 'SECOND_NUT_FLUSH_DRAW' || flushDraw === 'FLUSH_DRAW';
  const isStrongSD = straightDraw === 'OESD' || straightDraw === 'DOUBLE_GUTSHOT';
  const isComboDraw = isStrongFD && (isStrongSD || straightDraw === 'GUTSHOT');

  let totalOuts = 0;
  if (isStrongFD) totalOuts += 9;
  if (isStrongSD) totalOuts += 8;
  else if (straightDraw === 'GUTSHOT') totalOuts += 4;
  if (isComboDraw) totalOuts -= 2;

  return { flushDraw, straightDraw, isComboDraw, totalOuts };
}

// --- 5. DETECTOR DE OVERCARDS E BACKDOORS ---
export function analyzeOvercardsAndBackdoors(
  holeCards: Card[],
  board: Card[],
  street: Street
): OvercardsAnalysis {
  if (board.length === 0) {
    return { overcardsCount: 0, hasBDFD: false, hasBDSD: false, classification: 'NONE' };
  }

  const highestBoardRank = Math.max(...board.map(c => c.rank));
  const overcards = holeCards.filter(c => c.rank > highestBoardRank);
  const overcardsCount = overcards.length;

  if (overcardsCount === 0) {
    return { overcardsCount: 0, hasBDFD: false, hasBDSD: false, classification: 'NONE' };
  }

  let hasBDFD = false;
  let hasBDSD = false;

  if (street === 'FLOP') {
    hasBDFD = analyzeFlushDraw(holeCards, board, street) === 'BACKDOOR_FLUSH';
    hasBDSD = analyzeStraightDraw(holeCards, board, street) === 'BACKDOOR_STRAIGHT';
  }

  let classification: OvercardsAnalysis['classification'] = 'NONE';
  if (hasBDFD && hasBDSD) classification = 'OVERCARDS_COMBO_BD';
  else if (hasBDFD) classification = 'OVERCARDS_BDFD';
  else if (hasBDSD) classification = 'OVERCARDS_BDSD';
  else classification = 'OVERCARDS_ONLY';

  return { overcardsCount, hasBDFD, hasBDSD, classification };
}

// --- 6. CLASSIFICADOR GERAL EVOLUTIVO POR STREET ---
export function classifyHandComplete(
  holeCards: Card[],
  board: Card[],
  street: Street
): HandCategory {
  const allCards = [...holeCards, ...board];
  const evalResult = evaluateBest5CardHand(allCards);
  const texture = analyzeBoard(board);
  const boardRanks = board.map(c => c.rank);
  const holeRanks = holeCards.map(c => c.rank);

  // --- 6.1 JOGOS FORTES / MADE HANDS SUPERIORES ---
  if (
    evalResult.rank === 'STRAIGHT_FLUSH' ||
    evalResult.rank === 'FOUR_OF_A_KIND' ||
    evalResult.rank === 'FULL_HOUSE' ||
    evalResult.rank === 'FLUSH' ||
    evalResult.rank === 'STRAIGHT' ||
    evalResult.rank === 'THREE_OF_A_KIND'
  ) {
    return 'NUT_MADE';
  }

  if (evalResult.rank === 'TWO_PAIR') {
    return 'STRONG_VALUE';
  }

  // --- 6.2 UUM PAR (ONE PAIR) ---
  if (evalResult.rank === 'ONE_PAIR') {
    const isPocketPair = holeRanks[0] === holeRanks[1];
    const isOverpair = isPocketPair && holeRanks[0] > texture.highestRank;
    const pairedRanksWithBoard = holeRanks.filter(r => boardRanks.includes(r));

    if (isOverpair) {
      return texture.suitStructure === 'MONOTONE' || texture.isConnected ? 'MEDIUM_VALUE' : 'STRONG_VALUE';
    }

    const isTopPair = pairedRanksWithBoard.includes(texture.highestRank);
    if (isTopPair) {
      if (street === 'RIVER') {
        if (texture.suitStructure === 'MONOTONE' || texture.suitStructure === 'FOUR_FLUSH' || texture.isPaired) {
          return 'BLUFF_CATCHER';
        }
        return 'STRONG_VALUE';
      }
      return texture.isConnected || texture.suitStructure === 'MONOTONE' ? 'MEDIUM_VALUE' : 'STRONG_VALUE';
    }

    return 'MEDIUM_VALUE';
  }

  // --- 6.3 NO RIVER: SEM MADE HAND = AIR ---
  if (street === 'RIVER') {
    return 'AIR';
  }

  // --- 6.4 DRAWS FORTES & COMBO DRAWS (FLOP / TURN) ---
  const draws = analyzeDraws(holeCards, board, street);
  if (draws.isComboDraw || draws.totalOuts >= 8) {
    return 'STRONG_DRAW';
  }

  // --- 6.5 DRAWS FRACOS & OVERCARDS + BACKDOORS ---
  if (draws.straightDraw === 'GUTSHOT') {
    return 'WEAK_DRAW';
  }

  const overcards = analyzeOvercardsAndBackdoors(holeCards, board, street);
  if (overcards.classification !== 'NONE') {
    switch (overcards.classification) {
      case 'OVERCARDS_COMBO_BD':
      case 'OVERCARDS_BDFD':
      case 'OVERCARDS_BDSD':
        return 'WEAK_DRAW';
      case 'OVERCARDS_ONLY':
        return overcards.overcardsCount === 2 ? 'WEAK_DRAW' : 'AIR';
    }
  }

  return 'AIR';
}