/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CharacterSheet } from './types';

export const INITIAL_CHARACTER: CharacterSheet = {
  id: '1',
  name: 'Novo Herói',
  title: 'Aventureiro Iniciante',
  level: 1,
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
  domains: {},
  elements: {},
  skillTraining: {},
  unlockedSkills: [],
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
