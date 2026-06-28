/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ActiveCharacter, LegacyState, GameLog, Enemy, RandomEvent, GameState, Item, SkillName, Rarity } from './types';
import { generateProceduralItem, generatePotion, RARITIES } from './data/items';
import { generateEnemyForLevel } from './data/enemies';
import { generateRandomEvent } from './data/events';
import { saveToCloud, loadFromCloud } from './firebase';
import CharacterSheet from './components/CharacterSheet';
import AdventurePanel from './components/AdventurePanel';
import InventoryGrid from './components/InventoryGrid';
import CloudSavePanel from './components/CloudSavePanel';
import { Sparkles, Cloud, Check, Skull, Flame, Trophy, Play } from 'lucide-react';

const INITIAL_LEGACY: LegacyState = {
  legacyLevel: 1,
  legacyPoints: 0,
  unlockedUpgrades: {},
  highScores: {
    maxTurns: 0,
    maxLevel: 1,
    maxGold: 0,
    deadHeroes: []
  }
};

const INITIAL_LOGS = (): GameLog[] => [
  {
    id: 'log_init',
    turn: 0,
    text: 'Welcome to the Echoing Abyss, brave adventurer. Stepping into the dark will mold your skills, test your bravery, and reward your resilience. Prepare for permadeath!',
    type: 'general',
    timestamp: new Date().toISOString()
  }
];

