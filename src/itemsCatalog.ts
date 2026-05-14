/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Item } from './types';

export const ITEMS_CATALOG: Item[] = [
  // --- Armas Brancas Simples ---
  { id: 'abs1', name: 'Faca de Cozinha', description: 'Corpo a Corpo | 1d4 Cortante | Leve, Oculta', price: 5, icon: '🔪' },
  { id: 'abs2', name: 'Clava', description: 'Corpo a Corpo | 1d6 Concussivo | Duas Mãos', price: 10, icon: '🏏' },
  { id: 'abs3', name: 'Bastão', description: 'Corpo a Corpo | 1d6 Concussivo | Versátil (1d8)', price: 12, icon: '🦯' },
  { id: 'abs4', name: 'Pé de Cabra', description: 'Corpo a Corpo | 1d4 Concussivo | Ferramenta, Versátil (1d6)', price: 8, icon: '🔨' },
  { id: 'abs5', name: 'Faca de Arremesso', description: 'Curto | 1d4 Perfurante | Arremesso (6m), Leve', price: 7, icon: '🎯' },
  { id: 'abs6', name: 'Foice Pequena', description: 'Corpo a Corpo | 1d6 Cortante | Leve, Rural', price: 9, icon: '🌾' },
  { id: 'abs7', name: 'Adaga', description: 'Corpo a Corpo | 1d4 Perfurante | Leve, Arremesso (6m)', price: 10, icon: '🗡️' },
  { id: 'abs8', name: 'Martelo Pequeno', description: 'Corpo a Corpo | 1d4 Concussivo | Arremesso (6m), Leve', price: 7, icon: '🔨' },
  { id: 'abs9', name: 'Cajado Simples', description: 'Corpo a Corpo | 1d6 Concussivo | Versátil (1d8), Mágico Improvisado', price: 15, icon: '🪄' },
  { id: 'abs10', name: 'Corda com Peso', description: 'Corpo a Corpo | 1d4 Concussivo | Alcance (3m), Emaranhar', price: 10, icon: '🪢' },
  { id: 'abs11', name: 'Pá de Mineração', description: 'Corpo a Corpo | 1d6 Concussivo | Pesada, Rural', price: 8, icon: '🥄' },
  { id: 'abs12', name: 'Estaca de Madeira', description: 'Corpo a Corpo | 1d4 Perfurante | Ferramenta, Eficaz contra Mortos-vivos', price: 5, icon: '🪵' },
  { id: 'abs13', name: 'Lança Curta', description: 'Corpo a Corpo | 1d6 Perfurante | Arremesso (6m), Versátil (1d8)', price: 12, icon: '🔱' },
  { id: 'abs14', name: 'Picareta Leve', description: 'Corpo a Corpo | 1d6 Concussivo | Rural', price: 15, icon: '⛏️' },
  { id: 'abs15', name: 'Tacape', description: 'Corpo a Corpo | 1d8 Concussivo | Pesada, Duas Mãos', price: 15, icon: '🪵' },
  { id: 'abs16', name: 'Foice Grande', description: 'Corpo a Corpo | 1d8 Cortante | Duas Mãos, Pesada', price: 20, icon: '🌾' },
  { id: 'abs17', name: 'Estilingue', description: 'Curto | 1d4 Concussivo | Disparo Simples', price: 7, icon: '🎯' },
  { id: 'abs18', name: 'Espeto', description: 'Corpo a Corpo | 1d4 Perfurante | Ferramenta, Improvisado', price: 5, icon: '🍢' },
  { id: 'abs19', name: 'Ripa com Pregos', description: 'Corpo a Corpo | 1d6 Concussivo | Improvisada, Mortal', price: 8, icon: '🪵' },
  { id: 'abs20', name: 'Funda', description: 'Curto | 1d4 Concussivo | Arremesso (9m), Recarga', price: 6, icon: '🪢' },
  { id: 'abs21', name: 'Espada Rústica', description: 'Corpo a Corpo | 1d6 Cortante | Improvisada', price: 10, icon: '🗡️' },
  { id: 'abs22', name: 'Ferrão', description: 'Corpo a Corpo | 1d4 Perfurante | Arremesso (6m), Versátil (1d6)', price: 7, icon: '🐝' },
  { id: 'abs23', name: 'Machado Simples', description: 'Corpo a Corpo | 1d6 Cortante | Pesada, Rural', price: 12, icon: '🪓' },
  { id: 'abs24', name: 'Alabarda Improvisada', description: 'Corpo a Corpo | 1d8 Concussivo | Pesada, Versátil', price: 15, icon: '⚚' },

  // --- Armas Brancas Marciais ---
  { id: 'abm1', name: 'Espada Longa', description: 'Corpo a Corpo | 1d8 Cortante | Versátil (1d10)', price: 25, icon: '⚔️' },
  { id: 'abm2', name: 'Espada Curta', description: 'Corpo a Corpo | 1d6 Cortante | Leve', price: 20, icon: '🗡️' },
  { id: 'abm3', name: 'Machadinha', description: 'Corpo a Corpo | 1d6 Cortante | Leve, Arremesso (6m)', price: 20, icon: '🪓' },
  { id: 'abm4', name: 'Machado de Batalha', description: 'Corpo a Corpo | 1d8 Cortante | Versátil (1d10)', price: 30, icon: '🪓' },
  { id: 'abm5', name: 'Martelo de Guerra', description: 'Corpo a Corpo | 1d8 Concussivo | Pesada, Duas Mãos', price: 35, icon: '🔨' },
  { id: 'abm6', name: 'Lança Longa', description: 'Corpo a Corpo | 1d10 Perfurante | Alcance (3m), Duas Mãos', price: 30, icon: '🔱' },
  { id: 'abm7', name: 'Florete', description: 'Corpo a Corpo | 1d8 Perfurante | Preciso', price: 25, icon: '🤺' },
  { id: 'abm8', name: 'Alabarda', description: 'Corpo a Corpo | 1d10 Concussivo | Pesada, Alcance (3m)', price: 40, icon: '⚚' },
  { id: 'abm9', name: 'Mangual', description: 'Corpo a Corpo | 1d8 Concussivo | Ignora Escudo', price: 35, icon: '⛓️' },
  { id: 'abm10', name: 'Foice Dupla', description: 'Corpo a Corpo | 1d10 Cortante | Duas Mãos', price: 40, icon: '🌾' },
  { id: 'abm11', name: 'Espada Bastarda', description: 'Corpo a Corpo | 1d10 Cortante | Versátil (1d12)', price: 50, icon: '⚔️' },
  { id: 'abm12', name: 'Lança de Cavaleiro', description: 'Corpo a Corpo | 1d12 Perfurante | Pesada, Montada', price: 45, icon: '🏇' },
  { id: 'abm13', name: 'Chakram', description: 'Curto | 1d6 Cortante | Arremesso (9m), Retorno', price: 30, icon: '⭕' },
  { id: 'abm14', name: 'Adaga Cerimonial', description: 'Corpo a Corpo | 1d6 Perfurante | Mágica, Precisa', price: 30, icon: '✨' },
  { id: 'abm15', name: 'Espada Gládio', description: 'Corpo a Corpo | 1d8 Cortante | Leve', price: 28, icon: '⚔️' },
  { id: 'abm16', name: 'Katana', description: 'Corpo a Corpo | 1d10 Cortante | Duas Mãos, Rápida', price: 50, icon: '⚔️' },
  { id: 'abm17', name: 'Espada de Ossos', description: 'Corpo a Corpo | 1d8 Lacerante | Mortal, Improvisada', price: 25, icon: '🦴' },
  { id: 'abm18', name: 'Clavas Cravadas', description: 'Corpo a Corpo | 1d10 Concussivo | Pesada', price: 35, icon: '🏏' },
  { id: 'abm19', name: 'Machado Duplo', description: 'Corpo a Corpo | 1d12 Cortante | Duas Mãos', price: 50, icon: '🪓' },
  { id: 'abm20', name: 'Espada Encantada', description: 'Corpo a Corpo | 1d8 Elemental | Mágica, Versátil (1d10)', price: 60, icon: '🪄' },
  { id: 'abm21', name: 'Lâmina Oculta', description: 'Corpo a Corpo | 1d6 Perfurante | Oculta', price: 40, icon: '🕵️' },
  { id: 'abm22', name: 'Kusarigama', description: 'Corpo a Corpo | 1d8 Cortante | Alcance (3m), Leve', price: 35, icon: '🧶' },
  { id: 'abm23', name: 'Rapieira', description: 'Corpo a Corpo | 1d8 Perfurante | Precisa', price: 25, icon: '🤺' },
  { id: 'abm24', name: 'Machados Gêmeos', description: 'Corpo a Corpo | 1d6+1d6 Cortante | Dupla Empunhadura', price: 40, icon: '🪓' },
  { id: 'abm25', name: 'Clava Mística', description: 'Corpo a Corpo | 1d8 Elemental (Fogo), Mágica', price: 50, icon: '🔥' },
  { id: 'abm26', name: 'Punhal de Veneno', description: 'Corpo a Corpo | 1d4 Lacerante | Envenenado, Leve', price: 35, icon: '🐍' },

  // --- Poções ---
  { id: 'pot1', name: 'Poção de Cura Menor', description: 'Recupera 3d4+3 PV instantaneamente.', price: 25, icon: '🧪' },
  { id: 'pot2', name: 'Poção de Cura Média', description: 'Recupera 6d4+6 PV instantaneamente.', price: 50, icon: '🧪' },
  { id: 'pot3', name: 'Poção de Cura Superior', description: 'Recupera 12d6+12 PV instantaneamente.', price: 150, icon: '🧪' },
  { id: 'pot4', name: 'Poção de Cura Suprema', description: 'Recupera 10d4+20 PV instantaneamente.', price: 300, icon: '🧪' },
  { id: 'pot5', name: 'Poção de Energia', description: 'Recupera 2d6+3 PM.', price: 40, icon: '🧪' },
  { id: 'pot6', name: 'Poção de Resistência ao Fogo', description: 'Reduz dano de fogo pela metade por 1 min.', price: 75, icon: '🧪' },
  { id: 'pot7', name: 'Poção de Velocidade', description: 'Aumenta deslocamento em 3m por 1 min.', price: 50, icon: '🧪' },
  { id: 'pot8', name: 'Poção de Invisibilidade', description: 'Invisibilidade por 1 min.', price: 200, icon: '🧪' },
  { id: 'pot9', name: 'Poção de Escudo Arcano', description: 'Adiciona +2 à CA por 10 min.', price: 100, icon: '🧪' },
  { id: 'pot10', name: 'Poção de Força Titânica', description: 'Concede +4 em Força por 1 min.', price: 120, icon: '🧪' },
  { id: 'pot11', name: 'Poção de Reflexos Felinos', description: 'Concede +4 em Destreza por 1 min.', price: 120, icon: '🧪' },
  { id: 'pot12', name: 'Poção de Mente Afiada', description: 'Concede +4 em Intelecto por 1 min.', price: 120, icon: '🧪' },
  { id: 'pot13', name: 'Poção de Armadura de Pedra', description: 'Resistência a dano concussivo por 1 min.', price: 90, icon: '🧪' },
  { id: 'pot14', name: 'Poção de Agilidade', description: 'Vantagem em testes de Destreza por 1 min.', price: 100, icon: '🧪' },
  { id: 'pot15', name: 'Poção de Fôlego Profundo', description: 'Respira debaixo d\'água por 1h.', price: 60, icon: '🧪' },
  { id: 'pot16', name: 'Poção de Revigoramento', description: 'Remove 1 condição de cansaço.', price: 50, icon: '🧪' },
  { id: 'pot17', name: 'Poção de Regeneração', description: 'Recupera 1d6 PV por turno durante 1 min.', price: 200, icon: '🧪' },
  { id: 'pot18', name: 'Poção de Resistência à Magia', description: 'Vantagem em testes contra magia por 1 min.', price: 150, icon: '🧪' },
  { id: 'pot19', name: 'Poção de Pele de Dragão', description: 'Resistência a dano cortante por 1 min.', price: 75, icon: '🧪' },
  { id: 'pot20', name: 'Poção de Invisibilidade Maior', description: 'Invisibilidade por 10 min.', price: 500, icon: '🧪' },
  { id: 'pot21', name: 'Poção de Explosão de Força', description: '4d6 dano concussivo em raio de 3m.', price: 150, icon: '🧪' },
  { id: 'pot22', name: 'Poção de Vitalidade', description: 'PV máx +10 por 1h.', price: 100, icon: '🧪' },
  { id: 'pot23', name: 'Poção de Restauração Menor', description: 'Remove 1 status negativo.', price: 50, icon: '🧪' },
  { id: 'pot24', name: 'Poção de Restauração Maior', description: 'Remove todos status negativos.', price: 200, icon: '🧪' },
  { id: 'pot25', name: 'Poção de Olhos de Gato', description: 'Visão no escuro por 1h.', price: 80, icon: '🧪' },
  { id: 'pot35', name: 'Poção de Cura Espiritual', description: '1d10+5 PV e 2d4 PM.', price: 120, icon: '🧪' },
  { id: 'pot54', name: 'Poção de Cura dos Deuses', description: 'Recupera todos os PV.', price: 600, icon: '🧪' },

  // --- Explosivos ---
  { id: 'exp1', name: 'Granada de Fragmentação', description: 'Raio: 5m | 3d6 Dano', price: 50, icon: '💣' },
  { id: 'exp2', name: 'Bomba Adesiva', description: 'Raio: 2m | 2d10 Dano | Adesiva', price: 60, icon: '💣' },
  { id: 'exp5', name: 'Granada Incendiária', description: 'Raio: 5m | 2d6 + Fogo (2 rod.)', price: 55, icon: '🔥' },
  { id: 'exp7', name: 'Granada de Fumaça', description: 'Raio: 3m | Obscurece por 2 min.', price: 20, icon: '💨' },
  { id: 'exp11', name: 'Granada de Choque', description: 'Raio: 3m | 3d6 | Paralisia (1 rod.)', price: 70, icon: '⚡' },
  { id: 'exp17', name: 'Bomba Flashbang', description: 'Raio: 6m | Cega e Ensurdece (2 rod.)', price: 40, icon: '✨' },

  // --- Comidas ---
  { id: 'com1', name: 'Pão Rústico', description: 'Recupera 5 PV.', price: 5, icon: '🍞' },
  { id: 'com2', name: 'Ensopado de Carne', description: 'Recupera 10 PV e 2 PM.', price: 15, icon: '🥣' },
  { id: 'com3', name: 'Sopa de Ervas', description: 'Remove status leve.', price: 20, icon: '🥣' },
  { id: 'com6', name: 'Pimenta do Caos', description: '+1 Dano corpo a corpo (3 rod.)', price: 10, icon: '🌶️' },
  { id: 'com11', name: 'Ensopado de Dragão', description: 'Resistência Fogo e +5 PV (5 rod.)', price: 35, icon: '🐉' },
  { id: 'com14', name: 'Fruta Cristalina', description: '10 PM e vantagem em Magia (3 rod.)', price: 40, icon: '🍎' },
  { id: 'com20', name: 'Vinho Celestial', description: '10 PM e remove efeito negativo.', price: 50, icon: '🍷' },

  // --- Equipamentos Cabeça ---
  { id: 'hc1', name: 'Capuz Simples', description: 'RD: 1', price: 10, icon: '🎩' },
  { id: 'hc2', name: 'Elmo de Couro Leve', description: 'RD: 2', price: 20, icon: '👷' },
  { id: 'hc3', name: 'Chapéu do Viajante', description: 'RD: 1 | +1 Sobrevivência', price: 50, icon: '🤠' },
  { id: 'hc9', name: 'Óculos de Visão Noturna', description: 'RD: 1 | Visão no Escuro (15m)', price: 120, icon: '🥽' },
  { id: 'hc11', name: 'Máscara de Gás', description: 'RD: 2 | Imunidade a venenos inalados', price: 200, icon: '😷' },

  // --- Equipamentos Torso ---
  { id: 'tc1', name: 'Jaqueta de Couro Leve', description: 'Def: 2', price: 50, icon: '🧥' },
  { id: 'tc4', name: 'Peitoral de Couro Grosso', description: 'Def: 4 | -1 Desloc.', price: 100, icon: '🧥' },
  { id: 'tc6', name: 'Colete Blindado', description: 'Def: 6 | Resistência Projéteis | -1 Desloc.', price: 200, icon: '🛡️' },
  { id: 'tc19', name: 'Armadura de Dragão', description: 'Def: 9 | Res. Elemental | -3 Desloc.', price: 500, icon: '🐉' },
  { id: 'tc26', name: 'Manto de Invisibilidade', description: 'Def: 3 | Invisível (1/cena) | -2 Energia', price: 350, icon: '🪄' },

  // --- Equipamentos Pernas ---
  { id: 'lc1', name: 'Calças de Couro Simples', description: 'Def: 1', price: 40, icon: '👖' },
  { id: 'lc13', name: 'Armadura de Placas Pesadas', description: 'Def: 8 | -3 Desloc.', price: 250, icon: '👖' },

  // --- Equipamentos Pés ---
  { id: 'fc1', name: 'Botas de Couro Simples', description: 'RD: +1', price: 30, icon: '👞' },
  { id: 'fc16', name: 'Botas do Ventor', description: 'RD: +5 | Ignore terreno difícil | -1 Energia', price: 200, icon: '👞' },

  // --- Acessórios ---
  { id: 'acc1', name: 'Anel da Vitalidade', description: 'Máx PV +10', price: 200, icon: '💍' },
  { id: 'acc2', name: 'Colar de Resistência Arcana', description: 'Res. Magica 5', price: 300, icon: '📿' },
  { id: 'acc9', name: 'Anel de Invisibilidade', description: 'Invisível 2 rodadas | 15 Energia', price: 1000, icon: '💍' },
  { id: 'acc19', name: 'Colar de Respiração Aquática', description: 'Respira debaixo d\'água', price: 800, icon: '📿' },
  { id: 'acc64', name: 'Amuleto da Fênix', description: 'Revive com 10% vida | 20 Energia', price: 2000, icon: '🦅' },
];
