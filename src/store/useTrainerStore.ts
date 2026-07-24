import { create } from 'zustand';
import type { TrainerConfig, GameState, ActionOption, ActionFeedback } from '../core/domain/pokerTrainerTypes';
import { PokerEngineFacade } from '../core/engine';
import { getPreflopRangesForSpot } from '../core/database/rangesData';

export interface ScoreBoard {
  total: number;
  excellent: number;
  inaccuracy: number;
  blunder: number;
}

export interface TrainerState {
  // Estado da Sessão
  config: TrainerConfig | null;
  gameState: GameState | null;
  feedback: ActionFeedback | null;
  isSessionActive: boolean;
  isProcessingAction: boolean;
  
  // Métricas e Histórico
  currentHandIndex: number;
  score: ScoreBoard;
  history: ActionFeedback[];

  // Ações
  startSession: (config: TrainerConfig) => void;
  submitAction: (option: ActionOption) => void;
  nextHand: () => void;
  resetSession: () => void;
}

const INITIAL_SCORE: ScoreBoard = {
  total: 0,
  excellent: 0,
  inaccuracy: 0,
  blunder: 0
};

export const useTrainerStore = create<TrainerState>((set, get) => ({
  config: null,
  gameState: null,
  feedback: null,
  isSessionActive: false,
  isProcessingAction: false,
  currentHandIndex: 1,
  score: INITIAL_SCORE,
  history: [],

  startSession: (config: TrainerConfig) => {
    const ranges = getPreflopRangesForSpot(
      config.heroPosition,
      config.spot.defaultPosition === 'IP' ? 'OOP' : 'IP',
      config.spot.isFacingBet
    );

    const initialGameState = PokerEngineFacade.createHandState(
      config.spot,
      config.heroPosition,
      1,
      config.totalHands,
      ranges.heroRange,
      ranges.villainRange
    );

    set({
      config,
      gameState: initialGameState,
      feedback: null,
      isSessionActive: true,
      isProcessingAction: false,
      currentHandIndex: 1,
      score: INITIAL_SCORE,
      history: []
    });
  },

  submitAction: (option: ActionOption) => {
    const { gameState, score, history, isProcessingAction } = get();
    if (!gameState || isProcessingAction) return;

    set({ isProcessingAction: true });

    const feedback = PokerEngineFacade.processAction(gameState, option);

    const updatedScore: ScoreBoard = {
      ...score,
      total: score.total + 1,
      excellent: feedback.quality === 'EXCELLENT' ? score.excellent + 1 : score.excellent,
      inaccuracy: feedback.quality === 'INACCURACY' ? score.inaccuracy + 1 : score.inaccuracy,
      blunder: feedback.quality === 'BLUNDER' ? score.blunder + 1 : score.blunder
    };

    set({
      feedback,
      score: updatedScore,
      history: [feedback, ...history],
      isProcessingAction: false
    });
  },

  nextHand: () => {
    const { config, currentHandIndex } = get();
    if (!config) return;

    const nextIndex = currentHandIndex + 1;

    if (nextIndex > config.totalHands) {
      set({ feedback: null, isSessionActive: false });
      return;
    }

    const ranges = getPreflopRangesForSpot(
      config.heroPosition,
      config.spot.defaultPosition === 'IP' ? 'OOP' : 'IP',
      config.spot.isFacingBet
    );

    const newGameState = PokerEngineFacade.createHandState(
      config.spot,
      config.heroPosition,
      nextIndex,
      config.totalHands,
      ranges.heroRange,
      ranges.villainRange
    );

    set({
      gameState: newGameState,
      feedback: null,
      currentHandIndex: nextIndex
    });
  },

  resetSession: () => {
    set({
      config: null,
      gameState: null,
      feedback: null,
      isSessionActive: false,
      isProcessingAction: false,
      currentHandIndex: 1,
      score: INITIAL_SCORE,
      history: []
    });
  }
}));