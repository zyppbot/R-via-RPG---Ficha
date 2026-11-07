/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Origin {
  name: string;
  bonus: string;
  basePV?: number;
  basePM?: number;
  abilityName: string;
  abilityDescription: string;
  pvPerLevel: number;
  pmPerLevel: number;
  trainingPoints: number;
  attributeBonuses: {
    forca?: number;
    destreza?: number;
    vigor?: number;
    intelecto?: number;
    expressao?: number;
    carisma?: number;
    all?: number;
  };
}

export const ORIGINS: Origin[] = [
  {
    name: "Chian-Thei",
    bonus: "+2 Expressão, +1 Intelecto, +4 PV/Lvl, +5 PM/Lvl, 7 pts treinamento",
    abilityName: "Comunhão Espiritual",
    abilityDescription: "Pode entrar em transe meditativo para dialogar com falecidos (até 3 perguntas).",
    pvPerLevel: 4,
    pmPerLevel: 5,
    trainingPoints: 7,
    attributeBonuses: { expressao: 2, intelecto: 1 }
  },
  {
    name: "Zaha'ariano",
    bonus: "+2 Intelecto, +1 Carisma, +7 PV/Lvl, +5 PM/Lvl, 4 pts treinamento",
    abilityName: "Erudição",
    abilityDescription: "Traça mapa estelar para receber +2 em uma perícia até o próximo interlúdio.",
    pvPerLevel: 7,
    pmPerLevel: 5,
    trainingPoints: 4,
    attributeBonuses: { intelecto: 2, carisma: 1 }
  },
  {
    name: "Tahloriano",
    bonus: "+2 Carisma, +2 Expressão, +5 PV/Lvl, +4 PM/Lvl, 6 pts treinamento",
    abilityName: "Pena & Espada",
    abilityDescription: "Pode trocar o valor de uma perícia pelo seu valor em carisma até o próximo interlúdio.",
    pvPerLevel: 5,
    pmPerLevel: 4,
    trainingPoints: 6,
    attributeBonuses: { carisma: 2, expressao: 2 }
  },
  {
    name: "Draughoriano",
    bonus: "+3 Força, +2 Expressão, -1 Intelecto, -4 Carisma, +10 PV/Lvl, +5 PM/Lvl, 4 pts treinamento",
    abilityName: "Brutalidade Rúnica",
    abilityDescription: "Marca pele com runa; todo ataque recebe bônus de dano igual ao seu nível.",
    pvPerLevel: 10,
    pmPerLevel: 5,
    trainingPoints: 4,
    attributeBonuses: { forca: 3, expressao: 2, intelecto: -1, carisma: -4 }
  },
  {
    name: "Hekhayi",
    bonus: "+2 Destreza, +2 Expressão, +1 Carisma, +8 PV/Lvl, +5 PM/Lvl, 1 pt treinamento",
    abilityName: "Destino Totêmico",
    abilityDescription: "Recebe pontos de destino para re-rolar dados (2 + Nível/5).",
    pvPerLevel: 8,
    pmPerLevel: 5,
    trainingPoints: 1,
    attributeBonuses: { destreza: 2, expressao: 2, carisma: 1 }
  },
  {
    name: "Akaruná",
    bonus: "+1 em tudo, +3 PV/Lvl, +2 PM/Lvl, 7 pts treinamento",
    abilityName: "Transição Elemental",
    abilityDescription: "Pode trocar sua aptidão elemental através de ritual para o sol e a lua.",
    pvPerLevel: 3,
    pmPerLevel: 2,
    trainingPoints: 7,
    attributeBonuses: { all: 1 }
  },
  {
    name: "Valdoriano",
    bonus: "+3 Carisma, +1 Expressão, +9 PV/Lvl, +5 PM/Lvl, 1 pt treinamento",
    abilityName: "Código de Honra",
    abilityDescription: "Jura defesa a aliados; dano é repartido igualmente entre o Valdoriano e os aliados jurados.",
    pvPerLevel: 9,
    pmPerLevel: 5,
    trainingPoints: 1,
    attributeBonuses: { carisma: 3, expressao: 1 }
  }
];

export interface SupplementOrigin extends Origin {
  basePV?: number;
  basePM?: number;
}

