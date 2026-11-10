import { useCallback, useEffect, useState } from 'react';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { PORTADORES_ORIGINS } from './constants';
import { CharacterAttributes, CharacterSheet, MiracleGift } from './types';

const ATTRIBUTE_FIELDS: { key: keyof CharacterAttributes; label: string }[] = [
  { key: 'forca', label: 'Força' },
  { key: 'destreza', label: 'Destreza' },
  { key: 'vigor', label: 'Vigor' },
  { key: 'intelecto', label: 'Intelecto' },
  { key: 'expressao', label: 'Expressão' },
  { key: 'carisma', label: 'Carisma' },
];

const SKILLS = [
  'Acrobacia', 'Adestramento', 'Afinidade', 'Atletismo', 'Atuação', 'Blefe',
  'Ciências', 'Computação', 'Conhecimento', 'Cultura', 'Diplomacia', 'Enganação',
  'Direção', 'Engenharia', 'Exploração', 'Fortitude', 'Furtividade', 'História', 'Idiomas', 'Iniciativa',
  'Intimidação', 'Investigação', 'Intuição', 'Jogatina', 'Luta', 'Manha',
  'Medicina', 'Natureza', 'Percepção', 'Política', 'Pontaria', 'Reflexos',
  'Prestidigitação', 'Sobrevivência', 'Teologia', 'Vontade',
];

const skillFormula = (name: string, attrs: CharacterAttributes) => {
  const { forca: F, destreza: D, vigor: V, intelecto: I, expressao: E, carisma: C } = attrs;
  const formulas: Record<string, number> = {
    Acrobacia: Math.floor((2 * D + F) / 3),
    Adestramento: Math.floor((I + C + D) / 3),
    Afinidade: Math.floor((2 * E + I) / 3),
    Atletismo: Math.floor((2 * F + D) / 3),
    Atuação: Math.floor((3 * C + I) / 4),
    Blefe: Math.floor((I + C) / 2),
    Ciências: Math.floor((4 * I + E) / 5),
    Computação: Math.floor((4 * I + D) / 5),
    Direção: Math.floor((3 * D + 2 * I + V) / 6),
    Conhecimento: Math.floor((3 * I + 2 * E + C) / 6),
    Cultura: Math.floor((3 * E + 2 * C + I) / 6),
    Diplomacia: Math.floor((C + I) / 2),
    Enganação: Math.floor((2 * C + I) / 3),
    Engenharia: Math.floor((3 * I + 2 * D + F) / 6),
    Exploração: Math.floor((I + D + E) / 3),
    Fortitude: Math.floor((5 * V + F) / 6),
    Furtividade: Math.floor((3 * D + I) / 4),
    História: Math.floor((5 * I + E) / 6),
    Idiomas: Math.floor((3 * I + 2 * C + E) / 6),
    Iniciativa: D,
    Intimidação: Math.floor((2 * C + 2 * F + V) / 5),
    Investigação: I,
    Intuição: Math.floor((2 * E + I) / 3),
    Jogatina: Math.floor((2 * D + 2 * I + E) / 5),
    Luta: Math.floor((3 * F + 2 * D + I + E) / 7) - 2,
    Manha: Math.floor((2 * I + 2 * E + C) / 5),
    Medicina: Math.floor((2 * I + D) / 3),
    Natureza: Math.floor((3 * I + E + C) / 5),
    Percepção: Math.floor((5 * I + D) / 6),
    Política: Math.floor((4 * C + 2 * I + E) / 7),
    Pontaria: Math.floor((5 * D + I) / 6),
    Prestidigitação: Math.floor((4 * D + I + E) / 6) - 2,
    Reflexos: Math.floor((2 * D + I) / 3),
    Sobrevivência: Math.floor((4 * V + F + E) / 6),
    Teologia: Math.floor((I + E) / 2),
    Vontade: Math.floor((3 * E + 2 * I + V) / 6),
  };
  return formulas[name] || 0;
};

interface PortadoresSheetEditorProps {
  character: CharacterSheet;
  onChange: (updates: Partial<CharacterSheet>) => void;
  onBack: () => void;
  onSave: () => void;
  onLoad: () => void;
}

