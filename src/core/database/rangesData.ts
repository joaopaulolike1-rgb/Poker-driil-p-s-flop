export interface RangeNotation {
    symbol: string;
    meaning: string;
  }
  
  export interface RangeRule {
    id: number;
    stack_size: number;
    category: string;
    hero_pos: string;
    villain_pos: string | null;
    action: string;
    hand_range: string;
  }
  
  export const POKER_NOTATIONS: RangeNotation[] = [
    { symbol: 's', meaning: 'Suited (Mesmo naipe)' },
    { symbol: 'o', meaning: 'Offsuit (Naipes diferentes)' },
    { symbol: '+', meaning: 'Indica a carta/par e todas as superiores (ex: 22+)' },
    { symbol: '-', meaning: 'Faixa inclusiva (ex: 77-22)' }
  ];
  
  export const PREFLOP_RANGES_DATABASE: RangeRule[] = [
    // RFI (Raise First In)
    { id: 1, stack_size: 100, category: 'RFI', hero_pos: 'UTG', villain_pos: null, action: 'Raise', hand_range: '66+, A3s+, AJo+, KQo, K9s+, Q9s+, J9s+, T9s' },
    { id: 2, stack_size: 100, category: 'RFI', hero_pos: 'MP', villain_pos: null, action: 'Raise', hand_range: '55+, A2s+, ATo+, KJo+, K8s+, Q9s+, J9s+, T8s+, 98s' },
    { id: 3, stack_size: 100, category: 'RFI', hero_pos: 'CO', villain_pos: null, action: 'Raise', hand_range: '22+, A2s+, A9o+, KTo+, QTo+, JTo, K5s+, Q8s+, J8s+, T8s+, 97s+, 87s, 76s, 65s' },
    { id: 4, stack_size: 100, category: 'RFI', hero_pos: 'BTN', villain_pos: null, action: 'Raise', hand_range: '22+, A2s+, A2o+, K2s+, K7o+, Q4s+, Q9o+, J6s+, J9o+, T6s+, T8o+, 95s+, 85s+, 74s+, 64s+, 53s+' },
    { id: 5, stack_size: 100, category: 'RFI', hero_pos: 'SB', villain_pos: null, action: 'Raise', hand_range: '22+, A2s+, A7o+, K2s+, K9o+, Q2s+, Q9o+, J4s+, J9o+, T6s+, 96s+, 85s+, 75s+, 64s+, 54s' },
  
    // Defense BB vs RFI
    { id: 6, stack_size: 100, category: 'Defense_BB', hero_pos: 'BB', villain_pos: 'UTG', action: 'Call', hand_range: '22-TT, A2s-AJs, K9s+, Q9s+, J9s+, T8s+, 97s+, 87s, 76s, AJo-AQo, KQo' },
    { id: 7, stack_size: 100, category: 'Defense_BB', hero_pos: 'BB', villain_pos: 'UTG', action: '3Bet', hand_range: 'JJ+, AQs+, AKo, A2s-A5s' },
    { id: 8, stack_size: 100, category: 'Defense_BB', hero_pos: 'BB', villain_pos: 'BTN', action: 'Call', hand_range: '22-99, A2s-A9s, A2o-AJo, K2s-K9s, K8o+, Q4s-QJs, Q9o+, J6s+, J9o+, T7s+, 97s+, 86s+, 75s+' },
    { id: 9, stack_size: 100, category: 'Defense_BB', hero_pos: 'BB', villain_pos: 'BTN', action: '3Bet', hand_range: 'TT+, ATs+, AJo+, KTs+, KQo, QJs, A2s-A5s, 76s, 65s' },
  
    // Defense BTN vs RFI
    { id: 20, stack_size: 100, category: 'Defense_BTN', hero_pos: 'BTN', villain_pos: 'CO', action: 'Call', hand_range: '22-99, A2s-A9s, K9s+, Q9s+, J9s+, T9s, 98s, 87s' },
    { id: 21, stack_size: 100, category: 'Defense_BTN', hero_pos: 'BTN', villain_pos: 'CO', action: '3Bet', hand_range: 'TT+, ATs+, AJo+, KTs+, KQo, A2s-A5s' }
  ];
  
  /**
   * Procura os ranges pré-flop adequados ao cenário
   */
  export function getPreflopRangesForSpot(
    heroPos: string,
    villainPos: string | null,
    isFacingBet: boolean
  ): { heroRange: string; villainRange: string } {
    const category = isFacingBet ? (heroPos === 'BB' ? 'Defense_BB' : 'Defense_BTN') : 'RFI';
  
    const heroRule = PREFLOP_RANGES_DATABASE.find(
      (r) => r.hero_pos === heroPos && r.category === category
    );
  
    const villainRule = PREFLOP_RANGES_DATABASE.find(
      (r) => r.hero_pos === (villainPos || 'UTG') && r.category === 'RFI'
    );
  
    return {
      heroRange: heroRule?.hand_range || '66+, A3s+, AJo+, KQo',
      villainRange: villainRule?.hand_range || '22+, A2s+, K7s+, ATo+'
    };
  }