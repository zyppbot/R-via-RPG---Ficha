/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sword, 
  Shield, 
  Scroll, 
  BookOpen, 
  Plus, 
  Save, 
  Trash2, 
  ChevronRight,
  Sun,
  Moon,
  Wind,
  Flame,
  Brain,
  Eye,
  Heart,
  Users,
  UserPlus,
  ArrowLeft,
  Sparkles,
  Zap,
  Lock,
  Unlock,
  Coins,
  Package,
  Download,
  Upload,
  User,
  HeartOff,
  ZapOff,
  Star,
  Rocket,
  Folder,
  FolderPlus,
  X
} from 'lucide-react';
import ShipSheetEditor, { createShipData } from './ShipSheetEditor';
import SupplementPanels from './SupplementPanels';
import { 
  CharacterSheet, 
  Item, 
  Skill, 
  ClassAbility, 
  CharacterAttributes,
  CharacterSupplement,
  SupplementData
} from './types';
import { 
  INITIAL_CHARACTER, 
  SPECIALIZATIONS_LIST, 
  DOMAINS_LIST, 
  ELEMENTS_LIST,
  SUPPLEMENT_OPTIONS,
  FOUR_ELEMENTS_ORIGINS,
  INFAMES_ORIGINS,
  INFAMES_SPECIALIZATIONS,
  AD_ASTRA_SPECIALIZATIONS,
  AD_ASTRA_OFFICES,
  AD_ASTRA_SPECIES
} from './constants';
import { ORIGINS, FOUR_ELEMENTS_ORIGINS as FOUR_ELEMENT_ORIGIN_DATA, INFAMES_ORIGINS as INFAMES_ORIGIN_DATA } from './originData';

interface CharacterFolder {
  id: string;
  name: string;
}

type CharacterLevel = number | 'none';

function getCharacterLevel(character: CharacterSheet): CharacterLevel {
  if (character.supplement === 'quatro-elementos' || character.supplement === 'fading-humans') return 'none';
  if (character.kind === 'nave') return character.shipData?.level || 1;
  if (character.supplement === 'ad-astra') return Math.max(1, Math.min(20, character.level || 1));
  return Math.max(1, Object.values(character.specializations || {}).reduce((sum, level) => sum + (level || 0), 0));
}

const SUPPLEMENT_THEMES = {
  'modulo-basico': {
    accent: 'text-ruvia-accent',
    accentSoft: 'text-ruvia-accent/70',
    button: 'bg-ruvia-accent text-ruvia-bg',
    badge: 'bg-ruvia-accent/10 border-ruvia-accent/20 text-ruvia-accent',
    panel: 'bg-ruvia-panel',
    card: 'bg-ruvia-card border-ruvia-border',
  },
  'quatro-elementos': {
    accent: 'text-[#8f6b45]',
    accentSoft: 'text-[#8f6b45]/70',
    button: 'bg-[#8f6b45] text-[#f6ecd8]',
    badge: 'bg-[#f3e4b7]/20 border-[#8f6b45]/40 text-[#6b4b2d]',
    panel: 'bg-[#f3e7c9]',
    card: 'bg-[#f4e6bf] border-[#8f6b45]',
  },
  'infames-condutores': {
    accent: 'text-[#f5f5f5]',
    accentSoft: 'text-[#d1d5db]',
    button: 'bg-[#111827] text-[#f3f4f6]',
    badge: 'bg-[#111827]/70 border-[#374151] text-[#f3f4f6]',
    panel: 'bg-[#0f172a]',
    card: 'bg-[#111827] border-[#374151]',
  },
  'fading-humans': {
    accent: 'text-[#f9a8d4]',
    accentSoft: 'text-[#fbcfe8]',
    button: 'bg-[#7f1d1d] text-[#fff1f2]',
    badge: 'bg-[#7f1d1d]/20 border-[#f9a8d4]/40 text-[#f9a8d4]',
    panel: 'bg-[#1f0d12]',
    card: 'bg-[#2a1017] border-[#7f1d1d]',
  },
  'ad-astra': {
    accent: 'text-[#7dd3fc]',
    accentSoft: 'text-[#bae6fd]',
    button: 'bg-[#082f49] text-[#e0f2fe]',
    badge: 'bg-[#082f49]/60 border-[#7dd3fc]/30 text-[#7dd3fc]',
    panel: 'bg-[#020b17]',
    card: 'bg-[#0b1323] border-[#082f49]',
  },
  nave: {
    accent: 'text-[#7dd3fc]',
    accentSoft: 'text-[#bae6fd]',
    button: 'bg-[#082f49] text-[#e0f2fe]',
    badge: 'bg-[#082f49]/60 border-[#7dd3fc]/30 text-[#7dd3fc]',
    panel: 'bg-[#020b17]',
    card: 'bg-[#0b1323] border-[#082f49]',
  },
} as const;

const SUPPLEMENT_CARD_LABELS: Record<CharacterSupplement, string> = {
  'modulo-basico': 'Ficha do Módulo Básico',
  'quatro-elementos': 'Ficha dos 4 Elementos',
  'infames-condutores': 'Ficha de Infames Condutores',
  'fading-humans': 'Ficha de Fading Humans',
  'ad-astra': 'Ficha de Ad Astra',
  nave: 'Ficha de Nave • Ad Astra',
};

