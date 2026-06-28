/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useEffect, useState } from 'react';
import { ActiveCharacter, Enemy, RandomEvent, GameLog, Item, SkillName } from '../types';
import { 
  Play, Shield, Sword, Sparkles, MessageSquare, Compass, AlertCircle, 
  RefreshCw, Skull, Pause, Hammer, Coffee, Droplets, Leaf, Trees, ChevronRight
} from 'lucide-react';

interface AdventurePanelProps {
  character: ActiveCharacter | null;
  logs: GameLog[];
  activeEncounter: {
    type: 'battle' | 'event' | null;
    enemy: Enemy | null;
    event: RandomEvent | null;
    enemyCurrentHp?: number;
  };
  onTakeStep: () => void;
  onCombatAction: (action: 'strike' | 'spell' | 'flee') => void;
  onResolveEventOption: (optionIdx: number) => void;
  onResetGame: (name: string) => void;
  potionsCount: number;
  onUseQuickPotion: () => void;
  isAiGenerating?: boolean;
  activeTask: string;
  taskProgress: number;
  setActiveTask: (task: string) => void;
}

export default function AdventurePanel({
  character,
  logs,
  activeEncounter,
  onTakeStep,
  onCombatAction,
  onResolveEventOption,
  onResetGame,
  potionsCount,
  onUseQuickPotion,
  isAiGenerating = false,
  activeTask,
  taskProgress,
  setActiveTask
}: AdventurePanelProps) {
  const terminalRef = useRef<HTMLDivElement | null>(null);
  const [newCharName, setNewCharName] = useState('');
  const [panelTab, setPanelTab] = useState<'arena' | 'milkyway'>('arena');

  // Auto-scroll RPG Terminal to the bottom on new logs
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [logs]);

  // Handle initial creation / resurrection
  const handleStartRun = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCharName.trim()) return;
    onResetGame(newCharName.trim());
    setNewCharName('');
  };

  // If character is dead, show death screen
  if (!character || !character.alive) {
    return (
      <div id="death-panel" className="retro-glass-panel-heavy rounded-2xl p-6 shadow-2xl flex flex-col items-center justify-center text-center space-y-6 h-full font-mono select-none">
        <div className="w-16 h-16 rounded-full bg-red-600/10 border border-red-500/30 flex items-center justify-center animate-pulse">
          <Skull className="w-8 h-8 text-red-500" />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-red-500 tracking-wider">HERO DEFEATED (PERMADEATH)</h2>
          <p className="text-xs text-zinc-400">Your physical shell has collapsed. Your soul ascends to the ancestral hall.</p>
        </div>

        {character && (
          <div className="bg-zinc-900/50 border border-zinc-850 p-4 rounded-xl w-full max-w-sm space-y-3 text-xs text-left">
            <h3 className="text-center font-bold text-zinc-300 border-b border-zinc-800 pb-1.5 mb-2 uppercase">Crawl Achievements</h3>
            <div className="flex justify-between">
              <span className="text-zinc-500">HERO NAME:</span>
              <span className="text-white font-bold">{character.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">LEVEL REACHED:</span>
              <span className="text-amber-400 font-bold">Level {character.level}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">TOTAL TURNS:</span>
              <span className="text-cyan-400 font-bold">{character.turnCount} turns</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">GOLD EARNED:</span>
              <span className="text-yellow-400 font-bold">{character.gold} Gold</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">SLAYED ENEMIES:</span>
              <span className="text-red-400 font-bold">{character.killedEnemiesCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">RESOLVED SCENARIOS:</span>
              <span className="text-indigo-400 font-bold">{character.eventsResolvedCount}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleStartRun} className="w-full max-w-sm space-y-3">
          <div className="space-y-1 text-left">
            <label className="block text-[10px] text-zinc-400 tracking-wider uppercase">Create New Hero Name</label>
            <input
              type="text"
              placeholder="e.g. Alden the Brave"
              value={newCharName}
              onChange={(e) => setNewCharName(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-red-500"
            />
          </div>
          <button
            type="submit"
            disabled={!newCharName.trim()}
            className="w-full bg-red-600 hover:bg-red-500 text-white py-2.5 rounded-lg text-xs font-bold transition duration-200 shadow-lg shadow-red-950/50 flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 fill-current" />
            START NEW ADVENTURE
          </button>
        </form>
      </div>
    );
  }

  // Active Combat View
  const isCombatActive = activeEncounter.type === 'battle' && activeEncounter.enemy;
  const isEventActive = activeEncounter.type === 'event' && activeEncounter.event;

  const activities = [
    {
      id: 'milking',
      name: '🥛 Star Milking',
      skillKey: 'milking' as const,
      desc: 'Milk stellar space-cows. Gathers 1x Cow Milk.',
      req: 'FREE',
      isCraft: false
    },
    {
      id: 'foraging',
      name: '🌿 Flora Foraging',
      skillKey: 'foraging' as const,
      desc: 'Forage space flora. Gathers 1x Wild Herbs.',
      req: 'FREE',
      isCraft: false
    },
    {
      id: 'woodcutting',
      name: '🪵 Timber Logging',
      skillKey: 'woodcutting' as const,
      desc: 'Chop runic ancient trees. Gathers 1x Runic Wood.',
      req: 'FREE',
      isCraft: false
    },
    {
      id: 'mining',
      name: '☄️ Meteor Mining',
      skillKey: 'mining' as const,
      desc: 'Drill core space meteorites. Gathers 1x Meteor Ore.',
      req: 'FREE',
      isCraft: false
    },
    {
      id: 'fishing',
      name: '🎣 Nebula Fishing',
      skillKey: 'fishing' as const,
      desc: 'Cast energy nets in stellar streams. Gathers 1x Nebula Fish.',
      req: 'FREE',
      isCraft: false
    },
    {
      id: 'cooking',
      name: '🥣 Nebula Cooking',
      skillKey: 'cooking' as const,
      desc: 'Brew health potions. Costs Milk & Herbs.',
      req: '1x Space Milk, 1x Wild Herbs',
      isCraft: true,
      hasIngredients: (character?.materials?.cow_milk ?? 0) >= 1 && (character?.materials?.wild_herbs ?? 0) >= 1
    },
    {
      id: 'stew_cooking',
      name: '🍲 Nebula Stewing',
      skillKey: 'cooking' as const,
      desc: 'Cook Star Soups. Costs Fish & Herbs. Sells for high Gold.',
      req: '1x Nebula Fish, 1x Wild Herbs',
      isCraft: true,
      hasIngredients: (character?.materials?.nebula_fish ?? 0) >= 1 && (character?.materials?.wild_herbs ?? 0) >= 1
    },
    {
      id: 'crafting',
      name: '🛠️ Astral Smithing',
      skillKey: 'crafting' as const,
      desc: 'Forge level-scaled gear. Costs Wood & Gold.',
      req: '2x Runic Wood, 20 Gold',
      isCraft: true,
      hasIngredients: (character?.materials?.runic_wood ?? 0) >= 2 && (character?.gold ?? 0) >= 20
    },
    {
      id: 'ore_smelting',
      name: '🌋 Meteor Forge',
      skillKey: 'crafting' as const,
      desc: 'Forge rare metallic rings. Costs Ore & Gold.',
      req: '2x Meteor Ore, 30 Gold',
      isCraft: true,
      hasIngredients: (character?.materials?.meteor_ore ?? 0) >= 2 && (character?.gold ?? 0) >= 30
    }
  ];

  return (
    <div id="adventure-panel" className="retro-glass-panel-heavy rounded-2xl p-4.5 shadow-2xl h-full flex flex-col font-mono select-none">
      
      {/* Tab Selector */}
      <div className="flex bg-zinc-950/60 p-1 rounded-xl border border-zinc-900 mb-3 shrink-0 gap-1 text-[10px] font-bold">
        <button
          onClick={() => setPanelTab('arena')}
          className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer ${
            panelTab === 'arena'
              ? 'bg-red-600/10 text-red-400 border border-red-500/20 shadow-inner'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
          }`}
        >
          <Sword className="w-3.5 h-3.5" />
          🗡️ ADVENTURE ARENA
        </button>
        <button
          onClick={() => setPanelTab('milkyway')}
          className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer ${
            panelTab === 'milkyway'
              ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 shadow-inner'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          🥛 GALAXY GATHERING
        </button>
      </div>

      {panelTab === 'arena' ? (
        // ==========================================
        // ADVENTURE ARENA TAB
        // ==========================================
        <div className="flex-1 flex flex-col min-h-0">
          
          {/* Active Display Arena (Combat, Event, or Exploration Scene) */}
          <div className="h-44 rounded-xl bg-zinc-900/40 border border-zinc-900 p-3 relative mb-3 shrink-0 overflow-hidden flex flex-col justify-between">
            <div className="absolute inset-0 bg-radial from-transparent to-zinc-950 opacity-40 pointer-events-none" />

            {isCombatActive ? (
              // COMBAT VIEW
              <div id="combat-display" className="h-full flex flex-col justify-between relative z-10">
                <div className="flex justify-between items-center bg-red-950/10 border border-red-950/20 p-1.5 rounded-lg">
                  <span className="text-[9px] text-red-400 font-bold tracking-widest uppercase animate-pulse flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> COMBAT ACTIVE
                  </span>
                  <span className="text-[9px] text-zinc-500">Lv {activeEncounter.enemy?.level} Threat</span>
                </div>

                <div className="flex items-center gap-3 py-1">
                  <div className="w-12 h-12 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-center overflow-hidden text-3xl shadow-lg relative">
                    {activeEncounter.enemy?.imageUrl ? (
                      <img
                        src={activeEncounter.enemy.imageUrl}
                        alt={activeEncounter.enemy.name}
                        className="w-full h-full object-cover pixelated"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      activeEncounter.enemy?.icon
                    )}
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-red-950 border border-red-800 flex items-center justify-center text-[8px] font-bold text-red-400 z-10">
                      {activeEncounter.enemy?.level}
                    </div>
                  </div>

                  <div className="flex-1 space-y-1">
                    <h3 className="text-[11px] font-bold text-zinc-100 flex items-center gap-1">
                      {activeEncounter.enemy?.name}
                    </h3>
                    <div className="w-full bg-zinc-950 h-2 rounded-full border border-zinc-850 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-red-600 to-rose-500 transition-all duration-300"
                        style={{ width: `${Math.max(0, Math.min(100, ((activeEncounter.enemyCurrentHp || 0) / (activeEncounter.enemy?.maxHp || 1)) * 100))}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[7px] text-zinc-400">
                      <span>HP: {activeEncounter.enemyCurrentHp} / {activeEncounter.enemy?.maxHp}</span>
                      <span>Atk: {activeEncounter.enemy?.damage} | Def: {activeEncounter.enemy?.defense}</span>
                    </div>
                  </div>
                </div>

                <div className="text-[7px] text-zinc-500 italic truncate">
                  Attributes: {activeEncounter.enemy?.abilities.join(', ')}
                </div>
              </div>
            ) : isEventActive ? (
              // CHOICE EVENT VIEW
              <div id="event-display" className={`h-full flex flex-col justify-between border rounded-lg p-2 ${activeEncounter.event?.imageTheme} relative z-10`}>
                <div className="flex justify-between items-center bg-black/40 p-1 rounded text-[8px] font-bold">
                  <span className="text-amber-400 tracking-wider uppercase flex items-center gap-1">
                    <MessageSquare className="w-3 h-3 text-amber-500" /> CHOOSE ADVENTURE SCENARIO
                  </span>
                </div>

                <div className="py-1.5 bg-black/50 p-1.5 rounded border border-white/5 space-y-0.5">
                  <h3 className="text-[10px] font-bold text-zinc-100 uppercase tracking-wide">{activeEncounter.event?.title}</h3>
                  <p className="text-[9px] text-zinc-300 leading-normal line-clamp-2">{activeEncounter.event?.description}</p>
                </div>

                <div className="text-[7px] text-zinc-400">
                  * Choices scale based on skill check levels.
                </div>
              </div>
            ) : (
              // Standard Exploration state
              <div id="exploration-display" className="h-full flex flex-col justify-between items-center text-center relative z-10 py-2">
                <Compass className="w-6 h-6 text-zinc-600 animate-spin" style={{ animationDuration: '20s' }} />
                <div className="space-y-1">
                  <h3 className="text-[11px] font-bold text-zinc-200">Zone: {character.currentArea}</h3>
                  <p className="text-[8px] text-zinc-500">The Abyss is quiet. Initiate crawl step or trigger auto-crawler!</p>
                </div>
                <div className="text-[8px] text-zinc-400 font-semibold bg-zinc-950/80 px-2 py-0.5 rounded border border-zinc-850">
                  Total Crawl Steps: {character.turnCount}
                </div>
              </div>
            )}
          </div>

          {/* Action Interaction Board */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5 mb-3 shrink-0">
            
            {/* Main Action Controllers */}
            <div className="col-span-1 md:col-span-8 flex flex-col justify-center">
              {activeTask === 'auto_crawl' ? (
                // If Auto-Crawl is actively running, show status and deactivate
                <div className="bg-red-950/20 border border-red-500/20 p-2.5 rounded-xl space-y-1.5">
                  <div className="flex justify-between items-center text-[9px]">
                    <span className="text-red-400 font-bold flex items-center gap-1 animate-pulse">
                      <RefreshCw className="w-3 h-3 animate-spin text-red-500" /> AUTO-CRAWLING...
                    </span>
                    <span className="text-zinc-400 font-bold">{taskProgress}%</span>
                  </div>
                  
                  <div className="w-full bg-zinc-950 h-1.5 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-red-600 to-amber-500" style={{ width: `${taskProgress}%` }} />
                  </div>

                  <button
                    onClick={() => setActiveTask('none')}
                    className="w-full bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white py-2 rounded-lg text-[10px] font-bold border border-zinc-800 cursor-pointer flex items-center justify-center gap-1 shadow-md transition"
                  >
                    <Pause className="w-3 h-3 fill-current" />
                    PAUSE AUTO-CRAWLER
                  </button>
                </div>
              ) : isCombatActive ? (
                // Combat buttons
                <div className="grid grid-cols-3 gap-2">
                  <button
                    id="combat-strike-btn"
                    onClick={() => onCombatAction('strike')}
                    className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white rounded-xl py-3 px-1.5 font-bold flex flex-col items-center justify-center gap-0.5 border border-red-500/20 shadow-lg transition active:scale-[0.98] cursor-pointer"
                  >
                    <Sword className="w-4 h-4" />
                    <span className="text-[8px] tracking-wider font-bold">STRIKE</span>
                  </button>
                  <button
                    id="combat-spell-btn"
                    onClick={() => onCombatAction('spell')}
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl py-3 px-1.5 font-bold flex flex-col items-center justify-center gap-0.5 border border-purple-500/20 shadow-lg transition active:scale-[0.98] cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span className="text-[8px] tracking-wider font-bold">SPELL</span>
                  </button>
                  <button
                    id="combat-flee-btn"
                    onClick={() => onCombatAction('flee')}
                    className="bg-zinc-900 hover:bg-zinc-850 text-zinc-300 rounded-xl py-3 px-1.5 font-bold flex flex-col items-center justify-center gap-0.5 border border-zinc-800 transition active:scale-[0.98] cursor-pointer"
                  >
                    <Shield className="w-4 h-4" />
                    <span className="text-[8px] tracking-wider font-bold">FLEE</span>
                  </button>
                </div>
              ) : isEventActive ? (
                <div className="space-y-1">
                  {activeEncounter.event?.options.map((opt, idx) => (
                    <button
                      id={`event-option-btn-${idx}`}
                      key={idx}
                      onClick={() => onResolveEventOption(idx)}
                      className="w-full text-left bg-zinc-900 border border-zinc-800 hover:border-red-500/30 hover:bg-zinc-850 p-1.5 rounded-lg transition text-[9px] text-zinc-300 font-mono leading-normal cursor-pointer"
                    >
                      {opt.text}
                    </button>
                  ))}
                </div>
              ) : (
                // Core Manual + Auto toggle buttons
                <div className="flex flex-col gap-1.5">
                  <button
                    id="adventure-step-btn"
                    disabled={isAiGenerating}
                    onClick={onTakeStep}
                    className="w-full bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white cursor-pointer py-3.5 rounded-xl text-[10px] font-bold tracking-widest border border-red-500/20 shadow-lg flex items-center justify-center gap-1.5 transition"
                  >
                    {isAiGenerating ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-500" />
                        WARPING SPATIAL CRAWL...
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-current" />
                        MANUAL STEP / EXPLORE
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => setActiveTask('auto_crawl')}
                    className="w-full bg-zinc-950 hover:bg-zinc-900 text-red-400 hover:text-red-300 py-1.5 rounded-lg text-[9px] font-bold border border-red-950/40 flex items-center justify-center gap-1 transition cursor-pointer"
                  >
                    🤖 TOGGLE AUTO-CRAWL IDLE
                  </button>
                </div>
              )}
            </div>

            {/* Quick potion helper */}
            <div className="col-span-1 md:col-span-4 bg-zinc-900/40 border border-zinc-900 rounded-xl p-2 flex flex-col justify-between">
              <div className="flex justify-between items-center text-[8px] text-zinc-500 font-bold">
                <span>BELT</span>
                <span className="text-rose-400">{potionsCount} Potions</span>
              </div>
              <button
                id="quick-potion-btn"
                disabled={potionsCount === 0}
                onClick={onUseQuickPotion}
                className={`w-full py-2 rounded-lg text-[9px] font-bold transition flex items-center justify-center gap-1 ${
                  potionsCount > 0
                    ? 'bg-rose-950/40 hover:bg-rose-900 text-rose-300 border border-rose-500/20 shadow shadow-rose-950/20 cursor-pointer'
                    : 'bg-zinc-950 text-zinc-700 border border-zinc-900 cursor-not-allowed'
                }`}
              >
                🧪 QUICK HEAL
              </button>
            </div>
          </div>
        </div>
      ) : (
        // ==========================================
        // GALAXY GATHERING & CRAFTING ACTIVITIES TAB
        // ==========================================
        <div className="flex-1 flex flex-col min-h-0 space-y-3">
          
          {/* Milky Way Materials Warehouse (Galaxy Silo) */}
          <div className="bg-zinc-950/80 rounded-xl p-2.5 border border-zinc-900 space-y-1.5 shrink-0">
            <h4 className="text-[8px] text-zinc-500 font-bold uppercase tracking-widest flex justify-between">
              <span>🌌 Galaxy Materials Silo</span>
              <span className="text-amber-500">Warehouse Capacity: Unlimited</span>
            </h4>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-1 text-[9px] font-mono font-bold">
              <div className="bg-zinc-900/40 p-1 rounded border border-zinc-850 flex flex-col items-center justify-center">
                <span className="text-base">🥛</span>
                <span className="text-[7px] text-zinc-500 font-normal uppercase text-center truncate w-full">Milk</span>
                <span className="text-zinc-200 mt-0.5">{character?.materials?.cow_milk ?? 0}</span>
              </div>
              <div className="bg-zinc-900/40 p-1 rounded border border-zinc-850 flex flex-col items-center justify-center">
                <span className="text-base">🌿</span>
                <span className="text-[7px] text-zinc-500 font-normal uppercase text-center truncate w-full">Herbs</span>
                <span className="text-zinc-200 mt-0.5">{character?.materials?.wild_herbs ?? 0}</span>
              </div>
              <div className="bg-zinc-900/40 p-1 rounded border border-zinc-850 flex flex-col items-center justify-center">
                <span className="text-base">🪵</span>
                <span className="text-[7px] text-zinc-500 font-normal uppercase text-center truncate w-full">Wood</span>
                <span className="text-zinc-200 mt-0.5">{character?.materials?.runic_wood ?? 0}</span>
              </div>
              <div className="bg-zinc-900/40 p-1 rounded border border-zinc-850 flex flex-col items-center justify-center">
                <span className="text-base">☄️</span>
                <span className="text-[7px] text-zinc-500 font-normal uppercase text-center truncate w-full">Ore</span>
                <span className="text-zinc-200 mt-0.5">{character?.materials?.meteor_ore ?? 0}</span>
              </div>
              <div className="bg-zinc-900/40 p-1 rounded border border-zinc-850 flex flex-col items-center justify-center">
                <span className="text-base">🎣</span>
                <span className="text-[7px] text-zinc-500 font-normal uppercase text-center truncate w-full">Fish</span>
                <span className="text-zinc-200 mt-0.5">{character?.materials?.nebula_fish ?? 0}</span>
              </div>
              <div className="bg-zinc-900/40 p-1 rounded border border-zinc-850 flex flex-col items-center justify-center">
                <span className="text-base">🪙</span>
                <span className="text-[7px] text-zinc-500 font-normal uppercase text-center truncate w-full">Gold</span>
                <span className="text-amber-400 mt-0.5">{character?.gold ?? 0}</span>
              </div>
            </div>
          </div>

          {/* Active Skill Progress Bar */}
          {activeTask !== 'none' && activeTask !== 'auto_crawl' && (
            <div className="bg-indigo-950/20 border border-indigo-500/20 p-2.5 rounded-xl shrink-0 space-y-1">
              <div className="flex justify-between items-center text-[8px] font-bold">
                <span className="text-indigo-400 uppercase tracking-widest animate-pulse flex items-center gap-1">
                  <RefreshCw className="w-2.5 h-2.5 animate-spin" /> ACTIVE TASK: {activeTask.toUpperCase()}...
                </span>
                <span className="text-zinc-400">{taskProgress}%</span>
              </div>
              <div className="w-full bg-zinc-950 h-1.5 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-600" style={{ width: `${taskProgress}%` }} />
              </div>
            </div>
          )}

          {/* List of Gathering/Crafting Activities */}
          <div className="flex-1 overflow-y-auto max-h-56 pr-1 space-y-2">
            {activities.map(act => {
              const isActive = activeTask === act.id;
              const skillVal = character?.skills[act.skillKey];
              const level = skillVal?.level ?? 1;
              const xp = skillVal?.xp ?? 0;
              const xpNeeded = skillVal?.xpNeeded ?? 50;

              return (
                <div
                  key={act.id}
                  className={`bg-zinc-900/40 border p-2 rounded-xl flex items-center justify-between gap-3 transition ${
                    isActive ? 'border-indigo-500/40 bg-zinc-900/80 shadow-md' : 'border-zinc-900'
                  }`}
                >
                  <div className="flex-1 space-y-0.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-zinc-200">{act.name}</span>
                      <span className="text-[8px] text-zinc-400">
                        Lv {level} <span className="text-zinc-600">({Math.round((xp/xpNeeded)*100)}%)</span>
                      </span>
                    </div>
                    <p className="text-[8px] text-zinc-500 leading-snug">{act.desc}</p>
                    <div className="flex items-center gap-1.5 text-[7px] font-bold">
                      <span className="text-zinc-600">Requirements:</span>
                      {act.isCraft ? (
                        <span className={act.hasIngredients ? 'text-emerald-400' : 'text-red-400'}>
                          {act.req}
                        </span>
                      ) : (
                        <span className="text-zinc-400">{act.req}</span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (isActive) {
                        setActiveTask('none');
                      } else {
                        setActiveTask(act.id);
                      }
                    }}
                    className={`px-3 py-1.5 rounded text-[8px] font-bold tracking-widest uppercase transition cursor-pointer ${
                      isActive
                        ? 'bg-amber-600 text-white hover:bg-amber-500'
                        : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow shadow-indigo-950/40'
                    }`}
                  >
                    {isActive ? 'Stop' : 'Start'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Scrolling Logger Terminal Console */}
      <h3 className="text-[10px] font-bold text-zinc-500 tracking-wider mb-1.5 uppercase shrink-0 mt-3">Adventure Crawl Log</h3>
      <div
        id="terminal-log-box"
        ref={terminalRef}
        className="flex-1 bg-zinc-950 border border-zinc-900 p-3 rounded-xl font-mono text-[9px] overflow-y-auto space-y-1.5 scrollbar-thin max-h-[140px] min-h-[100px]"
      >
        {logs.map((log) => {
          let logColor = 'text-zinc-400';
          if (log.type === 'combat') logColor = 'text-red-400 font-bold';
          else if (log.type === 'loot') logColor = 'text-cyan-400 font-bold';
          else if (log.type === 'event') logColor = 'text-amber-400';
          else if (log.type === 'level') logColor = 'text-emerald-400 font-bold animate-pulse';
          else if (log.type === 'death') logColor = 'text-red-500 font-black tracking-widest uppercase border-y border-red-500/20 py-1 my-1 block';

          return (
            <div key={log.id} className="flex gap-2">
              <span className="text-zinc-600 select-none shrink-0">[{log.turn}]</span>
              <p className={`${logColor} leading-relaxed`}>{log.text}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