export default function PortadoresSheetEditor({ character, onChange, onBack, onSave, onLoad }: PortadoresSheetEditorProps) {
  const data = character.supplementData || {};
  const [impetusAdjustment, setImpetusAdjustment] = useState(0);
  const activeFace = data.activeFace || 'civil';
  const heroPV = data.heroPVCurrent ?? 0;
  const civilAttributes = data.civilAttributes || character.attributes;
  const heroAttributeBonuses = data.heroAttributeBonuses || {};
  const heroAttributes: CharacterAttributes = {
    forca: civilAttributes.forca + (heroAttributeBonuses.forca || 0),
    destreza: civilAttributes.destreza + (heroAttributeBonuses.destreza || 0),
    vigor: civilAttributes.vigor + (heroAttributeBonuses.vigor || 0),
    intelecto: civilAttributes.intelecto + (heroAttributeBonuses.intelecto || 0),
    expressao: civilAttributes.expressao + (heroAttributeBonuses.expressao || 0),
    carisma: civilAttributes.carisma + (heroAttributeBonuses.carisma || 0),
  };
  const origin = PORTADORES_ORIGINS.find(item => item.name === character.origin);
  const originSkillBonuses = (origin?.skills || {}) as Record<string, number>;
  const updateData = useCallback((updates: Partial<NonNullable<CharacterSheet['supplementData']>>) => {
    onChange({ supplementData: { ...data, ...updates } });
  }, [data, onChange]);
  const updateCivilAttribute = (key: keyof CharacterAttributes, value: number) => {
    updateData({ civilAttributes: { ...civilAttributes, [key]: value } });
  };

  useEffect(() => {
    if (activeFace === 'hero' && !data.noMiracle && heroPV <= 0) {
      updateData({ activeFace: 'civil', impetus: 0, destransformed: true });
    }
  }, [activeFace, data.noMiracle, heroPV, updateData]);

  const updateSkillPoints = (face: 'civil' | 'hero', skill: string, value: number) => {
    const key = face === 'civil' ? 'civilSkillPoints' : 'heroSkillPoints';
    const pointMap = data[key] || {};
    updateData({ [key]: { ...pointMap, [skill]: value } });
  };

  const addGift = () => {
    const gift: MiracleGift = {
      id: crypto.randomUUID(), name: '', description: '', actionType: '',
      impetusCost: 0, attackForm: 'Nenhuma', combinable: false, equipped: false,
    };
    updateData({ miracleGifts: [...(data.miracleGifts || []), gift] });
  };

  const renderAttributeFields = (attributes: CharacterAttributes, isHero: boolean) => (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {ATTRIBUTE_FIELDS.map(({ key, label }) => (
        <div key={key} className="rounded border border-current/15 p-2">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-wider">{label} <strong className="ml-1 text-base">{attributes[key]}</strong></p>
          <label className="flex items-center justify-between gap-2 text-[9px] uppercase opacity-75">Valor civil
            <input type="number" value={civilAttributes[key]} onChange={event => updateCivilAttribute(key, Number(event.target.value))} className="w-14 rounded border border-current/20 bg-black/10 p-1 text-center text-sm" />
          </label>
          <label className="mt-1 flex items-center justify-between gap-2 text-[9px] uppercase opacity-75">Bônus de herói
            <input type="number" value={heroAttributeBonuses[key] || 0} onChange={event => updateData({ heroAttributeBonuses: { ...heroAttributeBonuses, [key]: Number(event.target.value) } })} className="w-14 rounded border border-current/20 bg-black/10 p-1 text-center text-sm" />
          </label>
          {isHero && <p className="mt-1 text-right text-[9px] uppercase opacity-60">civil + bônus</p>}
        </div>
      ))}
    </div>
  );

  const renderSkillPoints = (face: 'civil' | 'hero') => {
    const pointMap = face === 'civil' ? data.civilSkillPoints || {} : data.heroSkillPoints || {};
    const originBonuses = originSkillBonuses;
    const total = Object.values(data.civilSkillPoints || {}).reduce((sum, value) => sum + (value || 0), 0);
    const availableCivilPoints = civilAttributes.intelecto - total;
    const civilSkillValue = (skill: string) => skillFormula(skill, civilAttributes)
      + (originBonuses[skill as keyof typeof originBonuses] || 0)
      + ((data.civilSkillPoints || {})[skill] || 0);
    return (
      <div>
        <div className="mb-3 flex items-center justify-between border-b border-current/15 pb-2">
          <h3 className="font-bold uppercase tracking-widest">Perícias {face === 'civil' ? 'Civis' : 'Heroicas'}</h3>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className={`rounded border px-2 py-1 ${availableCivilPoints < 0 ? 'border-red-500/60 text-red-600' : 'border-current/20'}`}>
              Pontos civis disponíveis: {availableCivilPoints}
            </span>
            <span className="rounded border border-current/20 px-2 py-1">
              Pontos heroicos investidos: {Object.values(data.heroSkillPoints || {}).reduce((sum, value) => sum + (value || 0), 0)}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-x-6 sm:grid-cols-2 lg:grid-cols-3">
          {SKILLS.map(skill => (
            <div key={skill} className="grid grid-cols-[1fr_auto] items-center gap-2 border-b border-current/10 py-2 text-xs">
              <span>{skill}{originBonuses[skill as keyof typeof originBonuses] ? <span className="ml-1 opacity-60">(+{originBonuses[skill as keyof typeof originBonuses]} origem)</span> : null}
                <strong className="ml-2">{face === 'civil' ? civilSkillValue(skill) : civilSkillValue(skill) + 2 + (pointMap[skill] || 0)}</strong>
              </span>
              <div className="flex items-center gap-1">
                {face === 'civil' && <label className="flex items-center gap-1 text-[9px] opacity-70">C
                  <input aria-label={`${skill} - pontos civis`} type="number" value={pointMap[skill] || 0} onChange={event => updateSkillPoints(face, skill, Number(event.target.value))} className="w-10 rounded border border-current/20 bg-black/10 p-1 text-center text-xs" />
                </label>}
                <label className="flex items-center gap-1 text-[9px] opacity-70">H
                  <input aria-label={`${skill} - pontos heroicos`} type="number" value={face === 'civil' ? data.heroSkillPoints?.[skill] || 0 : pointMap[skill] || 0} onChange={event => updateSkillPoints('hero', skill, Number(event.target.value))} className="w-10 rounded border border-current/20 bg-black/10 p-1 text-center text-xs" />
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const face = activeFace === 'hero' && !data.noMiracle ? 'hero' : 'civil';
  const activeAttributes = face === 'hero' ? heroAttributes : civilAttributes;
  const activeSkillValue = (skill: string) => skillFormula(skill, civilAttributes)
    + (originSkillBonuses[skill] || 0)
    + ((data.civilSkillPoints || {})[skill] || 0)
    + (face === 'hero' ? 2 + ((data.heroSkillPoints || {})[skill] || 0) : 0);
  const athletics = activeSkillValue('Atletismo');
  const movement = 9 + Math.floor(athletics / 5) * 1.5;
  const defense = 8 + activeAttributes.destreza + Math.ceil((1 + (2 * activeAttributes.vigor) + activeAttributes.forca) / 3);
  const civilPVMax = (origin?.basePV ?? 10) + civilAttributes.vigor + 2 * (
    skillFormula('Fortitude', civilAttributes)
    + (originSkillBonuses.Fortitude || 0)
    + ((data.civilSkillPoints || {}).Fortitude || 0)
  ) + (data.civilPVAdjustment || 0);
  const heroPVMax = (civilPVMax * 2) + (data.heroPVAdjustment || 0);
  const pvMaximum = face === 'civil' ? civilPVMax : heroPVMax;
  const equippedGifts = (data.miracleGifts || []).filter(gift => gift.equipped).length;
  const updateCurrentPV = (whichFace: 'civil' | 'hero', value: number) => {
    updateData({ [whichFace === 'civil' ? 'civilPVCurrent' : 'heroPVCurrent']: Math.max(0, value) });
  };
  const finishInterlude = () => updateData({ civilPVCurrent: civilPVMax, heroPVCurrent: heroPVMax, destransformed: false });
  const renderTalentList = (category: 'Talentos Civis' | 'Talentos Heroicos', disabled = false) => {
    const talents = character.abilities.map((ability, index) => ({ ability, index }))
      .filter(({ ability }) => ability.category === category);
    return (
      <fieldset disabled={disabled} className={`rounded border border-current/15 p-3 ${disabled ? 'opacity-50' : ''}`}>
        <div className="mb-3 flex items-center justify-between gap-2">
          <h3 className="font-bold uppercase tracking-widest">{category}</h3>
          <button type="button" onClick={() => onChange({ abilities: [...character.abilities, { name: '', description: '', category }] })} className="flex items-center gap-1 rounded border border-current/25 px-2 py-1 text-[10px] font-bold uppercase"><Plus size={13} /> Talento</button>
        </div>
        {talents.map(({ ability, index }) => (
          <article key={`${category}-${index}`} className="mb-2 rounded border border-current/10 p-2">
            <div className="flex gap-2">
              <input aria-label="Nome do talento" value={ability.name} onChange={event => onChange({ abilities: character.abilities.map((item, current) => current === index ? { ...item, name: event.target.value } : item) })} className="min-w-0 flex-1 rounded border border-current/20 bg-black/10 p-2 text-sm" />
              <button type="button" aria-label="Remover talento" onClick={() => onChange({ abilities: character.abilities.filter((_, current) => current !== index) })} className="text-red-500"><Trash2 size={14} /></button>
            </div>
            <textarea aria-label="Descrição do talento" value={ability.description} onChange={event => onChange({ abilities: character.abilities.map((item, current) => current === index ? { ...item, description: event.target.value } : item) })} className="mt-2 min-h-16 w-full rounded border border-current/20 bg-black/10 p-2 text-sm" />
          </article>
        ))}
      </fieldset>
    );
  };

  return (
    <main data-supplement="portadores-milagres" className={`min-h-screen p-4 text-[#d5f3e5] sm:p-8 ${face === 'hero' ? 'portadores-hero' : 'portadores-civil'}`}>
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-current/40 pb-4">
          <div className="flex items-center gap-3">
            <button type="button" onClick={onBack} aria-label="Voltar às fichas" className="rounded border border-current/30 p-2"><ArrowLeft size={18} /></button>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-70">Rúvia RPG • Portadores de Milagres</p>
              <h1 className="text-3xl font-bold uppercase sm:text-5xl">Portadores de Milagres</h1>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={onSave} className="rounded border border-current/30 px-3 py-2 text-xs font-bold uppercase">Salvar backup</button>
            <button type="button" onClick={onLoad} className="rounded border border-current/30 px-3 py-2 text-xs font-bold uppercase">Carregar backup</button>
          </div>
        </header>

        <section className="grid gap-4 rounded border border-current/25 bg-black/10 p-4 md:grid-cols-2">
          <label className="flex flex-col gap-1 text-xs font-bold uppercase">
            Origem
            <select value={character.origin || ''} onChange={event => {
              const nextOrigin = PORTADORES_ORIGINS.find(item => item.name === event.target.value);
              onChange({
                origin: event.target.value,
                supplementData: {
                  ...data,
                  money: nextOrigin?.money ?? data.money ?? 0,
                  income: nextOrigin?.income ?? data.income ?? 0,
                  civilPVCurrent: nextOrigin
                    ? nextOrigin.basePV + civilAttributes.vigor + 2 * (skillFormula('Fortitude', civilAttributes) + ((nextOrigin.skills as Record<string, number>).Fortitude || 0) + ((data.civilSkillPoints || {}).Fortitude || 0)) + (data.civilPVAdjustment || 0)
                    : data.civilPVCurrent ?? 10,
                  heroPVCurrent: nextOrigin
                    ? 2 * (nextOrigin.basePV + civilAttributes.vigor + 2 * (skillFormula('Fortitude', civilAttributes) + ((nextOrigin.skills as Record<string, number>).Fortitude || 0) + ((data.civilSkillPoints || {}).Fortitude || 0)) + (data.civilPVAdjustment || 0)) + (data.heroPVAdjustment || 0)
                    : data.heroPVCurrent ?? 10,
                  originAbilityText: nextOrigin?.abilityName || '',
                },
              });
            }} className="rounded border border-current/20 bg-black/10 p-2 text-sm normal-case">
              <option value="">Escolher origem...</option>
              {PORTADORES_ORIGINS.map(item => <option key={item.name} value={item.name}>{item.name}</option>)}
            </select>
            {origin && (
              <span className="text-[10px] normal-case opacity-70">
                PV base {origin.basePV} • Dinheiro R$ {origin.money} • Renda R$ {origin.income} • +1 {Object.keys(origin.skills).join(' e ')}
              </span>
            )}
            {origin && <label className="flex flex-col gap-1 text-[10px] font-bold uppercase">Habilidade de Origem
              <textarea aria-label="Habilidade de Origem" value={data.originAbilityText ?? origin.abilityName} onChange={event => updateData({ originAbilityText: event.target.value })} className="min-h-16 rounded border border-current/20 bg-black/10 p-2 text-sm normal-case" />
            </label>}
          </label>
          <label className="flex flex-col gap-1 text-xs font-bold uppercase">
            {face === 'civil' ? 'Nome Civil' : 'Nome de Herói'}
            <input value={face === 'civil' ? character.name : data.heroName || ''} onChange={event => face === 'civil' ? onChange({ name: event.target.value }) : updateData({ heroName: event.target.value })} className="rounded border border-current/20 bg-black/10 p-2 text-sm normal-case" />
          </label>
          <label className="flex items-center gap-2 self-end text-xs font-bold uppercase">
            <input type="checkbox" checked={Boolean(data.noMiracle)} onChange={event => updateData({ noMiracle: event.target.checked, activeFace: event.target.checked ? 'civil' : activeFace })} />
            Personagem sem Milagre
          </label>
          <div className="flex flex-wrap gap-2 md:col-span-2">
            {(['civil', 'hero'] as const).map(item => (
              <button type="button" key={item} disabled={item === 'hero' && Boolean(data.noMiracle)} onClick={() => { if (item !== face) updateData({ activeFace: item, impetus: 0, destransformed: false }); }} className={`rounded border px-4 py-2 text-xs font-bold uppercase ${face === item ? 'border-current bg-current/15' : 'border-current/20 opacity-60'} disabled:cursor-not-allowed disabled:opacity-30`}>
                {item === 'civil' ? 'Civil' : 'Herói'}
              </button>
            ))}
          </div>
        </section>

        <section className="grid gap-6 rounded border border-current/25 bg-black/10 p-4 md:grid-cols-2">
          <div>
            <h2 className="mb-3 border-b border-current/20 pb-2 text-lg font-bold uppercase">Atributos {face === 'civil' ? 'Civis' : 'Heroicos'}</h2>
            {renderAttributeFields(activeAttributes, face === 'hero')}
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <label className="flex flex-col gap-1 text-[10px] font-bold uppercase">PV atual
                <input type="number" value={face === 'civil' ? data.civilPVCurrent ?? 0 : data.heroPVCurrent ?? 0} onChange={event => updateCurrentPV(face, Number(event.target.value))} className="rounded border border-current/20 bg-black/10 p-2 text-sm" />
              </label>
              <p className="flex flex-col gap-1 text-[10px] font-bold uppercase">PV máximo <strong className="rounded border border-current/20 bg-black/10 p-2 text-sm">{pvMaximum}</strong></p>
            </div>
            <progress className={`h-3 w-full ${face === 'hero' ? 'accent-[#f0604f]' : 'accent-[#e0796b]'}`} max={Math.max(1, pvMaximum)} value={Math.max(0, Math.min(face === 'civil' ? data.civilPVCurrent || 0 : heroPV, pvMaximum))} />
            <div className="grid grid-cols-2 gap-3">
              <label className="flex flex-col gap-1 text-[10px] font-bold uppercase">Bônus manual {face === 'hero' ? 'de herói' : ''}
                <input type="number" value={face === 'civil' ? data.civilPVAdjustment || 0 : data.heroPVAdjustment || 0} onChange={event => updateData({ [face === 'civil' ? 'civilPVAdjustment' : 'heroPVAdjustment']: Number(event.target.value) })} className="rounded border border-current/20 bg-black/10 p-2 text-sm" />
              </label>
              <button type="button" onClick={finishInterlude} className="self-end rounded border border-current/30 px-3 py-2 text-[10px] font-bold uppercase">Fim de Interlúdio</button>
            </div>
            <div className="grid grid-cols-2 gap-3 rounded border border-current/15 p-3 text-xs">
              <p>Defesa <strong className="ml-1 text-base">{defense}</strong></p>
              <p>Deslocamento <strong className="ml-1 text-base">{movement} m</strong></p>
            </div>
            {data.destransformed && <p role="status" className="rounded border border-amber-500/40 bg-amber-500/10 p-2 text-xs">Destransformado: só pode se transformar de novo na próxima cena.</p>}
          </div>
        </section>

        <section className="rounded border border-amber-500/40 bg-amber-500/10 p-4 text-amber-700">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold">{data.impetus ?? 0} Ímpeto</h2>
              <p className="text-xs">Bônus de Carregar: +{Math.floor(activeSkillValue('Vontade') / 4)}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button type="button" onClick={() => updateData({ impetus: Math.max(0, (data.impetus || 0) + 1) })} className="rounded border border-current/30 px-3 py-2 font-bold">+1</button>
              <button type="button" onClick={() => updateData({ impetus: Math.max(0, (data.impetus || 0) - 1) })} className="rounded border border-current/30 px-3 py-2 font-bold">−1</button>
              <input aria-label="Valor para alterar Ímpeto" type="number" value={impetusAdjustment} onChange={event => setImpetusAdjustment(Number(event.target.value))} className="w-20 rounded border border-current/30 bg-transparent p-2 text-center" />
              <button type="button" onClick={() => { updateData({ impetus: Math.max(0, (data.impetus || 0) + impetusAdjustment) }); setImpetusAdjustment(0); }} className="rounded border border-current/30 px-3 py-2 text-xs font-bold uppercase">Aplicar</button>
              <button type="button" onClick={() => updateData({ impetus: 0 })} className="rounded border border-current/30 px-3 py-2 text-xs font-bold uppercase">Zerar</button>
            </div>
          </div>
        </section>
        <section className="rounded border border-current/25 bg-black/10 p-4">
          {renderSkillPoints(face)}
        </section>
        <section className="grid gap-4 rounded border border-current/25 bg-black/10 p-4 md:grid-cols-2">
          <div className="md:col-span-2">{renderTalentList('Talentos Civis')}</div>
          {!data.noMiracle && <div className="md:col-span-2">{renderTalentList('Talentos Heroicos', face === 'civil')}</div>}
        </section>

        {!data.noMiracle && <fieldset disabled={face === 'civil'} className={`grid gap-4 rounded border border-current/25 bg-black/10 p-4 md:grid-cols-2 ${face === 'civil' ? 'opacity-55' : ''}`}>
          <div>
            <div className="mb-3 flex items-center justify-between gap-2">
              <h2 className="font-bold uppercase tracking-widest">Milagre</h2>
              <button type="button" onClick={addGift} className="flex items-center gap-1 rounded border border-current/25 px-2 py-1 text-xs font-bold uppercase"><Plus size={14} /> Dom</button>
            </div>
            {([
              ['milagreTheme', 'Tema do Milagre'], ['miracleObject', 'Objeto'], ['miracleSpark', 'Faísca'],
              ['bondBenefits', 'Benefícios do Vínculo'],
            ] as const).map(([key, label]) => (
              <label key={key} className="mb-3 flex flex-col gap-1 text-[10px] font-bold uppercase">{label}
                <input value={data[key] || ''} onChange={event => updateData({ [key]: event.target.value })} className="rounded border border-current/20 bg-black/10 p-2 text-sm normal-case" />
              </label>
            ))}
            <label className="flex flex-col gap-1 text-[10px] font-bold uppercase">Grau de Vínculo
              <input type="number" value={data.bondRank ?? 1} onChange={event => updateData({ bondRank: Number(event.target.value) })} className="rounded border border-current/20 bg-black/10 p-2 text-sm" />
            </label>
            {((data.bondRank ?? 1) < 1 || (data.bondRank ?? 1) > 5) && <p className="mt-1 text-[10px] text-amber-400/80">Grau fora da faixa indicada pelo sistema; o valor foi mantido.</p>}
            <label className="mt-3 flex flex-col gap-1 text-[10px] font-bold uppercase">Espaços de Dons
              <input type="number" value={data.giftSlots ?? 3} onChange={event => updateData({ giftSlots: Number(event.target.value) })} className="rounded border border-current/20 bg-black/10 p-2 text-sm" />
            </label>
            <p className={`mt-2 text-xs font-bold ${equippedGifts > (data.giftSlots ?? 3) ? 'text-red-500' : ''}`}>Dons equipados: {equippedGifts} / {data.giftSlots ?? 3}</p>
            {face === 'hero' && (
              <label className="mt-3 flex flex-col gap-1 text-[10px] font-bold uppercase">Arma do Milagre
                <input value={data.miracleWeapon || ''} onChange={event => updateData({ miracleWeapon: event.target.value })} className="rounded border border-current/20 bg-black/10 p-2 text-sm normal-case" />
              </label>
            )}
          </div>
          <div className="space-y-3">
            <h3 className="font-bold uppercase tracking-widest">Biblioteca de Dons</h3>
            {(data.miracleGifts || []).map((gift, index) => (
              <article key={gift.id} className="rounded border border-current/15 p-3">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase">Dom {index + 1}</h3>
                  <button type="button" aria-label="Remover dom" onClick={() => updateData({ miracleGifts: data.miracleGifts?.filter(item => item.id !== gift.id) })} className="text-red-300"><Trash2 size={14} /></button>
                </div>
                <input aria-label="Nome do dom" placeholder="Nome" value={gift.name} onChange={event => updateData({ miracleGifts: data.miracleGifts?.map(item => item.id === gift.id ? { ...item, name: event.target.value } : item) })} className="mb-2 w-full rounded border border-current/20 bg-black/10 p-2 text-sm" />
                <textarea aria-label="Descrição do dom" placeholder="Descrição" value={gift.description} onChange={event => updateData({ miracleGifts: data.miracleGifts?.map(item => item.id === gift.id ? { ...item, description: event.target.value } : item) })} className="mb-2 min-h-20 w-full rounded border border-current/20 bg-black/10 p-2 text-sm" />
                <div className="grid grid-cols-2 gap-2">
                  <input aria-label="Tipo de ação" placeholder="Tipo de ação" value={gift.actionType} onChange={event => updateData({ miracleGifts: data.miracleGifts?.map(item => item.id === gift.id ? { ...item, actionType: event.target.value } : item) })} className="rounded border border-current/20 bg-black/10 p-2 text-xs" />
                  <input aria-label="Custo de Ímpeto" type="number" value={gift.impetusCost} onChange={event => updateData({ miracleGifts: data.miracleGifts?.map(item => item.id === gift.id ? { ...item, impetusCost: Number(event.target.value) } : item) })} className="rounded border border-current/20 bg-black/10 p-2 text-xs" />
                  <select aria-label="Forma de ataque" value={gift.attackForm} onChange={event => updateData({ miracleGifts: data.miracleGifts?.map(item => item.id === gift.id ? { ...item, attackForm: event.target.value as MiracleGift['attackForm'] } : item) })} className="rounded border border-current/20 bg-black/10 p-2 text-xs">
                    {(['Nenhuma', 'Luta', 'Pontaria', 'Afinidade'] as const).map(item => <option key={item}>{item}</option>)}
                  </select>
                  <label className="flex items-center gap-2 text-[10px] font-bold uppercase"><input type="checkbox" checked={gift.combinable} onChange={event => updateData({ miracleGifts: data.miracleGifts?.map(item => item.id === gift.id ? { ...item, combinable: event.target.checked } : item) })} /> Combinável</label>
                  <label className="flex items-center gap-2 text-[10px] font-bold uppercase"><input type="checkbox" checked={gift.equipped} onChange={event => updateData({ miracleGifts: data.miracleGifts?.map(item => item.id === gift.id ? { ...item, equipped: event.target.checked } : item) })} /> Equipado</label>
                </div>
              </article>
            ))}
          </div>
        </fieldset>}

        {face === 'civil' && <section className="grid gap-4 rounded border border-current/25 bg-black/10 p-4 md:grid-cols-2">
          <div>
            <h2 className="mb-3 font-bold uppercase tracking-widest">Vida Civil</h2>
            <label className="mt-3 flex flex-col gap-1 text-[10px] font-bold uppercase">Segredo ou Objetivo
              <textarea value={data.civilSecret || ''} onChange={event => updateData({ civilSecret: event.target.value })} className="min-h-20 rounded border border-current/20 bg-black/10 p-2 text-sm normal-case" />
            </label>
          </div>
          <div>
            <h2 className="mb-3 font-bold uppercase tracking-widest">Laços Civis</h2>
            {(data.civilLinks || ['', '', '']).map((link, index) => (
              <input key={index} aria-label={`Vínculo ${index + 1}`} placeholder={`Vínculo ${index + 1} • nome e significado`} value={link} onChange={event => updateData({ civilLinks: (data.civilLinks || ['', '', '']).map((item, current) => current === index ? event.target.value : item) })} className="mb-2 w-full rounded border border-current/20 bg-black/10 p-2 text-sm" />
            ))}
          </div>
        </section>}

        <section className="rounded border border-current/25 bg-black/10 p-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-bold uppercase tracking-widest">Inventário</h2>
            <div className="flex flex-wrap gap-3">
              <label className="flex items-center gap-2 text-[10px] font-bold uppercase">Dinheiro (R$)
                <input type="number" value={data.money ?? origin?.money ?? 0} onChange={event => updateData({ money: Number(event.target.value) })} className="w-24 rounded border border-current/20 bg-black/10 p-2 text-sm" />
              </label>
              <label className="flex items-center gap-2 text-[10px] font-bold uppercase">Recursos
                <input type="number" value={data.resourceCount ?? 0} onChange={event => updateData({ resourceCount: Number(event.target.value) })} className="w-20 rounded border border-current/20 bg-black/10 p-2 text-sm" />
              </label>
            </div>
          </div>
          <label className="mb-3 flex max-w-xs flex-col gap-1 text-[10px] font-bold uppercase">Renda mensal (R$)
            <input type="number" value={data.income ?? origin?.income ?? 0} onChange={event => updateData({ income: Number(event.target.value) })} className="rounded border border-current/20 bg-black/10 p-2 text-sm" />
          </label>
            <button type="button" onClick={() => onChange({ inventory: [...character.inventory, { id: crypto.randomUUID(), name: 'Novo item', description: '', type: 'Geral' }] })} className="mb-3 flex items-center gap-1 rounded border border-current/25 px-2 py-1 text-xs font-bold uppercase"><Plus size={14} /> Item</button>
            <div className="grid gap-2 sm:grid-cols-2">
              {character.inventory.map((item, index) => (
                <div key={item.id} className="flex gap-2">
                  <input aria-label="Item do inventário" value={item.name} onChange={event => onChange({ inventory: character.inventory.map((entry, current) => current === index ? { ...entry, name: event.target.value } : entry) })} className="min-w-0 flex-1 rounded border border-current/20 bg-black/10 p-2 text-sm" />
                  <input aria-label="Descrição do item" value={item.description} onChange={event => onChange({ inventory: character.inventory.map((entry, current) => current === index ? { ...entry, description: event.target.value } : entry) })} className="min-w-0 flex-1 rounded border border-current/20 bg-black/10 p-2 text-sm" />
                  <button type="button" aria-label="Remover item" onClick={() => onChange({ inventory: character.inventory.filter((_, current) => current !== index) })} className="text-red-300"><Trash2 size={14} /></button>
                </div>
              ))}
            </div>
        </section>
      </div>
    </main>
  );
}
