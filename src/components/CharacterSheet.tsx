/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ActiveCharacter, Item, SkillName, Skills, SkillState } from '../types';
import { Shield, Sword, Heart, Trophy, User, Zap, Star, Sparkles, RefreshCw } from 'lucide-react';
import { RARITY_THEMES } from '../data/items';

interface CharacterSheetProps {
  character: ActiveCharacter;
  onUnequipItem: (slot: 'helmet' | 'chestplate' | 'boots' | 'weapon' | 'offhand' | 'ring') => void;
  onUsePotion: (item: Item) => void;
  onGenerateSprite: (itemId: string, name: string, description: string) => Promise<{ success: boolean; imageUrl?: string; error?: string }>;
}

export default function CharacterSheet({
  character,
  onUnequipItem,
  onUsePotion,
  onGenerateSprite
}: CharacterSheetProps) {
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);

  // Derive final character stats from base stats + equipped items
  const baseStats = {
    strength: 5 + Math.floor(character.skills.melee.level * 1.5),
    intellect: 5 + Math.floor(character.skills.arcane.level * 1.5),
    agility: 5 + Math.floor(character.skills.stealth.level * 1.5),
    defense: Math.floor(character.skills.defense.level * 2.0),
    critChance: 5 + Math.floor(character.skills.melee.level * 0.5),
    luck: 5 + Math.floor(character.skills.scavenging.level * 1.0)
  };

  const equipStats = {
    strength: 0,
    intellect: 0,
    agility: 0,
    defense: 0,
    critChance: 0,
    luck: 0,
    maxHp: 0
  };

  // Sum equipment stats
  const slots: Array<keyof typeof character.equipment> = ['helmet', 'chestplate', 'boots', 'weapon', 'offhand', 'ring'];
  slots.forEach(slot => {
    const item = character.equipment[slot];
    if (item && item.stats) {
      if (item.stats.strength) equipStats.strength += item.stats.strength;
      if (item.stats.intellect) equipStats.intellect += item.stats.intellect;
      if (item.stats.agility) equipStats.agility += item.stats.agility;
      if (item.stats.defense) equipStats.defense += item.stats.defense;
      if (item.stats.critChance) equipStats.critChance += item.stats.critChance;
      if (item.stats.luck) equipStats.luck += item.stats.luck;
      if (item.stats.maxHp) equipStats.maxHp += item.stats.maxHp;
    }
  });

  const finalStats = {
    strength: baseStats.strength + equipStats.strength,
    intellect: baseStats.intellect + equipStats.intellect,
    agility: baseStats.agility + equipStats.agility,
    defense: baseStats.defense + equipStats.defense,
    critChance: baseStats.critChance + equipStats.critChance,
    luck: baseStats.luck + equipStats.luck,
    maxHp: character.maxHp + equipStats.maxHp
  };

  // Helper to render skill item
  const renderSkill = (name: string, label: string, skill: SkillState, color: string, description: string) => {
    const progressPercent = Math.min(100, Math.round((skill.xp / skill.xpNeeded) * 100));
    return (
      <div className="bg-zinc-900/50 border border-zinc-850 p-2.5 rounded-xl space-y-1 relative group hover:border-zinc-750 transition duration-200">
        <div className="flex justify-between items-center">
          <span className="text-[11px] font-mono font-bold text-zinc-300">{label}</span>
          <span className="text-xs font-mono font-bold text-amber-400">Lv {skill.level}</span>
        </div>
        
        {/* Progress bar */}
        <div className="w-full bg-zinc-950 h-2 rounded overflow-hidden border border-zinc-850">
          <div
            className={`h-full ${color} transition-all duration-300`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="flex justify-between text-[8px] font-mono text-zinc-500">
          <span>XP: {skill.xp}/{skill.xpNeeded}</span>
          <span>{progressPercent}%</span>
        </div>

        {/* Skill Tooltip */}
        <div className="absolute z-10 hidden group-hover:block bottom-12 left-0 right-0 bg-zinc-950 border border-zinc-800 text-[10px] font-mono text-zinc-300 p-2.5 rounded-lg shadow-xl leading-relaxed">
          <p className="font-bold text-white mb-0.5 uppercase tracking-wider">{label} MASTERY</p>
          <p>{description}</p>
        </div>
      </div>
    );
  };

  // Render equipment slot
  const renderSlot = (slotKey: 'helmet' | 'chestplate' | 'boots' | 'weapon' | 'offhand' | 'ring', placeholderIcon: string) => {
    const item = character.equipment[slotKey];
    const isSelected = selectedSlot === slotKey;

    if (!item) {
      return (
        <div className="relative group">
          <div className="w-12 h-12 rounded-lg bg-zinc-900 border-2 border-dashed border-zinc-800 flex items-center justify-center text-xl text-zinc-600 transition hover:border-zinc-700 select-none">
            {placeholderIcon}
          </div>
          <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[8px] font-mono text-zinc-500 tracking-wider uppercase">{slotKey}</span>
        </div>
      );
    }

    const theme = RARITY_THEMES[item.rarity];

    return (
      <div className="relative">
        <button
          id={`equip-slot-${slotKey}`}
          onClick={() => {
            setSelectedSlot(isSelected ? null : slotKey);
            setGenerationError(null);
          }}
          className={`w-12 h-12 rounded-lg ${theme.bg} border-2 ${theme.border} ${theme.glow} flex items-center justify-center overflow-hidden text-xl transition hover:scale-105 active:scale-95 cursor-pointer relative select-none`}
        >
          {item.imageUrl ? (
            <img
              src={item.imageUrl}
              alt={item.name}
              className="w-full h-full object-cover pixelated"
              referrerPolicy="no-referrer"
            />
          ) : (
            item.icon
          )}
          {/* Subtle item rarity indicator */}
          <div className="absolute right-0.5 bottom-0.5 w-1.5 h-1.5 rounded-full bg-current" style={{ color: theme.text.replace('text-', '') }} />
        </button>
        <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[8px] font-mono text-zinc-300 tracking-wider uppercase truncate max-w-full">{slotKey}</span>

        {/* Action tooltip for equipped item */}
        {isSelected && (
          <div className="absolute z-25 top-14 left-1/2 -translate-x-1/2 bg-zinc-950 border border-zinc-850 p-3 rounded-lg shadow-2xl w-44 font-mono text-[10px]">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-1 mb-1.5">
              <span className={`font-bold ${theme.text}`}>{item.name}</span>
              <span className="text-[8px] text-zinc-500">[{theme.label}]</span>
            </div>
            <p className="text-zinc-400 italic mb-1.5 leading-snug">&quot;{item.description}&quot;</p>
            <div className="space-y-0.5 text-zinc-300 mb-2">
              {Object.entries(item.stats).map(([stat, val]) => (
                <div key={stat} className="flex justify-between">
                  <span className="text-zinc-500 capitalize">{stat.replace('Bonus', ' bonus').replace('maxHp', 'health')}</span>
                  <span className="text-emerald-400 font-bold">+{val}</span>
                </div>
              ))}
              <div className="flex justify-between text-amber-500 font-bold border-t border-zinc-900 mt-1 pt-1">
                <span>Value</span>
                <span>{item.goldValue} Gold</span>
              </div>
            </div>

            {/* Forge AI Sprite Action */}
            {!item.imageUrl && (
              <div className="mb-2 bg-zinc-900/60 p-1.5 rounded border border-zinc-800 space-y-1">
                <button
                  onClick={async () => {
                    if (isGenerating) return;
                    setIsGenerating(true);
                    setGenerationError(null);
                    const res = await onGenerateSprite(item.id, item.name, item.description);
                    setIsGenerating(false);
                    if (!res.success) {
                      setGenerationError(res.error || "Low energy. Try again!");
                    }
                  }}
                  disabled={isGenerating}
                  className={`w-full py-1 px-1.5 rounded text-[8px] font-bold flex items-center justify-center gap-1 transition ${
                    isGenerating
                      ? 'bg-zinc-850 text-zinc-600'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer'
                  }`}
                >
                  <RefreshCw className={`w-2.5 h-2.5 ${isGenerating ? 'animate-spin' : ''}`} />
                  {isGenerating ? "FORGING ART..." : "FORGE AI SPRITE"}
                </button>
                {generationError && (
                  <p className="text-[7px] text-red-400 leading-tight font-bold text-center">
                    {generationError}
                  </p>
                )}
              </div>
            )}

            <button
              id={`unequip-btn-${slotKey}`}
              onClick={() => {
                onUnequipItem(slotKey);
                setSelectedSlot(null);
              }}
              className="w-full bg-red-600/30 hover:bg-red-600 text-red-300 hover:text-white font-bold py-1 px-2 rounded border border-red-500/20 text-[9px] transition"
            >
              UNEQUIP ITEM
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div id="character-pane" className="retro-glass-panel-heavy rounded-2xl p-5 shadow-2xl h-full flex flex-col font-mono select-none">
      {/* Header Info */}
      <div className="flex items-center justify-between border-b border-zinc-850 pb-3 mb-4 shrink-0">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-1.5">
            <User className="w-4 h-4 text-red-500" />
            {character.name}
          </h2>
          <p className="text-[10px] text-zinc-500 uppercase tracking-wider flex items-center gap-1">
            <Star className="w-3 h-3 text-amber-500 animate-spin" />
            Area: <span className="text-red-400 font-bold">{character.currentArea}</span>
          </p>
        </div>
        <div className="text-right">
          <span className="text-xs bg-red-500/10 border border-red-500/20 text-red-400 font-bold py-1 px-2.5 rounded-full">
            Level {character.level}
          </span>
        </div>
      </div>

      {/* HP & XP Bars */}
      <div className="space-y-2.5 mb-4 shrink-0">
        <div className="space-y-1">
          <div className="flex justify-between items-center text-xs">
            <span className="text-red-400 font-bold flex items-center gap-1">
              <Heart className="w-3.5 h-3.5 fill-red-500/10" />
              HEALTH POINTS
            </span>
            <span className="font-bold text-red-300">
              {character.hp} / {finalStats.maxHp}
            </span>
          </div>
          <div className="w-full bg-zinc-900 h-3 rounded-full border border-zinc-800 overflow-hidden relative">
            <div
              className="h-full bg-gradient-to-r from-red-600 to-rose-500 transition-all duration-300"
              style={{ width: `${Math.max(0, Math.min(100, (character.hp / finalStats.maxHp) * 100))}%` }}
            />
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between items-center text-[10px] tracking-wider text-zinc-400">
            <span className="font-bold flex items-center gap-1">
              <Star className="w-3.5 h-3.5" />
              EXPERIENCE
            </span>
            <span className="font-bold">
              {character.xp} / {character.xpNeeded}
            </span>
          </div>
          <div className="w-full bg-zinc-900 h-2 rounded-full border border-zinc-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-300"
              style={{ width: `${Math.min(100, (character.xp / character.xpNeeded) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Layered Custom Avatar Visualizer + Character Equipment Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4 items-center bg-zinc-900/20 p-3 border border-zinc-900 rounded-2xl shrink-0">
        {/* Layered Sprite Box */}
        <div className="col-span-1 md:col-span-4 flex justify-center">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-b from-zinc-950 to-zinc-900 border border-zinc-800 flex items-center justify-center relative shadow-inner overflow-hidden">
            {/* Visual background glow reflecting highest gear rarity */}
            <div className="absolute inset-0 bg-red-500/5 filter blur-md pointer-events-none" />

            {/* Character Base Head & Body Layers */}
            <div className="relative w-16 h-16 flex flex-col items-center justify-center">
              {/* Helmet Slot Overlay */}
              {character.equipment.helmet ? (
                <span className="text-3xl absolute -top-1.5 z-10 animate-bounce">{character.equipment.helmet.icon}</span>
              ) : (
                <span className="text-sm absolute -top-1 z-10 text-zinc-700 opacity-60">🧑‍🦲</span>
              )}

              {/* Head emoji base */}
              <span className="text-2xl z-0 mt-0.5">🧑</span>

              {/* Chestplate Armor Slot Overlay */}
              {character.equipment.chestplate ? (
                <span className="text-3xl absolute top-3.5 z-5">{character.equipment.chestplate.icon}</span>
              ) : (
                <span className="text-xl absolute top-4 z-5 text-zinc-700 opacity-50">👕</span>
              )}

              {/* Weapon Left Hand Overlay */}
              {character.equipment.weapon ? (
                <span className="text-2xl absolute -left-2 top-4 z-10 transform -rotate-12 hover:rotate-12 transition">{character.equipment.weapon.icon}</span>
              ) : (
                <span className="text-[10px] absolute -left-1 top-4 text-zinc-800 opacity-30 select-none">👊</span>
              )}

              {/* Offhand Shield Right Hand Overlay */}
              {character.equipment.offhand ? (
                <span className="text-2xl absolute -right-2 top-4 z-10 transform rotate-12 hover:-rotate-12 transition">{character.equipment.offhand.icon}</span>
              ) : (
                <span className="text-[10px] absolute -right-1 top-4 text-zinc-800 opacity-30 select-none">🛡️</span>
              )}

              {/* Boots Footwear Overlay */}
              {character.equipment.boots ? (
                <span className="text-xl absolute -bottom-1 z-10 flex gap-0.5">
                  <span>{character.equipment.boots.icon}</span>
                </span>
              ) : (
                <span className="text-xs absolute -bottom-0.5 z-0 text-zinc-700 opacity-30">👣</span>
              )}
            </div>
          </div>
        </div>

        {/* Equipments Slots Grid */}
        <div className="col-span-1 md:col-span-8 flex flex-wrap gap-4 justify-center py-2">
          {renderSlot('helmet', '🪖')}
          {renderSlot('chestplate', '👕')}
          {renderSlot('boots', '🥾')}
          {renderSlot('weapon', '⚔️')}
          {renderSlot('offhand', '🛡️')}
          {renderSlot('ring', '💍')}
        </div>
      </div>

      {/* Derived Core Attributes (Strength, defense, etc) */}
      <div className="grid grid-cols-2 gap-2 mb-4 text-[10px] bg-zinc-900/30 p-3 rounded-xl border border-zinc-850 shrink-0">
        <div className="flex justify-between items-center text-zinc-400">
          <span className="flex items-center gap-1">⚔️ STRENGTH</span>
          <span className="font-bold text-zinc-100">{finalStats.strength}</span>
        </div>
        <div className="flex justify-between items-center text-zinc-400">
          <span className="flex items-center gap-1">🛡️ DEFENSE</span>
          <span className="font-bold text-zinc-100">{finalStats.defense}</span>
        </div>
        <div className="flex justify-between items-center text-zinc-400">
          <span className="flex items-center gap-1">🪄 INTELLECT</span>
          <span className="font-bold text-zinc-100">{finalStats.intellect}</span>
        </div>
        <div className="flex justify-between items-center text-zinc-400">
          <span className="flex items-center gap-1">⚡ AGILITY</span>
          <span className="font-bold text-zinc-100">{finalStats.agility}</span>
        </div>
        <div className="flex justify-between items-center text-zinc-400">
          <span className="flex items-center gap-1">🔥 CRIT %</span>
          <span className="font-bold text-zinc-100">{finalStats.critChance}%</span>
        </div>
        <div className="flex justify-between items-center text-zinc-400">
          <span className="flex items-center gap-1">🍀 LUCK</span>
          <span className="font-bold text-zinc-100">{finalStats.luck}</span>
        </div>
      </div>

      {/* Deep Skill Progress Grid */}
      <h3 className="text-xs font-bold text-zinc-400 tracking-wider mb-2 uppercase shrink-0">Skill Mastery</h3>
      <div className="flex-1 overflow-y-auto pr-1 space-y-2">
        {renderSkill('melee', '⚔️ MELEE', character.skills.melee, 'bg-red-500', 'Powers up physical melee base strike damage and critical strike multipliers.')}
        {renderSkill('defense', '🛡️ DEFENSE', character.skills.defense, 'bg-zinc-400', 'Significantly blocks incoming enemy physical hits and lowers combat wounds.')}
        {renderSkill('arcane', '🪄 ARCANE', character.skills.arcane, 'bg-purple-500', 'Powers up spell strikes, mana flow efficiency, and arcane event resolution.')}
        {renderSkill('scavenging', '🎒 SCAVENGING', character.skills.scavenging, 'bg-emerald-500', 'Increases general item drops and enhances the rolling odds of Epic & Legendary loot.')}
        {renderSkill('athletics', '🥾 ATHLETICS', character.skills.athletics, 'bg-blue-500', 'Boosts natural Maximum HP ceiling and speed recovery during turn pacing.')}
        {renderSkill('stealth', '🥷 STEALTH', character.skills.stealth, 'bg-indigo-500', 'Enables picking chests safely, hiding from ambush crawls, and pickpocketing NPCs.')}
        {renderSkill('charisma', '🗣️ CHARISMA', character.skills.charisma, 'bg-yellow-500', 'Provides merchant price discounts, higher gold rewards, and diplomatic event bypasses.')}
        {renderSkill('faith', '✨ FAITH', character.skills.faith, 'bg-cyan-400', 'Allows holy altar blessings and grants a literal divine resurrection once per crawl!')}
      </div>
    </div>
  );
}
