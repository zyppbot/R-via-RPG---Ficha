/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface CharacterAttributes {
  forca: number;
  destreza: number;
  vigor: number;
  intelecto: number;
  expressao: number;
  carisma: number;
}

export interface CharacterStats {
  pv: { current: number; max: number };
  pm: { current: number; max: number };
}

export interface Skill {
  name: string;
  bonus: number;
  isLocked?: boolean;
}

export interface Item {
  id: string;
  name: string;
  description: string;
  price?: number;
  icon?: string;
  type?: string;
}

export interface ClassAbility {
  name: string;
  description: string;
}

export interface CharacterSheet {
  id: string;
  name: string;
  title: string;
  level: number;
  attributes: CharacterAttributes;
  stats: CharacterStats;
  skills: Skill[];
  inventory: Item[];
  abilities: ClassAbility[];
  notes: string;
  origin?: string;
  specializations: { [name: string]: number };
  trainingPointsAdjustment: number;
  pvAdjustment: number;
  pmAdjustment: number;
  soulTestsUsed: number;
  soulTestsAdjustment: number;
  domains: { [name: string]: number };
  elements: { [name: string]: number };
  skillTraining: { [skillName: string]: number };
  unlockedSkills: string[];
  quickNote: {
    label: string;
    content: string;
  };
}