export default function App() {
  const [loading, setLoading] = useState(true);
  const [characters, setCharacters] = useState<CharacterSheet[]>([]);
  const [folders, setFolders] = useState<CharacterFolder[]>([]);
  const [activeFolderFilter, setActiveFolderFilter] = useState('all');
  const [newFolderName, setNewFolderName] = useState('');
  const [activeId, setActiveId] = useState<string | null>(null);
  const [view, setView] = useState<'list' | 'sheet'>('list');
  const [newCharacterMenuOpen, setNewCharacterMenuOpen] = useState(false);
  const [pendingImport, setPendingImport] = useState<CharacterSheet[] | null>(null);
  const [shareNotice, setShareNotice] = useState(false);
  const [selectedSupplements, setSelectedSupplements] = useState<CharacterSupplement[]>([]);
  const [selectedLevels, setSelectedLevels] = useState<CharacterLevel[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load private sheets and folders from this browser.
  useEffect(() => {
    const saved = localStorage.getItem('ruvia_characters');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as CharacterSheet[];
        setCharacters(parsed.map(char => ({
          ...INITIAL_CHARACTER,
          ...char,
          stats: {
            ...INITIAL_CHARACTER.stats,
            ...(char.stats || {})
          },
          attributes: {
            ...INITIAL_CHARACTER.attributes,
            ...(char.attributes || {})
          }
        })));
      } catch (e) {
        console.error("Erro ao carregar do local storage", e);
        setCharacters([]);
      }
    }
    const savedFolders = localStorage.getItem('ruvia_folders');
    if (savedFolders) {
      try {
        setFolders(JSON.parse(savedFolders) as CharacterFolder[]);
      } catch (error) {
        console.error('Erro ao carregar pastas locais', error);
        setFolders([]);
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!loading) {
      localStorage.setItem('ruvia_characters', JSON.stringify(characters));
    }
  }, [characters, loading]);

  useEffect(() => {
    if (!loading) {
      localStorage.setItem('ruvia_folders', JSON.stringify(folders));
    }
  }, [folders, loading]);

  const activeCharacter = useMemo(() => {
    return characters.find(c => c.id === activeId) || characters[0] || INITIAL_CHARACTER;
  }, [characters, activeId]);

  const activeSupplementTheme = SUPPLEMENT_THEMES[(activeCharacter?.supplement || 'modulo-basico') as keyof typeof SUPPLEMENT_THEMES];
  const isNoLevelSupplement = activeCharacter.supplement === 'quatro-elementos' || activeCharacter.supplement === 'fading-humans';
  const isAdAstra = activeCharacter.supplement === 'ad-astra';
  const isFadingHumans = activeCharacter.supplement === 'fading-humans';
  const characterOriginOptions = activeCharacter.supplement === 'quatro-elementos'
    ? FOUR_ELEMENTS_ORIGINS
    : activeCharacter.supplement === 'infames-condutores'
      ? INFAMES_ORIGINS
      : ORIGINS.map(origin => origin.name);
  const characterSpecializations = activeCharacter.supplement === 'infames-condutores'
    ? INFAMES_SPECIALIZATIONS
    : SPECIALIZATIONS_LIST;
  const activeOriginDetails = activeCharacter.supplement === 'quatro-elementos'
    ? FOUR_ELEMENT_ORIGIN_DATA.find(origin => origin.name === activeCharacter.origin)
    : activeCharacter.supplement === 'infames-condutores'
      ? INFAMES_ORIGIN_DATA.find(origin => origin.name === activeCharacter.origin)
      : ORIGINS.find(origin => origin.name === activeCharacter.origin);

  const totalLevel = useMemo(() => {
    if (activeCharacter.supplement === 'quatro-elementos' || activeCharacter.supplement === 'fading-humans') return 1;
    if (activeCharacter.supplement === 'ad-astra') {
      return Math.max(1, Math.min(20, activeCharacter.level || 1));
    }
    if (!activeCharacter || !activeCharacter.specializations) return 1;
    const sum = (Object.values(activeCharacter.specializations) as number[]).reduce((a, b) => a + (b || 0), 0);
    return sum || 1;
  }, [activeCharacter.supplement, activeCharacter.level, activeCharacter.specializations]);

  const updateCharacter = (updates: Partial<CharacterSheet>) => {
    if (!activeCharacter || activeCharacter === INITIAL_CHARACTER) return;

    setCharacters(prev => prev.map(c => 
      c.id === activeCharacter.id 
        ? { ...c, ...updates, updatedAt: new Date().toISOString() } 
        : c
    ));
  };

  const exportCharacters = (list: CharacterSheet[] = characters) => {
    const backupCharacters = list.map(({ folderId: _folderId, ...character }) => character);
    const dataStr = JSON.stringify(backupCharacters, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const safeCharacterName = (list[0]?.name || 'backup').toLowerCase().replace(/[^a-z0-9_-]+/g, '_').replace(/^_+|_+$/g, '') || 'backup';
    const exportFileDefaultName = list.length === 1
      ? `ruvia_personagem_${safeCharacterName}.json`
      : 'ruvia_personagens_backup.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const exportCurrentCharacter = () => {
    if (!activeCharacter || activeCharacter === INITIAL_CHARACTER) return;
    exportCharacters([activeCharacter]);
  };

  const normalizeImportedCharacters = (input: unknown): CharacterSheet[] => {
    const candidateBundle = typeof input === 'object' && input !== null && 'characters' in input
      ? (input as { characters?: unknown[] }).characters
      : input;
    const maybeArray = Array.isArray(candidateBundle) ? candidateBundle : [candidateBundle];
    const results: CharacterSheet[] = [];
    for (const item of maybeArray) {
      if (!item || typeof item !== 'object') continue;
      const candidate = item as Partial<CharacterSheet>;
      const defaultShipData = createShipData();
      const importedShipData = candidate.shipData;
      const normalized: CharacterSheet = {
        ...INITIAL_CHARACTER,
        ...candidate,
        id: candidate.id || Math.random().toString(36).slice(2, 10),
        name: candidate.name || 'Novo Herói',
        title: candidate.title || 'Aventureiro Iniciante',
        attributes: { ...INITIAL_CHARACTER.attributes, ...(candidate.attributes || {}) },
        stats: {
          pv: { ...INITIAL_CHARACTER.stats.pv, ...(candidate.stats?.pv || {}) },
          pm: { ...INITIAL_CHARACTER.stats.pm, ...(candidate.stats?.pm || {}) },
        },
        specializations: { ...(candidate.specializations || {}) },
        skillTraining: { ...(candidate.skillTraining || {}) },
        unlockedSkills: candidate.unlockedSkills || [],
        inventory: candidate.inventory || [],
        abilities: candidate.abilities || [],
        quickNote: { ...INITIAL_CHARACTER.quickNote, ...(candidate.quickNote || {}) },
        supplement: candidate.supplement || 'modulo-basico',
        kind: candidate.kind || 'personagem',
        shipData: candidate.kind === 'nave'
          ? {
              ...defaultShipData,
              ...(importedShipData || {}),
              attributes: { ...defaultShipData.attributes, ...(importedShipData?.attributes || {}) },
              resources: {
                hull: { ...defaultShipData.resources.hull, ...(importedShipData?.resources?.hull || {}) },
                shields: { ...defaultShipData.resources.shields, ...(importedShipData?.resources?.shields || {}) },
                energy: { ...defaultShipData.resources.energy, ...(importedShipData?.resources?.energy || {}) },
                fuel: { ...defaultShipData.resources.fuel, ...(importedShipData?.resources?.fuel || {}) },
              },
              activeDamage: importedShipData?.activeDamage || [],
              crew: importedShipData?.crew || [],
              systems: importedShipData?.systems || [],
              modules: importedShipData?.modules || [],
              inventory: importedShipData?.inventory || [],
            }
          : candidate.shipData,
      };
      results.push(normalized);
    }
    return results;
  };

  const importCharacters = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        const imported = normalizeImportedCharacters(parsed);
        if (imported.length === 0) {
          alert('Arquivo carregado sem fichas válidas.');
          return;
        }

        setPendingImport(imported);
      } catch (err) {
        alert('Erro ao importar arquivo. Verifique se o formato está correto.');
        console.error(err);
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const updateAttr = (key: keyof CharacterAttributes, val: number) => {
    let boundedValue = activeCharacter.supplement === 'ad-astra'
      ? Math.max(0, Math.min(val, totalLevel + 3))
      : Math.max(0, val);
    const updates: Partial<CharacterSheet> = {};
    if (activeCharacter.supplement === 'fading-humans') {
      const currentValue = activeCharacter.attributes[key];
      const available = activeCharacter.supplementData?.attributePoints ?? 8;
      const delta = boundedValue - currentValue;
      if (delta > available) boundedValue = currentValue + available;
      updates.supplementData = {
        ...(activeCharacter.supplementData || {}),
        attributePoints: Math.min(8, Math.max(0, available - (boundedValue - currentValue))),
      };
    }
    updateCharacter({
      ...updates,
      attributes: { ...activeCharacter.attributes, [key]: boundedValue },
    });
  };

  const updateSkillTraining = (skillName: string, val: number) => {
    const maxAllowed = activeCharacter.supplement === 'ad-astra' ? totalLevel + 1 : activeCharacter.supplement === 'fading-humans' ? 12 : totalLevel + 2;
    const clampedVal = Math.max(0, Math.min(val, maxAllowed));
    updateCharacter({
      skillTraining: { ...activeCharacter.skillTraining, [skillName]: clampedVal }
    });
  };

  // Clamos and caps existing skill training points: max = totalLevel + 2
  useEffect(() => {
    if (!activeCharacter || !activeCharacter.skillTraining || !activeCharacter.id) return;
    const maxAllowed = activeCharacter.supplement === 'ad-astra' ? totalLevel + 1 : activeCharacter.supplement === 'fading-humans' ? 12 : totalLevel + 2;
    let modified = false;
    const updatedTraining = { ...activeCharacter.skillTraining };
    
    Object.keys(updatedTraining).forEach((skillName) => {
      const val = updatedTraining[skillName] || 0;
      if (val > maxAllowed) {
        updatedTraining[skillName] = maxAllowed;
        modified = true;
      } else if (val < 0) {
        updatedTraining[skillName] = 0;
        modified = true;
      }
    });

    if (modified) {
      updateCharacter({ skillTraining: updatedTraining });
    }
  }, [activeCharacter?.id, activeCharacter?.skillTraining, activeCharacter?.supplement, totalLevel]);

  useEffect(() => {
    if (activeCharacter.supplement !== 'ad-astra' || !activeCharacter.attributes) return;
    const cap = totalLevel + 3;
    const corrected = { ...activeCharacter.attributes };
    let modified = false;
    (Object.keys(corrected) as (keyof CharacterAttributes)[]).forEach(key => {
      if (corrected[key] > cap) {
        corrected[key] = cap;
        modified = true;
      }
    });
    if (modified) updateCharacter({ attributes: corrected });
  }, [activeCharacter.id, activeCharacter.supplement, activeCharacter.attributes, totalLevel]);

  const updateStatMax = (key: 'pv' | 'pm', newMax: number) => {
    const stat = activeCharacter.stats[key];
    const oldMax = stat.max;
    // Scaled proportionately: current = (current / oldMax) * newMax
    const newCurrent = oldMax > 0 ? Math.round((stat.current / oldMax) * newMax) : newMax;
    
    updateCharacter({
      stats: {
        ...activeCharacter.stats,
        [key]: { current: newCurrent, max: newMax }
      }
    });
  };

  const updateStatCurrent = (key: 'pv' | 'pm', val: number) => {
    const change = activeCharacter.supplement === 'infames-condutores'
      ? {
          id: Math.random().toString(36).slice(2, 10),
          key,
          before: activeCharacter.stats[key].current,
          after: val,
          changedAt: new Date().toISOString(),
        }
      : undefined;
    updateCharacter({
      ...(change ? { statChangeLog: [...(activeCharacter.statChangeLog || []), change].slice(-20) } : {}),
      stats: {
        ...activeCharacter.stats,
        [key]: { ...activeCharacter.stats[key], current: val }
      }
    });
  };

  const undoStatChange = (changeId: string) => {
    const changes = activeCharacter.statChangeLog || [];
    const change = changes.find(entry => entry.id === changeId);
    if (!change) return;
    updateCharacter({
      stats: { ...activeCharacter.stats, [change.key]: { ...activeCharacter.stats[change.key], current: change.before } },
      statChangeLog: changes.filter(entry => entry.id !== changeId),
    });
  };

  const effectiveAttributes = useMemo(() => {
    if (!activeCharacter || !activeCharacter.attributes) return INITIAL_CHARACTER.attributes;
    const origin = activeOriginDetails;
    const bonuses = origin?.attributeBonuses || {};
    const frame = activeCharacter.supplementData?.physicalFrame;
    const frameBonuses = frame === 'Robusto'
      ? { forca: 1, vigor: 1 }
      : frame === 'Mirrado'
        ? { destreza: 2 }
        : {};
    
    return {
      forca: (activeCharacter.attributes.forca || 0) + (bonuses.forca || 0) + (bonuses.all || 0) + (frameBonuses.forca || 0),
      destreza: (activeCharacter.attributes.destreza || 0) + (bonuses.destreza || 0) + (bonuses.all || 0) + (frameBonuses.destreza || 0),
      vigor: (activeCharacter.attributes.vigor || 0) + (bonuses.vigor || 0) + (bonuses.all || 0) + (frameBonuses.vigor || 0),
      intelecto: (activeCharacter.attributes.intelecto || 0) + (bonuses.intelecto || 0) + (bonuses.all || 0),
      expressao: (activeCharacter.attributes.expressao || 0) + (bonuses.expressao || 0) + (bonuses.all || 0),
      carisma: (activeCharacter.attributes.carisma || 0) + (bonuses.carisma || 0) + (bonuses.all || 0),
    };
  }, [activeCharacter.attributes, activeOriginDetails, activeCharacter.supplementData?.physicalFrame]);

  const calculateSkills = (attrs: CharacterAttributes, lvl: number, training: { [name: string]: number }, supplement?: CharacterSupplement): Skill[] => {
    const { forca: F, destreza: D, vigor: V, intelecto: I, expressao: E, carisma: C } = attrs;
    const floor = Math.floor;

    const basicSkills: Skill[] = [
      { name: 'Acrobacia', bonus: floor((2 * D + F) / 3) },
      { name: 'Adestramento', bonus: floor((I + C + D) / 3) },
      { name: 'Arcanismo', bonus: floor((2 * E + I) / 3) },
      { name: 'Atletismo', bonus: floor((2 * F + D) / 3) },
      { name: 'Atuação', bonus: floor((3 * C + I) / 4) },
      { name: 'Blefe', bonus: floor((I + C) / 2) },
      { name: 'Cavalgar', bonus: floor((3 * D + I) / 4) },
      { name: 'Conhecimento', bonus: floor((3 * I + 2 * E + C) / 6) },
      { name: 'Cultura', bonus: floor((3 * E + 2 * C + I) / 6) },
      { name: 'Cura', bonus: floor((2 * I + D) / 3) },
      { name: 'Diplomacia', bonus: floor((C + I) / 2) },
      { name: 'Enganação', bonus: floor((2 * C + I) / 3) },
      { name: 'Exploração', bonus: floor((I + D + E) / 3) },
      { name: 'Fortitude', bonus: floor((5 * V + F) / 6) },
      { name: 'Furtividade', bonus: floor((3 * D + I) / 4) },
      { name: 'Tática', bonus: floor((I + 1) / 2) },
      { name: 'História', bonus: floor((5 * I + E) / 6) },
      { name: 'Iniciativa', bonus: D },
      { name: 'Intimidação', bonus: floor((2 * C + 2 * F + V) / 5) },
      { name: 'Investigação', bonus: I },
      { name: 'Intuição', bonus: floor((2 * E + I) / 3) },
      { name: 'Jogatina', bonus: floor((2 * D + 2 * I + E) / 5) },
      { name: 'Ladinagem', bonus: floor((3 * D + I + E) / 5) },
      { name: 'Manha', bonus: floor((2 * I + 2 * E + C) / 5) },
      { name: 'Natureza', bonus: floor((3 * I + E + C) / 5) },
      { name: 'Nobreza', bonus: floor((4 * C + 2 * I + E) / 7) },
      { name: 'Percepção', bonus: floor((5 * I + D) / 6) },
      { name: 'Pontaria', bonus: floor((5 * D + I) / 6) },
      { name: 'Reflexos', bonus: floor((2 * D + I) / 3) },
      { name: 'Religião', bonus: floor((I + E) / 2) },
      { name: 'Sobrevivência', bonus: floor((4 * V + F + E) / 6) },
      { name: 'Vontade', bonus: floor((3 * E + 2 * I + V) / 6) },
    ].map(s => ({ ...s, bonus: s.bonus + (training[s.name] || 0) }));

    const lockedSkills: Skill[] = [
      { name: 'Luta', bonus: floor((F + D) / 2 + 2 + (lvl / 5)), isLocked: true },
      { name: 'Culinária', bonus: floor((2 * D + E) / 3 + 2 + (lvl / 5)), isLocked: true },
      { name: 'Composição', bonus: floor((D + E + I) / 3 + 2 + (lvl / 5)), isLocked: true },
      { name: 'Joalheria', bonus: floor((2 * I + E + D) / 4 + 2 + (lvl / 5)), isLocked: true },
      { name: 'Dança', bonus: floor((3 * D + V) / 4 + 2 + (lvl / 5)), isLocked: true },
      { name: 'Artesanato', bonus: floor((I + E + D) / 3 + 2 + (lvl / 5)), isLocked: true },
      { name: 'Pintura', bonus: floor((3 * E + 2 * D + C) / 6 + 2 + (lvl / 5)), isLocked: true },
      { name: 'Costura', bonus: floor((2 * D + E + C) / 4 + 2 + (lvl / 5)), isLocked: true },
      { name: 'Prestidigitação', bonus: floor((3 * D + 2 * I) / 5 + 2 + (lvl / 5)), isLocked: true },
      { name: 'Escrita', bonus: floor((4 * E + 2 * C) / 6 + 2 + (lvl / 5)), isLocked: true },
      { name: 'Forja', bonus: floor((3 * F + D + I) / 5 + 2 + (lvl / 5)), isLocked: true },
    ].map(s => ({ ...s, bonus: s.bonus + (training[s.name] || 0) }));

    let skills = [...basicSkills, ...lockedSkills];

    if (supplement === 'quatro-elementos' || supplement === 'fading-humans') {
      skills = skills.filter(skill => !skill.isLocked || skill.name === 'Luta')
        .map(skill => skill.name === 'Luta' ? { ...skill, isLocked: undefined } : skill);
    } else if (supplement === 'infames-condutores') {
      skills = skills.filter(skill => !skill.isLocked || skill.name === 'Luta' || skill.name === 'Prestidigitação')
        .map(skill => {
          if (skill.name === 'Luta' || skill.name === 'Prestidigitação') return { ...skill, isLocked: undefined };
          if (skill.name === 'Cavalgar') return {
            ...skill,
            name: 'Pilotagem',
            bonus: floor((3 * D + 2 * I + E) / 6) + (training.Pilotagem || 0),
          };
          return skill;
        });
    } else if (supplement === 'ad-astra') {
      const removedArtSkills = new Set(['Culinária', 'Composição', 'Joalheria', 'Dança', 'Artesanato', 'Pintura', 'Costura', 'Escrita', 'Forja']);
      skills = skills.filter(skill => !removedArtSkills.has(skill.name))
        .map(skill => {
          if (skill.name === 'Arcanismo') return { ...skill, name: 'Sintonia', bonus: floor(((4 * E) + (3 * V) + (3 * I) + (2 * C)) / 12) + (training.Sintonia || 0) };
          if (skill.name === 'Cavalgar') return { ...skill, name: 'Pilotagem', bonus: floor((3 * D + 2 * I + E) / 6) + (training.Pilotagem || 0) };
          if (skill.name === 'Nobreza') return { ...skill, name: 'Política' };
          if (skill.name === 'Religião') return { ...skill, name: 'Teologia' };
          if (skill.name === 'Luta') return { ...skill, isLocked: undefined, bonus: floor((3 * F + 2 * D + I + E) / 7) - 2 + (training.Luta || 0) };
          if (skill.name === 'Prestidigitação') return { ...skill, isLocked: undefined, bonus: floor((4 * D + I + E) / 6) - 2 + (training.Prestidigitação || 0) };
          return skill;
        });
      skills.push(
        { name: 'Engenharia', bonus: floor((4 * I + 2 * D) / 6) + (training.Engenharia || 0) },
        { name: 'Computação', bonus: floor((4 * I + D + E) / 6) + (training.Computação || 0) },
        { name: 'Xenologia', bonus: floor((3 * E + 2 * I + C) / 6) + (training.Xenologia || 0) },
        { name: 'Navegação', bonus: floor((3 * I + 2 * E + D) / 6) + (training.Navegação || 0) },
      );
    }

    return skills;
  };

  const currentSkills = useMemo(() => {
    const skills = calculateSkills(effectiveAttributes, totalLevel, activeCharacter.skillTraining, activeCharacter.supplement);
    if (activeCharacter.supplement === 'fading-humans' && activeCharacter.supplementData?.physicalFrame === 'Mirrado') {
      return skills.map(skill => ['Acrobacia', 'Furtividade', 'Iniciativa'].includes(skill.name) ? { ...skill, bonus: skill.bonus + 1 } : skill);
    }
    return skills;
  }, [effectiveAttributes, totalLevel, activeCharacter.skillTraining, activeCharacter.supplement, activeCharacter.supplementData?.physicalFrame]);

  const statsWithOrigin = useMemo(() => {
    if (!activeCharacter || !activeCharacter.stats) return INITIAL_CHARACTER.stats;
    const origin = activeOriginDetails;
    const pvPerLvl = origin?.pvPerLevel || 0;
    const pmPerLvl = origin?.pmPerLevel || 0;
    
    const fortitude = currentSkills.find(s => s.name === 'Fortitude')?.bonus || 0;
    const arcanismo = currentSkills.find(s => s.name === (isAdAstra ? 'Sintonia' : 'Arcanismo'))?.bonus || 0;

    let maxPV = 10 + (pvPerLvl * totalLevel) + (6 * fortitude) + (activeCharacter.pvAdjustment || 0);
    let maxPM = 5 + (pmPerLvl * totalLevel) + (2 * arcanismo) + (2 * fortitude) + (activeCharacter.pmAdjustment || 0);
    if (activeCharacter.supplement === 'quatro-elementos') {
      maxPV = (origin?.basePV ?? 10) + (activeCharacter.pvAdjustment || 0);
      maxPM = (origin?.basePM ?? 5) + (activeCharacter.pmAdjustment || 0);
    } else if (activeCharacter.supplement === 'fading-humans') {
      const robustBonus = activeCharacter.supplementData?.physicalFrame === 'Robusto';
      const slightPenalty = activeCharacter.supplementData?.physicalFrame === 'Mirrado';
      maxPV = 10 + (robustBonus ? 3 : 0) - (slightPenalty ? 1 : 0) + (activeCharacter.pvAdjustment || 0);
      maxPM = 8 + (robustBonus ? 1 : 0) + (activeCharacter.pmAdjustment || 0);
    } else if (activeCharacter.supplement === 'infames-condutores') {
      maxPV = 10 + (pvPerLvl * totalLevel) + (activeCharacter.pvAdjustment || 0);
      maxPM = 5 + (pmPerLvl * totalLevel) + (activeCharacter.pmAdjustment || 0);
    } else if (isAdAstra) {
      maxPV = 10 + (activeCharacter.pvAdjustment || 0);
      maxPM = 5 + (activeCharacter.pmAdjustment || 0);
    }

    if (activeCharacter.supplement === 'modulo-basico' && activeCharacter.pvReduced) {
      maxPV -= 3 * totalLevel;
    }
    if (activeCharacter.supplement === 'modulo-basico' && activeCharacter.pmReduced) {
      maxPM -= 3 * totalLevel;
    }

    return {
      pv: { 
        current: activeCharacter.stats.pv?.current || 0, 
        max: maxPV 
      },
      pm: { 
        current: activeCharacter.stats.pm?.current || 0, 
        max: maxPM 
      }
    };
  }, [activeCharacter.stats, activeCharacter.origin, activeCharacter.supplement, activeOriginDetails, activeCharacter.supplementData?.physicalFrame, totalLevel, currentSkills, activeCharacter.pvAdjustment, activeCharacter.pmAdjustment, activeCharacter.pvReduced, activeCharacter.pmReduced, isAdAstra]);

  const trainingPoints = useMemo(() => {
    if (!activeCharacter) return 0;
    const spent = (Object.values(activeCharacter.skillTraining || {}) as number[]).reduce((a, b) => a + (b || 0), 0);
    if (activeCharacter.supplement === 'fading-humans') return 12 - spent;
    if (activeCharacter.supplement === 'ad-astra') return 10 + (totalLevel - 1) + (Math.floor(totalLevel / 5) * 3) - spent;
    const origin = activeOriginDetails;
    if (activeCharacter.supplement === 'quatro-elementos' || activeCharacter.supplement === 'infames-condutores') {
      return (origin?.trainingPoints || 0) + (activeCharacter.trainingPointsAdjustment || 0) - spent;
    }
    if (activeCharacter.supplement === 'fading-humans') {
      return 12 + (activeCharacter.supplementData?.physicalFrame === 'Padrão' ? 2 : 0) - spent;
    }
    const base = (origin?.trainingPoints || 0) + 2 + (effectiveAttributes.intelecto || 0);
    const levelUpPoints = (totalLevel - 1) + Math.floor(totalLevel / 5) * 2;
    const totalTrainingPoints = base + levelUpPoints;
    return totalTrainingPoints + (activeCharacter.trainingPointsAdjustment || 0) - spent;
  }, [activeCharacter.origin, activeCharacter.supplement, activeOriginDetails, activeCharacter.supplementData?.physicalFrame, activeCharacter.trainingPointsAdjustment, activeCharacter.skillTraining, effectiveAttributes.intelecto, totalLevel]);

  const toggleSkillUnlock = (skillName: string) => {
    const isUnlocked = activeCharacter.unlockedSkills.includes(skillName);
    const newUnlocked = isUnlocked 
      ? activeCharacter.unlockedSkills.filter(s => s !== skillName)
      : [...activeCharacter.unlockedSkills, skillName];
    updateCharacter({ unlockedSkills: newUnlocked });
  };

  const isTestUsed = (i: number) => {
    if (activeCharacter.soulTestsState && activeCharacter.soulTestsState[i] !== undefined) {
      return activeCharacter.soulTestsState[i];
    }
    return i < (activeCharacter.soulTestsUsed || 0);
  };

  const toggleSoulTest = (i: number) => {
    const isCurrentlyUsed = isTestUsed(i);
    const nextUsed = !isCurrentlyUsed;
    const length = Math.max(0, 3 + (currentSkills.find(s => s.name === 'Sobrevivência')?.bonus || 0) + activeCharacter.soulTestsAdjustment);
    const newStateMap = { ...(activeCharacter.soulTestsState || {}) };
    for (let idx = 0; idx < length; idx++) {
      if (newStateMap[idx] === undefined) {
        newStateMap[idx] = idx < (activeCharacter.soulTestsUsed || 0);
      }
    }
    newStateMap[i] = nextUsed;
    const newUsedCount = Object.values(newStateMap).filter(Boolean).length;
    updateCharacter({
      soulTestsState: newStateMap,
      soulTestsUsed: newUsedCount
    });
  };

  const defenseValue = useMemo(() => {
    const { forca: F, destreza: D, vigor: V } = effectiveAttributes;
    const lvl = totalLevel;
    const frameAdjustment = activeCharacter.supplement === 'fading-humans'
      ? activeCharacter.supplementData?.physicalFrame === 'Robusto' ? 1 : activeCharacter.supplementData?.physicalFrame === 'Mirrado' ? -1 : 0
      : 0;
    return (8 + D + Math.ceil((lvl + (2 * V) + F) / 3)) + (activeCharacter.defenseAdjustment || 0) + frameAdjustment;
  }, [effectiveAttributes, totalLevel, activeCharacter.defenseAdjustment, activeCharacter.supplement, activeCharacter.supplementData?.physicalFrame]);

  const [prevMaxStats, setPrevMaxStats] = useState<{ [charId: string]: { pv: number, pm: number } }>({});

  useEffect(() => {
    const currentMaxPV = statsWithOrigin.pv.max;
    const currentMaxPM = statsWithOrigin.pm.max;
    const charId = activeCharacter.id;

    const prev = prevMaxStats[charId];

    if (!prev) {
      // First time seeing this character in this session or after focus
      setPrevMaxStats(p => ({ ...p, [charId]: { pv: currentMaxPV, pm: currentMaxPM } }));
      return;
    }

    const pvDelta = currentMaxPV - prev.pv;
    const pmDelta = currentMaxPM - prev.pm;

    if (pvDelta !== 0 || pmDelta !== 0) {
      updateCharacter({
        stats: {
          pv: { ...activeCharacter.stats.pv, current: activeCharacter.stats.pv.current + pvDelta },
          pm: { ...activeCharacter.stats.pm, current: activeCharacter.stats.pm.current + pmDelta },
        }
      });
      setPrevMaxStats(p => ({ ...p, [charId]: { pv: currentMaxPV, pm: currentMaxPM } }));
    }
  }, [statsWithOrigin.pv.max, statsWithOrigin.pm.max, activeCharacter.id]);

  const createCharacterFromSupplement = (supplement: CharacterSupplement, customName?: string) => {
    const id = Math.random().toString(36).slice(2, 10);
    const isShip = supplement === 'nave';
    const initialSpecializations = isShip || supplement === 'quatro-elementos' || supplement === 'fading-humans' || supplement === 'ad-astra'
      ? {}
      : { 'Lutador': 1 };

    const newChar: CharacterSheet = {
      ...INITIAL_CHARACTER,
      id,
      supplement,
      kind: isShip ? 'nave' : 'personagem',
      shipData: isShip ? createShipData() : undefined,
      name: customName || (isShip ? 'Nova Nave' : 'Novo Herói'),
      title: isShip ? 'Nave de Patrulha' : 'Aventureiro Iniciante',
      specializations: initialSpecializations,
      stats: {
        pv: { current: isShip ? 0 : 10, max: isShip ? 0 : 10 },
        pm: { current: isShip ? 0 : supplement === 'fading-humans' ? 8 : 5, max: isShip ? 0 : supplement === 'fading-humans' ? 8 : 5 },
      },
      level: isShip ? 1 : 1,
      supplementData: supplement === 'fading-humans'
        ? { characterPoints: 8, attributePoints: 8, physicalFrame: 'Padrão', masteries: {} }
        : supplement === 'infames-condutores'
          ? { karmicRed: 0, karmicBlue: 0, conductionTraits: [] }
          : supplement === 'quatro-elementos'
            ? { subfolds: [], elementRank: 1 }
            : supplement === 'ad-astra'
              ? { matrixChoice: 'Sem Matriz', protocols: [], mainLoadout: [], secondaryLoadout: [], snippets: [] }
              : undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      origin: isShip ? '' : INITIAL_CHARACTER.origin,
    };

    setCharacters(prev => [...prev, newChar]);
    setActiveId(id);
    setView('sheet');
  };

  const applyImport = (mode: 'merge' | 'replace') => {
    if (!pendingImport) return;
    setCharacters(prev => {
      if (mode === 'replace') return pendingImport;
      const usedIds = new Set(prev.map(character => character.id));
      const additions = pendingImport.map(character => {
        if (!usedIds.has(character.id)) {
          usedIds.add(character.id);
          return character;
        }
        const id = Math.random().toString(36).slice(2, 10);
        usedIds.add(id);
        return { ...character, id };
      });
      return [...prev, ...additions];
    });
    setPendingImport(null);
  };

  const updateShipData = (shipData: NonNullable<CharacterSheet['shipData']>) => {
    updateCharacter({ shipData });
  };

  const updateSupplementData = (updates: Partial<SupplementData>) => {
    updateCharacter({ supplementData: { ...(activeCharacter.supplementData || {}), ...updates } });
  };

  const spendCharacterPoint = (target: string) => {
    const data = activeCharacter.supplementData || {};
    const points = data.characterPoints ?? 8;
    if (points <= 0) return;
    const nextData = { ...data, characterPoints: points - 1 };
    if (target === 'Vitalidade') {
      const nextMaximum = Math.ceil(statsWithOrigin.pv.max * 1.2);
      updateCharacter({ pvAdjustment: (activeCharacter.pvAdjustment || 0) + nextMaximum - statsWithOrigin.pv.max, supplementData: nextData });
      return;
    }
    if (target === 'Síntese') {
      const nextMaximum = Math.floor(statsWithOrigin.pm.max * 1.2);
      updateCharacter({ pmAdjustment: (activeCharacter.pmAdjustment || 0) + nextMaximum - statsWithOrigin.pm.max, supplementData: nextData });
      return;
    }
    if (target.startsWith('Atributo: ')) {
      const key = target.slice('Atributo: '.length) as keyof CharacterAttributes;
      if (activeCharacter.attributes[key] >= 8) {
        alert('Esse atributo já atingiu o limite de 8 pontos para Pontos de Personagem.');
        return;
      }
      updateCharacter({
        attributes: { ...activeCharacter.attributes, [key]: activeCharacter.attributes[key] + 1 },
        supplementData: { ...nextData, attributePoints: Math.max(0, (data.attributePoints ?? 8) - 1) },
      });
      return;
    }
    if (target.startsWith('Perícia: ')) {
      const skillName = target.slice('Perícia: '.length);
      const skill = currentSkills.find(item => item.name === skillName);
      if ((skill?.bonus || 0) >= 15) {
        alert('Essa perícia já atingiu o limite de 15 pontos para Pontos de Personagem.');
        return;
      }
      updateCharacter({ skillTraining: { ...activeCharacter.skillTraining, [skillName]: (activeCharacter.skillTraining[skillName] || 0) + 1 }, supplementData: nextData });
      return;
    }
    if (target.startsWith('Maestria: ')) {
      const name = target.slice('Maestria: '.length);
      updateCharacter({ supplementData: { ...nextData, masteries: { ...(data.masteries || {}), [name]: (data.masteries?.[name] || 0) + 1 } } });
      return;
    }
    if (target === 'Árvore de Sinapse') {
      updateCharacter({ abilities: [...activeCharacter.abilities, { name: 'Nova Habilidade Sináptica', description: 'Descreva a habilidade adquirida nesta árvore de Sinapse.', category: 'Habilidades Sinápticas' }], supplementData: nextData });
    }
  };

  const importDialog = pendingImport && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4" role="dialog" aria-modal="true" aria-labelledby="import-title">
      <div className="w-full max-w-md rounded border border-ruvia-accent/40 bg-ruvia-bg p-6 text-ruvia-text shadow-2xl">
        <h2 id="import-title" className="text-xl font-bold">Carregar backup</h2>
        <p className="mt-2 text-sm opacity-80">O arquivo contém {pendingImport.length} ficha(s). Como deseja prosseguir?</p>
        <div className="mt-5 flex flex-wrap justify-end gap-2">
          <button type="button" onClick={() => setPendingImport(null)} className="rounded border border-white/20 px-3 py-2 text-xs font-bold uppercase">Cancelar</button>
          <button type="button" onClick={() => applyImport('merge')} className="rounded border border-ruvia-accent/50 px-3 py-2 text-xs font-bold uppercase text-ruvia-accent">Adicionar às fichas existentes</button>
          <button type="button" onClick={() => applyImport('replace')} className="rounded bg-red-900 px-3 py-2 text-xs font-bold uppercase text-white">Substituir fichas existentes</button>
        </div>
      </div>
    </div>
  );

  const abilityCategories = activeCharacter.supplement === 'fading-humans'
    ? ['Habilidades', 'Fardos', 'Habilidades Sinápticas']
    : activeCharacter.supplement === 'ad-astra'
      ? ['Habilidades de Espécie', 'Habilidades de Especialização', 'Habilidades de Ofício', 'Talentos']
      : activeCharacter.supplement === 'quatro-elementos'
        ? ['Habilidades e Talentos']
        : ['Habilidades', 'Talentos'];
  const abilityEntries = activeCharacter.abilities.map((ability, index) => ({
    ability,
    index,
    category: ability.category || abilityCategories[0],
  }));

  const deleteCharacter = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCharacters(prev => prev.filter(c => c.id !== id));
    if (activeId === id) setActiveId(null);
  };

  const createFolder = () => {
    const name = newFolderName.trim();
    if (!name) return;
    const folder = { id: crypto.randomUUID(), name };
    setFolders(previous => [...previous, folder]);
    setActiveFolderFilter(folder.id);
    setNewFolderName('');
  };

  const moveCharacterToFolder = (characterId: string, folderId?: string) => {
    setCharacters(previous => previous.map(character => {
      if (character.id !== characterId) return character;
      const { folderId: _previousFolderId, ...withoutFolder } = character;
      return folderId ? { ...withoutFolder, folderId } : withoutFolder;
    }));
  };

  const deleteFolder = (folderId: string) => {
    setFolders(previous => previous.filter(folder => folder.id !== folderId));
    setCharacters(previous => previous.map(character => {
      if (character.folderId !== folderId) return character;
      const { folderId: _removedFolderId, ...withoutFolder } = character;
      return withoutFolder;
    }));
    if (activeFolderFilter === folderId) setActiveFolderFilter('all');
  };

  const renameFolder = (folderId: string) => {
    const currentFolder = folders.find(folder => folder.id === folderId);
    if (!currentFolder) return;
    const name = window.prompt('Novo nome da pasta:', currentFolder.name)?.trim();
    if (name) setFolders(previous => previous.map(folder => folder.id === folderId ? { ...folder, name } : folder));
  };

  const visibleCharacters = characters.filter(character => {
    if (activeFolderFilter === 'all') return true;
    if (activeFolderFilter === 'unfiled') return !character.folderId || !folders.some(folder => folder.id === character.folderId);
    return character.folderId === activeFolderFilter;
  }).filter(character =>
    selectedSupplements.length === 0 || selectedSupplements.includes(character.supplement || 'modulo-basico')
  ).filter(character =>
    selectedLevels.length === 0 || selectedLevels.includes(getCharacterLevel(character))
  );
  const availableLevels: CharacterLevel[] = Array.from(new Set<CharacterLevel>(characters.map(getCharacterLevel)))
    .sort((left, right) => {
      if (left === 'none') return right === 'none' ? 0 : 1;
      if (right === 'none') return -1;
      return left - right;
    });

  const toggleSupplementFilter = (supplement: CharacterSupplement, checked: boolean) => {
    const current = selectedSupplements.length === 0
      ? SUPPLEMENT_OPTIONS.map(option => option.value)
      : selectedSupplements;
    const next = checked ? [...current, supplement] : current.filter(value => value !== supplement);
    setSelectedSupplements(next.length === SUPPLEMENT_OPTIONS.length ? [] : next);
  };

  const toggleLevelFilter = (level: CharacterLevel, checked: boolean) => {
    const current = selectedLevels.length === 0 ? availableLevels : selectedLevels;
    const next = checked ? [...current, level] : current.filter(value => value !== level);
    setSelectedLevels(next.length === availableLevels.length ? [] : next);
  };

  const addItemToInventory = (item: Item) => {
    updateCharacter({
      inventory: [...activeCharacter.inventory, { ...item, id: Math.random().toString() }]
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-ruvia-bg flex items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="text-ruvia-accent"
        >
          <Sparkles size={48} />
        </motion.div>
      </div>
    );
  }

  if (view === 'list') {
    return (
      <div className="max-w-[1024px] mx-auto min-h-screen p-8 flex flex-col gap-8 select-none">
        {importDialog}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end border-b-2 border-ruvia-accent pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <p className="text-ruvia-accent uppercase tracking-[0.3em] text-[10px] font-sans font-bold">Rúvia RPG</p>
              <span className="w-1 h-1 rounded-full bg-ruvia-accent/30"></span>
              <p className="text-gray-500 uppercase tracking-[0.1em] text-[9px] font-bold">Gerenciador Offline</p>
            </div>
            <h1 className="text-5xl font-black italic uppercase tracking-tighter">Personagens</h1>
          </div>
          <div className="flex flex-wrap gap-4 mt-4 md:mt-0">
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={importCharacters} 
              className="hidden" 
              accept=".json"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 flex items-center gap-2 font-bold uppercase text-xs text-ruvia-accent/60 hover:text-ruvia-accent transition-colors border border-ruvia-accent/20 rounded-sm"
            >
              <Upload size={16} /> Carregar Backup
            </button>
            <button 
              onClick={exportCharacters}
              className="px-4 py-2 flex items-center gap-2 font-bold uppercase text-xs text-ruvia-accent/60 hover:text-ruvia-accent transition-colors border border-ruvia-accent/20 rounded-sm"
            >
              <Download size={16} /> Salvar Backup
            </button>
            <div className="relative">
              <button
                onClick={() => setNewCharacterMenuOpen(open => !open)}
                className="bg-ruvia-accent text-ruvia-bg px-4 py-2 flex items-center gap-2 font-bold uppercase text-xs hover:scale-105 transition-transform shadow-[0_0_15px_rgba(255,255,255,0.1)]"
              >
                <UserPlus size={16} /> Novo Personagem
              </button>
              {newCharacterMenuOpen && (
                <div className="absolute right-0 top-full mt-2 z-20 w-80 rounded-sm border border-ruvia-accent/30 bg-ruvia-bg/95 p-2 shadow-2xl backdrop-blur-md">
                  {SUPPLEMENT_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setNewCharacterMenuOpen(false);
                        createCharacterFromSupplement(option.value as CharacterSupplement);
                      }}
                      className="block w-full border-x border-t border-ruvia-accent/20 px-3 py-2 text-left text-xs uppercase tracking-[0.15em] text-white/80 transition-colors last:border-b hover:bg-white/5 hover:text-ruvia-accent"
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </header>

        <section className="rounded-sm border border-ruvia-accent/20 bg-ruvia-panel/30 p-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-ruvia-accent">
              <Folder size={15} /> Pastas locais
            </div>
            <form
              className="flex gap-2"
              onSubmit={event => {
                event.preventDefault();
                createFolder();
              }}
            >
              <input
                className="min-w-0 rounded-sm border border-ruvia-accent/20 bg-ruvia-bg px-3 py-2 text-xs text-white outline-none focus:border-ruvia-accent"
                aria-label="Nome da nova pasta"
                placeholder="Nome da pasta"
                value={newFolderName}
                onChange={event => setNewFolderName(event.target.value)}
              />
              <button type="submit" className="flex shrink-0 items-center gap-2 rounded-sm border border-ruvia-accent/40 px-3 py-2 text-xs font-bold uppercase text-ruvia-accent hover:bg-ruvia-accent/10">
                <FolderPlus size={14} /> Criar pasta
              </button>
            </form>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <button type="button" onClick={() => setActiveFolderFilter('all')} className={`rounded-sm border px-3 py-1.5 text-xs uppercase ${activeFolderFilter === 'all' ? 'border-ruvia-accent bg-ruvia-accent/10 text-ruvia-accent' : 'border-white/10 text-white/60'}`}>
              Todas ({characters.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveFolderFilter('unfiled')}
              onDragOver={event => event.preventDefault()}
              onDrop={event => {
                event.preventDefault();
                const characterId = event.dataTransfer.getData('text/character-id');
                if (characterId) moveCharacterToFolder(characterId);
              }}
              className={`rounded-sm border px-3 py-1.5 text-xs uppercase ${activeFolderFilter === 'unfiled' ? 'border-ruvia-accent bg-ruvia-accent/10 text-ruvia-accent' : 'border-white/10 text-white/60'}`}
            >
              Sem pasta ({characters.filter(character => !character.folderId || !folders.some(folder => folder.id === character.folderId)).length})
            </button>
            {folders.map(folder => (
              <div
                key={folder.id}
                className={`flex items-center rounded-sm border ${activeFolderFilter === folder.id ? 'border-ruvia-accent bg-ruvia-accent/10' : 'border-white/10'}`}
                onDragOver={event => event.preventDefault()}
                onDrop={event => {
                  event.preventDefault();
                  const characterId = event.dataTransfer.getData('text/character-id');
                  if (characterId) moveCharacterToFolder(characterId, folder.id);
                }}
              >
                <button type="button" onClick={() => setActiveFolderFilter(folder.id)} className={`flex items-center gap-1.5 px-3 py-1.5 text-xs uppercase ${activeFolderFilter === folder.id ? 'text-ruvia-accent' : 'text-white/60'}`}>
                  <Folder size={13} /> {folder.name} ({characters.filter(character => character.folderId === folder.id).length})
                </button>
                <button type="button" aria-label={`Renomear pasta ${folder.name}`} onClick={() => renameFolder(folder.id)} className="px-1 text-[10px] text-white/40 hover:text-ruvia-accent">✎</button>
                <button type="button" aria-label={`Excluir pasta ${folder.name}`} onClick={() => deleteFolder(folder.id)} className="px-2 text-white/40 hover:text-red-400"><X size={12} /></button>
              </div>
            ))}
          </div>
          <p className="mt-2 text-[10px] text-white/40">Arraste uma ficha para uma pasta. Pastas e fichas privadas ficam salvas neste navegador.</p>
        </section>

        <section className="rounded-sm border border-ruvia-accent/20 bg-ruvia-panel/30 p-4">
          <h2 className="mb-3 text-xs font-bold uppercase tracking-widest text-ruvia-accent">Filtrar fichas</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <fieldset>
              <legend className="mb-2 text-[10px] uppercase tracking-wider text-white/50">Modelo</legend>
              <div className="flex flex-wrap gap-x-4 gap-y-2">
                {SUPPLEMENT_OPTIONS.map(option => (
                  <label key={option.value} className="flex items-center gap-2 text-xs text-white/75">
                    <input
                      type="checkbox"
                      checked={selectedSupplements.length === 0 || selectedSupplements.includes(option.value)}
                      onChange={event => toggleSupplementFilter(option.value, event.target.checked)}
                      className="accent-ruvia-accent"
                    />
                    {SUPPLEMENT_CARD_LABELS[option.value]}
                  </label>
                ))}
              </div>
            </fieldset>
            <fieldset>
              <legend className="mb-2 text-[10px] uppercase tracking-wider text-white/50">Nível</legend>
              {availableLevels.length === 0 ? (
                <p className="text-xs text-white/40">Sem fichas cadastradas.</p>
              ) : (
                <div className="flex flex-wrap gap-x-4 gap-y-2">
                  {availableLevels.map(level => (
                    <label key={level} className="flex items-center gap-2 text-xs text-white/75">
                      <input
                        type="checkbox"
                        checked={selectedLevels.length === 0 || selectedLevels.includes(level)}
                        onChange={event => toggleLevelFilter(level, event.target.checked)}
                        className="accent-ruvia-accent"
                      />
                      {level === 'none' ? 'Sem nível' : `Nível ${level}`}
                    </label>
                  ))}
                </div>
              )}
            </fieldset>
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {characters.length === 0 ? (
            <div className="col-span-full py-20 flex flex-col items-center justify-center opacity-30">
              <User size={64} />
              <p className="mt-4 uppercase tracking-[0.3em] font-bold">Nenhum personagem encontrado</p>
              <div className="flex gap-4 mt-6">
                 <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="text-gray-400 border border-gray-400/30 px-4 py-2 hover:bg-white/5 transition-all font-bold uppercase text-xs"
                >
                  Carregar Backup
                </button>
                <button 
                  onClick={() => setNewCharacterMenuOpen(true)}
                  className="text-ruvia-accent border border-ruvia-accent px-4 py-2 hover:bg-ruvia-accent hover:text-ruvia-bg transition-all font-bold uppercase text-xs"
                >
                  Criar Primeiro Herói
                </button>
              </div>
            </div>
          ) : visibleCharacters.length === 0 ? (
            <div className="col-span-full rounded-sm border border-dashed border-ruvia-accent/20 py-12 text-center text-xs uppercase tracking-widest text-white/40">
              Nenhuma ficha corresponde aos filtros atuais.
            </div>
          ) : visibleCharacters.map(char => (
            <motion.div
              layoutId={char.id}
              key={char.id}
              draggable
              onDragStart={event => {
                event.dataTransfer.setData('text/character-id', char.id);
                event.dataTransfer.effectAllowed = 'move';
              }}
              data-supplement={char.supplement || 'modulo-basico'}
              onClick={() => {
                setShareNotice(false);
                setActiveId(char.id);
                setView('sheet');
              }}
              className={`p-6 rounded-sm cursor-pointer transition-all group ${char.kind === 'nave' ? 'bg-[#0b1323] border border-sky-300/30 hover:border-sky-200' : `${SUPPLEMENT_THEMES[(char.supplement || 'modulo-basico')].card} hover:border-ruvia-accent`}`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className={`text-2xl font-bold transition-colors ${char.kind === 'nave' ? 'text-sky-100 group-hover:text-sky-300' : 'text-white group-hover:text-ruvia-accent'}`}>
                    {char.kind === 'nave' ? <span className="mr-2 inline-flex align-middle"><Rocket size={20} /></span> : null}
                    {char.name}
                  </h3>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {Object.entries(char.specializations || {}).filter(([_, lvl]: [string, any]) => (lvl as number) > 0).map(([name, lvl]: [string, any]) => (
                      <span key={name} className="text-[9px] bg-ruvia-accent/10 border border-ruvia-accent/20 text-ruvia-accent px-1 rounded-sm uppercase font-bold">
                        {name} {lvl as number}
                      </span>
                    ))}
                  </div>
                  <p className={`mt-2 text-[10px] font-medium uppercase tracking-[0.12em] ${char.kind === 'nave' ? 'text-sky-300' : 'text-ruvia-accent/80'}`}>
                    {SUPPLEMENT_CARD_LABELS[char.supplement || 'modulo-basico']}
                  </p>
                </div>
                <div className="text-right">
                  {char.kind === 'nave' ? (
                    <p className="text-xs uppercase tracking-widest text-sky-300">{char.shipData?.size || 'Pequena'}</p>
                  ) : char.supplement !== 'quatro-elementos' && char.supplement !== 'fading-humans' ? (
                    <>
                      <p className="text-[10px] uppercase tracking-widest text-ruvia-accent/60">Nível Total</p>
                      <p className="text-xl font-black">{char.supplement === 'ad-astra' ? char.level || 1 : (Object.values(char.specializations || {}) as number[]).reduce((a, b) => a + (b || 0), 0) || 1}</p>
                    </>
                  ) : null}
                </div>
              </div>
              
              <div data-character-stats={char.kind === 'nave' ? 'hidden' : 'visible'} className="mt-6 flex flex-wrap gap-4 text-[10px] uppercase font-bold opacity-60">
                <div className="flex items-center gap-1">
                  <Heart size={10} className="text-red-500" /> 
                  {(() => {
                    const lvl = (Object.values(char.specializations || {}) as number[]).reduce((a, b) => a + (b || 0), 0) || 1;
                    const bonusFortitude = calculateSkills(
                      {
                        forca: char.attributes.forca + (ORIGINS.find(o => o.name === char.origin)?.attributeBonuses.forca || 0) + (ORIGINS.find(o => o.name === char.origin)?.attributeBonuses.all || 0),
                        destreza: char.attributes.destreza + (ORIGINS.find(o => o.name === char.origin)?.attributeBonuses.destreza || 0) + (ORIGINS.find(o => o.name === char.origin)?.attributeBonuses.all || 0),
                        vigor: char.attributes.vigor + (ORIGINS.find(o => o.name === char.origin)?.attributeBonuses.vigor || 0) + (ORIGINS.find(o => o.name === char.origin)?.attributeBonuses.all || 0),
                        intelecto: char.attributes.intelecto + (ORIGINS.find(o => o.name === char.origin)?.attributeBonuses.intelecto || 0) + (ORIGINS.find(o => o.name === char.origin)?.attributeBonuses.all || 0),
                        expressao: char.attributes.expressao + (ORIGINS.find(o => o.name === char.origin)?.attributeBonuses.expressao || 0) + (ORIGINS.find(o => o.name === char.origin)?.attributeBonuses.all || 0),
                        carisma: char.attributes.carisma + (ORIGINS.find(o => o.name === char.origin)?.attributeBonuses.carisma || 0) + (ORIGINS.find(o => o.name === char.origin)?.attributeBonuses.all || 0),
                      },
                      lvl,
                      char.skillTraining || {}
                    ).find(s => s.name === 'Fortitude')?.bonus || 0;
                    const pvPerLvl = ORIGINS.find(o => o.name === char.origin)?.pvPerLevel || 0;
                    let maxPV = 10 + (pvPerLvl * lvl) + (6 * bonusFortitude) + (char.pvAdjustment || 0);
                    if (char.pvReduced) {
                      maxPV -= (3 * lvl);
                    }
                    return `${char.stats.pv.current}/${maxPV}`;
                  })()} PV
                </div>
                <div className="flex items-center gap-1">
                  <Zap size={10} className="text-blue-400" /> 
                  {(() => {
                    const lvl = (Object.values(char.specializations || {}) as number[]).reduce((a, b) => a + (b || 0), 0) || 1;
                    const attrs = {
                      forca: char.attributes.forca + (ORIGINS.find(o => o.name === char.origin)?.attributeBonuses.forca || 0) + (ORIGINS.find(o => o.name === char.origin)?.attributeBonuses.all || 0),
                      destreza: char.attributes.destreza + (ORIGINS.find(o => o.name === char.origin)?.attributeBonuses.destreza || 0) + (ORIGINS.find(o => o.name === char.origin)?.attributeBonuses.all || 0),
                      vigor: char.attributes.vigor + (ORIGINS.find(o => o.name === char.origin)?.attributeBonuses.vigor || 0) + (ORIGINS.find(o => o.name === char.origin)?.attributeBonuses.all || 0),
                      intelecto: char.attributes.intelecto + (ORIGINS.find(o => o.name === char.origin)?.attributeBonuses.intelecto || 0) + (ORIGINS.find(o => o.name === char.origin)?.attributeBonuses.all || 0),
                      expressao: char.attributes.expressao + (ORIGINS.find(o => o.name === char.origin)?.attributeBonuses.expressao || 0) + (ORIGINS.find(o => o.name === char.origin)?.attributeBonuses.all || 0),
                      carisma: char.attributes.carisma + (ORIGINS.find(o => o.name === char.origin)?.attributeBonuses.carisma || 0) + (ORIGINS.find(o => o.name === char.origin)?.attributeBonuses.all || 0),
                    };
                    const skills = calculateSkills(attrs, lvl, char.skillTraining || {});
                    const arcanismo = skills.find(s => s.name === 'Arcanismo')?.bonus || 0;
                    const fortitude = skills.find(s => s.name === 'Fortitude')?.bonus || 0;
                    const pmPerLvl = ORIGINS.find(o => o.name === char.origin)?.pmPerLevel || 0;
                    let maxPM = 5 + (pmPerLvl * lvl) + (2 * arcanismo) + (2 * fortitude) + (char.pmAdjustment || 0);
                    if (char.pmReduced) {
                      maxPM -= (3 * lvl);
                    }
                    return `${char.stats.pm.current}/${maxPM}`;
                  })()} PM
                </div>
                <div className="flex items-center gap-1">
                  <Shield size={10} className="text-gray-400" />
                  {(() => {
                    const origin = ORIGINS.find(o => o.name === char.origin);
                    const bonuses = origin?.attributeBonuses || {};
                    const eff = {
                      forca: (char.attributes.forca || 0) + (bonuses.forca || 0) + (bonuses.all || 0),
                      destreza: (char.attributes.destreza || 0) + (bonuses.destreza || 0) + (bonuses.all || 0),
                      vigor: (char.attributes.vigor || 0) + (bonuses.vigor || 0) + (bonuses.all || 0),
                    };
                    const lvl = (Object.values(char.specializations || {}) as number[]).reduce((a, b) => a + (b || 0), 0) || 1;
                    return (8 + eff.destreza + Math.ceil((lvl + (2 * eff.vigor) + eff.forca) / 3)) + (char.defenseAdjustment || 0);
                  })()} DEF
                </div>
                <div className="flex items-center gap-1">
                  <Package size={10} /> {char.origin || 'SEM ORIGEM'}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-ruvia-panel flex justify-between items-center">
                <span className="text-[10px] uppercase tracking-widest text-ruvia-accent flex items-center gap-1">
                  Ver Ficha <ChevronRight size={12} />
                </span>
                {characters.length > 1 && (
                  <button 
                    onClick={(e) => deleteCharacter(char.id, e)}
                    className="text-red-500/50 hover:text-red-500 p-1 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        <footer className="mt-auto pt-10 text-[10px] uppercase tracking-[0.2em] text-ruvia-accent/40 text-center">
          © MMXXIV RÚVIA RPG SYSTEM • Gerenciador de Fichas
        </footer>
          {importDialog}
        </div>
    );
  }

  if (activeCharacter.kind === 'nave') {
    const shipData = activeCharacter.shipData || createShipData();
    return (
        <>
          <input type="file" ref={fileInputRef} onChange={importCharacters} className="hidden" accept=".json" />
          <ShipSheetEditor
            name={activeCharacter.name}
            data={shipData}
            onNameChange={name => updateCharacter({ name })}
            onChange={updateShipData}
            onBack={() => setView('list')}
            onSave={exportCurrentCharacter}
            onLoad={() => fileInputRef.current?.click()}
          />
          {importDialog}
        </>
    );
  }

  return (
    <div data-supplement={activeCharacter.supplement || 'modulo-basico'} className={`max-w-[1024px] mx-auto min-h-screen p-8 flex flex-col gap-6 select-none sm:p-4 supplement-sheet supplement-${activeCharacter.supplement || 'modulo-basico'}`}>
        <input type="file" ref={fileInputRef} onChange={importCharacters} className="hidden" accept=".json" />
        {importDialog}
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end border-b-2 border-ruvia-accent pb-4">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-4"
        >
          <button 
            onClick={() => {
              setShareNotice(false);
              setView('list');
            }}
            className="p-2 border border-ruvia-accent/30 text-ruvia-accent hover:bg-ruvia-accent hover:text-ruvia-bg transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <p className="text-ruvia-accent uppercase tracking-[0.3em] text-[10px] font-sans mb-1 font-bold">Sistema de RPG Autoral</p>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-none italic uppercase">RÚVIA RPG</h1>
          </div>
        </motion.div>
        
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-left md:text-right mt-4 md:mt-0 w-full md:w-auto flex flex-col items-start md:items-end gap-3"
          >
            {/* Origin Selection */}
            {!isFadingHumans && <div className="flex max-w-full flex-wrap items-center gap-1 bg-ruvia-panel px-3 py-1 border border-ruvia-accent shadow-lg rounded-sm">
              <span className="text-[10px] text-ruvia-accent font-black uppercase tracking-tighter mr-1">{isAdAstra ? 'Espécie:' : 'Origem do Herói:'}</span>
              <select 
                className="max-w-[160px] bg-transparent text-white font-bold outline-none text-sm cursor-pointer hover:text-ruvia-accent transition-colors"
                value={isAdAstra ? (activeCharacter.species || '') : (activeCharacter.origin || '')}
                onChange={e => isAdAstra
                  ? updateCharacter({ species: e.target.value })
                  : updateCharacter({ origin: e.target.value })}
              >
                <option value="" className="bg-ruvia-bg italic">{isAdAstra ? 'Escolha uma espécie...' : 'Escolha uma Origem...'}</option>
                {(isAdAstra ? AD_ASTRA_SPECIES : characterOriginOptions).map(name => (
                  <option key={name} value={name} className="bg-ruvia-bg font-bold">{name}</option>
                ))}
              </select>
            </div>}

            <div className="flex flex-wrap gap-2 justify-end">
              <button
                type="button"
                onClick={exportCurrentCharacter}
                className={`px-3 py-1.5 rounded-sm border text-[10px] font-black uppercase tracking-[0.12em] transition-all ${activeSupplementTheme.badge}`}
              >
                Salvar backup da ficha
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className={`px-3 py-1.5 rounded-sm border text-[10px] font-black uppercase tracking-[0.12em] transition-all ${activeSupplementTheme.badge}`}
              >
                Carregar backup
              </button>
              <button
                type="button"
                onClick={() => setShareNotice(true)}
                className={`flex items-center gap-1.5 rounded-sm border px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] transition-all ${activeSupplementTheme.badge}`}
              >
                Compartilhar (em breve)
              </button>
            </div>
            {shareNotice && (
              <div className="w-full rounded-sm border border-current/15 bg-black/10 p-2 text-left text-[11px]">
                <p className="opacity-70">O compartilhamento simultâneo por link está em desenvolvimento e ainda não está disponível.</p>
              </div>
            )}

            <div className="flex flex-col gap-2 w-full">
              <input 
                className="bg-ruvia-panel border border-ruvia-accent/30 p-1 text-2xl font-bold text-white w-full md:text-right outline-none hover:bg-white/5 transition-colors"
                value={activeCharacter.name}
                onChange={e => updateCharacter({ name: e.target.value })}
                placeholder="NOME"
              />
              {!isNoLevelSupplement && <div className="flex flex-col gap-2 md:items-end">
                {isAdAstra ? (
                  <div className="flex flex-wrap items-center gap-2 justify-start md:justify-end">
                    <label className="flex items-center gap-2 text-[10px] font-bold uppercase text-ruvia-accent">
                      Especialização
                      <select className="max-w-48 bg-ruvia-panel text-white p-1" value={activeCharacter.specializationChoice || ''} onChange={e => updateCharacter({ specializationChoice: e.target.value })}>
                        <option value="">Escolher...</option>
                        {AD_ASTRA_SPECIALIZATIONS.map(name => <option key={name}>{name}</option>)}
                      </select>
                    </label>
                    {activeCharacter.offices?.map((office, index) => (
                      <label key={index} className="flex items-center gap-2 text-[10px] font-bold uppercase text-ruvia-accent">
                        Ofício {index + 1}
                        <select className="max-w-48 bg-ruvia-panel text-white p-1" value={office} onChange={e => updateCharacter({ offices: activeCharacter.offices?.map((value, i) => i === index ? e.target.value : value) })}>
                          <option value="">Escolher...</option>
                          {AD_ASTRA_OFFICES.map(name => <option key={name}>{name}</option>)}
                        </select>
                      </label>
                    ))}
                    {(!activeCharacter.offices || activeCharacter.offices.length === 0) && (
                      <label className="flex items-center gap-2 text-[10px] font-bold uppercase text-ruvia-accent">
                        Ofício
                        <select className="max-w-48 bg-ruvia-panel text-white p-1" value="" onChange={e => updateCharacter({ offices: [e.target.value] })}>
                          <option value="">Escolher...</option>
                          {AD_ASTRA_OFFICES.map(name => <option key={name}>{name}</option>)}
                        </select>
                      </label>
                    )}
                    {totalLevel >= 9 && (activeCharacter.offices?.length || 0) < 2 && (
                      <button type="button" onClick={() => updateCharacter({ offices: [...(activeCharacter.offices || []), ''] })} className="text-[10px] text-ruvia-accent underline">Adicionar segundo Ofício</button>
                    )}
                    <label className="flex items-center gap-1 text-[10px] font-bold uppercase text-ruvia-accent">
                      <input type="checkbox" checked={activeCharacter.isCaptain || false} onChange={e => updateCharacter({ isCaptain: e.target.checked })} /> Capitão
                    </label>
                  </div>
                ) : (
                <div className="flex flex-wrap gap-1 justify-start md:justify-end max-w-sm">
                  {characterSpecializations.map(spec => {
                    const level = activeCharacter.specializations[spec] || 0;
                    return (
                      <div 
                        key={spec}
                        className={`flex items-center gap-1 px-1.5 py-0.5 border rounded-sm transition-all ${
                          level > 0 ? 'bg-ruvia-accent border-ruvia-accent text-ruvia-bg' : 'bg-transparent border-white/10 opacity-40 hover:opacity-100 text-white'
                        }`}
                      >
                        <button 
                          onClick={() => {
                            const current = activeCharacter.specializations[spec] || 0;
                            const next = current > 0 ? 0 : 1;
                            updateCharacter({ specializations: { ...activeCharacter.specializations, [spec]: next } });
                          }}
                          className="text-[8px] font-black uppercase tracking-tighter"
                        >
                          {spec}
                        </button>
                        {level > 0 && (
                          <input 
                            type="number"
                            min="1"
                            className="bg-ruvia-bg/20 text-ruvia-bg w-5 text-center text-[9px] font-bold outline-none rounded-sm"
                            value={level}
                            onChange={e => {
                              const val = Math.max(1, parseInt(e.target.value) || 1);
                              updateCharacter({ specializations: { ...activeCharacter.specializations, [spec]: val } });
                            }}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
                )}
                <div className="flex items-center gap-1 bg-ruvia-panel px-2 border border-ruvia-accent/30 self-start md:self-end">
                  <span className="text-[10px] text-ruvia-accent font-bold">NÍVEL TOTAL</span>
                  {isAdAstra ? (
                    <input type="number" min={1} max={20} className="bg-transparent text-white w-10 font-bold text-center text-sm" value={totalLevel} onChange={e => updateCharacter({ level: Math.max(1, Math.min(20, Number(e.target.value) || 1)) })} />
                  ) : <span className="text-white w-10 font-bold text-center text-sm">{totalLevel.toString().padStart(2, '0')}</span>}
                </div>
              </div>}
            </div>
          </motion.div>
      </header>

      {/* Main Content */}
      <div className="flex min-w-0 flex-col flex-1 gap-10">
        
        {/* Top Section: Basic Stats, Attributes, Domains & Elements */}
        <div className="grid min-w-0 grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Attributes & Status */}
          <aside className="min-w-0 lg:col-span-4 flex flex-col gap-8">
            <div className="space-y-8">
              <div className="relative group">
                <div className="absolute -left-4 top-0 w-1 h-full bg-ruvia-accent"></div>
                <p className="text-xs uppercase tracking-widest text-ruvia-accent mb-4 font-bold">Atributos</p>
                
                <div className="grid grid-cols-1 gap-4">
                  {[
                    { label: 'FORÇA', key: 'forca', icon: <Flame size={14} className="text-ruvia-accent/50" /> },
                    { label: 'DESTREZA', key: 'destreza', icon: <Wind size={14} className="text-ruvia-accent/50" /> },
                    { label: 'VIGOR', key: 'vigor', icon: <Shield size={14} className="text-ruvia-accent/50" /> },
                    { label: 'INTELECTO', key: 'intelecto', icon: <Brain size={14} className="text-ruvia-accent/50" /> },
                    { label: 'EXPRESSÃO', key: 'expressao', icon: <Scroll size={14} className="text-ruvia-accent/50" /> },
                    { label: 'CARISMA', key: 'carisma', icon: <Heart size={14} className="text-ruvia-accent/50" /> },
                  ].map((attr) => (
                    <div key={attr.key} className="flex min-w-0 justify-between items-center gap-2 border-b border-ruvia-panel pb-1 group/item">
                      <div className="flex min-w-0 items-center gap-2">
                        {attr.icon}
                        <span className="text-sm sm:text-base tracking-tight font-medium uppercase">{attr.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-baseline gap-1 mr-2">
                          <span className="text-xl sm:text-2xl font-black text-white italic tracking-tighter">
                            {effectiveAttributes[attr.key as keyof typeof effectiveAttributes].toString().padStart(2, '0')}
                          </span>
                        </div>
                        <input 
                          type="number"
                          className="bg-ruvia-panel text-ruvia-accent w-10 text-center font-bold text-sm outline-none border border-ruvia-accent/20 rounded hover:border-ruvia-accent transition-colors"
                          value={activeCharacter.attributes[attr.key as keyof CharacterAttributes]}
                          onChange={e => updateAttr(attr.key as keyof CharacterAttributes, parseInt(e.target.value) || 0)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>            {/* Status Bars */}
            <div className="space-y-6">
              {[
                {
                  label: 'PONTOS DE VIDA',
                  key: 'pv',
                  color: activeCharacter.supplement === 'quatro-elementos' ? 'bg-gradient-to-r from-rose-500 to-rose-300'
                    : activeCharacter.supplement === 'fading-humans' ? 'bg-gradient-to-r from-red-700 to-pink-400'
                      : 'bg-red-700',
                },
                {
                  label: activeCharacter.supplement === 'quatro-elementos' ? 'PONTOS DE CHI'
                    : activeCharacter.supplement === 'fading-humans' ? 'PONTOS DE SÍNTESE'
                      : activeCharacter.supplement === 'infames-condutores' || isAdAstra ? 'PONTOS DE ENERGIA'
                        : 'PONTOS DE MANA',
                  key: 'pm',
                  color: activeCharacter.supplement === 'quatro-elementos' ? 'bg-[#54b9ad]'
                    : activeCharacter.supplement === 'fading-humans' ? 'bg-gradient-to-r from-pink-300 to-violet-300'
                      : activeCharacter.supplement === 'ad-astra' ? 'bg-cyan-500'
                        : activeCharacter.supplement === 'infames-condutores' ? 'bg-emerald-500'
                          : 'bg-blue-600',
                },
              ].map(stat => (
                <div key={stat.key}>
                  <div className="flex justify-between items-center text-[10px] uppercase tracking-wider mb-1 font-bold">
                    <div className="flex items-center gap-2">
                       {activeCharacter.supplement === 'modulo-basico' && <button
                         type="button"
                         onClick={() => {
                           if (stat.key === 'pv') {
                             updateCharacter({ pvReduced: !activeCharacter.pvReduced });
                           } else {
                             updateCharacter({ pmReduced: !activeCharacter.pmReduced });
                           }
                         }}
                         className={`flex items-center gap-1.5 px-2 py-0.5 rounded border text-[8px] font-black tracking-wider uppercase transition-all ${
                           stat.key === 'pv'
                             ? activeCharacter.pvReduced
                               ? 'bg-red-950/50 border-red-500/80 text-red-500 hover:bg-red-900/50 hover:border-red-400'
                               : 'bg-transparent border-white/10 text-white/40 hover:bg-white/5 hover:border-white/20'
                             : activeCharacter.pmReduced
                               ? 'bg-blue-950/50 border-blue-500/80 text-blue-400 hover:bg-blue-900/50 hover:border-blue-400'
                               : 'bg-transparent border-white/10 text-white/40 hover:bg-white/5 hover:border-white/20'
                         }`}
                         title={
                           stat.key === 'pv'
                             ? `Ativar/Desativar Redução de PV Máximo (-${3 * totalLevel})`
                             : `Ativar/Desativar Redução de PM Máximo (-${3 * totalLevel})`
                         }
                       >
                         {stat.key === 'pv' ? (
                           <>
                             <HeartOff size={10} className={activeCharacter.pvReduced ? "text-red-500" : ""} />
                             <span>-{3 * totalLevel}</span>
                           </>
                         ) : (
                           <>
                             <ZapOff size={10} className={activeCharacter.pmReduced ? "text-blue-400" : ""} />
                             <span>-{3 * totalLevel}</span>
                           </>
                         )}
                       </button>}
                      <span>{stat.label}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <input 
                        type="number"
                        className="bg-transparent text-white w-10 text-right outline-none hover:bg-white/5 transition-colors font-bold"
                        value={statsWithOrigin[stat.key as 'pv' | 'pm'].current}
                        onChange={e => {
                          const val = parseInt(e.target.value) || 0;
                          updateStatCurrent(stat.key as 'pv'|'pm', val);
                        }}
                      />
                      {activeCharacter.supplement !== 'infames-condutores' && <span>/</span>}
                      <div className="flex items-center gap-1 group/adj">
                        {activeCharacter.supplement !== 'infames-condutores' && <span className="text-white w-10 text-right opacity-60">{statsWithOrigin[stat.key as 'pv' | 'pm'].max}</span>}
                        <input 
                          type="number"
                          placeholder="±"
                          className={`w-8 bg-transparent text-[8px] text-ruvia-accent ${activeCharacter.supplement === 'infames-condutores' ? 'opacity-100' : 'opacity-0 group-hover/adj:opacity-100 focus:opacity-100'} outline-none text-center border-b border-ruvia-accent/30`}
                          value={stat.key === 'pv' ? activeCharacter.pvAdjustment : activeCharacter.pmAdjustment}
                          onChange={e => updateCharacter({ [stat.key === 'pv' ? 'pvAdjustment' : 'pmAdjustment']: parseInt(e.target.value) || 0 })}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="h-3 bg-ruvia-panel rounded-full overflow-hidden border border-white/5 relative">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${statsWithOrigin[stat.key as 'pv'|'pm'].max > 0 ? Math.min(100, (statsWithOrigin[stat.key as 'pv'|'pm'].current / statsWithOrigin[stat.key as 'pv'|'pm'].max) * 100) : 0}%` }}
                        className={`h-full ${stat.color} transition-all duration-500`}
                      />
                  </div>
                </div>
              ))}
            </div>

            {activeCharacter.supplement === 'infames-condutores' && (
              <section className="rounded-sm border border-white/10 bg-black/20 p-3">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-emerald-300">Histórico recente de PV e PE</h3>
                <div className="mt-2 flex max-h-40 flex-col gap-1 overflow-y-auto">
                  {[...(activeCharacter.statChangeLog || [])].reverse().map(change => (
                    <div key={change.id} className="flex items-center justify-between gap-2 text-xs">
                      <span>{change.key.toUpperCase()}: {change.before} → {change.after} <span className="opacity-60">{new Date(change.changedAt).toLocaleTimeString()}</span></span>
                      <button type="button" onClick={() => undoStatChange(change.id)} className="rounded border border-white/20 px-2 py-0.5">Desfazer</button>
                    </div>
                  ))}
                  {(activeCharacter.statChangeLog || []).length === 0 && <span className="text-xs opacity-60">Nenhuma mudança registrada nesta sessão.</span>}
                </div>
              </section>
            )}

            {/* Soul Tests */}
            <div className="p-4 bg-ruvia-panel/50 border border-ruvia-accent/20 rounded-sm shadow-inner">
              <div className="flex justify-between items-center mb-3">
                <span className="text-[10px] font-black text-ruvia-accent uppercase tracking-widest">Testes de Alma</span>
                <div className="flex items-center gap-1">
                  <input 
                    type="number"
                    className="bg-ruvia-bg text-white w-10 text-center text-[10px] font-bold outline-none border border-ruvia-accent/30 rounded"
                    value={activeCharacter.soulTestsAdjustment}
                    onChange={e => updateCharacter({ soulTestsAdjustment: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-2 items-center">
                {activeCharacter.supplement === 'modulo-basico' && <button
                  type="button"
                  onClick={() => updateCharacter({ soulTestStarActive: !activeCharacter.soulTestStarActive })}
                  className={`w-8 h-8 rounded-full transition-all duration-500 flex items-center justify-center border ${
                    activeCharacter.soulTestStarActive
                      ? 'bg-yellow-500/10 border-yellow-500/80 shadow-[0_0_15px_rgba(234,179,8,0.6),inset_0_0_8px_rgba(255,255,255,0.4)]'
                      : 'bg-gray-800 border-white/5 opacity-20 shadow-none'
                  }`}
                  title="Estrela Especial do Teste de Alma"
                >
                  <Star 
                    size={16} 
                    className={activeCharacter.soulTestStarActive ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'} 
                  />
                </button>}
                
                {/* Divisor Visual */}
                <div className="w-[1px] h-6 bg-white/10 mx-1"></div>

                {Array.from({ length: Math.max(0, 3 + (currentSkills.find(s => s.name === 'Sobrevivência')?.bonus || 0) + activeCharacter.soulTestsAdjustment) }).map((_, i) => {
                  const isCurrentlyUsed = isTestUsed(i);
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => toggleSoulTest(i)}
                      className={`w-6 h-6 rounded-full transition-all duration-700 flex items-center justify-center border ${
                        isCurrentlyUsed 
                          ? 'bg-gray-800 border-white/5 opacity-20 shadow-none' 
                          : 'bg-white/5 border-ruvia-accent shadow-[0_0_15px_rgba(165,180,252,0.8),inset_0_0_8px_rgba(255,255,255,0.4)] animate-pulse'
                      }`}
                    >
                      <Sparkles size={12} className={isCurrentlyUsed ? 'text-gray-600' : 'text-blue-100'} />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Defense Display */}
            <div className="p-4 bg-ruvia-panel/50 border border-ruvia-accent/20 rounded-sm shadow-inner mt-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Shield size={16} className="text-ruvia-accent" />
                  <span className="text-[10px] font-black text-ruvia-accent uppercase tracking-widest">Defesa Total</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-baseline gap-1 mr-2">
                    <span className="text-3xl font-black text-white italic">{defenseValue}</span>
                  </div>
                  <input 
                    type="number"
                    placeholder="±"
                    className="w-10 bg-ruvia-bg text-ruvia-accent text-xs font-bold text-center border border-ruvia-accent/30 rounded py-1 outline-none hover:border-ruvia-accent transition-colors"
                    value={activeCharacter.defenseAdjustment || 0}
                    onChange={e => updateCharacter({ defenseAdjustment: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>
              <p className="text-[8px] text-gray-500 uppercase font-bold mt-2 leading-tight">
                Reflete sua capacidade de evitar golpes e resistir a danos físicos.
              </p>
            </div>
          </aside>

          {/* Domains & Elements and Notes */}
          <div className={`lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6 ${activeCharacter.supplement !== 'modulo-basico' ? 'hidden' : ''}`}>
            <section className="bg-ruvia-card border border-ruvia-border p-4 rounded-sm relative shadow-2xl flex flex-col gap-8 backdrop-blur-sm bg-white/5 min-h-full">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles size={14} className="text-indigo-400" />
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">Domínios</h3>
                </div>
                <div className="space-y-4">
                  {DOMAINS_LIST.map(domain => (
                    <div key={domain} className="space-y-1">
                      <div className="flex justify-between text-[9px] font-bold uppercase tracking-tighter">
                        <span>{domain}</span>
                        <input 
                           type="number"
                           className="bg-transparent text-white w-8 text-right outline-none text-[10px]"
                           value={activeCharacter.domains[domain] || 0}
                           onChange={e => updateCharacter({ domains: { ...activeCharacter.domains, [domain]: parseInt(e.target.value) || 0 } })}
                        />
                      </div>
                      <div className="h-1.5 bg-ruvia-panel rounded-full overflow-hidden border border-white/5">
                         <div 
                           className="h-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)] transition-all" 
                           style={{ width: `${Math.min(100, ((activeCharacter.domains[domain] || 0) / 10) * 100)}%` }}
                         />
                      </div>
                    </div>
                  ))}
                  <div className="pt-2 border-t border-indigo-500/30 flex justify-between items-center text-[10px] font-black uppercase">
                    <span className="text-indigo-300">Total Pontos</span>
                    <span className="text-white bg-indigo-500/40 px-2 py-0.5 rounded-sm border border-indigo-400/30 font-mono">
                      {DOMAINS_LIST.reduce((a, b) => a + (activeCharacter.domains[b] || 0), 0).toString().padStart(2, '0')}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-4">
                   <Zap size={14} className="text-emerald-400" />
                   <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">Elementos</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 max-h-[380px] overflow-y-auto pr-2 custom-scrollbar">
                  {ELEMENTS_LIST.map(el => (
                    <div key={el} className={`flex justify-between items-center bg-white/5 p-1.5 rounded-sm border border-emerald-500/10 hover:border-emerald-500/30 transition-colors ${el === 'Espírito' ? 'sm:col-span-2' : ''}`}>
                      <span className="text-[9px] font-bold uppercase tracking-tight">{el}</span>
                      <input 
                        type="number"
                        className="bg-ruvia-bg/50 text-white w-8 text-center text-[10px] font-bold outline-none border border-emerald-500/20 rounded hover:border-emerald-400 transition-colors"
                        value={activeCharacter.elements[el] || 0}
                        onChange={e => updateCharacter({ elements: { ...activeCharacter.elements, [el]: parseInt(e.target.value) || 0 } })}
                      />
                    </div>
                  ))}
                </div>
                <div className="mt-2 pt-2 border-t border-emerald-500/30 flex justify-between items-center text-[10px] font-black uppercase">
                  <span className="text-emerald-300">Total Pontos</span>
                  <span className="text-white bg-emerald-500/40 px-2 py-0.5 rounded-sm border border-emerald-400/30 font-mono">
                    {ELEMENTS_LIST.reduce((a, b) => a + (activeCharacter.elements[b] || 0), 0).toString().padStart(2, '0')}
                  </span>
                </div>
              </div>
            </section>

            <div className="flex flex-col gap-6">
              <div className="bg-ruvia-card border border-ruvia-border p-5 shadow-2xl rounded-sm flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <BookOpen size={14} className="text-ruvia-accent" />
                  <p className="text-[10px] uppercase text-ruvia-accent font-bold tracking-widest">Notas Pessoais</p>
                </div>
                <textarea 
                  className="w-full bg-ruvia-panel border border-ruvia-accent/20 text-xs p-3 h-full min-h-[300px] outline-none text-gray-300 font-sans cursor-text hover:bg-white/5 transition-colors resize-none"
                  value={activeCharacter.notes}
                  onChange={e => updateCharacter({ notes: e.target.value })}
                  placeholder="Suas anotações aqui..."
                />
              </div>

              {(activeCharacter.origin || activeCharacter.supplement === 'ad-astra' || activeCharacter.supplement === 'fading-humans') && (
                <div className="bg-ruvia-card border border-ruvia-accent p-4 shadow-2xl rounded-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles size={14} className="text-ruvia-accent" />
                    <p className="text-[10px] uppercase text-ruvia-accent font-bold tracking-widest">Habilidade de Origem</p>
                  </div>
                  {(() => {
                    const origin = activeOriginDetails;
                    return origin ? (
                      <div>
                        <p className="text-sm font-bold text-white uppercase italic">{origin.abilityName}</p>
                        <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">{origin.abilityDescription}</p>
                        <p className="text-[9px] text-ruvia-accent/70 mt-2 uppercase font-black">{origin.bonus}</p>
                      </div>
                    ) : null;
                  })()}
                </div>
              )}
            </div>
          </div>

          {activeCharacter.supplement !== 'modulo-basico' && (
            <div className="min-w-0 lg:col-span-8">
              {activeOriginDetails && (activeCharacter.supplement === 'quatro-elementos' || activeCharacter.supplement === 'infames-condutores') && (
                <section className="mb-4 rounded-sm border border-current/20 bg-black/10 p-4">
                  <p className="text-[10px] font-medium uppercase tracking-widest opacity-70">Habilidade de Origem</p>
                  <h3 className="mt-1 font-semibold uppercase">{activeOriginDetails.abilityName}</h3>
                  <p className="mt-1 text-sm">{activeOriginDetails.abilityDescription}</p>
                  <p className="mt-2 text-xs opacity-70">{activeOriginDetails.bonus}</p>
                </section>
              )}
              <SupplementPanels
                supplement={activeCharacter.supplement || 'modulo-basico'}
                data={activeCharacter.supplementData || {}}
                attributes={effectiveAttributes}
                skills={currentSkills}
                trainingPoints={trainingPoints}
                onChange={updateSupplementData}
                onSpendCharacterPoint={spendCharacterPoint}
              />
            </div>
          )}
        </div>

        {/* Perícias Section - Full Width */}
        <section className="min-w-0 flex flex-col gap-4">
          <div className="bg-ruvia-panel/30 border border-ruvia-accent/20 p-4 rounded-sm flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-ruvia-accent uppercase tracking-widest leading-none">Treinamento</span>
              <h2 className="text-2xl font-black italic uppercase italic">Perícias</h2>
            </div>
            {activeCharacter.origin && (
              <div className="flex items-center gap-6">
                <div className="flex flex-col items-end">
                  <span className="text-[9px] font-bold text-gray-500 uppercase italic">Ajuste Manual</span>
                  <input 
                    type="number"
                    className="bg-ruvia-bg text-white w-14 text-center text-xs font-bold outline-none border border-ruvia-accent/20 rounded py-1"
                    value={activeCharacter.trainingPointsAdjustment}
                    onChange={e => updateCharacter({ trainingPointsAdjustment: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className="flex flex-col items-center bg-ruvia-accent/10 border border-ruvia-accent/30 px-6 py-2 rounded-sm">
                  <span className="text-[10px] font-bold text-ruvia-accent uppercase tracking-tighter">Pontos Disponíveis</span>
                  <span className={`text-3xl font-black leading-none mt-1 ${trainingPoints < 0 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
                    {trainingPoints}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="min-w-0 bg-ruvia-card border border-ruvia-border p-4 sm:p-8 rounded-sm shadow-2xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-10 gap-y-4">
              {currentSkills.map((skill, idx) => {
                const isSkillLocked = skill.isLocked && !activeCharacter.unlockedSkills.includes(skill.name);
                return (
                   <div
                     key={idx} 
                     className={`flex min-w-0 justify-between items-center gap-2 pb-2 border-b border-ruvia-panel transition-all ${isSkillLocked ? 'opacity-20 grayscale scale-[0.98]' : 'hover:border-ruvia-accent group'}`}
                   >
                     <div className="flex min-w-0 flex-col">
                        <div className="flex items-center gap-2">
                          <button 
                              onClick={() => skill.isLocked && toggleSkillUnlock(skill.name)}
                              className={`max-w-[100px] truncate text-[10px] sm:text-[11px] font-black uppercase tracking-tight transition-colors ${skill.isLocked ? 'cursor-pointer hover:text-ruvia-accent' : 'cursor-default text-white'}`}
                          >
                              {skill.name}
                          </button>
                          {skill.isLocked && (isSkillLocked ? <Lock size={10} className="text-gray-600" /> : <Unlock size={10} className="text-ruvia-accent" />)}
                        </div>
                        <span className="text-[8px] text-gray-500 uppercase font-bold">Modificador</span>
                     </div>
                    <div className="flex shrink-0 items-center gap-2">
                        <span className="text-xl font-black text-ruvia-accent italic font-mono w-10 text-right group-hover:scale-110 transition-transform">
                            {skill.bonus >= 0 ? '+' : ''}{skill.bonus}
                        </span>
                        <div className="flex flex-col items-center">
                          <input 
                              type="number"
                              className="bg-ruvia-panel text-white w-10 text-center text-xs font-bold border border-white/5 rounded outline-none focus:border-ruvia-accent py-1"
                              value={activeCharacter.skillTraining[skill.name] || 0}
                              onChange={(e) => updateSkillTraining(skill.name, parseInt(e.target.value) || 0)}
                          />
                        </div>
                    </div>
                   </div>
                 );
               })}
             </div>
          </div>
        </section>

        {/* Habilidades Section - Full Width */}
        <section className="min-w-0 flex flex-col gap-4">
          {abilityCategories.map(category => {
            const entries = abilityEntries.filter(entry => entry.category === category);
            return (
              <div key={category} className="flex flex-col gap-3">
                <div className="bg-ruvia-panel/30 border border-ruvia-accent/20 p-4 rounded-sm flex flex-wrap gap-3 justify-between items-center">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-ruvia-accent uppercase tracking-widest leading-none">Poderes & Especialidades</span>
                    <h2 className="text-lg sm:text-2xl font-black italic uppercase">{category}</h2>
                  </div>
                  <button
                    onClick={() => updateCharacter({ abilities: [...activeCharacter.abilities, { name: `Nova ${category}`, description: 'Descrição...', category }] })}
                    className="bg-ruvia-accent text-ruvia-bg px-4 py-2 flex items-center gap-2 font-bold uppercase text-xs hover:scale-105 transition-transform"
                  >
                    <Plus size={16} /> Adicionar
                  </button>
                </div>
                <div className="min-w-0 bg-ruvia-card border border-ruvia-border p-4 sm:p-6 rounded-sm shadow-2xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {entries.length === 0 ? (
                    <div className="col-span-full py-8 flex flex-col items-center justify-center opacity-30 border-2 border-dashed border-white/10">
                      <Scroll size={32} />
                      <p className="mt-2 text-xs uppercase font-bold tracking-[0.2em]">Nenhum item registrado</p>
                    </div>
                  ) : entries.map(({ ability, index }) => (
                    <motion.div
                      layout
                      key={`${category}-${index}`}
                      className="bg-ruvia-panel border border-white/5 p-4 rounded-sm relative group hover:border-ruvia-accent/50 transition-colors"
                    >
                      <input
                        className="text-sm font-black text-white mb-2 uppercase tracking-wide bg-transparent outline-none w-full border-b border-white/10 focus:border-ruvia-accent transition-colors"
                        value={ability.name}
                        onChange={event => updateCharacter({ abilities: activeCharacter.abilities.map((item, i) => i === index ? { ...item, name: event.target.value } : item) })}
                      />
                      <textarea
                        className="text-[11px] leading-relaxed text-gray-400 bg-transparent outline-none w-full h-24 mt-2 hover:bg-white/5 transition-colors resize-none scrollbar-hide"
                        value={ability.description}
                        onChange={event => updateCharacter({ abilities: activeCharacter.abilities.map((item, i) => i === index ? { ...item, description: event.target.value } : item) })}
                      />
                      <button
                        onClick={() => updateCharacter({ abilities: activeCharacter.abilities.filter((_, i) => i !== index) })}
                        className="absolute right-2 top-2 text-red-500/30 hover:text-red-500 p-1 transition-colors"
                        aria-label="Remover habilidade"
                      >
                        <Trash2 size={14} />
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>
            );
          })}
        </section>

        {/* Inventário Section - Full Width */}
        <section className="min-w-0 flex flex-col gap-4">
          <div className="bg-ruvia-panel/30 border border-ruvia-accent/20 p-4 rounded-sm flex flex-wrap gap-3 justify-between items-center">
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-ruvia-accent uppercase tracking-widest leading-none">Posse de Equipamentos</span>
              <h2 className="text-2xl font-black italic uppercase italic">Inventário</h2>
            </div>
            <button 
              onClick={() => addItemToInventory({ id: '', name: 'Novo Item', description: 'Descrição...', icon: '' })}
              className="bg-ruvia-accent text-ruvia-bg px-4 py-2 flex items-center gap-2 font-bold uppercase text-xs hover:scale-105 transition-transform"
            >
              <Plus size={16} /> Adicionar Item
            </button>
          </div>

          <div className="min-w-0 bg-ruvia-card border border-ruvia-border p-4 sm:p-8 rounded-sm shadow-2xl">
            {activeCharacter.inventory.length === 0 ? (
              <div className="h-40 flex flex-col items-center justify-center text-ruvia-accent/20 border-2 border-dashed border-white/5 rounded">
                <Package size={48} />
                <p className="text-sm mt-4 font-black uppercase tracking-[0.4em]">Sua mochila está vazia</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {activeCharacter.inventory.map((item, idx) => (
                  <div key={item.id} className="bg-ruvia-panel border border-white/5 p-4 rounded-sm group hover:border-ruvia-accent/40 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <input 
                        className="font-black text-white text-xs uppercase bg-transparent outline-none w-full border-b border-white/10 focus:border-ruvia-accent transition-colors pb-1 mr-4"
                        value={item.name}
                        onChange={e => {
                          const newInv = [...activeCharacter.inventory];
                          newInv[idx].name = e.target.value;
                          updateCharacter({ inventory: newInv });
                        }}
                      />
                      <div className="flex items-center gap-2">
                        {item.price !== undefined && (
                          <div className="flex items-center gap-1 bg-ruvia-bg px-2 py-0.5 rounded border border-ruvia-accent/20">
                            <input 
                              type="number"
                              className="text-[10px] font-mono text-ruvia-accent bg-transparent outline-none w-10 text-right"
                              value={item.price}
                              onChange={e => {
                                const newInv = [...activeCharacter.inventory];
                                newInv[idx].price = parseInt(e.target.value) || 0;
                                updateCharacter({ inventory: newInv });
                              }}
                            />
                            <Coins size={10} className="text-ruvia-accent" />
                          </div>
                        )}
                        <button 
                          onClick={() => updateCharacter({
                            inventory: activeCharacter.inventory.filter((_, i) => i !== idx)
                          })}
                          className="text-red-500/30 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    <textarea 
                      className="text-[11px] text-gray-400 font-sans italic bg-transparent outline-none w-full h-20 hover:bg-white/5 transition-colors resize-none mt-2"
                      value={item.description}
                      onChange={e => {
                        const newInv = [...activeCharacter.inventory];
                        newInv[idx].description = e.target.value;
                        updateCharacter({ inventory: newInv });
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

      </div>


      {/* Footer */}
      <footer className="mt-8 flex flex-col md:flex-row justify-center items-center text-[10px] uppercase tracking-[0.2em] text-ruvia-accent/50 gap-4">
        {/* Requested removals completed */}
      </footer>
    </div>
  );
}
