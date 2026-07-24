import type { Card, BoardTexture } from '../domain/pokerTypes';
import type { GameState, ActionOption, ActionFeedback, Position, SpotDefinition } from '../domain/pokerTrainerTypes';
import { dealCardsForSpotWithRanges } from './pokerRng';
import { classifyHandComplete, analyzeBoard } from './pokerEngine';
import { evaluateUserAction } from './pokerGtoEngine';
import { getCanonicalBoard } from './pokerIsomorphism';
import { parseRangeStringToCombos } from './rangeParser';

export class PokerEngineFacade {
  /**
   * Inicializa um novo GameState para o Spot selecionado aplicando Ranges pré-flop
   */
  public static createHandState(
    spot: SpotDefinition,
    heroPosition: Position,
    currentHandIndex: number,
    totalHands: number,
    heroRangeStr: string = '66+, A3s+, AJo+, KQo',
    villainRangeStr: string = '22+, A2s+, K7s+, ATo+'
  ): GameState {
    let streetCount: 3 | 4 | 5 = 3;
    if (spot.street === 'TURN') streetCount = 4;
    if (spot.street === 'RIVER') streetCount = 5;

    const { heroCards, villainCards, board } = dealCardsForSpotWithRanges(
      heroRangeStr,
      villainRangeStr,
      streetCount
    );

    let potSize = 6.0;
    if (spot.street === 'TURN') potSize = 14.0;
    if (spot.street === 'RIVER') potSize = 30.0;

    return {
      spot,
      heroCards,
      villainCards,
      board,
      heroPosition,
      potSize,
      currentBetToCall: spot.isFacingBet ? potSize * 0.5 : 0,
      currentHandIndex,
      totalHands
    };
  }

  /**
   * Processa a ação do jogador e retorna o feedback GTO
   */
  public static processAction(gameState: GameState, action: ActionOption): ActionFeedback {
    const handCategory = classifyHandComplete(gameState.heroCards, gameState.board, gameState.spot.street);
    return evaluateUserAction(gameState, action, handCategory);
  }

  /**
   * Analisa a textura visual e conectividade do board
   */
  public static getTextureAnalysis(board: Card[]): BoardTexture {
    return analyzeBoard(board);
  }

  /**
   * Retorna a chave isomórfica canônica do board
   */
  public static getIsomorphicKey(board: Card[]): string {
    return getCanonicalBoard(board).canonicalKey;
  }

  /**
   * Utilitário exposto para testes e análise de ranges
   */
  public static parseRange(rangeStr: string) {
    return parseRangeStringToCombos(rangeStr);
  }
}