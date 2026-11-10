import { useState } from 'react';
import { Info, Plus, Trash2 } from 'lucide-react';
import type { CharacterAttributes, CharacterSupplement, Skill, SupplementData, SupplementProtocol } from './types';

const masteries = ['Sensitividade', 'Telepatia', 'Cinesia', 'Controle', 'Restauração', 'Combate', 'Elemental', 'Polifórmica'];
const elements: NonNullable<SupplementData['element']>[] = ['Fogo', 'Terra', 'Água', 'Ar', 'Nenhum'];
const panel = 'rounded-sm border border-current/20 bg-black/10 p-4';
const input = 'rounded border border-current/20 bg-black/20 px-2 py-1 text-sm outline-none focus:border-current';

interface Props {
  supplement: CharacterSupplement;
  data: SupplementData;
  attributes: CharacterAttributes;
  skills: Skill[];
  trainingPoints: number;
  onChange: (data: SupplementData) => void;
  onSpendCharacterPoint: (target: string) => void;
}

export default function SupplementPanels({ supplement, data, attributes, skills, trainingPoints, onChange, onSpendCharacterPoint }: Props) {
  const [selectedSpendTarget, setSelectedSpendTarget] = useState('Vitalidade');
  const patch = (updates: Partial<SupplementData>) => onChange({ ...data, ...updates });

  if (supplement === 'quatro-elementos') {
    const disabled = !data.element || data.element === 'Nenhum';
    const subfolds = data.subfolds || [];
    return (
      <section className={panel}>
        <h2 className="mb-3 text-lg font-bold uppercase tracking-widest">Dobra</h2>
        <label className="flex items-center gap-3 text-sm font-bold">
          Elemento
          <select className={input} value={data.element || ''} onChange={event => patch({ element: (event.target.value || undefined) as SupplementData['element'] })}>
            <option value="">Escolher elemento...</option>
            {elements.map(element => <option key={element}>{element}</option>)}
          </select>
          {!disabled && <NumberInput label="Nível" min={1} value={Math.max(1, data.elementRank || 1)} onChange={elementRank => patch({ elementRank })} />}
        </label>
        <div className={`mt-4 flex flex-col gap-2 rounded border border-current/10 p-3 ${disabled ? 'pointer-events-none opacity-40 grayscale' : ''}`}>
          <p className="text-xs uppercase tracking-widest opacity-70">Subdobras de {data.element || 'elemento'}</p>
          {subfolds.map((subfold, index) => (
            <div key={subfold.id} className="grid grid-cols-[1fr_auto_auto] gap-2">
              <input className={input} aria-label="Nome da subdobra" value={subfold.name} placeholder="Nome da subdobra" onChange={event => patch({ subfolds: subfolds.map((item, i) => i === index ? { ...item, name: event.target.value } : item) })} />
              <NumberInput label="Nível" min={1} value={Math.max(1, subfold.rank)} onChange={rank => patch({ subfolds: subfolds.map((item, i) => i === index ? { ...item, rank } : item) })} />
              <button type="button" aria-label="Remover subdobra" onClick={() => patch({ subfolds: subfolds.filter((_, i) => i !== index) })}><Trash2 size={15} /></button>
            </div>
          ))}
          <button type="button" onClick={() => patch({ subfolds: [...subfolds, { id: crypto.randomUUID(), name: '', rank: 1 }] })} className="flex items-center gap-1 self-start text-sm"><Plus size={15} /> Adicionar subdobra</button>
        </div>
      </section>
    );
  }

  if (supplement === 'infames-condutores') {
    const traits = data.conductionTraits || [];
    return (
      <section className="grid gap-4 md:grid-cols-2">
        <div className={panel}>
          <label className="flex flex-col gap-2 text-sm font-bold uppercase tracking-widest">
            Condução
            <input className={input} value={data.conduction || ''} onChange={event => patch({ conduction: event.target.value })} placeholder="Informe sua condução" />
          </label>
          <div className="mt-4 flex items-center justify-between gap-3">
            <h2 className="font-bold uppercase tracking-widest">Características de Condução</h2>
            <button type="button" onClick={() => patch({ conductionTraits: [...traits, { name: 'Nova característica', description: '' }] })} aria-label="Adicionar característica"><Plus size={16} /></button>
          </div>
          <div className="mt-2 flex flex-col gap-2">
            {traits.map((trait, index) => (
              <div key={`${index}-${trait.name}`} className="grid grid-cols-[1fr_auto] gap-2">
                <input className={input} value={trait.name} onChange={event => patch({ conductionTraits: traits.map((item, i) => i === index ? { ...item, name: event.target.value } : item) })} placeholder="Característica" />
                <button type="button" aria-label="Remover característica" onClick={() => patch({ conductionTraits: traits.filter((_, i) => i !== index) })}><Trash2 size={15} /></button>
                <textarea className={`${input} col-span-2`} value={trait.description} onChange={event => patch({ conductionTraits: traits.map((item, i) => i === index ? { ...item, description: event.target.value } : item) })} placeholder="Descrição" />
              </div>
            ))}
          </div>
        </div>
        <div className={panel}>
          <h2 className="mb-3 font-bold uppercase tracking-widest">Balança Kármica</h2>
          <div className="grid grid-cols-2 gap-3">
            <NumberInput label="Karma" value={Math.max(0, data.karmicRed || 0)} onChange={karmicRed => patch({ karmicRed })} className="bg-red-700 text-black" />
            <NumberInput label="Dharma" value={Math.max(0, data.karmicBlue || 0)} onChange={karmicBlue => patch({ karmicBlue })} className="bg-blue-700 text-white" />
          </div>
        </div>
      </section>
    );
  }

  if (supplement === 'fading-humans') {
    const masteryValues = data.masteries || {};
    return (
      <section className="grid gap-4 md:grid-cols-2">
        <div className={panel}>
          <h2 className="mb-3 font-bold uppercase tracking-widest">Maestria Sináptica</h2>
          <div className="grid grid-cols-2 gap-3">
            {masteries.map(name => <NumberInput key={name} label={name} value={masteryValues[name] || 0} onChange={value => patch({ masteries: { ...masteryValues, [name]: value } })} />)}
          </div>
        </div>
        <div className={panel}>
          <h2 className="mb-3 font-bold uppercase tracking-widest">Porte Físico</h2>
          <select className={`${input} w-full`} value={data.physicalFrame || ''} onChange={event => patch({ physicalFrame: event.target.value as SupplementData['physicalFrame'] })}>
            <option value="">Escolher porte...</option>
            {['Robusto', 'Padrão', 'Mirrado'].map(frame => <option key={frame}>{frame}</option>)}
          </select>
          <p className="mt-2 text-xs opacity-70">
            {data.physicalFrame === 'Robusto' && '+3 PV, +1 PS, +1 Defesa, +1 Vigor e +1 Força.'}
            {data.physicalFrame === 'Padrão' && '+2 Pontos de Treinamento.'}
            {data.physicalFrame === 'Mirrado' && '-1 PV, -1 Defesa, +2 Destreza, +1 Acrobacia, Furtividade e Iniciativa.'}
          </p>
          <div className="mt-4 border-t border-current/20 pt-4">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="font-bold">Pontos de Personagem</p>
                <p className="text-xs opacity-70">Vitalidade/Síntese multiplicam por 1,2; atributos e perícias aumentam 1; sinapses e maestrias avançam uma etapa.</p>
              </div>
              <div className="flex items-center gap-2">
                <Info size={15} title="PV: +20%, arredondado para cima. Síntese: +20%, arredondado para baixo. Atributo: +1. Perícia: +1. Árvore de Sinapse: próxima habilidade. Maestria Sináptica: +1." />
                <input
                  type="number"
                  aria-label="Pontos de Personagem disponíveis"
                  className={`${input} w-20 text-center text-2xl font-bold`}
                  value={data.characterPoints ?? 8}
                  onChange={event => patch({ characterPoints: Number(event.target.value) || 0 })}
                />
              </div>
            </div>
            <p className="mt-2 text-xs">Pontos de Atributo disponíveis: {data.attributePoints ?? 8} • Pontos de Treinamento disponíveis: {trainingPoints}</p>
            {((data.characterPoints ?? 8) < 0 || (data.attributePoints ?? 8) < 0 || trainingPoints < 0) && (
              <p className="mt-1 text-[10px] text-amber-400/80">Distribuição acima do recomendado pelo sistema; os valores foram mantidos.</p>
            )}
            <div className="mt-2 flex gap-2">
              <select className={`${input} min-w-0 flex-1`} value={selectedSpendTarget} onChange={event => setSelectedSpendTarget(event.target.value)}>
              {['Vitalidade', 'Síntese', ...Object.keys(attributes).map(key => `Atributo: ${key}`), ...skills.map(skill => `Perícia: ${skill.name}`), 'Árvore de Sinapse', ...masteries.map(name => `Maestria: ${name}`)].map(target => <option key={target}>{target}</option>)}
              </select>
              <button type="button" onClick={() => onSpendCharacterPoint(selectedSpendTarget)} className="rounded border border-current/30 px-3 text-sm font-bold">Distribuir PP</button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (supplement === 'ad-astra') {
    const protocols = data.protocols || [];
    const snippets = data.snippets || [];
    const updateProtocol = (id: string, updates: Partial<SupplementProtocol>) => patch({ protocols: protocols.map(protocol => protocol.id === id ? { ...protocol, ...updates } : protocol) });
    const addProtocol = () => patch({ protocols: [...protocols, { id: crypto.randomUUID(), name: '', description: '', actionType: '', energyCost: 0, matrixPoints: 0, snippets: [] }] });
    return (
      <section className="grid gap-4 md:grid-cols-2">
        <div className={panel}>
          <h2 className="mb-3 font-bold uppercase tracking-widest">Matriz</h2>
          <select className={`${input} w-full`} value={data.matrixChoice || ''} onChange={event => patch({ matrixChoice: event.target.value as SupplementData['matrixChoice'] })}>
            <option value="">Escolher...</option><option>Portador</option><option>Sem Matriz</option>
          </select>
          <div className={`mt-3 flex flex-col gap-3 ${data.matrixChoice === 'Sem Matriz' ? 'pointer-events-none opacity-40 grayscale' : ''}`}>
            <label className="flex flex-col gap-1 text-xs uppercase">Tema<input className={input} value={data.matrixTheme || ''} onChange={event => patch({ matrixTheme: event.target.value })} /></label>
            <div className="flex items-center justify-between"><strong>Biblioteca de Protocolos</strong><button type="button" onClick={addProtocol} aria-label="Adicionar protocolo"><Plus size={16} /></button></div>
            {protocols.map(protocol => (
              <div key={protocol.id} className="grid gap-2 rounded border border-current/20 p-2 sm:grid-cols-2">
                <input className={input} placeholder="Nome do protocolo" value={protocol.name} onChange={event => updateProtocol(protocol.id, { name: event.target.value })} />
                <input className={input} placeholder="Tipo de ação" value={protocol.actionType} onChange={event => updateProtocol(protocol.id, { actionType: event.target.value })} />
                <textarea className={`${input} sm:col-span-2`} placeholder="Descrição" value={protocol.description} onChange={event => updateProtocol(protocol.id, { description: event.target.value })} />
                <NumberInput label="Custo em PE" value={protocol.energyCost} onChange={energyCost => updateProtocol(protocol.id, { energyCost })} />
                <NumberInput label="Pontos de Matriz" value={protocol.matrixPoints} onChange={matrixPoints => updateProtocol(protocol.id, { matrixPoints })} />
                <div className="sm:col-span-2 flex justify-between text-xs"><span>Snippets aplicados (até 2)</span><button type="button" onClick={() => patch({ protocols: protocols.filter(item => item.id !== protocol.id) })} aria-label="Remover protocolo"><Trash2 size={14} /></button></div>
                <input className={`${input} sm:col-span-2`} placeholder="Snippets separados por vírgula" value={protocol.snippets.join(', ')} onChange={event => updateProtocol(protocol.id, { snippets: event.target.value.split(',').map(value => value.trim()).filter(Boolean).slice(0, 2) })} />
              </div>
            ))}
          </div>
        </div>
        <div className={panel}>
          <h2 className="mb-3 font-bold uppercase tracking-widest">Loadout e Snippets</h2>
          <div className="grid grid-cols-2 gap-3">
            <NumberInput label="Espaços Principais" value={data.mainSlots || 0} onChange={mainSlots => patch({ mainSlots, mainLoadout: Array.from({ length: mainSlots }, (_, index) => data.mainLoadout?.[index] || '') })} />
            <NumberInput label="Espaços Secundários" value={data.secondarySlots || 0} onChange={secondarySlots => patch({ secondarySlots, secondaryLoadout: Array.from({ length: secondarySlots }, (_, index) => data.secondaryLoadout?.[index] || '') })} />
          </div>
          <Loadout title="Principais" values={data.mainLoadout || []} protocols={protocols} onChange={mainLoadout => patch({ mainLoadout })} />
          <Loadout title="Secundários" values={data.secondaryLoadout || []} protocols={protocols} onChange={secondaryLoadout => patch({ secondaryLoadout })} />
          <div className="mt-4 flex items-center justify-between"><strong>Snippets disponíveis</strong><button type="button" onClick={() => patch({ snippets: [...snippets, 'Novo Snippet'] })} aria-label="Adicionar snippet"><Plus size={16} /></button></div>
          {snippets.map((snippet, index) => <div key={`${index}-${snippet}`} className="mt-2 flex gap-2"><input className={`${input} flex-1`} value={snippet} onChange={event => patch({ snippets: snippets.map((item, i) => i === index ? event.target.value : item) })} /><button type="button" aria-label="Remover snippet" onClick={() => patch({ snippets: snippets.filter((_, i) => i !== index) })}><Trash2 size={15} /></button></div>)}
        </div>
      </section>
    );
  }
  return null;
}

function NumberInput({ label, value, onChange, className = '', min = 0 }: { key?: string; label: string; value: number; onChange: (value: number) => void; className?: string; min?: number }) {
  return <label className="flex flex-col gap-1 text-xs">
    {label}
    <input className={`${input} ${className}`} type="number" min={min} value={value} onChange={event => onChange(Math.max(min, Number(event.target.value)))} />
  </label>;
}

function Loadout({ title, values, protocols, onChange }: { title: string; values: string[]; protocols: SupplementProtocol[]; onChange: (values: string[]) => void }) {
  return <div className="mt-3"><strong className="text-xs">{title}</strong>{values.map((value, index) => <select key={index} className={`${input} mt-1 w-full`} value={value} onChange={event => onChange(values.map((item, i) => i === index ? event.target.value : item))}><option value="">Escolher protocolo...</option>{protocols.map(protocol => <option key={protocol.id} value={protocol.name}>{protocol.name || 'Protocolo sem nome'}</option>)}</select>)}</div>;
}
