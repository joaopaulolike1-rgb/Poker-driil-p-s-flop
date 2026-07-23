import { Card, Position, Street, HandCategory } from './pokerTypes';
import { GameState, ActionOption, ActionFeedback } from './pokerTrainerTypes';
import {
  FLOP_CBET_IP_DATABASE,
  FLOP_CBET_OOP_DATABASE,
  POSTFLOP_ACTION_DATABASE
} from './pokerGtoDatabase';

// Mapeador unificado para identificar a textura da mesa entre as 28 do banco de dados
export function getGtoFlopTextureName(board: Card[]): string {
  if (board.length < 3) return '1 BROADWAY + 2 BAIXAS SEM FLUSH DRAW';

  const ranks = board.map(c => c.rank).sort((a, b) => b - a);
  const suits = board.map(c => c.suit);

  const suitCounts: Record<string, number> = {};
  suits.forEach(s => (suitCounts[s] = (suitCounts[s] || 0) + 1));
  const maxSuit = Math.max(...Object.values(suitCounts));

  const isMonotone = maxSuit === 3;
  const isTwoTone = maxSuit === 2;
  const isRainbow = maxSuit === 1;

  const broadways = ranks.filter(r => r >= 10);
  const broadwayCount = broadways.length;

  const isTrips = ranks[0] === ranks[1] && ranks[1] === ranks[2];
  const isPaired = !isTrips && (ranks[0] === ranks[1] || ranks[1] === ranks[2] || ranks[0] === ranks[2]);

  if (isTrips) return 'BOARD DE TRINCA (TRIPS BOARD)';

  if (isPaired) {
    const pairedRank = ranks[0] === ranks[1] ? ranks[0] : ranks[1];
    if (pairedRank >= 10) {
      return isTwoTone ? 'PAREADO ALTO COM FLUSH DRAW' : 'PAREADO ALTO SECO';
    } else {
      return isTwoTone ? 'PAREADO BAIXO COM FLUSH DRAW' : 'PAREADO BAIXO SECO';
    }
  }

  if (isMonotone) {
    if (ranks.includes(14)) return 'BOARD MONOTONE COM ÁS (A-X-X MONOTONE)';
    if (broadwayCount >= 2) return 'BOARD MONOTONE CONECTADO ALTO';
    return 'BOARD MONOTONE BAIXO / DESCONECTADO';
  }

  if (ranks.includes(14)) {
    if (broadwayCount >= 2) {
      return isTwoTone ? 'BOARD COM ÁS + BROADWAY COM FLUSH DRAW' : 'BOARD COM ÁS + BROADWAY SECO';
    }
    return isTwoTone ? 'BOARD ÁS HIGH COM FLUSH DRAW (A-X-X FD)' : 'BOARD ÁS HIGH SECO (A-X-X SEM FD)';
  }

  if (broadwayCount === 3) return isTwoTone ? '3 BROADWAYS COM FLUSH DRAW' : '3 BROADWAYS RAINBOW';
  if (broadwayCount === 2) return isTwoTone ? '2 BROADWAYS COM FLUSH DRAW' : '2 BROADWAYS RAINBOW';
  if (broadwayCount === 1) return isTwoTone ? '1 BROADWAY + 2 BAIXAS COM FLUSH DRAW' : '1 BROADWAY + 2 BAIXAS SEM FLUSH DRAW';

  return isTwoTone ? '3 CARTAS BAIXAS COM FLUSH DRAW' : '3 CARTAS BAIXAS CONECTADO RAINBOW';
}

export function getGtoStrategy(
  board: Card[],
  position: Position,
  street: Street
): GtoFlopStrategy {
  const textureName = getGtoFlopTextureName(board);
  const database = position === 'IP' ? FLOP_CBET_IP_DATABASE : FLOP_CBET_OOP_DATABASE;

  const matchedStrategy = database.find(item => item.textureName === textureName);

  if (matchedStrategy) {
    return matchedStrategy;
  }

  return database[0];
}

export function evaluateUserAction(
  gameState: GameState,
  option: ActionOption,
  handCategory: HandCategory
): ActionFeedback {
  // 1. Busca a estratégia geral teórica para essa textura de mesa
  const strategy = getGtoStrategy(gameState.boardCards, gameState.heroPosition, gameState.street);

  // 2. Formata o nome da ação que o usuário escolheu (Ex: "BET 33%")
  const actionTaken = option.sizing ? `${option.action} ${option.sizing}` : option.action;

  // 3. Inicializa variáveis de avaliação
  let quality: 'EXCELLENT' | 'INACCURACY' | 'BLUNDER' = 'EXCELLENT';
  let qualityText = 'Ação GTO Perfeita';
  let frequencies: Record<string, number> = {};
  
  // 4. Lógica de Avaliação Simplificada baseada na Força da Mão vs Ação Escolhida
  const isAggressive = option.action === 'BET' || option.action === 'RAISE';
  const isPassive = option.action === 'CHECK' || option.action === 'FOLD' || option.action === 'CALL';

  if (handCategory === 'NUT_MADE' || handCategory === 'STRONG_VALUE' || handCategory === 'STRONG_DRAW') {
    if (isAggressive) {
      quality = 'EXCELLENT';
      frequencies = { [actionTaken]: 85, 'CHECK / CALL': 15 };
    } else {
      quality = 'INACCURACY';
      qualityText = 'Falta de Agressividade';
      frequencies = { 'BET / RAISE (Valor/Proteção)': 80, [actionTaken]: 20 };
    }
  } else if (handCategory === 'AIR' || handCategory === 'WEAK_DRAW') {
    if (isPassive) {
      quality = 'EXCELLENT';
      frequencies = { [actionTaken]: 90, 'BET (Blefe Ocasional)': 10 };
    } else {
      quality = 'BLUNDER';
      qualityText = 'Erro Crítico (Overplay)';
      frequencies = { 'CHECK / FOLD': 95, [actionTaken]: 5 };
    }
  } else {
    // Mãos marginais (MEDIUM_VALUE, BLUFF_CATCHER)
    quality = 'EXCELLENT';
    qualityText = 'Ação Mista Válida';
    frequencies = { [actionTaken]: 50, 'Outra ação': 50 };
  }

  // 5. Montar a explicação de feedback utilizando o banco GTO
  let explanation = `Categoria da sua mão: ${handCategory}. `;
  if (strategy && 'cbetValue' in strategy) {
    explanation += `\nBase teórica GTO (Flop): Apostas por Valor = ${strategy.cbetValue} | Blefes = ${strategy.cbetBluff}.`;
  }

  return {
    actionTaken,
    quality,
    qualityText,
    frequencies,
    explanation
  };
}