export const FOUR_ELEMENTS_ORIGINS: SupplementOrigin[] = [
  { name: 'Soldado', bonus: '30 PV, 15 PC, 4 PT', abilityName: 'Calejamento', abilityDescription: 'Ao se preparar em um interlúdio, todo ataque recebe bônus de dano igual à metade da rolagem de dano, arredondada para cima.', pvPerLevel: 0, pmPerLevel: 0, trainingPoints: 4, basePV: 30, basePM: 15, attributeBonuses: {} },
  { name: 'Guru Espiritual', bonus: '18 PV, 15 PC, 7 PT', abilityName: 'Calma de Espírito', abilityDescription: 'Com uma ação de interlúdio, adicione 1 ponto ao caminho espiritual. Cada ponto aumenta em 1 o máximo de Chi.', pvPerLevel: 0, pmPerLevel: 0, trainingPoints: 7, basePV: 18, basePM: 15, attributeBonuses: {} },
  { name: 'Pesquisador', bonus: '24 PV, 15 PC, 4 PT', abilityName: 'Erudição', abilityDescription: 'Com uma ação de interlúdio, escolha uma perícia para receber +2 até o próximo interlúdio; recursos podem conceder o mesmo bônus a outras perícias.', pvPerLevel: 0, pmPerLevel: 0, trainingPoints: 4, basePV: 24, basePM: 15, attributeBonuses: {} },
  { name: 'Inventor', bonus: '20 PV, 13 PC, 6 PT', abilityName: 'Surto Criativo', abilityDescription: 'Recebe uma ação de interlúdio extra, usada exclusivamente para criar uma bugiganga.', pvPerLevel: 0, pmPerLevel: 0, trainingPoints: 6, basePV: 20, basePM: 13, attributeBonuses: {} },
  { name: 'Cidadão', bonus: '26 PV, 15 PC, 1 PT', abilityName: 'Raízes do Povo', abilityDescription: 'Gaste uma ação de interlúdio e 2 recursos, role 1d4 e faça esse número de perguntas ao narrador, que responderá honestamente.', pvPerLevel: 0, pmPerLevel: 0, trainingPoints: 1, basePV: 26, basePM: 15, attributeBonuses: {} },
  { name: 'Nômade', bonus: '16 PV, 9 PC, 7 PT', abilityName: 'Adaptar-se', abilityDescription: 'Gaste uma ação de interlúdio e 1 recurso para inverter os valores de PV e PC; ambos os totais recebem +1.', pvPerLevel: 0, pmPerLevel: 0, trainingPoints: 7, basePV: 16, basePM: 9, attributeBonuses: {} },
  { name: 'Herói', bonus: '28 PV, 15 PC, 1 PT', abilityName: 'Feito Heroico', abilityDescription: 'Gaste uma ação de interlúdio e 2 recursos para adquirir um talento temporário, atendendo aos requisitos; ele desaparece no próximo interlúdio.', pvPerLevel: 0, pmPerLevel: 0, trainingPoints: 1, basePV: 28, basePM: 15, attributeBonuses: {} },
];

export const INFAMES_ORIGINS: SupplementOrigin[] = [
  { name: 'Baixa-Fornalha', bonus: '+3 Destreza, +2 Intelecto, -2 Carisma; +6 PV/nível; +4 PE/nível; 7 PT', abilityName: 'Sombra da Fornalha', abilityDescription: 'Reação: ao falhar em Furtividade, gaste 1 PE para repetir o teste. Só uma vez por cena contra o mesmo observador.', pvPerLevel: 6, pmPerLevel: 4, trainingPoints: 7, attributeBonuses: { destreza: 3, intelecto: 2, carisma: -2 } },
  { name: 'Mercado Central', bonus: '+3 Carisma, +3 Expressão; +4 PV/nível; +4 PE/nível; 7 PT', abilityName: 'Rede de Contatos', abilityDescription: 'Ação de interlúdio: obtenha informação, favor ou desconto; teste Diplomacia ou Blefe com vantagem.', pvPerLevel: 4, pmPerLevel: 4, trainingPoints: 7, attributeBonuses: { carisma: 3, expressao: 3 } },
  { name: 'Alto Cristal', bonus: '+2 Intelecto, +2 Carisma, -2 Vigor; +6 PV/nível; +5 PE/nível; 6 PT', abilityName: 'Herança da Coroa de Vidro', abilityDescription: 'Recebe automaticamente 100 Rúbios ao final de cada nível conquistado.', pvPerLevel: 6, pmPerLevel: 5, trainingPoints: 6, attributeBonuses: { intelecto: 2, carisma: 2, vigor: -2 } },
  { name: 'Distrito dos Sinais', bonus: '+3 Intelecto, +2 Destreza, +1 Expressão; +6 PV/nível; +4 PE/nível; 5 PT', abilityName: 'Visão de Rede', abilityDescription: 'Com infraestrutura urbana relevante e aparelho conectado, tem vantagem em Investigação e Percepção.', pvPerLevel: 6, pmPerLevel: 4, trainingPoints: 5, attributeBonuses: { intelecto: 3, destreza: 2, expressao: 1 } },
  { name: 'Portos Baixos', bonus: '+3 Força, +2 Vigor; +7 PV/nível; +5 PE/nível; 4 PT', abilityName: 'Casco de Estaleiro', abilityDescription: 'Uma vez por rodada, ao sofrer dano que reduza PV, gaste uma reação e 1 PE para reduzir o dano pelo Vigor.', pvPerLevel: 7, pmPerLevel: 5, trainingPoints: 4, attributeBonuses: { forca: 3, vigor: 2 } },
  { name: 'Colina dos Arquivos', bonus: '+2 Intelecto, +2 Expressão, +1 Carisma; +5 PV/nível; +4 PE/nível; 7 PT', abilityName: 'Precedente Registrado', abilityDescription: 'Ação de interlúdio: escolha uma perícia para substituir seu valor pelo Intelecto até o próximo interlúdio.', pvPerLevel: 5, pmPerLevel: 4, trainingPoints: 7, attributeBonuses: { intelecto: 2, expressao: 2, carisma: 1 } },
  { name: 'Viela das Máscaras', bonus: '+3 Expressão, +2 Carisma; +5 PV/nível; +4 PE/nível; 7 PT', abilityName: 'Véu de Palco', abilityDescription: 'Uma vez por cena, gaste uma ação secundária e 4 PE para impor desvantagem nos testes de acerto de até 3 criaturas em alcance curto até o próximo turno.', pvPerLevel: 5, pmPerLevel: 4, trainingPoints: 7, attributeBonuses: { expressao: 3, carisma: 2 } },
];
