import Card from './pokerTypes';

// --- INTERFACES DE ESTRUTURA GTO ---

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

// --- UTILITÁRIO DE NORMALIZAÇÃO DE CHAVES ---
export function normalizeTextureName(name: string): string {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .replace(/\(.*\)/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// ============================================================================
// 1. ESTRATÉGIAS FLOP CBET IP (28 TEXTURAS)
// ============================================================================

export const FLOP_CBET_IP_DATABASE: FlopTextureGtoStrategyIP[] = [
  {
    textureName: '3 BROADWAYS SEM FLUSH DRAW',
    sizing: 'Pequeno (33%)',
    cbetValue: 'Dois pares ou melhor, Top pair com kicker máximo.',
    cbetBluff: 'Projetos de sequência de duas pontas (OESD), Brocas duplas, Brocas simples.',
    checkBehind: 'Segundo e terceiro par, Top pair fraco, Air total sem potencial de sequência.'
  },
  {
    textureName: '3 BROADWAYS + FLUSH DRAW',
    sizing: 'Médio (50%)',
    cbetValue: 'Dois pares ou melhor, Top pair muito forte.',
    cbetBluff: 'Flush draws, OESD, Combo draws (Qualquer projeto misto).',
    checkBehind: 'Pares marginais, Air completo, Top pair sem kicker e sem bloqueador do flush.'
  },
  {
    textureName: '2 BROADWAYS + 1 BAIXA SEM FLUSH DRAW',
    sizing: 'Pequeno (33%)',
    cbetValue: 'Top pair ou melhor, Overpairs.',
    cbetBluff: 'Praticamente 100% do range (Range Cbet). Qualquer Air, Overcards e Brocas.',
    checkBehind: 'Apenas underpairs isolados que desejam ver o Turn barato.'
  },
  {
    textureName: '2 BROADWAYS + 1 MÉDIA SEM FLUSH DRAW',
    sizing: 'Pequeno (33%)',
    cbetValue: 'Top pair com bom kicker ou melhor, Segundo par muito forte.',
    cbetBluff: 'OESD, Brocas, Air com Backdoor Flush Draw.',
    checkBehind: 'Terceiro par, Segundo par fraco, Air total sem backdoor.'
  },
  {
    textureName: '2 BROADWAYS + 1 BAIXA + FLUSH DRAW',
    sizing: 'Médio (50%)',
    cbetValue: 'Top pair com kicker forte ou melhor.',
    cbetBluff: 'Flush draws, Brocas, Overcards que possuem o naipe do flush.',
    checkBehind: 'Air absoluto sem bloqueadores, Pares muito baixos e isolados.'
  },
  {
    textureName: '2 BROADWAYS + 1 MÉDIA + FLUSH DRAW',
    sizing: 'Alto (75%)',
    cbetValue: 'Top pair muito forte, Dois pares ou melhor.',
    cbetBluff: 'Flush draws, OESD, Projetos com múltiplas saídas.',
    checkBehind: 'Top pair com kicker marginal, Segundo par, Terceiro par, Air total sem equidade.'
  },
  {
    textureName: '1 BROADWAY + 1 MÉDIA + 1 BAIXA SEM FLUSH DRAW',
    sizing: 'Pequeno (33%)',
    cbetValue: 'Top pair ou melhor, Overpairs.',
    cbetBluff: 'Altíssima frequência. Air com qualquer backdoor, Brocas, Overcards.',
    checkBehind: 'Underpairs entre a carta média e baixa, Segundo par sem kicker.'
  },
  {
    textureName: '1 BROADWAY + 1 MÉDIA + 1 BAIXA + FLUSH DRAW',
    sizing: 'Médio (50%)',
    cbetValue: 'Top pair forte, Overpairs, Dois pares+.',
    cbetBluff: 'Flush draws, OESD, Brocas, Air suportado por overcards do naipe do flush.',
    checkBehind: 'Air sem naipe, Segundo ou terceiro par sem projetos.'
  },
  {
    textureName: '1 BROADWAY + 2 MÉDIAS SEM FLUSH DRAW',
    sizing: 'Médio (50%)',
    cbetValue: 'Top pair forte, Overpairs, Dois pares+.',
    cbetBluff: 'OESD, Brocas, Overcards suportadas por backdoor flush.',
    checkBehind: 'Top pair vulnerável (kicker fraco), Pares intermediários da mesa.'
  },
  {
    textureName: '1 BROADWAY + 2 MÉDIAS + FLUSH DRAW',
    sizing: 'Alto (75%)',
    cbetValue: 'Top pair máximo, Trincas, Sequências, Dois pares.',
    cbetBluff: 'Flush draws fortes, Combo draws (OESD + Flush draw).',
    checkBehind: 'Top pair médio/fraco, Segundo par, Air completo (equidade muito baixa para blefar).'
  },
  {
    textureName: '1 BROADWAY + 2 BAIXAS SEM FLUSH DRAW',
    sizing: 'Muito Pequeno (33%)',
    cbetValue: 'Qualquer Top pair, Overpairs, Trincas.',
    cbetBluff: 'Frequência máxima (Range Cbet). Qualquer Air e overcards.',
    checkBehind: 'Raríssimo (apenas se quiser proteger seu range de check com um underpair).'
  },
  {
    textureName: '1 BROADWAY + 2 BAIXAS + FLUSH DRAW',
    sizing: 'Médio (50%)',
    cbetValue: 'Top pair sólido, Overpairs, Trincas.',
    cbetBluff: 'Flush draws, Brocas.',
    checkBehind: 'Air absoluto desconectado, Pares da mesa sem kicker.'
  },
  {
    textureName: '3 MÉDIAS SEM FLUSH DRAW',
    sizing: 'Alto (75%)',
    cbetValue: 'Overpairs fortes, Dois pares ou melhor.',
    cbetBluff: 'OESD, Brocas com backdoor flush.',
    checkBehind: 'Overpairs vulneráveis, Top pair absoluto, Air sem equidade (textura péssima para o agressor).'
  },
  {
    textureName: '3 MÉDIAS + FLUSH DRAW',
    sizing: 'Muito Alto (75%)',
    cbetValue: 'Trincas, Sequências, Dois pares superiores.',
    cbetBluff: 'Nut Flush draws, Combo draws massivos.',
    checkBehind: 'Overpairs, Top pair, Air. (Necessidade de controle de pote extremo).'
  },
  {
    textureName: '2 MÉDIAS + 1 BAIXA SEM FLUSH DRAW',
    sizing: 'Médio (50%)',
    cbetValue: 'Overpairs, Top pair bom kicker, Trincas.',
    cbetBluff: 'OESD, Brocas.',
    checkBehind: 'Air total, Overcards desacompanhadas de backdoor.'
  },
  {
    textureName: '2 MÉDIAS + 1 BAIXA + FLUSH DRAW',
    sizing: 'Alto (75%)',
    cbetValue: 'Overpairs legítimos, Top pair com kicker alto, Trincas ou melhor.',
    cbetBluff: 'Flush draws, OESD.',
    checkBehind: 'Valor marginal (Overcard alta sem draw), Air limpo.'
  },
  {
    textureName: '1 MÉDIA + 2 BAIXAS SEM FLUSH DRAW',
    sizing: 'Pequeno (33%)',
    cbetValue: 'Overpairs, Top pair, Trincas.',
    cbetBluff: 'Duas overcards, Brocas, Backdoors.',
    checkBehind: 'Air sem nenhuma equidade residual, Pares fracos formados com cartas baixas.'
  },
  {
    textureName: '1 MÉDIA + 2 BAIXAS + FLUSH DRAW',
    sizing: 'Médio (50%)',
    cbetValue: 'Overpairs, Top pair, Trincas+.',
    cbetBluff: 'Flush draws, OESD, Brocas.',
    checkBehind: 'Overcards sem o naipe do flush, Air puro.'
  },
  {
    textureName: '3 BAIXAS SEM FLUSH DRAW',
    sizing: 'Médio (50%)',
    cbetValue: 'Overpairs consistentes, Trincas, Sequências.',
    cbetBluff: 'OESD, Brocas, Overcards com backdoor.',
    checkBehind: 'Overpairs mínimos e vulneráveis, Air puro sem saídas.'
  },
  {
    textureName: '3 BAIXAS + FLUSH DRAW',
    sizing: 'Alto (75%)',
    cbetValue: 'Overpairs altos, Trincas, Dois pares ou melhor.',
    cbetBluff: 'Nut flush draws, OESD, Projetos muito fortes.',
    checkBehind: 'Air total, Overcards sem naipe.'
  },
  {
    textureName: 'MONOTONE SECO (Desconectado)',
    sizing: 'Muito Pequeno (33%)',
    cbetValue: 'Flushes prontos, Trincas, Top pair que possua a carta mais alta do naipe.',
    cbetBluff: 'Mãos que contenham uma carta alta única do naipe (Bloqueadores).',
    checkBehind: 'Top pairs sem naipe, Pares médios, Air sem naipe.'
  },
  {
    textureName: 'MONOTONE DINÂMICO (Conectado)',
    sizing: 'Pequeno (33%) - Frequência de aposta mínima',
    cbetValue: 'Flushes muito fortes (Nut ou Second Nut), Trincas com possibilidade de full house.',
    cbetBluff: 'Exclusivamente o bloqueador máximo do Nut Flush.',
    checkBehind: 'Todo o resto do range (Top pairs, Flushes fracos, Air total).'
  },
  {
    textureName: 'PAREADO ALTO SECO',
    sizing: 'Minúsculo (33%)',
    cbetValue: 'Trincas, Full Houses, Overcards premium absolutas.',
    cbetBluff: 'Frequência extrema com qualquer Air (Range Cbet).',
    checkBehind: 'Apenas pares muito marginais que não aguentam ação nas próximas streets.'
  },
  {
    textureName: 'PAREADO ALTO DINÂMICO (Com conexão/Flush Draw)',
    sizing: 'Pequeno a Médio (50%)',
    cbetValue: 'Trincas, Overpairs da carta não dobrada, Top pair com bom kicker.',
    cbetBluff: 'Flush draws, OESD (se a carta solta permitir).',
    checkBehind: 'Underpairs puros, Air desconectado.'
  },
  {
    textureName: 'PAREADO MÉDIO SECO',
    sizing: 'Pequeno (33%)',
    cbetValue: 'Overpairs, Trincas.',
    cbetBluff: 'Overcards com backdoor flush draw, Air total.',
    checkBehind: 'Overcards puras sem backdoor, Underpairs em relação à carta média.'
  },
  {
    textureName: 'PAREADO MÉDIO DINÂMICO (Com conexão/Flush Draw)',
    sizing: 'Médio a Alto (50%)',
    cbetValue: 'Trincas, Overpairs inquebráveis.',
    cbetBluff: 'Flush draws, Projetos de sequência abertos.',
    checkBehind: 'Overcards sem draw, Pares fracos.'
  },
  {
    textureName: 'PAREADO BAIXO SECO',
    sizing: 'Pequeno (33%)',
    cbetValue: 'Top pair da carta alta solta, Overpairs, Trincas.',
    cbetBluff: 'Duas Overcards, Air (Frequência muito alta).',
    checkBehind: 'Lixo absoluto que não tem chance alguma de melhorar.'
  },
  {
    textureName: 'PAREADO BAIXO DINÂMICO (Com conexão/Flush Draw)',
    sizing: 'Médio a Alto (50%)',
    cbetValue: 'Overpairs fortes, Trincas.',
    cbetBluff: 'Combo draws, Flush draws, Overcards protegidas pelo naipe do flush.',
    checkBehind: 'Overpairs mínimos e frágeis, Air desnaipado.'
  }
];

// ============================================================================
// 2. ESTRATÉGIAS FLOP CBET OOP (28 TEXTURAS)
// ============================================================================

export const FLOP_CBET_OOP_DATABASE: FlopTextureGtoStrategyOOP[] = [
  {
    textureName: '3 BROADWAYS SEM FLUSH DRAW',
    sizing: '33%',
    cbetValue: 'Top Pair com bom kicker ou melhor.',
    cbetBluff: 'Brocas, Backdoor Flush Draws (BDFD).',
    checkRaiseValue: 'Trincas, Sequências, Dois Pares.',
    checkRaiseBluff: 'Brocas para o nut straight com BDFD.'
  },
  {
    textureName: '3 BROADWAYS + FLUSH DRAW',
    sizing: '50%',
    cbetValue: 'Dois Pares fortes, Trincas, Sequências.',
    cbetBluff: 'Draws fortes de duas pontas (OESD), Flush Draws.',
    checkRaiseValue: 'Sequências formadas, Trincas.',
    checkRaiseBluff: 'Nut Flush Draw com broca ou overcard.'
  },
  {
    textureName: '2 BROADWAYS + 1 BAIXA SEM FLUSH DRAW',
    sizing: '33%',
    cbetValue: 'Top Pair Top Kicker (TPTK) ou melhor.',
    cbetBluff: 'Brocas, BDFD, Overcards fortes com BDSD.',
    checkRaiseValue: 'Trincas, Dois Pares.',
    checkRaiseBluff: 'BDFD conectado com broca.'
  },
  {
    textureName: '2 BROADWAYS + 1 MEDIA SEM FLUSH DRAW',
    sizing: '50%',
    cbetValue: 'TPTK, Dois Pares, Trincas.',
    cbetBluff: 'OESD, Brocas.',
    checkRaiseValue: 'Trincas, Dois Pares fortes.',
    checkRaiseBluff: 'Duas pontas, brocas fortes com backdoor flush.'
  },
  {
    textureName: '2 BROADWAYS + 1 BAIXA + FLUSH DRAW',
    sizing: '50%',
    cbetValue: 'TPTK, Overpairs, Dois Pares.',
    cbetBluff: 'Flush Draws, Broca + BDFD.',
    checkRaiseValue: 'Trincas, Dois Pares.',
    checkRaiseBluff: 'Nut Flush Draw.'
  },
  {
    textureName: '2 BROADWAYS + 1 MEDIA + FLUSH DRAW',
    sizing: '75%',
    cbetValue: 'TPTK forte, Dois Pares, Trincas.',
    cbetBluff: 'Flush Draws fortes, OESD.',
    checkRaiseValue: 'Trincas, Dois Pares top.',
    checkRaiseBluff: 'Combo Draws (Flush Draw + Broca/Duas Pontas).'
  },
  {
    textureName: '1 BROADWAY + 1 MEDIA + BAIXA SEM FLUSH DRAW',
    sizing: '33%',
    cbetValue: 'TPTK ou melhor.',
    cbetBluff: 'Brocas, BDFD.',
    checkRaiseValue: 'Trincas, Dois Pares.',
    checkRaiseBluff: 'BDFD forte com duas overcards.'
  },
  {
    textureName: '1 BROADWAY + 1 MEDIA + BAIXA + FLUSH DRAW',
    sizing: '50%',
    cbetValue: 'TPTK, Dois Pares, Trincas.',
    cbetBluff: 'Flush Draws, Brocas limpas.',
    checkRaiseValue: 'Trincas, Dois Pares.',
    checkRaiseBluff: 'Nut Flush Draw, Flush draw + broca.'
  },
  {
    textureName: '1 BROADWAY + 2 MEDIA SEM FLUSH DRAW',
    sizing: '50%',
    cbetValue: 'Top Pair com bom kicker, Overpairs.',
    cbetBluff: 'OESD.',
    checkRaiseValue: 'Trincas, Sequências, Dois Pares.',
    checkRaiseBluff: 'OESD com BDFD.'
  },
  {
    textureName: '1 BROADWAY + 2 MEDIA + FLUSH DRAW',
    sizing: '75%',
    cbetValue: 'TPTK, Dois Pares, Trincas.',
    cbetBluff: 'Flush Draws, OESD.',
    checkRaiseValue: 'Trincas, Sequências.',
    checkRaiseBluff: 'Combo draws monstruosos (OESD + Flush Draw).'
  },
  {
    textureName: '1 BROADWAY + 2 BAIXA SEM FLUSH DRAW',
    sizing: '33%',
    cbetValue: 'TPTK, Overpairs.',
    cbetBluff: 'BDFD, brocas para sequência baixa (wheel).',
    checkRaiseValue: 'Trincas.',
    checkRaiseBluff: 'Broca + BDFD.'
  },
  {
    textureName: '1 BROADWAY + 2 BAIXA + FLUSH DRAW',
    sizing: '50%',
    cbetValue: 'TPTK, Overpairs, Dois Pares.',
    cbetBluff: 'Flush Draws.',
    checkRaiseValue: 'Trincas.',
    checkRaiseBluff: 'Nut Flush Draw, Flush Draw + overcards.'
  },
  {
    textureName: '3 MEDIA SEM FLUSH DRAW',
    sizing: '50% (Baixa frequência global, jogue de check frequentemente)',
    cbetValue: 'Overpairs fortes, Trincas, Sequências.',
    cbetBluff: 'OESD.',
    checkRaiseValue: 'Sequências, Trincas, Dois pares top.',
    checkRaiseBluff: 'OESD com overcards.'
  },
  {
    textureName: '3 MEDIA + FLUSH DRAW',
    sizing: '75% (Extremamente conectado, jogue agressivo por valor ou desista)',
    cbetValue: 'Trincas, Sequências, Dois Pares Fortes.',
    cbetBluff: 'Nut Flush Draw, OESD.',
    checkRaiseValue: 'Sequências, Trincas.',
    checkRaiseBluff: 'Combo draws (Par + Flush Draw, OESD + Flush Draw).'
  },
  {
    textureName: '2 MEDIA + 1 BAIXA SEM FLUSH DRAW',
    sizing: '50%',
    cbetValue: 'Overpairs, Top Pair bom kicker, Trincas.',
    cbetBluff: 'OESD, Brocas.',
    checkRaiseValue: 'Trincas, Dois Pares.',
    checkRaiseBluff: 'OESD com backdoor flush.'
  },
  {
    textureName: '2 MEDIA + 1 BAIXA + FLUSH DRAW',
    sizing: '75%',
    cbetValue: 'Overpairs, TPTK, Trincas.',
    cbetBluff: 'Flush Draws, OESD.',
    checkRaiseValue: 'Trincas, Dois pares.',
    checkRaiseBluff: 'Nut Flush draw, OESD.'
  },
  {
    textureName: '1 MEDIA + 2 BAIXA SEM FLUSH DRAW',
    sizing: '33%',
    cbetValue: 'Overpairs, TPTK.',
    cbetBluff: 'OESD para sequência baixa, BDFD.',
    checkRaiseValue: 'Trincas, Dois pares.',
    checkRaiseBluff: 'OESD, Brocas com duas overcards.'
  },
  {
    textureName: '1 MEDIA + 2 BAIXA + FLUSH DRAW',
    sizing: '50%',
    cbetValue: 'Overpairs, TPTK, Trincas.',
    cbetBluff: 'Flush Draws, OESD.',
    checkRaiseValue: 'Trincas, Dois pares.',
    checkRaiseBluff: 'Nut Flush Draw com overcards.'
  },
  {
    textureName: '3 BAIXA SEM FLUSH DRAW',
    sizing: '33%',
    cbetValue: 'Overpairs, Top Pair.',
    cbetBluff: 'OESD, Brocas.',
    checkRaiseValue: 'Trincas, Sequências.',
    checkRaiseBluff: 'OESD, Duas overcards com BDFD.'
  },
  {
    textureName: '3 BAIXA + FLUSH DRAW',
    sizing: '50%',
    cbetValue: 'Overpairs fortes, Trincas, Sequências.',
    cbetBluff: 'Flush Draws, OESD.',
    checkRaiseValue: 'Trincas, Sequências.',
    checkRaiseBluff: 'Flush draw com overcards, Combo draws.'
  },
  {
    textureName: 'MONOTONE SECO',
    sizing: '33%',
    cbetValue: 'Flushes formados, Trincas.',
    cbetBluff: 'Carta alta isolada do naipe (Nut Flush Blocker).',
    checkRaiseValue: 'Nut Flushes.',
    checkRaiseBluff: 'As do naipe isolado (sem par) + equidade de backdoor straight.'
  },
  {
    textureName: 'MONOTONE DINAMICO',
    sizing: '33% (Quase 100% check da sua parte é perfeitamente viável)',
    cbetValue: 'Flushes muito fortes.',
    cbetBluff: 'Nut Flush Blocker com OESD.',
    checkRaiseValue: 'Nut Flushes.',
    checkRaiseBluff: 'As do naipe + OESD.'
  },
  {
    textureName: 'PAREADO ALTO SECO',
    sizing: '33%',
    cbetValue: 'Trincas, Full House.',
    cbetBluff: 'Qualquer "ar" puro (a equidade de fold com aposta baixa é alta), BDFD.',
    checkRaiseValue: 'Full House top, Quadras.',
    checkRaiseBluff: 'Muito raro, evite. Se necessário, use overcards com backdoor flush.'
  },
  {
    textureName: 'PAREADO ALTO DINAMICO',
    sizing: '50%',
    cbetValue: 'Trincas fortes, Full House.',
    cbetBluff: 'Flush Draws, OESD.',
    checkRaiseValue: 'Trincas protegidas, Full House.',
    checkRaiseBluff: 'Nut Flush Draw.'
  },
  {
    textureName: 'PAREADO MEDIO SECO',
    sizing: '33%',
    cbetValue: 'Overpairs (10s+), Trincas.',
    cbetBluff: 'Duas overcards, BDFD.',
    checkRaiseValue: 'Trincas, Full House.',
    checkRaiseBluff: 'BDFD forte com overcards.'
  },
  {
    textureName: 'PAREADO MEDIO DINAMICO',
    sizing: '50%',
    cbetValue: 'Overpairs fortes, Trincas.',
    cbetBluff: 'Flush Draws, Brocas conectadas.',
    checkRaiseValue: 'Trincas, Full House.',
    checkRaiseBluff: 'Flush Draw, OESD.'
  },
  {
    textureName: 'PAREADO BAIXO SECO',
    sizing: '33%',
    cbetValue: 'Overpairs médios a altos, Trincas.',
    cbetBluff: 'Brocas, BDFD.',
    checkRaiseValue: 'Trincas.',
    checkRaiseBluff: 'BDFD com duas overcards limpas.'
  },
  {
    textureName: 'PAREADO BAIXO DINAMICO',
    sizing: '50%',
    cbetValue: 'Overpairs, Trincas, Full House.',
    cbetBluff: 'Flush Draws, OESD.',
    checkRaiseValue: 'Trincas, Full House.',
    checkRaiseBluff: 'Nut Flush Draw.'
  }
];

// ============================================================================
// 3. MATRIZ DE AÇÕES & DEFESA PÓS-FLOP (FLOP, TURN E RIVER)
// ============================================================================

export const POSTFLOP_ACTION_DATABASE: PostFlopActionStrategy[] = [
  // --- FLOP ---
  {
    street: 'FLOP',
    situation: 'Defesa vs C-Bet Flop < 33%',
    position: 'IP',
    action: 'Call',
    handRange: 'Qualquer par e todos os Ases altos'
  },
  {
    street: 'FLOP',
    situation: 'Defesa vs C-Bet Flop < 33%',
    position: 'IP',
    action: 'Raise / 4.5x',
    handRange: 'Mãos fortes (2 pares+) e draws fortes (FD, OESD, Broca+2 overs)'
  },
  {
    street: 'FLOP',
    situation: 'Defesa vs C-Bet Flop < 33%',
    position: 'OOP',
    action: 'Call ou Raise',
    handRange: 'Ajuste cauteloso, fold Ases altos fracos (A8-)'
  },
  {
    street: 'FLOP',
    situation: 'Defesa vs C-Bet Flop 40% a 75%',
    position: 'IP',
    action: 'Call',
    handRange: 'Até 3º par em dinâmicas favoráveis e draws de broca média/boa'
  },
  {
    street: 'FLOP',
    situation: 'Defesa vs C-Bet Flop 40% a 75%',
    position: 'OOP',
    action: 'Fold',
    handRange: '3º par é fold claro, brocas secas no lixo'
  },
  {
    street: 'FLOP',
    situation: 'Defesa vs C-Bet Flop 80% a 150%',
    position: 'IP',
    action: 'Call',
    handRange: 'Limite passa a ser estritamente o 2º par'
  },
  {
    street: 'FLOP',
    situation: 'Defesa vs C-Bet Flop 80% a 150%',
    position: 'OOP',
    action: 'Call',
    handRange: 'Apenas melhores Top Pairs e OESD observando o range'
  },
  {
    street: 'FLOP',
    situation: 'Defesa vs C-Bet Flop 80% a 150%',
    position: 'IP e OOP',
    action: 'Raise',
    handRange: 'Apenas puro valor absoluto (Trincas, 2 pares, Sequências)'
  },
  {
    street: 'FLOP',
    situation: 'Stab Flop (Boards Secos/Dobrados)',
    position: 'IP',
    action: 'Bet / 33%',
    handRange: 'Top Pair+, 2º pares fortes, Air puro, 2 overcards, BDFD, brocas'
  },
  {
    street: 'FLOP',
    situation: 'Stab Flop (Boards Baixas/Médias Desconectadas)',
    position: 'IP',
    action: 'Bet / 50%',
    handRange: 'Overpairs, Top Pairs sólidos, 2 overs com BDFD, Gutshots e lixos'
  },
  {
    street: 'FLOP',
    situation: 'Stab Flop (Boards 2 Broadways/Conectados)',
    position: 'IP',
    action: 'Bet / 50%',
    handRange: 'Top Pair forte+, OESD, FD, Gutshots Premium. Evite Air puro'
  },
  {
    street: 'FLOP',
    situation: 'Stab Flop (Boards Ultra Conectados/Molhados)',
    position: 'IP',
    action: 'Check Behind / Bet 75%',
    handRange: 'Check range inteiro. Bet apenas topo (Sequências, Trincas, Flush)'
  },

  // --- TURN ---
  {
    street: 'TURN',
    situation: 'Stab Turn após Check-Behind Flop',
    position: 'OOP',
    action: 'Bet / 75%',
    handRange: 'Top Pair bom+, Dois Pares ou Trincas'
  },
  {
    street: 'TURN',
    situation: 'Stab Turn após Check-Behind Flop',
    position: 'OOP',
    action: 'Bet / 75%',
    handRange: 'Blefes puros, Draws que ganharam equidade ou Overcards'
  },
  {
    street: 'TURN',
    situation: 'Stab Turn após Check-Behind Flop',
    position: 'OOP',
    action: 'Check-Call ou Check-Fold',
    handRange: 'Mãos Médias / Showdown Value (Par Médio, Pares Baixos)'
  },
  {
    street: 'TURN',
    situation: 'Stab Turn após Duplo Check Flop e Turn',
    position: 'IP',
    action: 'Bet / 50%',
    handRange: 'Mãos Fortes / Valor Claro'
  },
  {
    street: 'TURN',
    situation: 'Stab Turn após Duplo Check Flop e Turn',
    position: 'IP',
    action: 'Bet / 50%',
    handRange: 'Blefes Puros e Ar Completo'
  },
  {
    street: 'TURN',
    situation: 'Stab Turn após Duplo Check Flop e Turn',
    position: 'IP',
    action: 'Bet 50% ou Check-Behind',
    handRange: 'Mãos Médias (2º Pares ou Kicker Fraco)'
  },
  {
    street: 'TURN',
    situation: 'Stab Turn após C-Bet Flop e Check Turn',
    position: 'IP',
    action: 'Bet / 50%',
    handRange: 'Top Pairs sólidos, Trincas, Dois Pares (Valor Fino/Proteção)'
  },
  {
    street: 'TURN',
    situation: 'Stab Turn após C-Bet Flop e Check Turn',
    position: 'IP',
    action: 'Bet / 75%',
    handRange: 'Draws fortes ou Overcards (Blefe Agressivo)'
  },
  {
    street: 'TURN',
    situation: 'Stab Turn após C-Bet Flop e Check Turn',
    position: 'IP',
    action: 'Check Behind',
    handRange: 'Mãos de Showdown Value Médio (2º par, 3º par forte, Top Pair fraco)'
  },
  {
    street: 'TURN',
    situation: 'C-Bet Turn 2º Barril (Overcard no Turn)',
    position: 'IP e OOP',
    action: 'Bet / 75%',
    handRange: 'Mãos fortes e 100% dos blefes puros e draws fracos'
  },
  {
    street: 'TURN',
    situation: 'C-Bet Turn 2º Barril (Turn Regular)',
    position: 'IP e OOP',
    action: 'Bet / 75%',
    handRange: 'Mãos Fortes e Draws de Alta Equidade (2 pontas, FD, Broca+2 overs)'
  },
  {
    street: 'TURN',
    situation: 'C-Bet Turn 2º Barril (Turn Regular)',
    position: 'IP e OOP',
    action: 'Check',
    handRange: 'Mãos Médias e Draws de Baixa Equidade / Ar'
  },
  {
    street: 'TURN',
    situation: 'Delayed C-Bet Turn',
    position: 'IP',
    action: 'Bet / 75%',
    handRange: 'Mãos Fortes (Top Pair forte+)'
  },
  {
    street: 'TURN',
    situation: 'Delayed C-Bet Turn',
    position: 'IP',
    action: 'Bet / 75%',
    handRange: 'Blefes Puros e Ar Completo'
  },
  {
    street: 'TURN',
    situation: 'Delayed C-Bet Turn',
    position: 'IP',
    action: 'Check Behind ou Bet 50%',
    handRange: 'Mãos Médias Originais (2º pares)'
  },
  {
    street: 'TURN',
    situation: 'Delayed C-Bet Turn',
    position: 'OOP',
    action: 'Bet / 75%',
    handRange: 'Mãos Fortes / Valor Absoluto e Ar se Turn for Overcard'
  },
  {
    street: 'TURN',
    situation: 'Delayed C-Bet Turn',
    position: 'OOP',
    action: 'Check',
    handRange: 'Mãos Médias (2º pares ou Top Pairs Marginais)'
  },
  {
    street: 'TURN',
    situation: 'Delayed C-Bet Turn',
    position: 'OOP',
    action: 'Check-Fold',
    handRange: 'Ar Completo se Turn for Blank'
  },
  {
    street: 'TURN',
    situation: 'Defesa vs C-Bet Turn 2º Barril 75%',
    position: 'IP',
    action: 'Call',
    handRange: '2º par ou melhor, brocas com pelo menos 1 overcard'
  },
  {
    street: 'TURN',
    situation: 'Defesa vs C-Bet Turn 2º Barril 75%',
    position: 'OOP',
    action: 'Call',
    handRange: 'Top Pair ou melhores, Flush Draws e Duas Pontas'
  },
  {
    street: 'TURN',
    situation: 'Defesa vs C-Bet Turn 2º Barril 75%',
    position: 'OOP',
    action: 'Fold',
    handRange: 'Mãos médias, 2º/3º pares, brocas simples ou médias'
  },

  // --- RIVER ---
  {
    street: 'RIVER',
    situation: 'Stab River (Pós Delayed C-Bet e Check River)',
    position: 'IP',
    action: 'Bet / 50%',
    handRange: 'Valor Fino (Top Pairs/2º pares fortes) e Ar Completo com blockers'
  },
  {
    street: 'RIVER',
    situation: 'Stab River (Pós Delayed C-Bet e Check River)',
    position: 'IP',
    action: 'Check Behind',
    handRange: 'Mãos de Showdown Value Médio/Fraco'
  },
  {
    street: 'RIVER',
    situation: 'Stab River (Pós 2-Barrel e Check River)',
    position: 'IP',
    action: 'Bet / 75%',
    handRange: 'Blefe Obrigatório (Ar Completo sem showdown value)'
  },
  {
    street: 'RIVER',
    situation: 'Stab River (Pós 2-Barrel e Check River)',
    position: 'IP',
    action: 'Bet / 50%',
    handRange: 'Valor Máximo/Extração (2 pares+)'
  },
  {
    street: 'RIVER',
    situation: 'Stab River (Pós 2-Barrel e Check River)',
    position: 'IP',
    action: 'Check Behind',
    handRange: 'Bluffcatchers Puros / Mãos Médias (2º pares)'
  },
  {
    street: 'RIVER',
    situation: 'Stab River (Pós C-bet Flop e Check Behind Turn)',
    position: 'OOP',
    action: 'Bet / 50%',
    handRange: 'Valor Fino (Top Pairs fracos, 2º/3º pares com bom kicker) e Blefe Agressivo (draws quebrados)'
  },
  {
    street: 'RIVER',
    situation: 'Stab River (Pós C-bet Flop e Check Behind Turn)',
    position: 'OOP',
    action: 'Check',
    handRange: 'Mãos de Showdown Value Médio sem kicker/pares muito baixos'
  },
  {
    street: 'RIVER',
    situation: 'C-Bet River 3º Barril',
    position: 'IP e OOP',
    action: 'Bet / 75% a Overbet',
    handRange: 'Trincas, Dois Pares, Sequências, Flushes e Top Pairs com Kicker forte'
  },
  {
    street: 'RIVER',
    situation: 'C-Bet River 3º Barril',
    position: 'IP e OOP',
    action: 'Check',
    handRange: '2º par, 3º par, Top Pairs fracos, ou Ar em boards blanks/contra calling stations'
  },
  {
    street: 'RIVER',
    situation: 'C-Bet River 3º Barril',
    position: 'IP e OOP',
    action: 'Bet / 75%',
    handRange: 'Blefes apenas em Scare Cards ou com Blockers relevantes'
  },
  {
    street: 'RIVER',
    situation: 'Check - Bet - Bet River Agressor (X-B-B)',
    position: 'IP',
    action: 'Bet / 75%',
    handRange: 'Valor Absoluto (Top Pairs+, Trincas, 2 Pares) e Blefe Polarizado (Ar)'
  },
  {
    street: 'RIVER',
    situation: 'Check - Bet - Bet River Agressor (X-B-B)',
    position: 'IP',
    action: 'Bet / 50%',
    handRange: 'Valor Fino (Top Pair marginal, 2º par forte em blank)'
  },
  {
    street: 'RIVER',
    situation: 'Check - Bet - Bet River Agressor (X-B-B)',
    position: 'IP',
    action: 'Check Behind',
    handRange: 'Mãos de Showdown Value Médio'
  },
  {
    street: 'RIVER',
    situation: 'Check - Bet - Bet River Agressor (X-B-B)',
    position: 'OOP',
    action: 'Bet / 75%',
    handRange: 'Valor Sólido (Dois Pares, Trincas, Sequências+)'
  },
  {
    street: 'RIVER',
    situation: 'Check - Bet - Bet River Agressor (X-B-B)',
    position: 'OOP',
    action: 'Bet / 75%',
    handRange: 'Blefe Cirúrgico (Ar em cartas de extremo impacto)'
  },
  {
    street: 'RIVER',
    situation: 'Check - Bet - Bet River Agressor (X-B-B)',
    position: 'OOP',
    action: 'Check (Fold/Call)',
    handRange: 'Mãos Médias / Showdown Value Marginal'
  },
  {
    street: 'RIVER',
    situation: 'Bet - Check - Bet River Agressor (B-X-B)',
    position: 'IP',
    action: 'Bet / 75%',
    handRange: 'Valor Absoluto e Blefe Polarizado (Ar completo)'
  },
  {
    street: 'RIVER',
    situation: 'Bet - Check - Bet River Agressor (B-X-B)',
    position: 'IP',
    action: 'Bet / 50%',
    handRange: 'Valor Fino (Top Pairs kickers médios/fracos, 2º pares fortes)'
  },
  {
    street: 'RIVER',
    situation: 'Bet - Check - Bet River Agressor (B-X-B)',
    position: 'IP',
    action: 'Check Behind',
    handRange: 'Mãos de Showdown Value Médio'
  },
  {
    street: 'RIVER',
    situation: 'Bet - Check - Bet River Agressor (B-X-B)',
    position: 'OOP',
    action: 'Bet / 75%',
    handRange: 'Valor Absoluto (Trincas, Dois Pares altos)'
  },
  {
    street: 'RIVER',
    situation: 'Bet - Check - Bet River Agressor (B-X-B)',
    position: 'OOP',
    action: 'Bet / 75%',
    handRange: 'Blefe Polarizado (Ar completo, Pressão Máxima)'
  },
  {
    street: 'RIVER',
    situation: 'Bet - Check - Bet River Agressor (B-X-B)',
    position: 'OOP',
    action: 'Check (Fold/Call seletivo)',
    handRange: 'Mãos Médias (2º pares, Top Pairs fracos, mãos marginais)'
  },
  {
    street: 'RIVER',
    situation: 'Defesa vs C-Bet River 3º Barril',
    position: 'IP e OOP',
    action: 'Call',
    handRange: 'Dois Pares fortes, Trincas, Sequências, Flushes'
  },
  {
    street: 'RIVER',
    situation: 'Defesa vs C-Bet River 3º Barril',
    position: 'IP',
    action: 'Call',
    handRange: 'Parte superior dos Top Pairs se board propício a draws perdidos'
  },
  {
    street: 'RIVER',
    situation: 'Defesa vs C-Bet River 3º Barril',
    position: 'IP e OOP',
    action: 'Fold',
    handRange: 'Bluffcatchers puros, Segundos/Terceiros pares, Top Pairs fracos/médios, Overpairs desvalorizados'
  },
  {
    street: 'RIVER',
    situation: 'Defesa vs Check - Bet - Bet River',
    position: 'IP',
    action: 'Call',
    handRange: 'Parte superior dos Top Pairs em boards de draws perdidos'
  },
  {
    street: 'RIVER',
    situation: 'Defesa vs Check - Bet - Bet River',
    position: 'OOP',
    action: 'Call',
    handRange: 'Top Pairs Fortes, Overpairs, Dois Pares+ e topo absoluto dos bluffcatchers'
  },
  {
    street: 'RIVER',
    situation: 'Defesa vs Check - Bet - Bet River',
    position: 'OOP',
    action: 'Fold',
    handRange: 'Pares Médios Marginais, Pares Baixos, 3º Pares, Draws Perdidos, Top Pairs Fracos'
  },
  {
    street: 'RIVER',
    situation: 'Defesa vs Bet - Check - Bet River',
    position: 'IP',
    action: 'Call',
    handRange: 'Parte superior dos segundos pares, Ace-High fortes em boards secos'
  },
  {
    street: 'RIVER',
    situation: 'Defesa vs Bet - Check - Bet River',
    position: 'OOP',
    action: 'Call',
    handRange: 'Restrito ao topo dos bluffcatchers (Top Pairs e melhores 2º pares)'
  },
  {
    street: 'RIVER',
    situation: 'Defesa vs Bet - Check - Bet River',
    position: 'OOP',
    action: 'Fold',
    handRange: 'Puro ar, 3º pares fracos, pares baixos e mãos marginais'
  }
];

// ============================================================================
// 4. MOTOR DE CLASSIFICAÇÃO AUTOMÁTICA DE TEXTURAS DE FLOP (GTO)
// ============================================================================

/**
 * Converte qualquer board de Flop (3 cartas) em uma das 28 texturas GTO oficiais.
 */
export function getGtoFlopTextureName(board: Card[]): string {
  if (!board || board.length < 3) return '3 BROADWAYS SEM FLUSH DRAW';

  const flopCards = board.slice(0, 3);

  const suitCounts: Record<string, number> = {};
  const rankCounts: Record<number, number> = {};

  flopCards.forEach((c) => {
    suitCounts[c.suit] = (suitCounts[c.suit] || 0) + 1;
    rankCounts[c.rank] = (rankCounts[c.rank] || 0) + 1;
  });

  const maxSuit = Math.max(...Object.values(suitCounts));
  const isPaired = Object.values(rankCounts).some((cnt) => cnt >= 2);
  const sortedRanks = flopCards.map((c) => c.rank).sort((a, b) => b - a);

  // Verificação de conexão aproximada das cartas
  const isConnected = sortedRanks[0] - sortedRanks[2] <= 4 && !isPaired;

  // --- 1. BOARDS PAREADOS ---
  if (isPaired) {
    let pairRank = sortedRanks[0];
    for (const r of sortedRanks) {
      if (rankCounts[r] >= 2) {
        pairRank = r;
        break;
      }
    }

    const isDynamic = maxSuit >= 2 || isConnected;
    const isAlto = pairRank >= 10;
    const isMedio = pairRank >= 6 && pairRank <= 9;

    if (isAlto) {
      return isDynamic ? 'PAREADO ALTO DINÂMICO' : 'PAREADO ALTO SECO';
    } else if (isMedio) {
      return isDynamic ? 'PAREADO MÉDIO DINÂMICO' : 'PAREADO MÉDIO SECO';
    } else {
      return isDynamic ? 'PAREADO BAIXO DINÂMICO' : 'PAREADO BAIXO SECO';
    }
  }

  // --- 2. BOARDS MONOTONE ---
  if (maxSuit >= 3) {
    return isConnected ? 'MONOTONE DINÂMICO' : 'MONOTONE SECO';
  }

  // --- 3. BOARDS NÃO PAREADOS E NÃO MONOTONE ---
  let broadways = 0;
  let medias = 0;
  let baixas = 0;

  flopCards.forEach((c) => {
    if (c.rank >= 10) broadways++;
    else if (c.rank >= 6) medias++;
    else baixas++;
  });

  const hasFlushDraw = maxSuit >= 2;
  const flushSuffix = hasFlushDraw ? ' + FLUSH DRAW' : ' SEM FLUSH DRAW';

  let baseName = '';
  if (broadways === 3) baseName = '3 BROADWAYS';
  else if (broadways === 2 && baixas === 1) baseName = '2 BROADWAYS + 1 BAIXA';
  else if (broadways === 2 && medias === 1) baseName = '2 BROADWAYS + 1 MÉDIA';
  else if (broadways === 1 && medias === 1 && baixas === 1) baseName = '1 BROADWAY + 1 MÉDIA + 1 BAIXA';
  else if (broadways === 1 && medias === 2) baseName = '1 BROADWAY + 2 MÉDIAS';
  else if (broadways === 1 && baixas === 2) baseName = '1 BROADWAY + 2 BAIXAS';
  else if (medias === 3) baseName = '3 MÉDIAS';
  else if (medias === 2 && baixas === 1) baseName = '2 MÉDIAS + 1 BAIXA';
  else if (medias === 1 && baixas === 2) baseName = '1 MÉDIA + 2 BAIXAS';
  else if (baixas === 3) baseName = '3 BAIXAS';

  return baseName + flushSuffix;
}

// ============================================================================
// 5. FUNÇÕES UTILITÁRIAS DE CONSULTA GTO
// ============================================================================

/**
 * Busca a estratégia IP para um determinado nome de textura.
 */
export function getFlopGtoStrategyIP(textureName: string): FlopTextureGtoStrategyIP | undefined {
  const targetKey = normalizeTextureName(textureName);
  return FLOP_CBET_IP_DATABASE.find((item) => normalizeTextureName(item.textureName) === targetKey);
}

/**
 * Busca a estratégia OOP para um determinado nome de textura.
 */
export function getFlopGtoStrategyOOP(textureName: string): FlopTextureGtoStrategyOOP | undefined {
  const targetKey = normalizeTextureName(textureName);
  return FLOP_CBET_OOP_DATABASE.find((item) => normalizeTextureName(item.textureName) === targetKey);
}

/**
 * Busca automaticamente a estratégia GTO do Flop a partir do array de cartas do board.
 */
export function getFlopGtoStrategy(
  board: Card[],
  position: 'IP' | 'OOP'
): FlopTextureGtoStrategyIP | FlopTextureGtoStrategyOOP | undefined {
  const textureName = getGtoFlopTextureName(board);
  return position === 'IP' ? getFlopGtoStrategyIP(textureName) : getFlopGtoStrategyOOP(textureName);
}

/**
 * Filtra as regras de ação/defesa para Turn, River ou Flop.
 */
export function getPostFlopActionStrategies(filter?: {
  street?: 'FLOP' | 'TURN' | 'RIVER';
  situation?: string;
  position?: 'IP' | 'OOP' | 'IP e OOP';
}): PostFlopActionStrategy[] {
  if (!filter) return POSTFLOP_ACTION_DATABASE;

  return POSTFLOP_ACTION_DATABASE.filter((item) => {
    if (filter.street && item.street !== filter.street) return false;
    if (filter.position && item.position !== filter.position && item.position !== 'IP e OOP') return false;
    if (filter.situation && !item.situation.toLowerCase().includes(filter.situation.toLowerCase())) return false;
    return true;
  });
}