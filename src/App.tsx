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
  User
} from 'lucide-react';
import { 
  CharacterSheet, 
  Item, 
  Skill, 
  ClassAbility, 
  CharacterAttributes 
} from './types';
import { 
  INITIAL_CHARACTER, 
  SPECIALIZATIONS_LIST, 
  DOMAINS_LIST, 
  ELEMENTS_LIST 
} from './constants';
import { ORIGINS, Origin } from './originData';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [characters, setCharacters] = useState<CharacterSheet[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [view, setView] = useState<'list' | 'sheet'>('list');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load from localStorage on mount
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
    setLoading(false);
  }, []);

  // Save to localStorage whenever characters change
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('ruvia_characters', JSON.stringify(characters));
    }
  }, [characters, loading]);

  const activeCharacter = useMemo(() => {
    return characters.find(c => c.id === activeId) || characters[0] || INITIAL_CHARACTER;
  }, [characters, activeId]);

  const totalLevel = useMemo(() => {
    if (!activeCharacter || !activeCharacter.specializations) return 1;
    const sum = (Object.values(activeCharacter.specializations) as number[]).reduce((a, b) => a + (b || 0), 0);
    return sum || 1;
  }, [activeCharacter?.specializations]);

  const updateCharacter = (updates: Partial<CharacterSheet>) => {
    if (!activeCharacter || activeCharacter === INITIAL_CHARACTER) return;
    
    setCharacters(prev => prev.map(c => 
      c.id === activeCharacter.id 
        ? { ...c, ...updates, updatedAt: new Date().toISOString() } 
        : c
    ));
  };

  const exportCharacters = () => {
    const dataStr = JSON.stringify(characters, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'ruvia_personagens_backup.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const importCharacters = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string) as CharacterSheet[];
        if (Array.isArray(imported)) {
          setCharacters(imported);
          alert(`${imported.length} personagens carregados com sucesso!`);
        }
      } catch (err) {
        alert("Erro ao importar arquivo. Verifique se o formato está correto.");
        console.error(err);
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const updateAttr = (key: keyof CharacterAttributes, val: number) => {
    updateCharacter({
      attributes: { ...activeCharacter.attributes, [key]: val }
    });
  };

  const updateSkillTraining = (skillName: string, val: number) => {
    updateCharacter({
      skillTraining: { ...activeCharacter.skillTraining, [skillName]: val }
    });
  };

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
    updateCharacter({
      stats: {
        ...activeCharacter.stats,
        [key]: { ...activeCharacter.stats[key], current: val }
      }
    });
  };

  const effectiveAttributes = useMemo(() => {
    if (!activeCharacter || !activeCharacter.attributes) return INITIAL_CHARACTER.attributes;
    const origin = ORIGINS.find(o => o.name === activeCharacter.origin);
    const bonuses = origin?.attributeBonuses || {};
    
    return {
      forca: (activeCharacter.attributes.forca || 0) + (bonuses.forca || 0) + (bonuses.all || 0),
      destreza: (activeCharacter.attributes.destreza || 0) + (bonuses.destreza || 0) + (bonuses.all || 0),
      vigor: (activeCharacter.attributes.vigor || 0) + (bonuses.vigor || 0) + (bonuses.all || 0),
      intelecto: (activeCharacter.attributes.intelecto || 0) + (bonuses.intelecto || 0) + (bonuses.all || 0),
      expressao: (activeCharacter.attributes.expressao || 0) + (bonuses.expressao || 0) + (bonuses.all || 0),
      carisma: (activeCharacter.attributes.carisma || 0) + (bonuses.carisma || 0) + (bonuses.all || 0),
    };
  }, [activeCharacter.attributes, activeCharacter.origin]);

  const calculateSkills = (attrs: CharacterAttributes, lvl: number, training: { [name: string]: number }): Skill[] => {
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
      { name: 'Luta Básico', bonus: floor((3 * F + 2 * D + I + E) / 7) },
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

    return [...basicSkills, ...lockedSkills];
  };

  const currentSkills = useMemo(() => 
    calculateSkills(effectiveAttributes, totalLevel, activeCharacter.skillTraining), 
    [effectiveAttributes, totalLevel, activeCharacter.skillTraining]
  );

  const statsWithOrigin = useMemo(() => {
    if (!activeCharacter || !activeCharacter.stats) return INITIAL_CHARACTER.stats;
    const origin = ORIGINS.find(o => o.name === activeCharacter.origin);
    const pvPerLvl = origin?.pvPerLevel || 0;
    const pmPerLvl = origin?.pmPerLevel || 0;
    
    const fortitude = currentSkills.find(s => s.name === 'Fortitude')?.bonus || 0;
    const arcanismo = currentSkills.find(s => s.name === 'Arcanismo')?.bonus || 0;

    const maxPV = 10 + (pvPerLvl * totalLevel) + (6 * fortitude) + (activeCharacter.pvAdjustment || 0);
    const maxPM = 5 + (pmPerLvl * totalLevel) + (2 * arcanismo) + (2 * fortitude) + (activeCharacter.pmAdjustment || 0);

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
  }, [activeCharacter.stats, activeCharacter.origin, totalLevel, currentSkills, activeCharacter.pvAdjustment, activeCharacter.pmAdjustment]);

  const trainingPoints = useMemo(() => {
    if (!activeCharacter) return 0;
    const origin = ORIGINS.find(o => o.name === activeCharacter.origin);
    const base = origin?.trainingPoints || 0;
    const used = (Object.values(activeCharacter.skillTraining || {}) as number[]).reduce((a, b) => a + (b || 0), 0);
    return base + (activeCharacter.trainingPointsAdjustment || 0) - used;
  }, [activeCharacter.origin, activeCharacter.trainingPointsAdjustment, activeCharacter.skillTraining]);

  const toggleSkillUnlock = (skillName: string) => {
    const isUnlocked = activeCharacter.unlockedSkills.includes(skillName);
    const newUnlocked = isUnlocked 
      ? activeCharacter.unlockedSkills.filter(s => s !== skillName)
      : [...activeCharacter.unlockedSkills, skillName];
    updateCharacter({ unlockedSkills: newUnlocked });
  };

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

  const addNewCharacter = () => {
    const id = Math.random().toString(36).substr(2, 9);
    const initialSpecializations = { 'Lutador': 1 };
    
    const newChar: CharacterSheet = {
      ...INITIAL_CHARACTER,
      id,
      name: 'Novo Herói',
      specializations: initialSpecializations,
      stats: {
        pv: { current: 10, max: 10 },
        pm: { current: 5, max: 5 },
      },
      level: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setCharacters(prev => [...prev, newChar]);
    setActiveId(id);
    setView('sheet');
  };

  const deleteCharacter = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCharacters(prev => prev.filter(c => c.id !== id));
    if (activeId === id) setActiveId(null);
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
            <button 
              onClick={addNewCharacter}
              className="bg-ruvia-accent text-ruvia-bg px-4 py-2 flex items-center gap-2 font-bold uppercase text-xs hover:scale-105 transition-transform shadow-[0_0_15px_rgba(255,255,255,0.1)]"
            >
              <UserPlus size={16} /> Novo Personagem
            </button>
          </div>
        </header>

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
                  onClick={addNewCharacter}
                  className="text-ruvia-accent border border-ruvia-accent px-4 py-2 hover:bg-ruvia-accent hover:text-ruvia-bg transition-all font-bold uppercase text-xs"
                >
                  Criar Primeiro Herói
                </button>
              </div>
            </div>
          ) : characters.map(char => (
            <motion.div
              layoutId={char.id}
              key={char.id}
              onClick={() => {
                setActiveId(char.id);
                setView('sheet');
              }}
              className="bg-ruvia-card border border-ruvia-border p-6 rounded-sm cursor-pointer hover:border-ruvia-accent group transition-all"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-bold text-white group-hover:text-ruvia-accent transition-colors">{char.name}</h3>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {Object.entries(char.specializations || {}).filter(([_, lvl]: [string, any]) => (lvl as number) > 0).map(([name, lvl]: [string, any]) => (
                      <span key={name} className="text-[9px] bg-ruvia-accent/10 border border-ruvia-accent/20 text-ruvia-accent px-1 rounded-sm uppercase font-bold">
                        {name} {lvl as number}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase tracking-widest text-ruvia-accent/60">Nível Total</p>
                  <p className="text-xl font-black">
                    {(Object.values(char.specializations || {}) as number[]).reduce((a, b) => a + (b || 0), 0) || 1}
                  </p>
                </div>
              </div>
              
              <div className="mt-6 flex flex-wrap gap-4 text-[10px] uppercase font-bold opacity-60">
                <div className="flex items-center gap-1">
                  <Heart size={10} className="text-red-500" /> 
                  {char.stats.pv.current}/{
                    10 + 
                    ((ORIGINS.find(o => o.name === char.origin)?.pvPerLevel || 0) * ((Object.values(char.specializations || {}) as number[]).reduce((a, b) => a + (b || 0), 0) || 1)) + 
                    (6 * (calculateSkills(
                      {
                        forca: char.attributes.forca + (ORIGINS.find(o => o.name === char.origin)?.attributeBonuses.forca || 0) + (ORIGINS.find(o => o.name === char.origin)?.attributeBonuses.all || 0),
                        destreza: char.attributes.destreza + (ORIGINS.find(o => o.name === char.origin)?.attributeBonuses.destreza || 0) + (ORIGINS.find(o => o.name === char.origin)?.attributeBonuses.all || 0),
                        vigor: char.attributes.vigor + (ORIGINS.find(o => o.name === char.origin)?.attributeBonuses.vigor || 0) + (ORIGINS.find(o => o.name === char.origin)?.attributeBonuses.all || 0),
                        intelecto: char.attributes.intelecto + (ORIGINS.find(o => o.name === char.origin)?.attributeBonuses.intelecto || 0) + (ORIGINS.find(o => o.name === char.origin)?.attributeBonuses.all || 0),
                        expressao: char.attributes.expressao + (ORIGINS.find(o => o.name === char.origin)?.attributeBonuses.expressao || 0) + (ORIGINS.find(o => o.name === char.origin)?.attributeBonuses.all || 0),
                        carisma: char.attributes.carisma + (ORIGINS.find(o => o.name === char.origin)?.attributeBonuses.carisma || 0) + (ORIGINS.find(o => o.name === char.origin)?.attributeBonuses.all || 0),
                      },
                      (Object.values(char.specializations || {}) as number[]).reduce((a, b) => a + (b || 0), 0) || 1,
                      char.skillTraining || {}
                    ).find(s => s.name === 'Fortitude')?.bonus || 0)) + 
                    (char.pvAdjustment || 0)
                  } PV
                </div>
                <div className="flex items-center gap-1">
                  <Zap size={10} className="text-blue-400" /> 
                  {char.stats.pm.current}/{
                    5 + 
                    ((ORIGINS.find(o => o.name === char.origin)?.pmPerLevel || 0) * ((Object.values(char.specializations || {}) as number[]).reduce((a, b) => a + (b || 0), 0) || 1)) + 
                    (2 * (calculateSkills(
                      {
                        forca: char.attributes.forca + (ORIGINS.find(o => o.name === char.origin)?.attributeBonuses.forca || 0) + (ORIGINS.find(o => o.name === char.origin)?.attributeBonuses.all || 0),
                        destreza: char.attributes.destreza + (ORIGINS.find(o => o.name === char.origin)?.attributeBonuses.destreza || 0) + (ORIGINS.find(o => o.name === char.origin)?.attributeBonuses.all || 0),
                        vigor: char.attributes.vigor + (ORIGINS.find(o => o.name === char.origin)?.attributeBonuses.vigor || 0) + (ORIGINS.find(o => o.name === char.origin)?.attributeBonuses.all || 0),
                        intelecto: char.attributes.intelecto + (ORIGINS.find(o => o.name === char.origin)?.attributeBonuses.intelecto || 0) + (ORIGINS.find(o => o.name === char.origin)?.attributeBonuses.all || 0),
                        expressao: char.attributes.expressao + (ORIGINS.find(o => o.name === char.origin)?.attributeBonuses.expressao || 0) + (ORIGINS.find(o => o.name === char.origin)?.attributeBonuses.all || 0),
                        carisma: char.attributes.carisma + (ORIGINS.find(o => o.name === char.origin)?.attributeBonuses.carisma || 0) + (ORIGINS.find(o => o.name === char.origin)?.attributeBonuses.all || 0),
                      },
                      (Object.values(char.specializations || {}) as number[]).reduce((a, b) => a + (b || 0), 0) || 1,
                      char.skillTraining || {}
                    ).find(s => s.name === 'Arcanismo')?.bonus || 0)) + 
                    (2 * (calculateSkills(
                      {
                        forca: char.attributes.forca + (ORIGINS.find(o => o.name === char.origin)?.attributeBonuses.forca || 0) + (ORIGINS.find(o => o.name === char.origin)?.attributeBonuses.all || 0),
                        destreza: char.attributes.destreza + (ORIGINS.find(o => o.name === char.origin)?.attributeBonuses.destreza || 0) + (ORIGINS.find(o => o.name === char.origin)?.attributeBonuses.all || 0),
                        vigor: char.attributes.vigor + (ORIGINS.find(o => o.name === char.origin)?.attributeBonuses.vigor || 0) + (ORIGINS.find(o => o.name === char.origin)?.attributeBonuses.all || 0),
                        intelecto: char.attributes.intelecto + (ORIGINS.find(o => o.name === char.origin)?.attributeBonuses.intelecto || 0) + (ORIGINS.find(o => o.name === char.origin)?.attributeBonuses.all || 0),
                        expressao: char.attributes.expressao + (ORIGINS.find(o => o.name === char.origin)?.attributeBonuses.expressao || 0) + (ORIGINS.find(o => o.name === char.origin)?.attributeBonuses.all || 0),
                        carisma: char.attributes.carisma + (ORIGINS.find(o => o.name === char.origin)?.attributeBonuses.carisma || 0) + (ORIGINS.find(o => o.name === char.origin)?.attributeBonuses.all || 0),
                      },
                      (Object.values(char.specializations || {}) as number[]).reduce((a, b) => a + (b || 0), 0) || 1,
                      char.skillTraining || {}
                    ).find(s => s.name === 'Fortitude')?.bonus || 0)) + 
                    (char.pmAdjustment || 0)
                  } PM
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
      </div>
    );
  }

  return (
    <div className="max-w-[1024px] mx-auto min-h-screen p-8 flex flex-col gap-6 select-none sm:p-4">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end border-b-2 border-ruvia-accent pb-4">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-4"
        >
          <button 
            onClick={() => { setView('list'); }}
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
            <div className="flex items-center gap-1 bg-ruvia-panel px-3 py-1 border border-ruvia-accent shadow-lg rounded-sm">
              <span className="text-[10px] text-ruvia-accent font-black uppercase tracking-tighter mr-1">Origem do Herói:</span>
              <select 
                className="bg-transparent text-white font-bold outline-none text-sm cursor-pointer hover:text-ruvia-accent transition-colors"
                value={activeCharacter.origin || ''}
                onChange={e => updateCharacter({ origin: e.target.value })}
              >
                <option value="" className="bg-ruvia-bg italic">Escolha uma Origem...</option>
                {ORIGINS.map(o => (
                  <option key={o.name} value={o.name} className="bg-ruvia-bg font-bold">{o.name}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2 w-full">
              <input 
                className="bg-ruvia-panel border border-ruvia-accent/30 p-1 text-2xl font-bold text-white w-full md:text-right outline-none hover:bg-white/5 transition-colors"
                value={activeCharacter.name}
                onChange={e => updateCharacter({ name: e.target.value })}
                placeholder="NOME"
              />
              <div className="flex flex-col gap-2 md:items-end">
                <div className="flex flex-wrap gap-1 justify-start md:justify-end max-w-sm">
                  {SPECIALIZATIONS_LIST.map(spec => {
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
                <div className="flex items-center gap-1 bg-ruvia-panel px-2 border border-ruvia-accent/30 self-start md:self-end">
                  <span className="text-[10px] text-ruvia-accent font-bold">NÍVEL TOTAL</span>
                  <span className="text-white w-10 font-bold text-center text-sm">{totalLevel.toString().padStart(2, '0')}</span>
                </div>
              </div>
            </div>
          </motion.div>
      </header>

      {/* Main Content */}
      <div className="flex flex-col xl:flex-row flex-1 gap-6">
        
        {/* Left Column: Attributes & Status */}
        <aside className="w-full xl:w-56 flex flex-col justify-start py-2 gap-6">
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
                  <div key={attr.key} className="flex justify-between items-center border-b border-ruvia-panel pb-1 group/item">
                    <div className="flex items-center gap-2">
                      {attr.icon}
                      <span className="text-base tracking-tight font-medium uppercase">{attr.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-baseline gap-1 mr-2">
                        <span className="text-2xl font-black text-white italic tracking-tighter">
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
          </div>

          {/* Status Bars */}
          <div className="space-y-6">
            {[
              { label: 'PONTOS DE VIDA', key: 'pv', color: 'bg-red-700' },
              { label: 'PONTOS DE MANA', key: 'pm', color: 'bg-blue-600' },
            ].map(stat => (
              <div key={stat.key}>
                <div className="flex justify-between text-[10px] uppercase tracking-wider mb-1 font-bold">
                  <span>{stat.label}</span>
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
                    <span>/</span>
                    <div className="flex items-center gap-1 group/adj">
                      <span className="text-white w-10 text-right opacity-60">{statsWithOrigin[stat.key as 'pv' | 'pm'].max}</span>
                      <input 
                        type="number"
                        placeholder="±"
                        className="w-8 bg-transparent text-[8px] text-ruvia-accent opacity-0 group-hover/adj:opacity-100 focus:opacity-100 outline-none text-center border-b border-ruvia-accent/30"
                        value={stat.key === 'pv' ? activeCharacter.pvAdjustment : activeCharacter.pmAdjustment}
                        onChange={e => updateCharacter({ [stat.key === 'pv' ? 'pvAdjustment' : 'pmAdjustment']: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                  </div>
                </div>
                <div className="h-3 bg-ruvia-panel rounded-full overflow-hidden border border-white/5 relative">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, (statsWithOrigin[stat.key as 'pv'|'pm'].current / statsWithOrigin[stat.key as 'pv'|'pm'].max) * 100)}%` }}
                      className={`h-full ${stat.color} transition-all duration-500`}
                    />
                </div>
              </div>
            ))}
          </div>

          {/* Soul Tests */}
          <div className="mt-4 p-4 bg-ruvia-panel/50 border border-ruvia-accent/20 rounded-sm shadow-inner">
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
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: Math.max(0, 3 + (currentSkills.find(s => s.name === 'Sobrevivência')?.bonus || 0) + activeCharacter.soulTestsAdjustment) }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    const isCurrentlyUsed = i < activeCharacter.soulTestsUsed;
                    const newUsed = isCurrentlyUsed ? i : i + 1;
                    updateCharacter({ soulTestsUsed: newUsed });
                  }}
                  className={`w-6 h-6 rounded-full transition-all duration-700 flex items-center justify-center border ${
                    i < activeCharacter.soulTestsUsed 
                      ? 'bg-gray-800 border-white/5 opacity-20 shadow-none' 
                      : 'bg-white/5 border-ruvia-accent shadow-[0_0_15px_rgba(165,180,252,0.8),inset_0_0_8px_rgba(255,255,255,0.4)] animate-pulse'
                  }`}
                >
                  <Sparkles size={12} className={i < activeCharacter.soulTestsUsed ? 'text-gray-600' : 'text-blue-100'} />
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Middle Column: Domains & Elements */}
        <aside className="w-full xl:w-64 flex flex-col gap-6">
          <section className="bg-ruvia-card border border-ruvia-border p-4 rounded-sm relative shadow-2xl flex-1 backdrop-blur-sm bg-white/5">
            <div className="flex flex-col gap-8">
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
                <div className="grid grid-cols-1 gap-2 max-h-[380px] overflow-y-auto pr-2 custom-scrollbar">
                  {ELEMENTS_LIST.map(el => (
                    <div key={el} className="flex justify-between items-center bg-white/5 p-1.5 rounded-sm border border-emerald-500/10 hover:border-emerald-500/30 transition-colors">
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
            </div>
          </section>
        </aside>

        {/* Middle/Center: Skills */}
        <main className="flex-1 flex flex-col gap-6">
          {activeCharacter.origin && (
            <div className="p-3 bg-ruvia-panel border border-ruvia-accent/20 rounded-sm space-y-3 shadow-inner">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-ruvia-accent uppercase">Pontos Disponíveis (Perícias)</span>
                <span className={`text-xl font-black ${trainingPoints < 0 ? 'text-red-500' : 'text-white'}`}>{trainingPoints}</span>
              </div>
              <div className="flex justify-between items-center border-t border-ruvia-accent/10 pt-2">
                <span className="text-[10px] font-bold text-gray-500 uppercase italic">Ajuste Manual de Pontos</span>
                <input 
                  type="number"
                  className="bg-ruvia-bg text-white w-12 text-center text-xs font-bold outline-none border border-ruvia-accent/10 rounded"
                  value={activeCharacter.trainingPointsAdjustment}
                  onChange={e => updateCharacter({ trainingPointsAdjustment: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>
          )}

          <section className="bg-ruvia-card border border-ruvia-border p-6 rounded-sm relative shadow-2xl">
            <h3 className="text-xs uppercase tracking-widest text-ruvia-accent absolute -top-3 left-4 bg-ruvia-bg px-2 italic font-bold">
              Perícias
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-2 text-[11px] max-h-[500px] overflow-y-auto ruvia-scrollbar pr-2">
              {currentSkills.map((skill, idx) => {
                const isSkillLocked = skill.isLocked && !activeCharacter.unlockedSkills.includes(skill.name);
                return (
                   <div 
                     key={idx} 
                     className={`flex justify-between items-center pb-0.5 border-b border-ruvia-panel/50 transition-opacity duration-300 ${isSkillLocked ? 'opacity-30 grayscale' : ''}`}
                   >
                     <span className="font-sans flex items-center gap-1">
                        <button 
                            onClick={() => skill.isLocked && toggleSkillUnlock(skill.name)}
                            className={`hover:text-ruvia-accent transition-colors ${skill.isLocked ? 'cursor-pointer' : 'cursor-default'}`}
                        >
                            {skill.name}
                        </button>
                        {skill.isLocked && (isSkillLocked ? <Lock size={10} /> : <Unlock size={10} className="text-ruvia-accent" />)}
                     </span>
                    <div className="flex items-center gap-2">
                        <span className="text-ruvia-accent font-mono font-bold w-6 text-right">
                            {skill.bonus >= 0 ? '+' : ''}{skill.bonus.toString().padStart(2, '0')}
                        </span>
                        <input 
                            type="number"
                            className="bg-transparent text-white w-8 text-center text-[10px] border border-white/10 rounded outline-none focus:border-ruvia-accent"
                            value={activeCharacter.skillTraining[skill.name] || 0}
                            onChange={(e) => updateSkillTraining(skill.name, parseInt(e.target.value) || 0)}
                        />
                    </div>
                   </div>
                 );
               })}
             </div>
          </section>

          <section className="bg-ruvia-card border border-ruvia-border p-6 rounded-sm relative flex-1 shadow-2xl">
            <h3 className="text-xs uppercase tracking-widest text-ruvia-accent absolute -top-3 left-4 bg-ruvia-bg px-2 italic font-bold">
              Inventário
            </h3>
            <div className="space-y-2 max-h-[300px] overflow-y-auto ruvia-scrollbar pr-2 mb-4">
              {activeCharacter.inventory.length === 0 ? (
                <div className="h-24 flex flex-col items-center justify-center text-ruvia-accent/30 border-2 border-dashed border-ruvia-accent/10 rounded">
                  <Package size={24} />
                  <p className="text-[10px] mt-2 font-bold uppercase tracking-widest">Mochila Vazia</p>
                </div>
              ) : (
                activeCharacter.inventory.map((item, idx) => (
                  <div key={item.id} className="flex flex-col gap-1 border-b border-ruvia-panel/30 py-2 hover:bg-ruvia-accent/5 px-2 transition-colors group">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 flex flex-col">
                        <input 
                          className="font-bold text-white text-[10px] uppercase bg-transparent outline-none w-full hover:bg-white/5"
                          value={item.name}
                          onChange={e => {
                            const newInv = [...activeCharacter.inventory];
                            newInv[idx].name = e.target.value;
                            updateCharacter({ inventory: newInv });
                          }}
                        />
                        <textarea 
                          className="text-[9px] text-gray-400 font-sans italic bg-transparent outline-none w-full hover:bg-white/5 resize-none h-12 mt-1"
                          value={item.description}
                          onChange={e => {
                            const newInv = [...activeCharacter.inventory];
                            newInv[idx].description = e.target.value;
                            updateCharacter({ inventory: newInv });
                          }}
                        />
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <div className="flex items-center gap-1 group/price">
                          <input 
                            type="number"
                            className={`text-[9px] font-mono text-ruvia-accent bg-transparent outline-none w-10 text-right ${!item.price ? 'opacity-20 group-hover/price:opacity-100' : ''}`}
                            value={item.price || 0}
                            onChange={e => {
                              const newInv = [...activeCharacter.inventory];
                              newInv[idx].price = parseInt(e.target.value) || 0;
                              updateCharacter({ inventory: newInv });
                            }}
                          />
                          <Coins size={8} className="text-ruvia-accent" />
                        </div>
                        <button 
                          onClick={() => updateCharacter({
                            inventory: activeCharacter.inventory.filter((_, i) => i !== idx)
                          })}
                          className="text-red-500 hover:scale-110 transition-transform opacity-30 group-hover:opacity-100"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            <div className="flex">
                <button 
                  onClick={() => addItemToInventory({ id: '', name: 'Novo Item', description: 'Descrição...', icon: '' })}
                  className="flex-1 py-2 border border-ruvia-accent text-ruvia-accent text-[10px] font-black uppercase tracking-[0.2em] hover:bg-ruvia-accent hover:text-ruvia-bg transition-all flex items-center justify-center gap-2 mb-2"
                >
                  <Plus size={14} /> Adicionar Item
                </button>
            </div>
                

          </section>
        </main>

        {/* Right Column: Abilities & Notes */}
        <aside className="w-full lg:w-1/4 flex flex-col gap-8">
          <div className="bg-ruvia-card border border-ruvia-border p-5 flex-1 shadow-2xl rounded-sm">
            <div className="flex items-center gap-2 mb-4">
              <Scroll size={14} className="text-ruvia-accent" />
              <p className="text-[10px] uppercase tracking-widest text-ruvia-accent font-bold">Habilidades</p>
            </div>
            
            <div className="space-y-5">
              {activeCharacter.abilities.map((ability, idx) => (
                <div key={idx} className="group relative">
                  <input 
                    className="text-xs font-bold text-white mb-1 uppercase tracking-tight bg-transparent outline-none w-full hover:bg-white/5 transition-colors border-b border-white/5"
                    value={ability.name}
                    onChange={e => {
                      const newAbilities = [...activeCharacter.abilities];
                      newAbilities[idx].name = e.target.value;
                      updateCharacter({ abilities: newAbilities });
                    }}
                  />
                  <textarea 
                    className="text-[10px] italic leading-tight text-gray-400 bg-transparent outline-none w-full h-12 hover:bg-white/5 transition-colors resize-none"
                    value={ability.description}
                    onChange={e => {
                      const newAbilities = [...activeCharacter.abilities];
                      newAbilities[idx].description = e.target.value;
                      updateCharacter({ abilities: newAbilities });
                    }}
                  />
                  <button 
                    onClick={() => updateCharacter({
                      abilities: activeCharacter.abilities.filter((_, i) => i !== idx)
                    })}
                    className="absolute -right-2 -top-2 text-red-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
              <button 
                onClick={() => updateCharacter({
                  abilities: [...activeCharacter.abilities, { name: 'Nova Habilidade', description: 'Explicação...' }]
                })}
                className="text-xs text-ruvia-accent flex items-center gap-1 hover:underline font-bold uppercase tracking-widest"
              >
                <Plus size={12} /> Adicionar Habilidade
              </button>

              <div className="pt-6 border-t border-ruvia-panel">
                <div className="flex items-center gap-2 mb-3">
                  <BookOpen size={14} className="text-ruvia-accent" />
                  <p className="text-[10px] uppercase text-ruvia-accent font-bold tracking-widest">Notas</p>
                </div>
                <textarea 
                  className="w-full bg-ruvia-panel border border-ruvia-accent/20 text-[11px] p-2 h-32 outline-none text-gray-300 font-sans cursor-text hover:bg-white/5 transition-colors"
                  value={activeCharacter.notes}
                  onChange={e => updateCharacter({ notes: e.target.value })}
                  placeholder="Suas anotações aqui..."
                />
              </div>
            </div>
          </div>
          
          {activeCharacter.origin && (
            <div className="bg-ruvia-card border border-ruvia-accent p-4 shadow-2xl rounded-sm">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={14} className="text-ruvia-accent" />
                <p className="text-[10px] uppercase text-ruvia-accent font-bold tracking-widest">Habilidade de Origem</p>
              </div>
              {(() => {
                const origin = ORIGINS.find(o => o.name === activeCharacter.origin);
                return origin ? (
                  <div>
                    <p className="text-xs font-bold text-white uppercase italic">{origin.abilityName}</p>
                    <p className="text-[10px] text-gray-400 mt-1 leading-tight">{origin.abilityDescription}</p>
                    <p className="text-[8px] text-ruvia-accent/50 mt-2 uppercase font-bold">{origin.bonus}</p>
                  </div>
                ) : null;
              })()}
            </div>
          )}
        </aside>
      </div>

      {/* Footer */}
      <footer className="mt-8 flex flex-col md:flex-row justify-center items-center text-[10px] uppercase tracking-[0.2em] text-ruvia-accent/50 gap-4">
        {/* Requested removals completed */}
      </footer>
    </div>
  );
}
