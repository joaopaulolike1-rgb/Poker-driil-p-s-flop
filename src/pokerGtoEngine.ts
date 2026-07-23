import type { Card, Street, HandCategory } from './pokerTypes';
import type { GameState, ActionOption, ActionFeedback, Position } from './pokerTrainerTypes';
import { getGtoFlopTextureName } from './pokerGtoDatabase';
import type {
  FLOP_CBET_IP_DATABASE,
  FLOP_CBET_OOP_DATABASE,
  POSTFLOP_ACTION_DATABASE,
  FlopTextureGtoStrategyIP,
  FlopTextureGtoStrategyOOP
} from './pokerGtoDatabase';

export type GtoFlopStrategy = FlopTextureGtoStrategyIP | FlopTextureGtoStrategyOOP;


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