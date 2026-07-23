import type { Card, Street } from './pokerTypes';
import { GtoAction } from './pokerGtoEngine';

export type Position = 'IP' | 'OOP';

export type SpotId =
  // FLOP (5)
  | 'FLOP_CBET_IP'
  | 'FLOP_CBET_OOP'
  | 'FLOP_DEFENSE_VS_CBET_IP'
  | 'FLOP_DEFENSE_VS_CBET_OOP'
  | 'FLOP_STAB_IP'
  // TURN (8)
  | 'TURN_STAB_AFTER_CHECK_BEHIND_FLOP_OOP'
  | 'TURN_STAB_AFTER_DOUBLE_CHECK_IP'
  | 'TURN_STAB_AFTER_CBET_FLOP_CHECK_TURN_IP'
  | 'TURN_CBET_2ND_BARREL'
  | 'TURN_DELAYED_CBET_IP'
  | 'TURN_DELAYED_CBET_OOP'
  | 'TURN_DEFENSE_VS_2ND_BARREL_75_IP'
  | 'TURN_DEFENSE_VS_2ND_BARREL_75_OOP'
  // RIVER (14)
  | 'RIVER_STAB_POST_DELAYED_CBET_CHECK_RIVER_IP'
  | 'RIVER_STAB_POST_2BARREL_CHECK_RIVER_IP'
  | 'RIVER_STAB_POST_CBET_FLOP_CHECK_BEHIND_TURN_OOP'
  | 'RIVER_CBET_3RD_BARREL'
  | 'RIVER_XBB_IP'
  | 'RIVER_XBB_OOP'
  | 'RIVER_BXB_IP'
  | 'RIVER_BXB_OOP'
  | 'RIVER_DEFENSE_VS_3RD_BARREL_OOP'
  | 'RIVER_DEFENSE_VS_XBB_IP'
  | 'RIVER_DEFENSE_VS_XBB_OOP'
  | 'RIVER_DEFENSE_VS_BXB_IP'
  | 'RIVER_DEFENSE_VS_BXB_OOP';

export interface SpotDefinition {
  id: SpotId;
  street: Street;
  label: string;
  defaultPosition: Position;
  scenarioLine: string;
  isFacingBet: boolean;
}

export interface TrainerConfig {
  spot: SpotDefinition;
  heroPosition: Position;
  totalHands: 30 | 50 | 100;
}

export interface ActionOption {
  action: GtoAction;
  sizing?: string;
  label: string;
}

export type ActionQuality = 'EXCELLENT' | 'INACCURACY' | 'BLUNDER';

export interface GtoFrequencyMap {
  [actionLabel: string]: number; // ex: "CHECK": 72, "BET 33%": 28
}

export interface ActionFeedback {
  actionTaken: string;
  quality: ActionQuality;
  qualityText: string;
  frequencies: GtoFrequencyMap;
  explanation: string;
}

export interface GameState {
  currentHandIndex: number;
  totalHands: number;
  heroCards: [Card, Card];
  villainCards: [Card, Card];
  boardCards: Card[];
  potSize: number;
  heroStack: number;
  villainStack: number;
  currentBetToCall: number;
  street: Street;
  heroPosition: Position;
  isHeroTurn: boolean;
  spot: SpotDefinition;
}