export default function App() {
  const [character, setCharacter] = useState<ActiveCharacter | null>(null);
  const [legacy, setLegacy] = useState<LegacyState>(INITIAL_LEGACY);
  const [logs, setLogs] = useState<GameLog[]>(INITIAL_LOGS());
  const [activeEncounter, setActiveEncounter] = useState<{
    type: 'battle' | 'event' | null;
    enemy: Enemy | null;
    event: RandomEvent | null;
    enemyCurrentHp?: number;
  }>({
    type: null,
    enemy: null,
    event: null
  });

  const [cloudStatus, setCloudStatus] = useState<string | null>(null);
  const [saveMetadata, setSaveMetadata] = useState({
    isSaving: false,
    lastSaved: null as string | null,
    cloudSaveId: localStorage.getItem('pixel_crawler_cloud_id'),
    cloudUsername: null as string | null
  });

  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [activeTask, setActiveTask] = useState<string>('none');
  const [taskProgress, setTaskProgress] = useState<number>(0);
  // Manual trigger for user to generate custom retro pixel art on-demand
  const handleGenerateItemSprite = async (itemId: string, name: string, description: string): Promise<{ success: boolean; imageUrl?: string; error?: string }> => {
    try {
      const response = await fetch("/api/generate-sprite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description: description || "A piece of legendary RPG gear",
          isEnemy: false
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.imageUrl) {
          setCharacter(prev => {
            if (!prev) return null;

            // Update inventory items
            const updatedInventory = prev.inventory.map(i =>
              i.id === itemId ? { ...i, imageUrl: data.imageUrl } : i
            );

            // Update equipped items
            const updatedEquipment = { ...prev.equipment };
            const gearList: Array<keyof typeof prev.equipment> = ['helmet', 'chestplate', 'boots', 'weapon', 'offhand', 'ring'];
            gearList.forEach(slot => {
              const eqItem = updatedEquipment[slot];
              if (eqItem && eqItem.id === itemId) {
                updatedEquipment[slot] = { ...eqItem, imageUrl: data.imageUrl };
              }
            });

            const nextChar = {
              ...prev,
              inventory: updatedInventory,
              equipment: updatedEquipment
            };

            // Keep localstorage updated
            localStorage.setItem('pixel_crawler_character', JSON.stringify(nextChar));
            return nextChar;
          });
          return { success: true, imageUrl: data.imageUrl };
        }
      } else {
        const errData = await response.json().catch(() => ({}));
        return { success: false, error: errData.error || "Generation limit reached" };
      }
    } catch (err: any) {
      console.error(`Failed to generate sprite for item ${name}`, err);
      return { success: false, error: err.message || "Network error" };
    }
    return { success: false, error: "No image payload returned" };
  };

  // Asynchronously generate sprite image for an AI-generated enemy (Rare+)
  const fetchSpriteForEnemy = async (name: string, description: string) => {
    try {
      const response = await fetch("/api/generate-sprite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description, isEnemy: true })
      });
      if (response.ok) {
        const data = await response.json();
        if (data.imageUrl) {
          setActiveEncounter(prev => {
            if (prev.type === 'battle' && prev.enemy && (prev.enemy.name === name || prev.enemy.name.startsWith(name))) {
              return {
                ...prev,
                enemy: { ...prev.enemy, imageUrl: data.imageUrl }
              };
            }
            return prev;
          });
        }
      }
    } catch (err) {
      console.error("Failed to generate sprite for enemy", err);
    }
  };

  // 1. Initial Load from Local Storage on mount
  useEffect(() => {
    // Generate cloud save credentials automatically if they do not exist
    let savedId = localStorage.getItem('pixel_crawler_cloud_id');
    let savedCode = localStorage.getItem('pixel_crawler_passcode');
    let wasCloudGenerated = false;

    if (!savedId || !savedCode) {
      const randomSuffix = Math.floor(10000 + Math.random() * 90000); // 5-digit number
      savedId = `crawler_${randomSuffix}`;
      savedCode = Math.floor(1000 + Math.random() * 9000).toString(); // 4-digit passcode
      localStorage.setItem('pixel_crawler_cloud_id', savedId);
      localStorage.setItem('pixel_crawler_passcode', savedCode);
      wasCloudGenerated = true;
      setSaveMetadata(prev => ({
        ...prev,
        cloudSaveId: savedId
      }));
    }

    const localChar = localStorage.getItem('pixel_crawler_character');
    const localLegacy = localStorage.getItem('pixel_crawler_legacy');
    const localLogs = localStorage.getItem('pixel_crawler_logs');

    let parsedChar: ActiveCharacter | null = null;
    let parsedLegacy = INITIAL_LEGACY;

    if (localLegacy) {
      try {
        parsedLegacy = JSON.parse(localLegacy);
        setLegacy(parsedLegacy);
      } catch (e) {
        console.error('Failed to parse local legacy state', e);
      }
    }

    if (localChar) {
      try {
        const charData = JSON.parse(localChar);
        if (charData && charData.alive) {
          // Initialize safe defaults for Milky Way Idle skills if they don't exist
          if (!charData.skills) charData.skills = {} as any;
          if (!charData.skills.milking) charData.skills.milking = { level: 1, xp: 0, xpNeeded: 50 };
          if (!charData.skills.foraging) charData.skills.foraging = { level: 1, xp: 0, xpNeeded: 50 };
          if (!charData.skills.woodcutting) charData.skills.woodcutting = { level: 1, xp: 0, xpNeeded: 50 };
          if (!charData.skills.mining) charData.skills.mining = { level: 1, xp: 0, xpNeeded: 50 };
          if (!charData.skills.fishing) charData.skills.fishing = { level: 1, xp: 0, xpNeeded: 50 };
          if (!charData.skills.cooking) charData.skills.cooking = { level: 1, xp: 0, xpNeeded: 50 };
          if (!charData.skills.crafting) charData.skills.crafting = { level: 1, xp: 0, xpNeeded: 50 };
          
          if (!charData.materials) {
            charData.materials = { cow_milk: 0, wild_herbs: 0, runic_wood: 0, iron_ore: 0, meteor_ore: 0, nebula_fish: 0 };
          } else {
            if (charData.materials.meteor_ore === undefined) charData.materials.meteor_ore = 0;
            if (charData.materials.nebula_fish === undefined) charData.materials.nebula_fish = 0;
          }
          parsedChar = charData;
          setCharacter(charData);
        }
      } catch (e) {
        console.error('Failed to parse local character state', e);
      }
    }

    if (localLogs) {
      try {
        setLogs(JSON.parse(localLogs));
      } catch (e) {
        console.error('Failed to parse local logs', e);
      }
    }

    // If we just generated credentials, silently upload current state (if any) to back it up
    if (wasCloudGenerated) {
      saveToCloud(savedId, savedCode, parsedChar, parsedLegacy).catch(e => {
        console.warn('Initial cloud auto-save failed', e);
      });
    }
  }, []);

  // 2. Auto-save to LocalStorage whenever State changes
  useEffect(() => {
    if (character) {
      localStorage.setItem('pixel_crawler_character', JSON.stringify(character));
    } else {
      localStorage.removeItem('pixel_crawler_character');
    }
    localStorage.setItem('pixel_crawler_legacy', JSON.stringify(legacy));
    localStorage.setItem('pixel_crawler_logs', JSON.stringify(logs));
  }, [character, legacy, logs]);

  // Helper: Create a scrolling logger entry
  const addLog = (text: string, type: GameLog['type'] = 'general') => {
    const turn = character ? character.turnCount : 0;
    const newLog: GameLog = {
      id: 'log_' + Math.random().toString(36).substring(2, 9),
      turn,
      text,
      type,
      timestamp: new Date().toISOString()
    };
    setLogs(prev => [...prev, newLog]);
  };

  // Helper: Trigger silent cloud backup whenever crucial milestones are reached
  const triggerSilentCloudBackup = async (updatedChar: ActiveCharacter | null, updatedLegacy: LegacyState) => {
    const savedId = localStorage.getItem('pixel_crawler_cloud_id');
    const savedCode = localStorage.getItem('pixel_crawler_passcode');
    if (savedId && savedCode) {
      try {
        setSaveMetadata(prev => ({ ...prev, isSaving: true }));
        await saveToCloud(savedId, savedCode, updatedChar, updatedLegacy);
        setSaveMetadata(prev => ({
          ...prev,
          isSaving: false,
          lastSaved: new Date().toLocaleTimeString()
        }));
      } catch (e) {
        console.warn('Silent cloud auto-save failed', e);
        setSaveMetadata(prev => ({ ...prev, isSaving: false }));
      }
    }
  };

  // Helper to safely calculate stats + equipment boosts
  const getPlayerStats = (char: ActiveCharacter) => {
    const stats = {
      strength: 5 + Math.floor(char.skills.melee.level * 1.5),
      intellect: 5 + Math.floor(char.skills.arcane.level * 1.5),
      agility: 5 + Math.floor(char.skills.stealth.level * 1.5),
      defense: Math.floor(char.skills.defense.level * 2.0),
      critChance: 5 + Math.floor(char.skills.melee.level * 0.5),
      luck: 5 + Math.floor(char.skills.scavenging.level * 1.0),
      maxHp: char.maxHp
    };

    // Apply equipment
    const gearList: Array<keyof typeof char.equipment> = ['helmet', 'chestplate', 'boots', 'weapon', 'offhand', 'ring'];
    gearList.forEach(slot => {
      const item = char.equipment[slot];
      if (item && item.stats) {
        if (item.stats.strength) stats.strength += item.stats.strength;
        if (item.stats.intellect) stats.intellect += item.stats.intellect;
        if (item.stats.agility) stats.agility += item.stats.agility;
        if (item.stats.defense) stats.defense += item.stats.defense;
        if (item.stats.critChance) stats.critChance += item.stats.critChance;
        if (item.stats.luck) stats.luck += item.stats.luck;
        if (item.stats.maxHp) stats.maxHp += item.stats.maxHp;
      }
    });

    return stats;
  };

  // Helper to award skill experience
  const gainSkillXp = (char: ActiveCharacter, skillName: SkillName, amount: number, logBuffer: string[]) => {
    const skill = char.skills[skillName];
    let newXp = skill.xp + amount;
    let newLevel = skill.level;
    let newXpNeeded = skill.xpNeeded;
    let leveledUp = false;

    while (newXp >= newXpNeeded) {
      newXp -= newXpNeeded;
      newLevel += 1;
      newXpNeeded = Math.round(newXpNeeded * 1.5);
      leveledUp = true;
    }

    if (leveledUp) {
      logBuffer.push(`✨ SKILL UP: Your ${skillName.toUpperCase()} mastery reached Level ${newLevel}!`);
    }

    return {
      ...char,
      skills: {
        ...char.skills,
        [skillName]: {
          level: newLevel,
          xp: newXp,
          xpNeeded: newXpNeeded
        }
      }
    };
  };

  // Milky Way Idle style automatic task runner
  const handleCompleteTask = (task: string) => {
    setCharacter(prevChar => {
      if (!prevChar || !prevChar.alive) {
        setActiveTask('none');
        return prevChar;
      }

      const logBuffer: string[] = [];
      let updatedChar = { ...prevChar };

      if (task === 'milking') {
        const currentMilk = updatedChar.materials?.cow_milk ?? 0;
        const updatedMaterials = {
          ...(updatedChar.materials || { cow_milk: 0, wild_herbs: 0, runic_wood: 0, iron_ore: 0, meteor_ore: 0, nebula_fish: 0 }),
          cow_milk: currentMilk + 1
        };
        updatedChar = { ...updatedChar, materials: updatedMaterials };
        updatedChar = gainSkillXp(updatedChar, 'milking', 15, logBuffer);
        logBuffer.push(`🥛 GATHER: You milked a planetary star-cow and received 1x [Cow Milk]!`);
      } else if (task === 'foraging') {
        const currentHerbs = updatedChar.materials?.wild_herbs ?? 0;
        const updatedMaterials = {
          ...(updatedChar.materials || { cow_milk: 0, wild_herbs: 0, runic_wood: 0, iron_ore: 0, meteor_ore: 0, nebula_fish: 0 }),
          wild_herbs: currentHerbs + 1
        };
        updatedChar = { ...updatedChar, materials: updatedMaterials };
        updatedChar = gainSkillXp(updatedChar, 'foraging', 15, logBuffer);
        logBuffer.push(`🌿 GATHER: You gathered some luminous [Wild Herbs] from the celestial grove!`);
      } else if (task === 'woodcutting') {
        const currentWood = updatedChar.materials?.runic_wood ?? 0;
        const updatedMaterials = {
          ...(updatedChar.materials || { cow_milk: 0, wild_herbs: 0, runic_wood: 0, iron_ore: 0, meteor_ore: 0, nebula_fish: 0 }),
          runic_wood: currentWood + 1
        };
        updatedChar = { ...updatedChar, materials: updatedMaterials };
        updatedChar = gainSkillXp(updatedChar, 'woodcutting', 15, logBuffer);
        logBuffer.push(`🪵 GATHER: You chopped an ancient runic tree and received 1x [Runic Wood]!`);
      } else if (task === 'mining') {
        const currentOre = updatedChar.materials?.meteor_ore ?? 0;
        const updatedMaterials = {
          ...(updatedChar.materials || { cow_milk: 0, wild_herbs: 0, runic_wood: 0, iron_ore: 0, meteor_ore: 0, nebula_fish: 0 }),
          meteor_ore: currentOre + 1
        };
        updatedChar = { ...updatedChar, materials: updatedMaterials };
        updatedChar = gainSkillXp(updatedChar, 'mining', 18, logBuffer);
        logBuffer.push(`☄️ GATHER: You mined a glowing meteorite and gathered 1x [Meteor Ore]!`);
      } else if (task === 'fishing') {
        const currentFish = updatedChar.materials?.nebula_fish ?? 0;
        const updatedMaterials = {
          ...(updatedChar.materials || { cow_milk: 0, wild_herbs: 0, runic_wood: 0, iron_ore: 0, meteor_ore: 0, nebula_fish: 0 }),
          nebula_fish: currentFish + 1
        };
        updatedChar = { ...updatedChar, materials: updatedMaterials };
        updatedChar = gainSkillXp(updatedChar, 'fishing', 18, logBuffer);
        logBuffer.push(`🎣 GATHER: You reeled in a spectral star-fish and received 1x [Nebula Fish]!`);
      } else if (task === 'cooking') {
        const currentMilk = updatedChar.materials?.cow_milk ?? 0;
        const currentHerbs = updatedChar.materials?.wild_herbs ?? 0;
        if (currentMilk < 1 || currentHerbs < 1) {
          logBuffer.push(`⚠️ WARNING: Out of ingredients for Cooking! (Requires 1x Cow Milk and 1x Wild Herbs)`);
          setTimeout(() => setActiveTask('none'), 0);
        } else {
          const updatedMaterials = {
            ...(updatedChar.materials || { cow_milk: 0, wild_herbs: 0, runic_wood: 0, iron_ore: 0, meteor_ore: 0, nebula_fish: 0 }),
            cow_milk: currentMilk - 1,
            wild_herbs: currentHerbs - 1
          };
          const potionItem = generatePotion(updatedChar.level);
          if (updatedChar.inventory.length >= 24) {
            logBuffer.push(`🎒 INVENTORY FULL: Brewed a [${potionItem.name}] but your bag was completely full! It fell on the ground.`);
          } else {
            updatedChar.inventory = [...updatedChar.inventory, potionItem];
            logBuffer.push(`🥣 COOKING: Combined Space Milk and Flora to brew a high-grade [${potionItem.name}]!`);
          }
          updatedChar = { ...updatedChar, materials: updatedMaterials };
          updatedChar = gainSkillXp(updatedChar, 'cooking', 25, logBuffer);
        }
      } else if (task === 'stew_cooking') {
        const currentFish = updatedChar.materials?.nebula_fish ?? 0;
        const currentHerbs = updatedChar.materials?.wild_herbs ?? 0;
        if (currentFish < 1 || currentHerbs < 1) {
          logBuffer.push(`⚠️ WARNING: Out of ingredients for Stewing! (Requires 1x Nebula Fish and 1x Wild Herbs)`);
          setTimeout(() => setActiveTask('none'), 0);
        } else {
          const updatedMaterials = {
            ...(updatedChar.materials || { cow_milk: 0, wild_herbs: 0, runic_wood: 0, iron_ore: 0, meteor_ore: 0, nebula_fish: 0 }),
            nebula_fish: currentFish - 1,
            wild_herbs: currentHerbs - 1
          };
          
          const stewItem: Item = {
            id: 'potion_stew_' + Math.random().toString(36).substring(2, 9),
            name: 'Nebula Star Stew',
            type: 'potion',
            rarity: 'Rare',
            stats: {},
            goldValue: 50,
            icon: '🍲',
            color: 'text-cyan-400',
            bgGlow: 'bg-cyan-950/50',
            description: 'A stellar rich stew that heals 120 HP on use.',
            healingAmount: 120
          };

          if (updatedChar.inventory.length >= 24) {
            logBuffer.push(`🎒 INVENTORY FULL: Cooked a gourmet [Nebula Star Stew] but inventory was full. Sold it for 50 Gold.`);
            updatedChar.gold += 50;
          } else {
            updatedChar.inventory = [...updatedChar.inventory, stewItem];
            logBuffer.push(`🍲 STEWING: Cooked a piping hot, stats-boosting [Nebula Star Stew]!`);
          }
          updatedChar = { ...updatedChar, materials: updatedMaterials };
          updatedChar = gainSkillXp(updatedChar, 'cooking', 30, logBuffer);
        }
      } else if (task === 'crafting') {
        const currentWood = updatedChar.materials?.runic_wood ?? 0;
        const currentGold = updatedChar.gold;
        if (currentWood < 2 || currentGold < 20) {
          logBuffer.push(`⚠️ WARNING: Out of gold or resources for Crafting! (Requires 2x Runic Wood and 20 Gold)`);
          setTimeout(() => setActiveTask('none'), 0);
        } else {
          const updatedMaterials = {
            ...(updatedChar.materials || { cow_milk: 0, wild_herbs: 0, runic_wood: 0, iron_ore: 0, meteor_ore: 0, nebula_fish: 0 }),
            runic_wood: currentWood - 2
          };
          const craftingLevel = updatedChar.skills.crafting?.level ?? 1;
          const rRoll = Math.random() * 100 + (craftingLevel * 0.5);
          let selectedRarity: Rarity = 'Common';
          if (rRoll > 99) selectedRarity = 'Legendary';
          else if (rRoll > 91) selectedRarity = 'Epic';
          else if (rRoll > 76) selectedRarity = 'Rare';
          else if (rRoll > 51) selectedRarity = 'Uncommon';

          const craftedItem = generateProceduralItem(updatedChar.level, selectedRarity);
          if (updatedChar.inventory.length >= 24) {
            logBuffer.push(`🎒 INVENTORY FULL: Crafted a [${craftedItem.name}] but inventory was full. Sold it for ${craftedItem.goldValue} Gold.`);
            updatedChar.gold += craftedItem.goldValue;
          } else {
            updatedChar.inventory = [...updatedChar.inventory, craftedItem];
            logBuffer.push(`🛠️ CRAFTING: Crafted a pristine [${craftedItem.name}] (${selectedRarity})!`);
          }
          updatedChar = { ...updatedChar, gold: currentGold - 20, materials: updatedMaterials };
          updatedChar = gainSkillXp(updatedChar, 'crafting', 35, logBuffer);
        }
      } else if (task === 'ore_smelting') {
        const currentOre = updatedChar.materials?.meteor_ore ?? 0;
        const currentGold = updatedChar.gold;
        if (currentOre < 2 || currentGold < 30) {
          logBuffer.push(`⚠️ WARNING: Out of gold or resources for Smelting! (Requires 2x Meteor Ore and 30 Gold)`);
          setTimeout(() => setActiveTask('none'), 0);
        } else {
          const updatedMaterials = {
            ...(updatedChar.materials || { cow_milk: 0, wild_herbs: 0, runic_wood: 0, iron_ore: 0, meteor_ore: 0, nebula_fish: 0 }),
            meteor_ore: currentOre - 2
          };
          const craftingLevel = updatedChar.skills.crafting?.level ?? 1;
          const rRoll = Math.random() * 100 + (craftingLevel * 0.8);
          let selectedRarity: Rarity = 'Uncommon'; // Smelting has high base tier
          if (rRoll > 97) selectedRarity = 'Legendary';
          else if (rRoll > 85) selectedRarity = 'Epic';
          else if (rRoll > 60) selectedRarity = 'Rare';

          const craftedItem = generateProceduralItem(updatedChar.level, selectedRarity);
          // Force it to be a ring or offhand if we want extra themed variety
          if (Math.random() > 0.4 && craftedItem.type !== 'ring') {
            craftedItem.type = 'ring';
            craftedItem.icon = '💍';
            craftedItem.name = craftedItem.name.replace(/Sword|Helm|Cap|Plate|Tunic|Sandals|Boots|Staff|Hammer|Aegis|Book/g, 'Ring');
          }

          if (updatedChar.inventory.length >= 24) {
            logBuffer.push(`🎒 INVENTORY FULL: Forged a stellar [${craftedItem.name}] but inventory was full. Sold it for ${craftedItem.goldValue} Gold.`);
            updatedChar.gold += craftedItem.goldValue;
          } else {
            updatedChar.inventory = [...updatedChar.inventory, craftedItem];
            logBuffer.push(`🌋 METEOR FORGE: Successfully forged an ultra-rare [${craftedItem.name}] (${selectedRarity})!`);
          }
          updatedChar = { ...updatedChar, gold: currentGold - 30, materials: updatedMaterials };
          updatedChar = gainSkillXp(updatedChar, 'crafting', 40, logBuffer);
        }
      }

      // Flush log buffer
      if (logBuffer.length > 0) {
        setLogs(prev => [
          ...prev,
          ...logBuffer.map((text, idx) => ({
            id: `task_log_${Math.random()}_${idx}`,
            turn: updatedChar.turnCount,
            text,
            type: 'general' as const,
            timestamp: new Date().toISOString()
          }))
        ]);
      }

      return updatedChar;
    });

    if (task === 'auto_crawl') {
      if (activeEncounter.type === 'battle' && activeEncounter.enemy) {
        // If low HP and we have potions, let's use a potion first!
        const hasPotion = character?.inventory.some(i => i.type === 'potion');
        const lowHpRatio = (character?.hp ?? 100) / (character?.maxHp ?? 100) < 0.35;
        if (lowHpRatio && hasPotion) {
          handleUseQuickPotion();
          setLogs(prev => [
            ...prev,
            {
              id: `potion_use_${Math.random()}`,
              turn: character?.turnCount ?? 0,
              text: `🧪 AUTO COMBAT: Used a quick potion because HP is low!`,
              type: 'general',
              timestamp: new Date().toISOString()
            }
          ]);
        } else {
          const classStats = getPlayerStats(character!);
          const combatActionType = classStats.intellect > classStats.strength ? 'spell' : 'strike';
          handleCombatAction(combatActionType);
        }
      } else if (activeEncounter.type === 'event' && activeEncounter.event) {
        handleResolveEventOption(0);
      } else {
        handleTakeStep();
      }
    }
  };

  useEffect(() => {
    if (!character || !character.alive || activeTask === 'none') {
      setTaskProgress(0);
      return;
    }

    const interval = setInterval(() => {
      setTaskProgress(prev => {
        let step = 10; // default 2 seconds
        if (activeTask === 'crafting') {
          step = 5; // 4 seconds
        } else if (activeTask === 'auto_crawl') {
          if (activeEncounter.type === 'battle') {
            step = 10; // 2.0s combat tick (was 0.8s) for better readability
          } else {
            step = 5; // 4.0s dungeon step tick (was 2.0s) to slow exploration pace
          }
        }

        const nextProgress = prev + step;
        if (nextProgress >= 100) {
          setTimeout(() => handleCompleteTask(activeTask), 0);
          return 0;
        }
        return nextProgress;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [activeTask, character?.alive, activeEncounter.type]);

  // 3. Initiate a character Reset / Setup Run
  const handleResetGame = (name: string) => {
    // Check starting legacy bonuses
    const maxHpUpgrade = legacy.unlockedUpgrades['ancestral_vigor'] || 0;
    const startingHp = Math.round(100 * (1 + maxHpUpgrade * 0.1));

    const startingScavenging = legacy.unlockedUpgrades['scavenger_insight'] || 0;

    const baseSkills = {
      melee: { level: 1, xp: 0, xpNeeded: 50 },
      defense: { level: 1, xp: 0, xpNeeded: 50 },
      arcane: { level: 1, xp: 0, xpNeeded: 50 },
      scavenging: { level: 1 + startingScavenging, xp: 0, xpNeeded: startingScavenging > 0 ? Math.round(50 * Math.pow(1.5, startingScavenging)) : 50 },
      athletics: { level: 1, xp: 0, xpNeeded: 50 },
      stealth: { level: 1, xp: 0, xpNeeded: 50 },
      charisma: { level: 1, xp: 0, xpNeeded: 50 },
      faith: { level: 1, xp: 0, xpNeeded: 50 },
      milking: { level: 1, xp: 0, xpNeeded: 50 },
      foraging: { level: 1, xp: 0, xpNeeded: 50 },
      woodcutting: { level: 1, xp: 0, xpNeeded: 50 },
      mining: { level: 1, xp: 0, xpNeeded: 50 },
      fishing: { level: 1, xp: 0, xpNeeded: 50 },
      cooking: { level: 1, xp: 0, xpNeeded: 50 },
      crafting: { level: 1, xp: 0, xpNeeded: 50 }
    };

    // Starting items based on legacy upgrades
    const startingWeapon = legacy.unlockedUpgrades['scavenger_insight'] && legacy.unlockedUpgrades['scavenger_insight'] > 0
      ? generateProceduralItem(1, 'Uncommon')
      : null;

    const initialChar: ActiveCharacter = {
      name,
      level: 1,
      xp: 0,
      xpNeeded: 100,
      hp: startingHp,
      maxHp: startingHp,
      gold: 40,
      skills: baseSkills,
      materials: { cow_milk: 0, wild_herbs: 0, runic_wood: 0, iron_ore: 0, meteor_ore: 0, nebula_fish: 0 },
      equipment: {
        helmet: null,
        chestplate: null,
        boots: null,
        weapon: startingWeapon && startingWeapon.type === 'weapon' ? startingWeapon : null,
        offhand: null,
        ring: null
      },
      inventory: [generatePotion(1)], // Start with 1 health potion
      turnCount: 1,
      killedEnemiesCount: 0,
      eventsResolvedCount: 0,
      highestRarityFound: 'Common',
      currentArea: 'Forgotten Forest',
      alive: true
    };

    setCharacter(initialChar);
    setLogs([
      {
        id: 'log_recreate',
        turn: 1,
        text: `The mortal shell of "${name}" awakens. Your previous descendants have left permanent legacy bonuses. Let the crawl begin!`,
        type: 'general',
        timestamp: new Date().toISOString()
      }
    ]);
    setActiveEncounter({ type: null, enemy: null, event: null });
    
    // Auto cloud save
    triggerSilentCloudBackup(initialChar, legacy);
  };

  // 4. STEP / TURN action handler
  const handleTakeStep = async () => {
    if (!character || !character.alive) return;

    // Turn count increment
    let updatedChar = { ...character, turnCount: character.turnCount + 1 };
    const logBuffer: string[] = [];

    // Scale area names with turn count
    if (updatedChar.turnCount > 100) {
      updatedChar.currentArea = 'The Obsidian Citadel';
    } else if (updatedChar.turnCount > 50) {
      updatedChar.currentArea = 'Sunken Catacombs';
    } else if (updatedChar.turnCount > 25) {
      updatedChar.currentArea = 'Shattered Peaks';
    } else if (updatedChar.turnCount > 10) {
      updatedChar.currentArea = 'Whispering Sewers';
    }

    // Award minor Athletics XP for stepping
    updatedChar = gainSkillXp(updatedChar, 'athletics', 3, logBuffer);

    // Roll scenario odds
    const roll = Math.random() * 100;
    
    if (roll < 22) {
      // 1. CHOOSE YOUR OWN ADVENTURE EVENT TRIGGERED
      const ev = generateRandomEvent();
      setActiveEncounter({
        type: 'event',
        enemy: null,
        event: ev
      });
      logBuffer.push(`⚠️ EVENT: A mysterious event stops you in your tracks: "${ev.title}"`);
    } else if (roll < 52) {
      // 2. BATTLE ENCOUNTER TRIGGERED
      // Boss battle every 25 turns!
      const isBoss = updatedChar.turnCount % 25 === 0;
      let enemy: Enemy;
      
      const isAiRoll = Math.random() < 0.15;
      if (isAiRoll) {
        setIsAiGenerating(true);
        try {
          const res = await fetch("/api/generate-enemy", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ level: updatedChar.level, isBoss })
          });
          if (res.ok) {
            enemy = await res.json();
            logBuffer.push(`✨ AI ENEMY: The fabric of reality warps!`);
            if (['Rare', 'Epic', 'Legendary'].includes(enemy.rarity || 'Common')) {
              fetchSpriteForEnemy(enemy.name, enemy.description || "");
            }
          } else {
            enemy = generateEnemyForLevel(updatedChar.level, isBoss);
          }
        } catch (e) {
          console.error("Failed to generate AI enemy, falling back", e);
          enemy = generateEnemyForLevel(updatedChar.level, isBoss);
        } finally {
          setIsAiGenerating(false);
        }
      } else {
        enemy = generateEnemyForLevel(updatedChar.level, isBoss);
      }

      setActiveEncounter({
        type: 'battle',
        enemy,
        event: null,
        enemyCurrentHp: enemy.hp
      });
      logBuffer.push(`⚔️ COMBAT: Ambushed by a ${enemy.name}! HP: ${enemy.hp}, Threat Level: ${enemy.level}`);
    } else {
      // 3. EXPLORATION / LOOT SCAVENGE SUCCESS
      const lootRoll = Math.random() * 100;
      
      // Charisma / Luck influences scavenged gold multiplier
      const finalStats = getPlayerStats(updatedChar);
      const goldMult = 1 + (legacy.unlockedUpgrades['golden_touch'] || 0) * 0.15;
      const luckBonus = Math.min(50, finalStats.luck * 2);

      if (lootRoll < 12) {
        // Find equipment loot
        let item: Item;
        const isAiRoll = Math.random() < 0.15;
        if (isAiRoll) {
          setIsAiGenerating(true);
          try {
            const res = await fetch("/api/generate-loot", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ level: updatedChar.level })
            });
            if (res.ok) {
              item = await res.json();
              logBuffer.push(`✨ AI LOOT: An item manifests out of thin air!`);
            } else {
              item = generateProceduralItem(updatedChar.level);
            }
          } catch (e) {
            console.error("Failed to generate AI loot, falling back", e);
            item = generateProceduralItem(updatedChar.level);
          } finally {
            setIsAiGenerating(false);
          }
        } else {
          item = generateProceduralItem(updatedChar.level);
        }

        if (updatedChar.inventory.length < 24) {
          updatedChar.inventory.push(item);
          logBuffer.push(`🎒 LOOT: You sifted through old wreckage and salvaged ${item.rarity} [${item.name}]!`);
          updatedChar = gainSkillXp(updatedChar, 'scavenging', 10, logBuffer);
          
          if (RARITIES.indexOf(item.rarity) > RARITIES.indexOf(updatedChar.highestRarityFound)) {
            updatedChar.highestRarityFound = item.rarity;
          }
        } else {
          logBuffer.push(`🎒 LOOT: You spotted a glowing ${item.name} on the ground, but your inventory was completely full!`);
        }
      } else if (lootRoll < 28) {
        // Find potion
        const pot = generatePotion(updatedChar.level);
        if (updatedChar.inventory.length < 24) {
          updatedChar.inventory.push(pot);
          logBuffer.push(`🧪 LOOT: You found a hidden shelf containing a ${pot.name}. Added to storage.`);
        } else {
          logBuffer.push(`🧪 LOOT: Found a potion, but your adventure packs are full!`);
        }
      } else if (lootRoll < 60) {
        // Find Gold pile
        const baseGold = Math.round((10 + Math.random() * 15) * goldMult * (1 + updatedChar.level * 0.1));
        updatedChar.gold += baseGold;
        logBuffer.push(`🪙 GOLD: You discovered a discarded leather purse. Gained +${baseGold} gold coins!`);
        updatedChar = gainSkillXp(updatedChar, 'scavenging', 5, logBuffer);
      } else {
        // Serene recovery turn
        const heal = Math.round(updatedChar.maxHp * 0.08);
        updatedChar.hp = Math.min(getPlayerStats(updatedChar).maxHp, updatedChar.hp + heal);
        logBuffer.push(`🌿 Exploration: You rest at a campfire in the ${updatedChar.currentArea}. Restored +${heal} HP.`);
      }
    }

    // Process state updates
    setCharacter(updatedChar);
    logBuffer.forEach(txt => addLog(txt, txt.startsWith('🎒') ? 'loot' : txt.startsWith('⚔️') ? 'combat' : 'general'));
    
    // Auto-sync after turns
    triggerSilentCloudBackup(updatedChar, legacy);
  };

  // 5. COMBAT ROUND execution engine
  const handleCombatAction = async (action: 'strike' | 'spell' | 'flee') => {
    if (!character || !character.alive || activeEncounter.type !== 'battle' || !activeEncounter.enemy) return;

    const currentEnemy = activeEncounter.enemy;
    let enemyHp = activeEncounter.enemyCurrentHp ?? currentEnemy.hp;
    let char = { ...character };
    const pStats = getPlayerStats(char);
    const logBuffer: string[] = [];

    // Experience scalar based on legacy upgrades
    const expMultiplier = 1 + (legacy.unlockedUpgrades['wisdom_overflow'] || 0) * 0.1;

    // PLAYER TURN
    if (action === 'strike') {
      // Critical hit check
      const critRoll = Math.random() * 100;
      const isCrit = critRoll < pStats.critChance;
      const baseDamage = 10 + pStats.strength - Math.floor(currentEnemy.defense / 2);
      let dmg = Math.max(3, Math.round(baseDamage * (isCrit ? 1.8 : 1.0)));

      enemyHp -= dmg;
      logBuffer.push(`⚔️ You strike ${currentEnemy.name} for ${dmg} physical damage!${isCrit ? ' (CRITICAL HIT! 🔥)' : ''}`, 'combat');
      char = gainSkillXp(char, 'melee', 12, logBuffer);
      char = gainSkillXp(char, 'defense', 4, logBuffer);
    } else if (action === 'spell') {
      // Magical spell strikes ignore defense but cost focus (requires intellect check)
      const spellCritRoll = Math.random() * 100;
      const isSpellCrit = spellCritRoll < (10 + pStats.intellect * 0.5);
      const spellDmg = Math.round((12 + pStats.intellect * 1.5) * (isSpellCrit ? 2.0 : 1.0));

      enemyHp -= spellDmg;
      logBuffer.push(`🪄 You cast Fireball! Scorches ${currentEnemy.name} for ${spellDmg} arcane damage!${isSpellCrit ? ' (BURNING BLAST! ⚡)' : ''}`, 'combat');
      char = gainSkillXp(char, 'arcane', 15, logBuffer);
    } else if (action === 'flee') {
      // Fleeing success check
      const fleeChance = 35 + pStats.agility * 2 - currentEnemy.level * 2;
      const success = Math.random() * 100 < fleeChance;

      if (success) {
        addLog(`🏃 You deployed a smoke pellet and fled from ${currentEnemy.name}!`, 'general');
        setActiveEncounter({ type: null, enemy: null, event: null });
        char = gainSkillXp(char, 'stealth', 10, logBuffer);
        setCharacter(char);
        return;
      } else {
        logBuffer.push(`❌ Your escape was blocked! ${currentEnemy.name} gets a free strike!`, 'combat');
        char = gainSkillXp(char, 'athletics', 5, logBuffer);
      }
    }

    // CHECK ENEMY SURVIVAL
    if (enemyHp <= 0) {
      // ENEMY SLAYED! Combat complete!
      const finalGoldMult = 1 + (legacy.unlockedUpgrades['golden_touch'] || 0) * 0.15;
      const finalGold = Math.round(currentEnemy.goldValue * finalGoldMult);
      const finalXp = Math.round(currentEnemy.xpReward * expMultiplier);

      char.gold += finalGold;
      char.xp += finalXp;
      char.killedEnemiesCount += 1;

      logBuffer.push(`🎉 DEFEATED! You have slain ${currentEnemy.name}! Gained ${finalXp} XP and ${finalGold} Gold.`, 'level');
      
      // Roll dynamic drop chance (higher scavenging = higher odds of rare gear!)
      const scavRoll = Math.random() * 100;
      const dropChance = 35 + char.skills.scavenging.level * 3;

      if (scavRoll < dropChance) {
        // Roll rarity odds based on Scavenging level
        let rolledRarity: Rarity = 'Common';
        const rarRoll = Math.random() * 100;
        const scavLevel = char.skills.scavenging.level;

        if (rarRoll < 1 + scavLevel * 0.5) rolledRarity = 'Legendary';
        else if (rarRoll < 4 + scavLevel * 1.0) rolledRarity = 'Epic';
        else if (rarRoll < 15 + scavLevel * 1.5) rolledRarity = 'Rare';
        else if (rarRoll < 40 + scavLevel * 2.0) rolledRarity = 'Uncommon';

        let item: Item;
        const isAiRoll = Math.random() < 0.15;
        if (isAiRoll) {
          setIsAiGenerating(true);
          try {
            const res = await fetch("/api/generate-loot", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ level: char.level, forceRarity: rolledRarity })
            });
            if (res.ok) {
              item = await res.json();
              logBuffer.push(`✨ AI LOOT: You discover a rare digital anomaly!`);
            } else {
              item = generateProceduralItem(char.level, rolledRarity);
            }
          } catch (e) {
            console.error("Failed to generate AI loot, falling back", e);
            item = generateProceduralItem(char.level, rolledRarity);
          } finally {
            setIsAiGenerating(false);
          }
        } else {
          item = generateProceduralItem(char.level, rolledRarity);
        }

        if (char.inventory.length < 24) {
          char.inventory.push(item);
          logBuffer.push(`🎒 LOOT DROP: Sifting through the corpse, you found ${item.rarity} [${item.name}]!`);
          
          if (RARITIES.indexOf(item.rarity) > RARITIES.indexOf(char.highestRarityFound)) {
            char.highestRarityFound = item.rarity;
          }
        } else {
          logBuffer.push(`🎒 LOOT: The monster dropped ${item.name}, but your storage grids are completely full!`);
        }
      }

      // Check level up milestone
      if (char.xp >= char.xpNeeded) {
        char.level += 1;
        char.xp -= char.xpNeeded;
        char.xpNeeded = Math.round(char.xpNeeded * 1.6);
        
        // Increase core max HP
        char.maxHp = Math.round(char.maxHp * 1.15);
        char.hp = getPlayerStats(char).maxHp; // Full healing heal
        
        logBuffer.push(`💎💎💎 LEVEL UP! You reached Level ${char.level}! Maximum health increased and fully restored.`, 'level');
      }

      setActiveEncounter({ type: null, enemy: null, event: null });
      setCharacter(char);
      logBuffer.forEach(t => addLog(t, 'general'));
      
      // Sync cloud on wins
      triggerSilentCloudBackup(char, legacy);
      return;
    }

    // ENEMY COUNTER-STRIKE TURN
    const baseEnemyDamage = currentEnemy.damage;
    const finalWound = Math.max(2, Math.round(baseEnemyDamage - pStats.defense * 0.6));
    char.hp = Math.max(0, char.hp - finalWound);

    logBuffer.push(`💥 ${currentEnemy.name} counter-strikes dealing ${finalWound} health wounds to you.`, 'combat');

    // CHECK PLAYER DEATH / FAITH SAFETY RESURRECTION
    if (char.hp <= 0) {
      const faithLevel = char.skills.faith.level;
      // Faith check to survive fatal blow: Level 3+ grants a chance
      const faithSaveRoll = Math.random() * 100;
      const faithSaveChance = faithLevel * 12; // 12% per level (capped at 95)

      if (faithLevel >= 2 && faithSaveRoll < faithSaveChance) {
        // DIVINE INTERVENTION CHEAT DEATH
        char.hp = Math.round(pStats.maxHp * 0.35); // Revive with 35% HP
        char.skills.faith.level = Math.max(1, char.skills.faith.level - 1); // Cost of resurrection: lose 1 faith level
        logBuffer.push(`✨✨ DIVINE INTERVENTION! A blinding shield of spiritual energy blocks the death blow! Restored to 35% HP.`, 'level');
        setActiveEncounter({
          type: 'battle',
          enemy: currentEnemy,
          event: null,
          enemyCurrentHp: enemyHp
        });
      } else {
        // REAL PERMADEATH COMMENCED
        char.alive = false;
        logBuffer.push(`💀 DEFEATED: "${char.name}" was slain in the depths of ${char.currentArea} by ${currentEnemy.name}.`, 'death');
        
        // Convert achievements into permanent Legacy Points (LP)
        const earnedPoints = Math.round(char.level * 3 + Math.floor(char.turnCount / 6));
        
        const newDeadHero = {
          name: char.name,
          level: char.level,
          turns: char.turnCount,
          gold: char.gold,
          slainBy: currentEnemy.name,
          date: new Date().toISOString()
        };

        const updatedLegacy: LegacyState = {
          ...legacy,
          legacyPoints: legacy.legacyPoints + earnedPoints,
          highScores: {
            maxTurns: Math.max(legacy.highScores.maxTurns, char.turnCount),
            maxLevel: Math.max(legacy.highScores.maxLevel, char.level),
            maxGold: Math.max(legacy.highScores.maxGold, char.gold),
            deadHeroes: [newDeadHero, ...legacy.highScores.deadHeroes].slice(0, 20) // Cap cemetery list
          }
        };

        setLegacy(updatedLegacy);
        setActiveEncounter({ type: null, enemy: null, event: null });
        
        // Force sync high scores immediately to database
        triggerSilentCloudBackup(null, updatedLegacy);
      }
    } else {
      // Continue combat round
      setActiveEncounter({
        type: 'battle',
        enemy: currentEnemy,
        event: null,
        enemyCurrentHp: enemyHp
      });
    }

    setCharacter(char);
    logBuffer.forEach(t => addLog(t, 'general'));
  };

  // 6. RESOLVE CHOICE EVENT SELECTION
  const handleResolveEventOption = (optionIdx: number) => {
    if (!character || !character.alive || activeEncounter.type !== 'event' || !activeEncounter.event) return;

    const opt = activeEncounter.event.options[optionIdx];
    let char = { ...character };
    const logBuffer: string[] = [];

    const res = opt.resolve(char);
    logBuffer.push(res.logText);

    if (res.hpChange) {
      char.hp = Math.max(0, char.hp + res.hpChange);
    }
    if (res.goldChange) {
      char.gold = Math.max(0, char.gold + res.goldChange);
    }
    if (res.xpReward) {
      char.xp += res.xpReward;
      if (char.xp >= char.xpNeeded) {
        char.level += 1;
        char.xp -= char.xpNeeded;
        char.xpNeeded = Math.round(char.xpNeeded * 1.6);
        char.maxHp = Math.round(char.maxHp * 1.15);
        char.hp = getPlayerStats(char).maxHp;
        logBuffer.push(`💎💎💎 LEVEL UP! You reached Level ${char.level}! Health restored.`, 'level');
      }
    }
    if (res.itemReward) {
      const item = res.itemReward;
      if (char.inventory.length < 24) {
        char.inventory.push(item);
        if (RARITIES.indexOf(item.rarity) > RARITIES.indexOf(char.highestRarityFound)) {
          char.highestRarityFound = item.rarity;
        }
      } else {
        logBuffer.push(`🎒 LOOT SPILLED: You obtained ${item.name} but your backpack had no free slots!`);
      }
    }

    // Award skill levels / experience for choice resolved
    if (res.skillsLevelUp) {
      res.skillsLevelUp.forEach(skill => {
        char = gainSkillXp(char, skill, 25, logBuffer);
      });
    }

    char.eventsResolvedCount += 1;

    // CHECK PLAYER DEATH FROM SCENARIO PENALTIES
    if (char.hp <= 0) {
      const faithLevel = char.skills.faith.level;
      const faithSaveRoll = Math.random() * 100;
      const faithSaveChance = faithLevel * 12;

      if (faithLevel >= 2 && faithSaveRoll < faithSaveChance) {
        char.hp = Math.round(getPlayerStats(char).maxHp * 0.35);
        char.skills.faith.level = Math.max(1, char.skills.faith.level - 1);
        logBuffer.push(`✨✨ FAITH SURGE! Ancient ancestors shield your fall. Revived with 35% HP.`, 'level');
      } else {
        char.alive = false;
        logBuffer.push(`💀 SQUASHED: "${char.name}" triggered a fatal trap or event error.`, 'death');

        const earnedPoints = Math.round(char.level * 3 + Math.floor(char.turnCount / 6));
        const newDeadHero = {
          name: char.name,
          level: char.level,
          turns: char.turnCount,
          gold: char.gold,
          slainBy: activeEncounter.event.title,
          date: new Date().toISOString()
        };

        const updatedLegacy: LegacyState = {
          ...legacy,
          legacyPoints: legacy.legacyPoints + earnedPoints,
          highScores: {
            ...legacy.highScores,
            maxTurns: Math.max(legacy.highScores.maxTurns, char.turnCount),
            maxLevel: Math.max(legacy.highScores.maxLevel, char.level),
            maxGold: Math.max(legacy.highScores.maxGold, char.gold),
            deadHeroes: [newDeadHero, ...legacy.highScores.deadHeroes].slice(0, 20)
          }
        };

        setLegacy(updatedLegacy);
        setActiveEncounter({ type: null, enemy: null, event: null });
        triggerSilentCloudBackup(null, updatedLegacy);
        setCharacter(char);
        logBuffer.forEach(t => addLog(t, 'general'));
        return;
      }
    }

    setActiveEncounter({ type: null, enemy: null, event: null });
    setCharacter(char);
    logBuffer.forEach(t => addLog(t, 'general'));
    
    // Auto-save cloud
    triggerSilentCloudBackup(char, legacy);
  };

  // 7. DRINK POTION handler
  const handleUsePotion = (item: Item) => {
    if (!character || !character.alive || !item.healingAmount) return;

    let char = { ...character };
    const pStats = getPlayerStats(char);

    char.hp = Math.min(pStats.maxHp, char.hp + item.healingAmount);
    
    // Remove potion from inventory
    char.inventory = char.inventory.filter(i => i.id !== item.id);
    
    addLog(`🧪 POTION: You drank ${item.name} and healed +${item.healingAmount} HP!`, 'general');
    setCharacter(char);
    
    triggerSilentCloudBackup(char, legacy);
  };

  // Quick drink potion (grabs first potion from pack)
  const handleUseQuickPotion = () => {
    if (!character || !character.alive) return;
    const potion = character.inventory.find(i => i.type === 'potion');
    if (potion) {
      handleUsePotion(potion);
    }
  };

  // 8. EQUIP NEW GEAR
  const handleEquipItem = (item: Item) => {
    if (!character || !character.alive) return;

    const slot = item.type;
    if (slot === 'potion') return; // Potions cannot be equipped

    let char = { ...character };
    const previousEquip = char.equipment[slot];

    // Swap items in inventory
    char.inventory = char.inventory.filter(i => i.id !== item.id);
    if (previousEquip) {
      char.inventory.push(previousEquip);
    }

    char.equipment[slot] = item;
    addLog(`🛡️ EQUIPMENT: Equipped ${item.rarity} [${item.name}] onto your ${slot.toUpperCase()} slot!`, 'loot');
    
    // Recalculate max health scaling immediately on chestplate swaps
    const pStats = getPlayerStats(char);
    if (char.hp > pStats.maxHp) char.hp = pStats.maxHp;

    setCharacter(char);
    triggerSilentCloudBackup(char, legacy);
  };

  // 9. UNEQUIP GEAR
  const handleUnequipItem = (slot: 'helmet' | 'chestplate' | 'boots' | 'weapon' | 'offhand' | 'ring') => {
    if (!character || !character.alive) return;

    let char = { ...character };
    const item = char.equipment[slot];
    if (!item) return;

    if (char.inventory.length >= 24) {
      addLog(`❌ ERROR: Backpack is full! Scrap an item first to unequip.`, 'general');
      return;
    }

    char.inventory.push(item);
    char.equipment[slot] = null;
    addLog(`🎒 STORAGE: Unequipped [${item.name}] back to inventory storage.`, 'general');
    
    // Recalculate max health bounds
    const pStats = getPlayerStats(char);
    if (char.hp > pStats.maxHp) char.hp = pStats.maxHp;

    setCharacter(char);
    triggerSilentCloudBackup(char, legacy);
  };

  // 10. SELL / SCRAP ITEM for gold coins
  const handleScrapItem = (itemId: string) => {
    if (!character || !character.alive) return;

    let char = { ...character };
    const item = char.inventory.find(i => i.id === itemId);
    if (!item) return;

    char.gold += item.goldValue;
    char.inventory = char.inventory.filter(i => i.id !== itemId);
    
    addLog(`🪙 SOLD: Scrapped [${item.name}] and received +${item.goldValue} gold!`, 'general');
    setCharacter(char);
    
    triggerSilentCloudBackup(char, legacy);
  };

  // Cloud load callback
  const handleLoadSaveState = (cloudChar: ActiveCharacter | null, cloudLegacy: LegacyState, saveId: string) => {
    setCharacter(cloudChar);
    setLegacy(cloudLegacy);
    setLogs(INITIAL_LOGS());
    setSaveMetadata(prev => ({
      ...prev,
      cloudSaveId: saveId,
      lastSaved: new Date().toLocaleTimeString()
    }));
  };

  const activePotionsCount = character?.inventory.filter(i => i.type === 'potion').length || 0;

  return (
    <div className="min-h-screen retro-material-bg text-zinc-100 flex flex-col antialiased selection:bg-red-500 selection:text-white pb-6">
      
      {/* Top Navigation Frame */}
      <header className="bg-zinc-950/70 backdrop-blur-md border-b border-zinc-900 py-4 px-6 shrink-0 shadow-lg relative z-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Logo Heading */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 via-orange-500 to-amber-500 flex items-center justify-center shadow-lg shadow-red-950/40 border border-red-500/30">
              <Flame className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <h1 className="text-base font-mono font-bold tracking-wider text-white">PIXEL BITCRAWLER MMO</h1>
              <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest flex items-center gap-1">
                <span>VER 1.2.0</span>
                <span>•</span>
                <span>PERMADEATH ROGUELIKE</span>
              </p>
            </div>
          </div>

          {/* Real-time Cloud Save Status Monitor */}
          <div className="flex items-center gap-3 bg-zinc-900/60 border border-zinc-850 p-2 rounded-xl text-xs font-mono">
            <div className="flex items-center gap-1.5">
              {saveMetadata.isSaving ? (
                <div className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
              ) : (
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
              )}
              <span className="text-zinc-400">Cloud Sync:</span>
            </div>
            <span className="font-bold text-zinc-200">
              {saveMetadata.cloudSaveId ? `Code: "${saveMetadata.cloudSaveId.toUpperCase()}"` : 'Guest Mode (Local Only)'}
            </span>
            {saveMetadata.lastSaved && (
              <span className="text-[10px] text-zinc-500">
                (Last Auto-Saved: {saveMetadata.lastSaved})
              </span>
            )}
          </div>

        </div>
      </header>

      {/* Main Grid View */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-6 pt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
        
        {/* Left Column: Character Attributes & Skill Sheet (4 grid columns) */}
        <div className="col-span-1 lg:col-span-4 h-full">
          {character && character.alive ? (
            <CharacterSheet
              character={character}
              onUnequipItem={handleUnequipItem}
              onUsePotion={handleUsePotion}
              onGenerateSprite={handleGenerateItemSprite}
            />
          ) : (
            <div className="retro-glass-panel-heavy rounded-2xl p-6 shadow-2xl h-full flex flex-col items-center justify-center text-center space-y-4 font-mono select-none">
              <Trophy className="w-12 h-12 text-zinc-800 animate-bounce" style={{ animationDuration: '4s' }} />
              <h3 className="text-sm font-bold text-zinc-300">NO ACTIVE ADVENTURER</h3>
              <p className="text-[11px] text-zinc-500 max-w-xs leading-relaxed">
                Initialize a hero name inside the main dashboard to embark on the Echoing Abyss crawler!
              </p>
            </div>
          )}
        </div>

        {/* Center Column: Adventure Steps Arena (4 grid columns) */}
        <div className="col-span-1 lg:col-span-4 h-full">
          <AdventurePanel
            character={character}
            logs={logs}
            activeEncounter={activeEncounter}
            onTakeStep={handleTakeStep}
            onCombatAction={handleCombatAction}
            onResolveEventOption={handleResolveEventOption}
            onResetGame={handleResetGame}
            potionsCount={activePotionsCount}
            onUseQuickPotion={handleUseQuickPotion}
            isAiGenerating={isAiGenerating}
            activeTask={activeTask}
            taskProgress={taskProgress}
            setActiveTask={setActiveTask}
          />
        </div>

        {/* Right Column: Inventory Grids & Cloud Settings Panel (4 grid columns) */}
        <div className="col-span-1 lg:col-span-4 flex flex-col gap-6 h-full">
          {/* Inventory Board */}
          <div className="flex-1 min-h-[300px]">
            {character && character.alive ? (
              <InventoryGrid
                character={character}
                onEquipItem={handleEquipItem}
                onScrapItem={handleScrapItem}
                onUsePotion={handleUsePotion}
                onGenerateSprite={handleGenerateItemSprite}
              />
            ) : (
              <div className="retro-glass-panel-heavy rounded-2xl p-6 shadow-2xl h-full flex flex-col items-center justify-center text-center space-y-3 font-mono select-none">
                <p className="text-xs text-zinc-600">Inventory storage is linked to your active hero run.</p>
              </div>
            )}
          </div>

          {/* Cloud Saving, Profiles & Cemetery Upgrades */}
          <div className="flex-1 min-h-[300px]">
            <CloudSavePanel
              character={character}
              legacy={legacy}
              onLoadSave={handleLoadSaveState}
              onUpdateLegacy={(updatedLegacy) => {
                setLegacy(updatedLegacy);
                triggerSilentCloudBackup(character, updatedLegacy);
              }}
            />
          </div>
        </div>

      </main>
    </div>
  );
}
