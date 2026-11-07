import { type Key, type ReactNode, useState } from 'react';
import { Plus, Trash2, Upload, Download, ArrowLeft, Rocket } from 'lucide-react';
import type { ShipData, ShipCrewMember, ShipSystem, ShipModule, ShipInventoryItem } from './types';

const CREW_ROLES = [
  'Piloto', 'Engenheiro de Bordo', 'Médico', 'Artilheiro', 'Navegador',
  'Operador de Sensores e Comunicações', 'Cientista', 'Diplomata', 'Intendente',
  'Especialista em Sistemas', 'Nenhuma',
];

const SHIP_SIZES: ShipData['size'][] = ['Pequena', 'Média', 'Grande', 'Colossal'];

export const createShipData = (): ShipData => ({
  captain: '',
  size: 'Pequena',
  level: 1,
  attributes: {
    structure: 0,
    mobility: 0,
    firepower: 0,
    energyEfficiency: 0,
    sensors: 0,
    computing: 0,
    stability: 0,
  },
  availableAttributePoints: 0,
  resources: {
    hull: { current: 0, max: 0 },
    shields: { current: 0, max: 0 },
    energy: { current: 0, max: 0 },
    fuel: { current: 0, max: 0 },
  },
  defense: 0,
  activeDamage: [],
  aiType: 'Assistente',
  aiLevel: 1,
  crewMaximum: 10,
  crewIdeal: 5,
  crew: [],
  systemSlots: 0,
  systems: [],
  moduleSlots: 0,
  modules: [],
  inventorySlots: 0,
  inventory: [],
  credits: 0,
  resourcesCount: 0,
});

interface Props {
  name: string;
  data: ShipData;
  onNameChange: (value: string) => void;
  onChange: (data: ShipData) => void;
  onBack: () => void;
  onSave: () => void;
  onLoad: () => void;
}

const inputClass = 'min-w-0 rounded border border-sky-300/20 bg-slate-950/70 px-2 py-1.5 text-sm text-slate-100 outline-none focus:border-sky-300';
const panelClass = 'rounded border border-sky-300/20 bg-slate-900/70 p-4';

