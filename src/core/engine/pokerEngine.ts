import type {
    Card,
    Rank,
    Street,
    BoardTexture,
    FlushDrawType,
    StraightDrawType,
    DrawAnalysis,
    OvercardsAnalysis,
    HandCategory,
    HoleCards
  } from '../domain/pokerTypes';
  
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
  
  export function evaluateBest5CardHand(cards: Card[]): HandEvaluation {
    if (cards.length < 5) {
      const ranks = cards.map(c => c.rank).sort((a, b) => b - a);
      return { rank: 'HIGH_CARD', kickers: ranks };
    }
  
    const suitCounts: Record<string, Card[]> = {};
    const rankCounts: Record<number, number> = {};
  
    cards.forEach(card => {
      suitCounts[card.suit] = suitCounts[card.suit] || [];
      suitCounts[card.suit].push(card);
      rankCounts[card.rank] = (rankCounts[card.rank] || 0) + 1;
    });
  
    // Flush / Straight Flush
    let flushCards: Card[] | null = null;
    for (const s in suitCounts) {
      if (suitCounts[s].length >= 5) {
        flushCards = suitCounts[s];
        break;
      }
    }
  
    if (flushCards) {
      const flushRanks = Array.from(new Set(flushCards.map(c => c.rank))).sort((a, b) => b - a);
      if (flushRanks.includes(14)) flushRanks.push(1);
  
      for (let i = 0; i <= flushRanks.length - 5; i++) {
        if (flushRanks[i] - flushRanks[i + 4] === 4) {
          return { rank: 'STRAIGHT_FLUSH', kickers: [flushRanks[i]] };
        }
      }
  
      const sortedFlush = flushCards.map(c => c.rank).sort((a, b) => b - a).slice(0, 5);
      return { rank: 'FLUSH', kickers: sortedFlush };
    }
  
    // Straight
    const uniqueRanks = Array.from(new Set(cards.map(c => c.rank))).sort((a, b) => b - a);
    if (uniqueRanks.includes(14)) uniqueRanks.push(1);
  
    for (let i = 0; i <= uniqueRanks.length - 5; i++) {
      if (uniqueRanks[i] - uniqueRanks[i + 4] === 4) {
        return { rank: 'STRAIGHT', kickers: [uniqueRanks[i]] };
      }
    }
  
    // Agrupamentos (4 of a kind, Full House, 3 of a kind, Pairs)
    const fourOfAKind: number[] = [];
    const threeOfAKind: number[] = [];
    const pairs: number[] = [];
    const singles: number[] = [];
  
    Object.entries(rankCounts).forEach(([rStr, count]) => {
      const r = parseInt(rStr, 10);
      if (count === 4) fourOfAKind.push(r);
      else if (count === 3) threeOfAKind.push(r);
      else if (count === 2) pairs.push(r);
      else singles.push(r);
    });
  
    fourOfAKind.sort((a, b) => b - a);
    threeOfAKind.sort((a, b) => b - a);
    pairs.sort((a, b) => b - a);
    singles.sort((a, b) => b - a);
  
    if (fourOfAKind.length > 0) {
      const kicker = Math.max(...cards.filter(c => c.rank !== fourOfAKind[0]).map(c => c.rank));
      return { rank: 'FOUR_OF_A_KIND', kickers: [fourOfAKind[0], kicker] };
    }
  
    if (threeOfAKind.length >= 2) {
      return { rank: 'FULL_HOUSE', kickers: [threeOfAKind[0], threeOfAKind[1]] };
    }
  
    if (threeOfAKind.length === 1 && pairs.length >= 1) {
      return { rank: 'FULL_HOUSE', kickers: [threeOfAKind[0], pairs[0]] };
    }
  
    if (threeOfAKind.length === 1) {
      const kickers = singles.slice(0, 2);
      return { rank: 'THREE_OF_A_KIND', kickers: [threeOfAKind[0], ...kickers] };
    }
  
    if (pairs.length >= 2) {
      const top2Pairs = pairs.slice(0, 2);
      const remaining = cards.map(c => c.rank).filter(r => !top2Pairs.includes(r)).sort((a, b) => b - a);
      return { rank: 'TWO_PAIR', kickers: [...top2Pairs, remaining[0]] };
    }
  
    if (pairs.length === 1) {
      const kickers = singles.slice(0, 3);
      return { rank: 'ONE_PAIR', kickers: [pairs[0], ...kickers] };
    }
  
    return { rank: 'HIGH_CARD', kickers: singles.slice(0, 5) };
  }
  
  export function analyzeBoard(board: Card[]): BoardTexture {
    const suitCounts: Record<string, number> = {};
    const ranks = board.map(c => c.rank).sort((a, b) => b - a);
  
    board.forEach(c => {
      suitCounts[c.suit] = (suitCounts[c.suit] || 0) + 1;
    });
  
    const maxSuitCount = Math.max(...Object.values(suitCounts));
    let suitStructure: BoardTexture['suitStructure'] = 'RAINBOW';
  
    if (maxSuitCount >= 4) suitStructure = 'FOUR_FLUSH';
    else if (maxSuitCount === 3) suitStructure = 'MONOTONE';
    else if (maxSuitCount === 2) suitStructure = 'TWO_TONE';
  
    const uniqueRanks = Array.from(new Set(ranks));
    const isPaired = uniqueRanks.length < ranks.length;
  
    let isConnected = false;
    if (uniqueRanks.length >= 3) {
      for (let i = 0; i <= uniqueRanks.length - 3; i++) {
        if (uniqueRanks[i] - uniqueRanks[i + 2] <= 4) {
          isConnected = true;
          break;
        }
      }
    }
  
    return {
      suitStructure,
      isConnected,
      isPaired,
      highestRank: ranks[0]
    };
  }
  
  export function analyzeDraws(holeCards: HoleCards, board: Card[], street: Street): DrawAnalysis {
    const allCards = [...holeCards, ...board];
    const suitCounts: Record<string, Card[]> = {};
  
    allCards.forEach(c => {
      suitCounts[c.suit] = suitCounts[c.suit] || [];
      suitCounts[c.suit].push(c);
    });
  
    let flushDraw: FlushDrawType = 'NONE';
    let flushOuts = 0;
  
    for (const s in suitCounts) {
      const count = suitCounts[s].length;
      const heroSuitCards = suitCounts[s].filter(c => holeCards.some(hc => hc.rank === c.rank && hc.suit === c.suit));
  
      if (count === 4 && heroSuitCards.length >= 1) {
        flushOuts = 9;
        const heroMaxRank = Math.max(...heroSuitCards.map(c => c.rank));
        if (heroMaxRank === 14) flushDraw = 'NUT_FLUSH_DRAW';
        else if (heroMaxRank >= 12) flushDraw = 'SECOND_NUT_FLUSH_DRAW';
        else flushDraw = 'FLUSH_DRAW';
        break;
      } else if (count === 3 && heroSuitCards.length >= 1 && street === 'FLOP') {
        flushDraw = 'BACKDOOR_FLUSH';
      }
    }
  
    const uniqueRanks = Array.from(new Set(allCards.map(c => c.rank))).sort((a, b) => b - a);
    if (uniqueRanks.includes(14)) uniqueRanks.push(1);
  
    let straightDraw: StraightDrawType = 'NONE';
    let straightOuts = 0;
  
    for (let r = 14; r >= 5; r--) {
      const targetRanks = [r, r - 1, r - 2, r - 3, r - 4];
      const presentRanks = targetRanks.filter(tr => uniqueRanks.includes(tr === 1 ? 14 : tr));
  
      if (presentRanks.length === 4) {
        const isOESD = (targetRanks[0] === presentRanks[0] && targetRanks[3] === presentRanks[3]) ||
                       (targetRanks[1] === presentRanks[0] && targetRanks[4] === presentRanks[3]);
        if (isOESD) {
          straightDraw = 'OESD';
          straightOuts = 8;
          break;
        } else {
          straightDraw = 'GUTSHOT';
          straightOuts = 4;
        }
      } else if (presentRanks.length === 3 && street === 'FLOP' && straightDraw === 'NONE') {
        straightDraw = 'BACKDOOR_STRAIGHT';
      }
    }
  
    const isComboDraw = flushOuts > 0 && straightOuts > 0;
    const totalOuts = isComboDraw ? flushOuts + straightOuts - 2 : flushOuts + straightOuts;
  
    return {
      flushDraw,
      straightDraw,
      isComboDraw,
      totalOuts
    };
  }
  
  export function analyzeOvercardsAndBackdoors(
    holeCards: HoleCards,
    board: Card[],
    street: Street
  ): OvercardsAnalysis {
    const boardRanks = board.map(c => c.rank);
    const maxBoardRank = Math.max(...boardRanks);
    const overcardsCount = holeCards.filter(hc => hc.rank > maxBoardRank).length;
  
    const draws = analyzeDraws(holeCards, board, street);
    const hasBDFD = draws.flushDraw === 'BACKDOOR_FLUSH';
    const hasBDSD = draws.straightDraw === 'BACKDOOR_STRAIGHT';
  
    let classification: OvercardsAnalysis['classification'] = 'NONE';
  
    if (overcardsCount > 0) {
      if (hasBDFD && hasBDSD) classification = 'OVERCARDS_COMBO_BD';
      else if (hasBDFD) classification = 'OVERCARDS_BDFD';
      else if (hasBDSD) classification = 'OVERCARDS_BDSD';
      else classification = 'OVERCARDS_ONLY';
    }
  
    return {
      overcardsCount,
      hasBDFD,
      hasBDSD,
      classification
    };
  }
  
  export function classifyHandComplete(
    holeCards: HoleCards,
    board: Card[],
    street: Street
  ): HandCategory {
    const allCards = [...holeCards, ...board];
    const evalResult = evaluateBest5CardHand(allCards);
    const texture = analyzeBoard(board);
  
    if (['STRAIGHT_FLUSH', 'FOUR_OF_A_KIND', 'FULL_HOUSE', 'FLUSH', 'STRAIGHT'].includes(evalResult.rank)) {
      return 'NUT_MADE';
    }
  
    if (evalResult.rank === 'THREE_OF_A_KIND') {
      const isSet = holeCards[0].rank === holeCards[1].rank;
      return isSet ? 'NUT_MADE' : 'STRONG_VALUE';
    }
  
    if (evalResult.rank === 'TWO_PAIR') {
      const isTwoPairWithBothHole = holeCards.every(hc => board.some(bc => bc.rank === hc.rank));
      return isTwoPairWithBothHole ? 'STRONG_VALUE' : 'MEDIUM_VALUE';
    }
  
    if (evalResult.rank === 'ONE_PAIR') {
      const pairRank = evalResult.kickers[0];
      const isOverpair = holeCards[0].rank === holeCards[1].rank && holeCards[0].rank > texture.highestRank;
  
      if (isOverpair) {
        return texture.suitStructure === 'MONOTONE' || texture.isConnected ? 'MEDIUM_VALUE' : 'STRONG_VALUE';
      }
  
      const isTopPair = pairRank === texture.highestRank;
      if (isTopPair) {
        if (street === 'RIVER') {
          return (texture.suitStructure === 'MONOTONE' || texture.isPaired) ? 'BLUFF_CATCHER' : 'STRONG_VALUE';
        }
        return texture.isConnected || texture.suitStructure === 'MONOTONE' ? 'MEDIUM_VALUE' : 'STRONG_VALUE';
      }
  
      return 'MEDIUM_VALUE';
    }
  
    if (street === 'RIVER') {
      return 'AIR';
    }
  
    const draws = analyzeDraws(holeCards, board, street);
    if (draws.isComboDraw || draws.totalOuts >= 8) {
      return 'STRONG_DRAW';
    }
  
    if (draws.straightDraw === 'GUTSHOT' || draws.flushDraw === 'BACKDOOR_FLUSH') {
      return 'WEAK_DRAW';
    }
  
    return 'AIR';
  }