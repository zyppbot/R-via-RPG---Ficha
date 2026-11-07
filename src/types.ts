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

export interface CharacterStatChange {
  id: string;
  key: 'pv' | 'pm';
  before: number;
  after: number;
  changedAt: string;
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
  category?: string;
}

export type CharacterSupplement =
  | 'modulo-basico'
  | 'quatro-elementos'
  | 'infames-condutores'
  | 'fading-humans'
  | 'ad-astra'
  | 'nave';

export interface ShipResource {
  current: number;
  max: number;
}

export interface ShipCrewMember {
  id: string;
  name: string;
  type: 'Jogador' | 'NPC';
  role: string;
}

export interface ShipSystem {
  id: string;
  name: string;
  role: string;
  description: string;
  energyCost: number;
}

export interface ShipModule {
  id: string;
  name: string;
  description: string;
}

export interface ShipInventoryItem {
  id: string;
  name: string;
  quantity: number;
}

export interface ShipData {
  captain: string;
  size: 'Pequena' | 'Média' | 'Grande' | 'Colossal';
  level: number;
  attributes: {
    structure: number;
    mobility: number;
    firepower: number;
    energyEfficiency: number;
    sensors: number;
    computing: number;
    stability: number;
  };
  availableAttributePoints: number;
  resources: {
    hull: ShipResource;
    shields: ShipResource;
    energy: ShipResource;
    fuel: ShipResource;
  };
  defense: number;
  activeDamage: string[];
  aiType: 'Assistente' | 'Tática' | 'Analítica' | 'Autônoma';
  aiLevel: number;
  crewMaximum: number;
  crewIdeal: number;
  crew: ShipCrewMember[];
  systemSlots: number;
  systems: ShipSystem[];
  moduleSlots: number;
  modules: ShipModule[];
  inventorySlots: number;
  inventory: ShipInventoryItem[];
  credits: number;
  resourcesCount: number;
}

export interface SupplementSubfold {
  id: string;
  name: string;
  rank: number;
}

export interface SupplementProtocol {
  id: string;
  name: string;
  description: string;
  actionType: string;
  energyCost: number;
  matrixPoints: number;
  snippets: string[];
}

export interface SupplementData {
  element?: 'Fogo' | 'Terra' | 'Água' | 'Ar' | 'Nenhum';
  elementRank?: number;
  subfolds?: SupplementSubfold[];
  conduction?: string;
  conductionTraits?: ClassAbility[];
  karmicRed?: number;
  karmicBlue?: number;
  masteries?: Record<string, number>;
  physicalFrame?: 'Robusto' | 'Padrão' | 'Mirrado';
  attributePoints?: number;
  characterPoints?: number;
  matrixChoice?: 'Portador' | 'Sem Matriz';
  matrixTheme?: string;
  protocols?: SupplementProtocol[];
  mainSlots?: number;
  secondarySlots?: number;
  mainLoadout?: string[];
  secondaryLoadout?: string[];
  snippets?: string[];
}

export interface CharacterSheet {
  id: string;
  folderId?: string;
  name: string;
  title: string;
  level: number;
  supplement?: CharacterSupplement;
  kind?: 'personagem' | 'nave';
  shipData?: ShipData;
  species?: string;
  specializationChoice?: string;
  offices?: string[];
  isCaptain?: boolean;
  supplementData?: SupplementData;
  attributes: CharacterAttributes;
  stats: CharacterStats;
  statChangeLog?: CharacterStatChange[];
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
  soulTestsState?: { [key: number]: boolean };
  soulTestStarActive?: boolean;
  domains: { [name: string]: number };
  elements: { [name: string]: number };
  skillTraining: { [skillName: string]: number };
  unlockedSkills: string[];
  defenseAdjustment: number;
  pvReduced?: boolean;
  pmReduced?: boolean;
  quickNote: {
    label: string;
    content: string;
  };
  createdAt?: string;
  updatedAt?: string;
}
