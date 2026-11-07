/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CharacterSheet } from './types';

export const SUPPLEMENT_OPTIONS = [
  { value: 'modulo-basico', label: 'Personagem do Módulo Básico' },
  { value: 'quatro-elementos', label: 'Personagem do Suplemento 4 Elementos' },
  { value: 'infames-condutores', label: 'Personagem do Suplemento Infames Condutores' },
  { value: 'fading-humans', label: 'Personagem do Suplemento Fading Humans' },
  { value: 'ad-astra', label: 'Personagem do Suplemento Ad Astra' },
  { value: 'nave', label: 'Nave (Suplemento Ad Astra)' },
] as const;

export const FOUR_ELEMENTS_ORIGINS = [
  'Soldado', 'Guru Espiritual', 'Pesquisador', 'Inventor', 'Cidadão', 'Nômade', 'Herói',
];

export const INFAMES_ORIGINS = [
  'Baixa-Fornalha', 'Mercado Central', 'Alto Cristal', 'Distrito dos Sinais',
  'Portos Baixos', 'Colina dos Arquivos', 'Viela das Máscaras',
];

export const INFAMES_SPECIALIZATIONS = [
  'Lutador', 'Atirador', 'Infiltrador', 'Técnico', 'Médico', 'Negociador', 'Conduíte', 'Piloto',
];

export const AD_ASTRA_SPECIALIZATIONS = [
  'Lutador', 'Atirador', 'Infiltrador', 'Duelista', 'Baluarte', 'Rastreador',
  'Demolidor', 'Estrategista', 'Técnico', 'Ciborgue', 'Sintonizado',
];

export const AD_ASTRA_OFFICES = [
  'Piloto', 'Engenheiro de Bordo', 'Médico', 'Artilheiro', 'Navegador',
  'Operador de Sensores e Comunicações', 'Cientista', 'Diplomata', 'Intendente',
  'Especialista em Sistemas',
];

export const AD_ASTRA_SPECIES = [
  'Humanos', 'Oráculos', 'Arcanistas', 'Fractais', 'Florais', 'DemiDeuses',
  'Florescidos', 'Fadas', 'Dracomantes', 'Caçadores de Dragão', 'Draconianos',
  'Cromatídeos', 'Poetas', 'Mecânicos', 'Simbióticos', 'Paladinos', 'Lunari',
  'Solari', 'Ascendidos', 'Bonecas', 'Demônios Urbanos', "Ax'Saalam", 'Avian',
  'Eletro', 'Guelreans', 'Pulsar', 'Umbral', 'Slime', 'Corai',
];

export const INITIAL_CHARACTER: CharacterSheet = {
  id: '1',
  name: 'Novo Herói',
  title: 'Aventureiro Iniciante',
  level: 1,
  supplement: 'modulo-basico',
  kind: 'personagem',
  attributes: {
    forca: 0,
    destreza: 0,
    vigor: 0,
    intelecto: 0,
    expressao: 0,
    carisma: 0,
  },
  stats: {
    pv: { current: 100, max: 100 },
    pm: { current: 100, max: 100 },
  },
  skills: [], // Calculated dynamically in App
  inventory: [],
  abilities: [],
  notes: '',
  origin: '',
  specializations: {},
  trainingPointsAdjustment: 0,
  pvAdjustment: 0,
  pmAdjustment: 0,
  soulTestsUsed: 0,
  soulTestsAdjustment: 0,
  soulTestsState: {},
  soulTestStarActive: false,
  domains: {},
  elements: {},
  skillTraining: {},
  unlockedSkills: [],
  defenseAdjustment: 0,
  pvReduced: false,
  pmReduced: false,
  quickNote: {
    label: 'Anotação Rápida',
    content: 'Prosperidade de Rúvia',
  },
};

export const SPECIALIZATIONS_LIST = [
  'Lutador', 'Cozinheiro', 'Músico', 'Joalheiro', 'Dançarino', 
  'Artesão', 'Pintor', 'Alfaiate', 'Yogi', 'Escritor', 'Ferreiro'
];

export const DOMAINS_LIST = ['Invocação', 'Manipulação', 'Emanação', 'Transformação'];

export const ELEMENTS_LIST = [
  'Fogo', 'Água', 'Ar', 'Terra', 'Gelo', 'Metal', 
  'Eletricidade', 'Madeira', 'Luz', 'Trevas', 'Vida', 'Morte', 'Espírito'
];
