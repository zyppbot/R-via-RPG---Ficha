import { Plus, Trash2 } from 'lucide-react';
import { NovaVehicle, NovaVehicleCategory, NovaVehicleWeapon } from './types';

const VEHICLE_DEFAULTS: Record<NovaVehicleCategory, Omit<NovaVehicle, 'id' | 'name' | 'category' | 'currentPV' | 'security' | 'refinements' | 'antiMagicInsulation' | 'enchantedParts' | 'mountedWeapons'>> = {
  'Bicicleta ou patinete': { maxPV: 6, defense: 15, movement: 12, armor: 0, seats: 1 },
  Moto: { maxPV: 15, defense: 14, movement: 24, armor: 10, seats: 2 },
  Carro: { maxPV: 25, defense: 12, movement: 18, armor: 17, seats: 5 },
  Utilitário: { maxPV: 35, defense: 11, movement: 15, armor: 24, seats: 6 },
  Caminhão: { maxPV: 50, defense: 9, movement: 12, armor: 34, seats: 2 },
  Ônibus: { maxPV: 60, defense: 7, movement: 12, armor: 28, seats: 41 },
  Tanque: { maxPV: 95, defense: 5, movement: 10, armor: 80, seats: 4 },
  Lancha: { maxPV: 25, defense: 12, movement: 18, armor: 17, seats: 5 },
  Barco: { maxPV: 35, defense: 11, movement: 15, armor: 24, seats: 6 },
  Helicóptero: { maxPV: 35, defense: 11, movement: 15, armor: 24, seats: 6 },
  'Avião pequeno': { maxPV: 35, defense: 11, movement: 15, armor: 24, seats: 6 },
};

const categories = Object.keys(VEHICLE_DEFAULTS) as NovaVehicleCategory[];
const refinementFields: { key: keyof NovaVehicle['refinements']; label: string }[] = [
  { key: 'engine', label: 'Motor' },
  { key: 'armor', label: 'Blindagem' },
  { key: 'wheels', label: 'Pneus e Rodas' },
  { key: 'structure', label: 'Reforço Estrutural' },
  { key: 'electronics', label: 'Eletrônica' },
  { key: 'security', label: 'Segurança' },
];

const createVehicle = (): NovaVehicle => ({
  id: crypto.randomUUID(),
  name: '',
  category: 'Carro',
  ...VEHICLE_DEFAULTS.Carro,
  currentPV: VEHICLE_DEFAULTS.Carro.maxPV,
  security: 0,
  refinements: { engine: 0, armor: 0, wheels: 0, structure: 0, electronics: 0, security: 0 },
  antiMagicInsulation: false,
  enchantedParts: '',
  mountedWeapons: [],
});

interface NovaVehiclesPanelProps {
  vehicles: NovaVehicle[];
  onChange: (vehicles: NovaVehicle[]) => void;
}

