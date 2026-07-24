import type { Card, Street, HandCategory } from '../domain/pokerTypes';
import type { GameState, ActionOption, ActionFeedback, Position } from '../domain/pokerTrainerTypes';
import {
  getGtoFlopTextureName,
  FLOP_CBET_IP_DATABASE,
  FLOP_CBET_OOP_DATABASE,
  type FlopTextureGtoStrategyIP,
  type FlopTextureGtoStrategyOOP
} from '../database/pokerGtoDatabase';

export type GtoFlopStrategy = FlopTextureGtoStrategyIP | FlopTextureGtoStrategyOOP;

export function getGtoStrategy(
  board: Card[],
  position: Position,
  _street: Street
): GtoFlopStrategy {
  const textureName = getGtoFlopTextureName(board);
  const database = position === 'IP' ? FLOP_CBET_IP_DATABASE : FLOP_CBET_OOP_DATABASE;

  const matchedStrategy = database.find(item => item.textureName === textureName);
  return matchedStrategy || database[0];
}

export function evaluateUserAction(
  gameState: GameState,
  option: ActionOption,
  handCategory: HandCategory
): ActionFeedback {
  const strategy = getGtoStrategy(gameState.board, gameState.heroPosition, gameState.spot.street);
  const actionTaken = option.label;

  let quality: ActionFeedback['quality'] = 'EXCELLENT';
  let qualityText = 'Jogada GTO Correta';
  let frequencies: Record<string, number> = {};

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
    quality = 'EXCELLENT';
    qualityText = 'Ação Mista Válida';
    frequencies = { [actionTaken]: 50, 'Outra ação': 50 };
  }

  const explanation = `A textura da mesa é "${strategy.textureName}". Com uma mão classificada como ${handCategory}, a frequência teórica de aposta/agressão é recomendada para manter a proteção do range.`;

  return {
    quality,
    qualityText,
    userAction: actionTaken,
    recommendedAction: isAggressive ? 'BET / RAISE' : 'CHECK / CALL',
    frequencies,
    explanation,
    handCategory
  };
}