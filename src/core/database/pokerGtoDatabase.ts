import type { Card } from '../domain/pokerTypes';

export interface FlopTextureGtoStrategyIP {
  textureName: string;
  sizing: string;
  cbetValue: string;
  cbetBluff: string;
  checkBehind: string;
}

export interface FlopTextureGtoStrategyOOP {
  textureName: string;
  sizing: string;
  cbetValue: string;
  cbetBluff: string;
  checkRaiseValue: string;
  checkRaiseBluff: string;
}

export interface PostFlopActionStrategy {
  street: 'FLOP' | 'TURN' | 'RIVER';
  situation: string;
  position: 'IP' | 'OOP' | 'IP e OOP';
  action: string;
  handRange: string;
}

export function normalizeTextureName(name: string): string {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .replace(/\(.*\)/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function getGtoFlopTextureName(board: Card[]): string {
  if (!board || board.length < 3) return 'A-HIGH RAINBOW';

  const ranks = board.slice(0, 3).map((c) => c.rank).sort((a, b) => b - a);
  const suits = board.slice(0, 3).map((c) => c.suit);
  const uniqueSuits = new Set(suits).size;

  const isMonotone = uniqueSuits === 1;
  const isTwoTone = uniqueSuits === 2;
  const isPaired = ranks[0] === ranks[1] || ranks[1] === ranks[2];

  if (ranks[0] === 14) {
    if (isMonotone) return 'A-HIGH MONOTONE';
    if (isPaired) return 'A-HIGH PAIRED';
    if (isTwoTone) return 'A-HIGH TWO-TONE';
    return 'A-HIGH RAINBOW';
  }

  if (ranks[0] >= 10 && ranks[1] >= 10) {
    if (isTwoTone) return 'BROADWAY TWO-TONE';
    return 'BROADWAY RAINBOW';
  }

  if (isPaired) return 'PAIRED BOARD';
  if (isMonotone) return 'MONOTONE LOW/MEDIUM';
  if (isTwoTone) return 'CONNECTED TWO-TONE';

  return 'DISCONNECTED RAINBOW';
}

export const FLOP_CBET_IP_DATABASE: FlopTextureGtoStrategyIP[] = [
  {
    textureName: 'A-HIGH RAINBOW',
    sizing: '33% Pot',
    cbetValue: 'Top Pair Good Kicker+, Overpairs, Sets',
    cbetBluff: 'Gutshots, Backdoor Flush + Straight Draws, Overcards',
    checkBehind: 'Medium Pairs, Weak Top Pairs, Complete Air'
  },
  {
    textureName: 'BROADWAY TWO-TONE',
    sizing: '50% Pot / 75% Pot',
    cbetValue: 'Two Pair+, Strong Top Pair, Combination Draws',
    cbetBluff: 'Flush Draws, OESD, Gutshots com Overcards',
    checkBehind: 'Weak One Pair, Underpairs, Low Card Draws'
  },
  {
    textureName: 'CONNECTED TWO-TONE',
    sizing: '75% Pot',
    cbetValue: 'Sets, Two Pair, Overpairs com Blocker de Flush',
    cbetBluff: 'Nut Flush Draws, OESD com Overcard',
    checkBehind: 'Marginal Made Hands, Medium Pairs sem Draw'
  },
  {
    textureName: 'PAIRED BOARD',
    sizing: '33% Pot',
    cbetValue: 'Trips, Overpairs, Top Pair High Kicker',
    cbetBluff: 'Backdoor Draws, Overcards com Blocker',
    checkBehind: 'Underpairs, Low Cards sem Equidade'
  }
];

export const FLOP_CBET_OOP_DATABASE: FlopTextureGtoStrategyOOP[] = [
  {
    textureName: 'A-HIGH RAINBOW',
    sizing: '33% Pot / Check',
    cbetValue: 'Top Pair High Kicker, Sets',
    cbetBluff: 'Gutshots com Backdoor Flush',
    checkRaiseValue: 'Sets, Two Pair Fortes',
    checkRaiseBluff: 'Check-Raise com Nut Flush Draw'
  },
  {
    textureName: 'BROADWAY TWO-TONE',
    sizing: '50% Pot / Check',
    cbetValue: 'Two Pair+, Sets',
    cbetBluff: 'Combo Draws (OESD + Flush Draw)',
    checkRaiseValue: 'Sets, Straight',
    checkRaiseBluff: 'Flush Draws com Overcard'
  }
];

export const POSTFLOP_ACTION_DATABASE: PostFlopActionStrategy[] = [
  {
    street: 'FLOP',
    situation: 'CBET_IP',
    position: 'IP',
    action: 'BET 33%',
    handRange: 'Range Advantage amplo em boards secos'
  },
  {
    street: 'TURN',
    situation: '2ND_BARREL',
    position: 'IP e OOP',
    action: 'BET 75%',
    handRange: 'Valor forte contínuo e semi-blefes de alta equidade'
  }
];

export function getFlopGtoStrategyIP(textureName: string): FlopTextureGtoStrategyIP {
  const key = normalizeTextureName(textureName);
  const match = FLOP_CBET_IP_DATABASE.find((item) => normalizeTextureName(item.textureName) === key);
  return match || FLOP_CBET_IP_DATABASE[0];
}

export function getFlopGtoStrategyOOP(textureName: string): FlopTextureGtoStrategyOOP {
  const key = normalizeTextureName(textureName);
  const match = FLOP_CBET_OOP_DATABASE.find((item) => normalizeTextureName(item.textureName) === key);
  return match || FLOP_CBET_OOP_DATABASE[0];
}