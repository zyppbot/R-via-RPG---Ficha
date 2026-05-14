/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Origin {
  name: string;
  bonus: string;
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