export default function NovaVehiclesPanel({ vehicles, onChange }: NovaVehiclesPanelProps) {
  const updateVehicle = (id: string, updates: Partial<NovaVehicle>) => {
    onChange(vehicles.map(vehicle => vehicle.id === id ? { ...vehicle, ...updates } : vehicle));
  };
  const addWeapon = (vehicle: NovaVehicle) => {
    const weapon: NovaVehicleWeapon = { id: crypto.randomUUID(), name: '', description: '' };
    updateVehicle(vehicle.id, { mountedWeapons: [...vehicle.mountedWeapons, weapon] });
  };

  return (
    <section className="rounded-sm border border-ruvia-accent/40 bg-ruvia-card p-5 shadow-xl">
      <header className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-ruvia-accent">Garagem</p>
          <h2 className="text-2xl font-bold uppercase">Veículos</h2>
        </div>
        <button type="button" onClick={() => onChange([...vehicles, createVehicle()])} className="flex items-center gap-2 rounded-sm bg-ruvia-accent px-3 py-2 text-xs font-bold uppercase text-black">
          <Plus size={16} /> Adicionar veículo
        </button>
      </header>
      {vehicles.length === 0 && <p className="border border-dashed border-ruvia-accent/30 p-5 text-sm opacity-60">Nenhum veículo registrado.</p>}
      <div className="grid gap-4">
        {vehicles.map(vehicle => (
          <article key={vehicle.id} className="rounded-sm border border-ruvia-accent/20 bg-black/30 p-4">
            <div className="mb-4 flex flex-wrap items-end gap-3">
              <label className="flex min-w-[180px] flex-1 flex-col gap-1 text-[10px] font-bold uppercase">
                Nome / Modelo
                <input value={vehicle.name} onChange={event => updateVehicle(vehicle.id, { name: event.target.value })} className="rounded border border-white/10 bg-black/30 p-2 text-sm normal-case" />
              </label>
              <label className="flex min-w-[180px] flex-1 flex-col gap-1 text-[10px] font-bold uppercase">
                Categoria
                <select value={vehicle.category} onChange={event => {
                  const category = event.target.value as NovaVehicleCategory;
                  const stats = VEHICLE_DEFAULTS[category];
                  updateVehicle(vehicle.id, { category, ...stats, currentPV: stats.maxPV });
                }} className="rounded border border-white/10 bg-black/30 p-2 text-sm normal-case">
                  {categories.map(category => <option key={category} value={category}>{category}</option>)}
                </select>
              </label>
              <button type="button" title="Remover veículo" onClick={() => onChange(vehicles.filter(item => item.id !== vehicle.id))} className="rounded border border-red-500/30 p-2 text-red-300"><Trash2 size={16} /></button>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {([
                ['maxPV', 'PV máximo'], ['defense', 'Defesa'], ['movement', 'Deslocamento (m)'],
                ['armor', 'Blindagem'], ['seats', 'Assentos'], ['security', 'Segurança'],
              ] as const).map(([key, label]) => (
                <label key={key} className="flex flex-col gap-1 text-[10px] font-bold uppercase">
                  {label}
                  <input type="number" value={vehicle[key]} onChange={event => {
                    const value = Number(event.target.value);
                    updateVehicle(vehicle.id, key === 'maxPV'
                      ? { maxPV: value }
                      : { [key]: value });
                  }} className="w-full rounded border border-white/10 bg-black/30 p-2 text-sm" />
                </label>
              ))}
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              <label className="flex flex-col gap-1 text-[10px] font-bold uppercase">
                PV atual
                <input type="number" value={vehicle.currentPV} onChange={event => updateVehicle(vehicle.id, { currentPV: Number(event.target.value) })} className="rounded border border-white/10 bg-black/30 p-2 text-sm" />
              </label>
              <div className="col-span-1 flex flex-col justify-end gap-1 text-[10px] font-bold uppercase sm:col-span-2">
                Integridade: {vehicle.currentPV} / {vehicle.maxPV}
                <progress max={Math.max(vehicle.maxPV, 1)} value={Math.max(0, Math.min(vehicle.currentPV, vehicle.maxPV))} className="h-3 w-full accent-[#1e9aae]" />
              </div>
            </div>
            <div className="mt-4">
              <h3 className="mb-2 text-[10px] font-bold uppercase tracking-widest opacity-70">Refinos</h3>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                {refinementFields.map(({ key, label }) => (
                  <label key={key} className="flex flex-col gap-1 text-[10px] font-bold uppercase">
                    {label}
                    <input type="number" value={vehicle.refinements[key]} onChange={event => updateVehicle(vehicle.id, { refinements: { ...vehicle.refinements, [key]: Number(event.target.value) } })} className="rounded border border-white/10 bg-black/30 p-2 text-sm" />
                  </label>
                ))}
              </div>
              <label className="mt-3 flex items-center gap-2 text-xs font-bold uppercase">
                <input type="checkbox" checked={vehicle.antiMagicInsulation} onChange={event => updateVehicle(vehicle.id, { antiMagicInsulation: event.target.checked })} />
                Isolamento antimágico
              </label>
            </div>
            <label className="mt-4 flex flex-col gap-1 text-[10px] font-bold uppercase">
              Peças Encantadas
              <textarea value={vehicle.enchantedParts} onChange={event => updateVehicle(vehicle.id, { enchantedParts: event.target.value })} className="min-h-16 rounded border border-white/10 bg-black/30 p-2 text-sm normal-case" />
            </label>
            <div className="mt-4 border-t border-white/10 pt-3">
              <div className="mb-2 flex items-center justify-between gap-2">
                <h3 className="text-[10px] font-bold uppercase tracking-widest opacity-70">Armas Montadas</h3>
                <button type="button" onClick={() => addWeapon(vehicle)} className="flex items-center gap-1 text-xs font-bold uppercase text-ruvia-accent"><Plus size={14} /> Arma</button>
              </div>
              {vehicle.mountedWeapons.map(weapon => (
                <div key={weapon.id} className="mb-2 flex gap-2">
                  <input aria-label="Nome da arma" placeholder="Nome" value={weapon.name} onChange={event => updateVehicle(vehicle.id, { mountedWeapons: vehicle.mountedWeapons.map(item => item.id === weapon.id ? { ...item, name: event.target.value } : item) })} className="w-1/3 rounded border border-white/10 bg-black/30 p-2 text-sm" />
                  <input aria-label="Descrição da arma" placeholder="Descrição" value={weapon.description} onChange={event => updateVehicle(vehicle.id, { mountedWeapons: vehicle.mountedWeapons.map(item => item.id === weapon.id ? { ...item, description: event.target.value } : item) })} className="min-w-0 flex-1 rounded border border-white/10 bg-black/30 p-2 text-sm" />
                  <button type="button" aria-label="Remover arma" onClick={() => updateVehicle(vehicle.id, { mountedWeapons: vehicle.mountedWeapons.filter(item => item.id !== weapon.id) })} className="text-red-300"><Trash2 size={14} /></button>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