export default function ShipSheetEditor({ name, data, onNameChange, onChange, onBack, onSave, onLoad }: Props) {
  const [shareNotice, setShareNotice] = useState(false);
  const patch = (updates: Partial<ShipData>) => onChange({ ...data, ...updates });
  const patchResource = (key: keyof ShipData['resources'], property: keyof ShipData['resources']['hull'], value: number) => {
    patch({
      resources: {
        ...data.resources,
        [key]: { ...data.resources[key], [property]: Math.max(0, value) },
      },
    });
  };
  const addDamage = () => patch({ activeDamage: [...data.activeDamage, 'Nova avaria'] });
  const addCrew = () => patch({
    crew: [...data.crew, { id: crypto.randomUUID(), name: '', type: 'Jogador', role: 'Nenhuma' }],
  });
  const addSystem = () => patch({
    systems: [...data.systems, { id: crypto.randomUUID(), name: '', role: 'Nenhuma', description: '', energyCost: 0 }],
  });
  const addModule = () => patch({ modules: [...data.modules, { id: crypto.randomUUID(), name: '', description: '' }] });
  const addInventory = () => patch({ inventory: [...data.inventory, { id: crypto.randomUUID(), name: '', quantity: 1 }] });
  const crewRatioClass = data.crew.length < data.crewIdeal
    ? 'text-amber-300'
    : data.crew.length > data.crewMaximum
      ? 'text-red-400'
      : 'text-emerald-300';

  return (
    <main className="min-h-screen bg-[#020b17] px-4 py-6 text-slate-100 sm:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-sky-300/30 pb-5">
          <div className="flex items-center gap-3">
            <button type="button" onClick={onBack} aria-label="Voltar" className="rounded border border-sky-300/30 p-2 text-sky-200 hover:bg-sky-300/10">
              <ArrowLeft size={18} />
            </button>
            <Rocket className="text-sky-300" size={28} />
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-sky-300">Suplemento Ad Astra</p>
              <h1 className="text-2xl font-bold tracking-wide">Ficha da Nave</h1>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={onSave} className="flex items-center gap-2 rounded border border-sky-300/30 px-3 py-2 text-xs font-bold uppercase text-sky-200 hover:bg-sky-300/10">
              <Download size={15} /> Salvar backup
            </button>
            <button type="button" onClick={onLoad} className="flex items-center gap-2 rounded border border-sky-300/30 px-3 py-2 text-xs font-bold uppercase text-sky-200 hover:bg-sky-300/10">
              <Upload size={15} /> Carregar backup
            </button>
            <button type="button" onClick={() => setShareNotice(true)} className="rounded border border-sky-300/30 px-3 py-2 text-xs font-bold uppercase text-sky-200 hover:bg-sky-300/10">
              Compartilhamento em desenvolvimento
            </button>
          </div>
        </header>
        {shareNotice && (
          <div className="rounded border border-sky-300/20 bg-slate-900/70 p-3 text-xs text-sky-100/80">
            Compartilhamento simultâneo por link está em desenvolvimento e ainda não está disponível.
          </div>
        )}

        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <label className="flex flex-col gap-1 text-xs uppercase tracking-wider text-sky-200 sm:col-span-2">
            Nome da Nave
            <input className={inputClass} value={name} onChange={event => onNameChange(event.target.value)} />
          </label>
          <label className="flex flex-col gap-1 text-xs uppercase tracking-wider text-sky-200">
            Capitão
            <input className={inputClass} value={data.captain} onChange={event => patch({ captain: event.target.value })} />
          </label>
          <label className="flex flex-col gap-1 text-xs uppercase tracking-wider text-sky-200">
            Tamanho
            <select className={inputClass} value={data.size} onChange={event => {
              const size = event.target.value as ShipData['size'];
              const crewSizes: Record<ShipData['size'], [number, number]> = {
                Pequena: [10, 5], Média: [20, 10], Grande: [40, 20], Colossal: [80, 40],
              };
              patch({ size, crewMaximum: crewSizes[size][0], crewIdeal: crewSizes[size][1] });
            }}>
              {SHIP_SIZES.map(size => <option key={size}>{size}</option>)}
            </select>
          </label>
          <NumberField label="Nível" min={1} max={20} value={data.level} onChange={level => patch({ level })} />
        </section>

        <section className={panelClass}>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-bold uppercase tracking-widest text-sky-200">Atributos da Nave</h2>
            <NumberField label="Pontos de Atributo disponíveis" value={data.availableAttributePoints} onChange={availableAttributePoints => patch({ availableAttributePoints })} />
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {([
              ['Estrutura', 'structure'], ['Mobilidade', 'mobility'], ['Poder de Fogo', 'firepower'],
              ['Eficiência Energética', 'energyEfficiency'], ['Sensores', 'sensors'],
              ['Computação', 'computing'], ['Estabilidade', 'stability'],
            ] as const).map(([label, key]) => (
              <NumberField key={key} label={label} min={0} value={data.attributes[key]} onChange={value => patch({ attributes: { ...data.attributes, [key]: value } })} />
            ))}
          </div>
        </section>

        <section className="grid gap-3 md:grid-cols-2">
          {([
            ['Casco', 'hull', 'bg-gradient-to-r from-slate-500 to-slate-300'],
            ['Escudos', 'shields', 'bg-gradient-to-r from-cyan-700 to-cyan-300'],
            ['Energia', 'energy', 'bg-gradient-to-r from-amber-700 to-yellow-300'],
            ['Combustível', 'fuel', 'bg-gradient-to-r from-orange-800 to-orange-400'],
          ] as const).map(([label, key, color]) => (
            <div key={key} className={panelClass}>
              <h2 className="mb-2 font-bold uppercase tracking-widest text-sky-200">{label}</h2>
              <div className="mb-2 flex items-center gap-2">
                <input aria-label={`${label} atual`} className={inputClass} type="number" min={0} value={data.resources[key].current} onChange={event => patchResource(key, 'current', Number(event.target.value))} />
                <span>/</span>
                <input aria-label={`${label} máximo`} className={inputClass} type="number" min={0} value={data.resources[key].max} onChange={event => patchResource(key, 'max', Number(event.target.value))} />
                {key === 'shields' && <button type="button" onClick={() => patchResource('shields', 'current', data.resources.shields.max)} className="whitespace-nowrap rounded border border-cyan-300/30 px-2 py-1 text-xs text-cyan-200">Restaurar Escudos</button>}
              </div>
              <div className="h-2 overflow-hidden rounded bg-slate-950">
                <div className={`h-full ${color}`} style={{ width: `${data.resources[key].max > 0 ? Math.min(100, data.resources[key].current / data.resources[key].max * 100) : 0}%` }} />
              </div>
              {key === 'hull' && (
                <>
                  <div className="mt-3 flex gap-2" aria-label="Marcadores de avaria">
                    {[75, 50, 25].map(threshold => (
                      <span key={threshold} className={`h-3 flex-1 rounded ${data.resources.hull.max > 0 && data.resources.hull.current / data.resources.hull.max * 100 <= threshold ? 'bg-red-500' : 'bg-slate-700'}`} title={`${threshold}% de casco`} />
                    ))}
                  </div>
                  {data.resources.hull.max > 0 && data.resources.hull.current === 0 && <p className="mt-2 text-center text-lg font-black tracking-[0.3em] text-red-400">À DERIVA</p>}
                  <div className="mt-3 flex flex-wrap gap-2">
                    {data.activeDamage.map((damage, index) => (
                      <span key={`${index}-${damage}`} className="flex items-center gap-2 rounded border border-red-300/20 px-2 py-1">
                        <input className="w-40 bg-transparent text-xs outline-none" value={damage} onChange={event => patch({ activeDamage: data.activeDamage.map((item, i) => i === index ? event.target.value : item) })} />
                        <button type="button" aria-label="Remover avaria" onClick={() => patch({ activeDamage: data.activeDamage.filter((_, i) => i !== index) })}><Trash2 size={12} /></button>
                      </span>
                    ))}
                    <button type="button" onClick={addDamage} className="flex items-center gap-1 text-xs text-sky-200"><Plus size={14} /> Avaria ativa</button>
                  </div>
                </>
              )}
            </div>
          ))}
        </section>

        <section className="grid gap-3 md:grid-cols-2">
          <div className={panelClass}>
            <h2 className="mb-3 font-bold uppercase tracking-widest text-sky-200">Defesa e IA de Bordo</h2>
            <div className="grid gap-3 sm:grid-cols-3">
              <NumberField label="Defesa" value={data.defense} onChange={defense => patch({ defense })} />
              <label className="flex flex-col gap-1 text-xs text-sky-200">Tipo de IA
                <select className={inputClass} value={data.aiType} onChange={event => patch({ aiType: event.target.value as ShipData['aiType'] })}>
                  {['Assistente', 'Tática', 'Analítica', 'Autônoma'].map(type => <option key={type}>{type}</option>)}
                </select>
              </label>
              <NumberField label="Nível da IA" min={1} max={10} value={data.aiLevel} onChange={aiLevel => patch({ aiLevel })} />
            </div>
          </div>
          <div className={panelClass}>
            <div className="mb-3 flex items-center justify-between gap-2">
              <h2 className="font-bold uppercase tracking-widest text-sky-200">Tripulação</h2>
              <strong className={crewRatioClass}>{data.crew.length} / {data.crewIdeal} ideal / {data.crewMaximum} máx.</strong>
            </div>
            <div className="mb-3 grid grid-cols-2 gap-3">
              <NumberField label="Tripulação Máxima" value={data.crewMaximum} onChange={crewMaximum => patch({ crewMaximum })} />
              <NumberField label="Tripulação Ideal" value={data.crewIdeal} onChange={crewIdeal => patch({ crewIdeal })} />
            </div>
            <div className="flex flex-col gap-2">
              {data.crew.map((member, index) => <CrewRow key={member.id} member={member} onChange={next => patch({ crew: data.crew.map((item, i) => i === index ? next : item) })} onRemove={() => patch({ crew: data.crew.filter((_, i) => i !== index) })} />)}
              <AddButton label="Adicionar tripulante" onClick={addCrew} />
            </div>
          </div>
        </section>

        <section className="grid gap-3 lg:grid-cols-2">
          <ListPanel title="Sistemas" used={data.systems.length} slots={data.systemSlots} onSlotsChange={systemSlots => patch({ systemSlots })} onAdd={addSystem}>
            {data.systems.map((system, index) => <SystemRow key={system.id} item={system} onChange={next => patch({ systems: data.systems.map((item, i) => i === index ? next : item) })} onRemove={() => patch({ systems: data.systems.filter((_, i) => i !== index) })} />)}
          </ListPanel>
          <ListPanel title="Módulos" used={data.modules.length} slots={data.moduleSlots} onSlotsChange={moduleSlots => patch({ moduleSlots })} onAdd={addModule}>
            {data.modules.map((module, index) => <ModuleRow key={module.id} item={module} onChange={next => patch({ modules: data.modules.map((item, i) => i === index ? next : item) })} onRemove={() => patch({ modules: data.modules.filter((_, i) => i !== index) })} />)}
          </ListPanel>
          <ListPanel title="Inventário da Nave" used={data.inventory.length} slots={data.inventorySlots} onSlotsChange={inventorySlots => patch({ inventorySlots })} onAdd={addInventory}>
            {data.inventory.map((item, index) => <ShipInventoryRow key={item.id} item={item} onChange={next => patch({ inventory: data.inventory.map((row, i) => i === index ? next : row) })} onRemove={() => patch({ inventory: data.inventory.filter((_, i) => i !== index) })} />)}
          </ListPanel>
          <div className={panelClass}>
            <h2 className="mb-3 font-bold uppercase tracking-widest text-sky-200">Créditos e Recursos</h2>
            <div className="grid grid-cols-2 gap-3">
              <NumberField label="Créditos" value={data.credits} onChange={credits => patch({ credits })} />
              <NumberField label="Recursos" value={data.resourcesCount} onChange={resourcesCount => patch({ resourcesCount })} />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function NumberField({ label, value, onChange, min = 0, max }: { key?: Key; label: string; value: number; onChange: (value: number) => void; min?: number; max?: number }) {
  return (
    <label className="flex flex-col gap-1 text-xs text-sky-200">
      {label}
      <input className={inputClass} type="number" min={min} max={max} value={value} onChange={event => {
        const parsed = Number(event.target.value);
        onChange(Math.max(min, max === undefined ? parsed : Math.min(max, parsed)));
      }} />
    </label>
  );
}

function AddButton({ label, onClick }: { label: string; onClick: () => void }) {
  return <button type="button" onClick={onClick} className="flex items-center gap-1 self-start rounded border border-sky-300/20 px-2 py-1 text-xs text-sky-200 hover:bg-sky-300/10"><Plus size={14} /> {label}</button>;
}

function CrewRow({ member, onChange, onRemove }: { key?: Key; member: ShipCrewMember; onChange: (value: ShipCrewMember) => void; onRemove: () => void }) {
  return <div className="grid grid-cols-[1fr_auto_1fr_auto] gap-2">
    <input className={inputClass} placeholder="Nome" value={member.name} onChange={event => onChange({ ...member, name: event.target.value })} />
    <select className={inputClass} value={member.type} onChange={event => onChange({ ...member, type: event.target.value as ShipCrewMember['type'] })}><option>Jogador</option><option>NPC</option></select>
    <select className={inputClass} value={member.role} onChange={event => onChange({ ...member, role: event.target.value })}>{CREW_ROLES.map(role => <option key={role}>{role}</option>)}</select>
    <RemoveButton onClick={onRemove} />
  </div>;
}

function ListPanel({ title, used, slots, onSlotsChange, onAdd, children }: { key?: Key; title: string; used: number; slots: number; onSlotsChange: (value: number) => void; onAdd: () => void; children: ReactNode }) {
  return <div className={panelClass}>
    <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
      <h2 className="font-bold uppercase tracking-widest text-sky-200">{title}</h2>
      <div className="flex items-end gap-3">
        <NumberField label={`Espaços de ${title}`} value={slots} onChange={onSlotsChange} />
        <strong className={used > slots ? 'text-red-400' : 'text-slate-300'}>{used} / {slots}</strong>
      </div>
    </div>
    <div className="flex flex-col gap-2">{children}<AddButton label={`Adicionar ${title.toLowerCase().replace(/s$/, '')}`} onClick={onAdd} /></div>
  </div>;
}

function SystemRow({ item, onChange, onRemove }: { key?: Key; item: ShipSystem; onChange: (value: ShipSystem) => void; onRemove: () => void }) {
  return <div className="grid gap-2 rounded border border-slate-700 p-2 sm:grid-cols-2">
    <input className={inputClass} placeholder="Nome" value={item.name} onChange={event => onChange({ ...item, name: event.target.value })} />
    <select className={inputClass} value={item.role} onChange={event => onChange({ ...item, role: event.target.value })}>{CREW_ROLES.map(role => <option key={role}>{role}</option>)}</select>
    <textarea className={`${inputClass} sm:col-span-2`} placeholder="Descrição" value={item.description} onChange={event => onChange({ ...item, description: event.target.value })} />
    <NumberField label="Custo em Energia" value={item.energyCost} onChange={energyCost => onChange({ ...item, energyCost })} />
    <RemoveButton onClick={onRemove} />
  </div>;
}

function ModuleRow({ item, onChange, onRemove }: { key?: Key; item: ShipModule; onChange: (value: ShipModule) => void; onRemove: () => void }) {
  return <div className="grid gap-2 rounded border border-slate-700 p-2 sm:grid-cols-[1fr_2fr_auto]">
    <input className={inputClass} placeholder="Nome" value={item.name} onChange={event => onChange({ ...item, name: event.target.value })} />
    <textarea className={inputClass} placeholder="Descrição" value={item.description} onChange={event => onChange({ ...item, description: event.target.value })} />
    <RemoveButton onClick={onRemove} />
  </div>;
}

function ShipInventoryRow({ item, onChange, onRemove }: { key?: Key; item: ShipInventoryItem; onChange: (value: ShipInventoryItem) => void; onRemove: () => void }) {
  return <div className="grid grid-cols-[1fr_auto_auto] gap-2">
    <input className={inputClass} placeholder="Nome do item" value={item.name} onChange={event => onChange({ ...item, name: event.target.value })} />
    <input aria-label="Quantidade" className={`${inputClass} w-20`} type="number" min={0} value={item.quantity} onChange={event => onChange({ ...item, quantity: Math.max(0, Number(event.target.value)) })} />
    <RemoveButton onClick={onRemove} />
  </div>;
}

function RemoveButton({ onClick }: { onClick: () => void }) {
  return <button type="button" aria-label="Remover" onClick={onClick} className="self-center text-red-300/70 hover:text-red-300"><Trash2 size={15} /></button>;
}
