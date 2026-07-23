import { Card, Street } from './pokerTypes';
import { createDeck, shuffleDeck } from './pokerRng';
import { SpotDefinition, SpotId, GameState, Position } from './pokerTrainerTypes';

export const ALL_SPOTS: SpotDefinition[] = [
  // FLOP
  { id: 'FLOP_CBET_IP', street: 'FLOP', label: 'C-Bet Flop (IP)', defaultPosition: 'IP', scenarioLine: 'CBET_FLOP', isFacingBet: false },
  { id: 'FLOP_CBET_OOP', street: 'FLOP', label: 'C-Bet Flop (OOP)', defaultPosition: 'OOP', scenarioLine: 'CBET_FLOP', isFacingBet: false },
  { id: 'FLOP_DEFENSE_VS_CBET_IP', street: 'FLOP', label: 'Defesa vs C-Bet Flop (IP)', defaultPosition: 'IP', scenarioLine: 'DEFENSE_VS_CBET_FLOP', isFacingBet: true },
  { id: 'FLOP_DEFENSE_VS_CBET_OOP', street: 'FLOP', label: 'Defesa vs C-Bet Flop (OOP)', defaultPosition: 'OOP', scenarioLine: 'DEFENSE_VS_CBET_FLOP', isFacingBet: true },
  { id: 'FLOP_STAB_IP', street: 'FLOP', label: 'Stab Flop (IP)', defaultPosition: 'IP', scenarioLine: 'STAB_FLOP', isFacingBet: false },

  // TURN
  { id: 'TURN_STAB_AFTER_CHECK_BEHIND_FLOP_OOP', street: 'TURN', label: 'Stab Turn após Check-Behind Flop (OOP)', defaultPosition: 'OOP', scenarioLine: 'STAB_TURN_POST_CB_FLOP', isFacingBet: false },
  { id: 'TURN_STAB_AFTER_DOUBLE_CHECK_IP', street: 'TURN', label: 'Stab Turn após Duplo Check Flop e Turn (IP)', defaultPosition: 'IP', scenarioLine: 'STAB_TURN_POST_DOUBLE_CHECK', isFacingBet: false },
  { id: 'TURN_STAB_AFTER_CBET_FLOP_CHECK_TURN_IP', street: 'TURN', label: 'Stab Turn após C-Bet Flop e Check Turn (IP)', defaultPosition: 'IP', scenarioLine: 'STAB_TURN_POST_CBET_CHECK', isFacingBet: false },
  { id: 'TURN_CBET_2ND_BARREL', street: 'TURN', label: 'C-Bet Turn 2º Barril', defaultPosition: 'IP', scenarioLine: 'BARREL_2ND_TURN', isFacingBet: false },
  { id: 'TURN_DELAYED_CBET_IP', street: 'TURN', label: 'Delayed C-Bet Turn (IP)', defaultPosition: 'IP', scenarioLine: 'DELAYED_CBET_TURN', isFacingBet: false },
  { id: 'TURN_DELAYED_CBET_OOP', street: 'TURN', label: 'Delayed C-Bet Turn (OOP)', defaultPosition: 'OOP', scenarioLine: 'DELAYED_CBET_TURN', isFacingBet: false },
  { id: 'TURN_DEFENSE_VS_2ND_BARREL_75_IP', street: 'TURN', label: 'Defesa vs C-Bet Turn 2º Barril 75% (IP)', defaultPosition: 'IP', scenarioLine: 'DEFENSE_VS_2ND_BARREL', isFacingBet: true },
  { id: 'TURN_DEFENSE_VS_2ND_BARREL_75_OOP', street: 'TURN', label: 'Defesa vs C-Bet Turn 2º Barril 75% (OOP)', defaultPosition: 'OOP', scenarioLine: 'DEFENSE_VS_2ND_BARREL', isFacingBet: true },

  // RIVER
  { id: 'RIVER_STAB_POST_DELAYED_CBET_CHECK_RIVER_IP', street: 'RIVER', label: 'Stab River (Pós Delayed C-Bet e Check River) (IP)', defaultPosition: 'IP', scenarioLine: 'STAB_RIVER_POST_DELAYED', isFacingBet: false },
  { id: 'RIVER_STAB_POST_2BARREL_CHECK_RIVER_IP', street: 'RIVER', label: 'Stab River (Pós 2-Barrel e Check River) (IP)', defaultPosition: 'IP', scenarioLine: 'STAB_RIVER_POST_2BARREL', isFacingBet: false },
  { id: 'RIVER_STAB_POST_CBET_FLOP_CHECK_BEHIND_TURN_OOP', street: 'RIVER', label: 'Stab River (Pós C-Bet Flop e Check Behind Turn) (OOP)', defaultPosition: 'OOP', scenarioLine: 'STAB_RIVER_POST_CB_TURN', isFacingBet: false },
  { id: 'RIVER_CBET_3RD_BARREL', street: 'RIVER', label: 'C-Bet River 3º Barril', defaultPosition: 'IP', scenarioLine: 'BARREL_3RD_RIVER', isFacingBet: false },
  { id: 'RIVER_XBB_IP', street: 'RIVER', label: 'Check - Bet - Bet River Agressor (X-B-B) (IP)', defaultPosition: 'IP', scenarioLine: 'XBB_RIVER', isFacingBet: false },
  { id: 'RIVER_XBB_OOP', street: 'RIVER', label: 'Check - Bet - Bet River Agressor (X-B-B) (OOP)', defaultPosition: 'OOP', scenarioLine: 'XBB_RIVER', isFacingBet: false },
  { id: 'RIVER_BXB_IP', street: 'RIVER', label: 'Bet - Check - Bet River Agressor (B-X-B) (IP)', defaultPosition: 'IP', scenarioLine: 'BXB_RIVER', isFacingBet: false },
  { id: 'RIVER_BXB_OOP', street: 'RIVER', label: 'Bet - Check - Bet River Agressor (B-X-B) (OOP)', defaultPosition: 'OOP', scenarioLine: 'BXB_RIVER', isFacingBet: false },
  { id: 'RIVER_DEFENSE_VS_3RD_BARREL_OOP', street: 'RIVER', label: 'Defesa vs C-Bet River 3º Barril (OOP)', defaultPosition: 'OOP', scenarioLine: 'DEFENSE_VS_3RD_BARREL', isFacingBet: true },
  { id: 'RIVER_DEFENSE_VS_XBB_IP', street: 'RIVER', label: 'Defesa vs Check - Bet - Bet River (IP)', defaultPosition: 'IP', scenarioLine: 'DEFENSE_VS_XBB', isFacingBet: true },
  { id: 'RIVER_DEFENSE_VS_XBB_OOP', street: 'RIVER', label: 'Defesa vs Check - Bet - Bet River (OOP)', defaultPosition: 'OOP', scenarioLine: 'DEFENSE_VS_XBB', isFacingBet: true },
  { id: 'RIVER_DEFENSE_VS_BXB_IP', street: 'RIVER', label: 'Defesa vs Bet - Check - Bet River (IP)', defaultPosition: 'IP', scenarioLine: 'DEFENSE_VS_BXB', isFacingBet: true },
  { id: 'RIVER_DEFENSE_VS_BXB_OOP', street: 'RIVER', label: 'Defesa vs Bet - Check - Bet River (OOP)', defaultPosition: 'OOP', scenarioLine: 'DEFENSE_VS_BXB', isFacingBet: true }
];

export const generateHandForSpot = (
  spot: SpotDefinition,
  heroPosition: Position,
  handIndex: number,
  totalHands: number
): GameState => {
  const deck = shuffleDeck(createDeck());

  const heroCards: [Card, Card] = [deck[0], deck[1]];
  const villainCards: [Card, Card] = [deck[2], deck[3]];

  let boardCount = 3;
  if (spot.street === 'TURN') boardCount = 4;
  if (spot.street === 'RIVER') boardCount = 5;

  const boardCards = deck.slice(4, 4 + boardCount);

  // Calcula potes dinâmicos de acordo com a street e histórico do spot
  let potSize = 6.0; // Pote Padrão de 3Bet/SRP Flop
  if (spot.street === 'TURN') potSize = 14.5;
  if (spot.street === 'RIVER') potSize = 32.0;

  const currentBetToCall = spot.isFacingBet ? Math.round(potSize * 0.6 * 10) / 10 : 0;

  return {
    currentHandIndex: handIndex,
    totalHands,
    heroCards,
    villainCards,
    boardCards,
    potSize,
    heroStack: 100.0,
    villainStack: 100.0,
    currentBetToCall,
    street: spot.street,
    heroPosition,
    isHeroTurn: true,
    spot
  };
};