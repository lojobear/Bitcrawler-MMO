/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Rarity = 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary';

export interface ItemStats {
  strength?: number;
  intellect?: number;
  agility?: number;
  defense?: number;
  maxHp?: number;
  critChance?: number;
  luck?: number;
  meleeBonus?: number;
  defenseBonus?: number;
  arcaneBonus?: number;
}

export interface Item {
  id: string;
  name: string;
  type: 'helmet' | 'chestplate' | 'boots' | 'weapon' | 'offhand' | 'ring' | 'potion';
  rarity: Rarity;
  stats: ItemStats;
  goldValue: number;
  icon: string; // Emoji representing the item
  color: string; // Tailwind text color class
  bgGlow: string; // Tailwind background glow class
  description: string;
  healingAmount?: number; // Only for potions
  imageUrl?: string;
  isAiGenerated?: boolean;
}

export interface SkillState {
  level: number;
  xp: number;
  xpNeeded: number;
}

export interface Skills {
  melee: SkillState;      // Determines physical damage and critical hit impact
  defense: SkillState;    // Blocks incoming physical damage, reduces enemy crit
  arcane: SkillState;     // Powers spells, mana efficiency, spell critical chance
  scavenging: SkillState; // Increases item drop rates and chance of high-tier rarities
  athletics: SkillState;  // Increases Max HP scaling and turn recovery speed
  stealth: SkillState;    // Avoids hazardous traps, allows surprise attacks/stealing
  charisma: SkillState;   // NPC shop discount, higher gold rewards in choices
  faith: SkillState;      // Saved from fatal blow once per run, divine intervention
  milking: SkillState;    // Gathering milk from planetary cows
  foraging: SkillState;   // Gathering rare space herbs and flora
  woodcutting: SkillState;// Logging ancient space trees for runic timber
  mining: SkillState;     // Mining deep space meteorites for ore
  fishing: SkillState;    // Fishing in stellar nebulas
  cooking: SkillState;    // Brewing soup and elixirs out of raw materials
  crafting: SkillState;   // Forging high-tier gear using timber and gold
}

export type SkillName = keyof Skills;

export interface CharacterStats {
  strength: number;
  intellect: number;
  agility: number;
  defense: number;
  critChance: number;
  luck: number;
}

export interface Equipment {
  helmet: Item | null;
  chestplate: Item | null;
  boots: Item | null;
  weapon: Item | null;
  offhand: Item | null;
  ring: Item | null;
}

export interface GameLog {
  id: string;
  turn: number;
  text: string;
  type: 'general' | 'combat' | 'loot' | 'event' | 'death' | 'level';
  timestamp: string;
}

export interface ActiveCharacter {
  name: string;
  level: number;
  xp: number;
  xpNeeded: number;
  hp: number;
  maxHp: number;
  gold: number;
  skills: Skills;
  equipment: Equipment;
  inventory: Item[];
  turnCount: number;
  killedEnemiesCount: number;
  eventsResolvedCount: number;
  highestRarityFound: Rarity;
  currentArea: string;
  alive: boolean;
  materials?: Record<string, number>;
}

export interface LegacyUpgrade {
  id: string;
  name: string;
  description: string;
  cost: number;
  purchased: boolean;
  maxPurchases: number;
  currentCount: number;
  effects: {
    maxHpPercent?: number;
    goldMultiplier?: number;
    startWeapon?: boolean;
    scavengingBoost?: number;
    critChanceBoost?: number;
    expMultiplier?: number;
  };
}

export interface LegacyState {
  legacyLevel: number;
  legacyPoints: number;
  unlockedUpgrades: Record<string, number>; // upgradeId -> count
  highScores: {
    maxTurns: number;
    maxLevel: number;
    maxGold: number;
    deadHeroes: Array<{
      name: string;
      level: number;
      turns: number;
      gold: number;
      slainBy: string;
      date: string;
    }>;
  };
}

export interface Enemy {
  name: string;
  level: number;
  hp: number;
  maxHp: number;
  damage: number;
  defense: number;
  goldValue: number;
  xpReward: number;
  icon: string;
  abilities: string[];
  imageUrl?: string;
  isAiGenerated?: boolean;
  rarity?: Rarity;
  description?: string;
}

export interface SkillCheck {
  skill: SkillName;
  difficulty: number;
  successText: string;
  failureText: string;
  onSuccess: (char: ActiveCharacter) => { text: string; loot?: Item; gold?: number; xp?: number; hpChange?: number };
  onFailure: (char: ActiveCharacter) => { text: string; hpChange?: number; goldChange?: number };
}

export interface EventOption {
  text: string;
  requireSkill?: {
    skill: SkillName;
    level: number;
  };
  skillCheck?: {
    skill: SkillName;
    difficulty: number;
    successReward: string;
    failurePenalty: string;
  };
  resolve: (char: ActiveCharacter) => {
    logText: string;
    hpChange?: number;
    goldChange?: number;
    xpReward?: number;
    itemReward?: Item | null;
    skillsLevelUp?: SkillName[];
  };
}

export interface RandomEvent {
  id: string;
  title: string;
  description: string;
  imageTheme: string; // For CSS landscape representation
  options: EventOption[];
}

export interface GameState {
  character: ActiveCharacter | null;
  legacy: LegacyState;
  logs: GameLog[];
  activeEncounter: {
    type: 'battle' | 'event' | null;
    enemy: Enemy | null;
    event: RandomEvent | null;
    enemyCurrentHp?: number;
  };
  saveMetadata: {
    isSaving: boolean;
    lastSaved: string | null;
    cloudSaveId: string | null;
    cloudUsername: string | null;
  };
}
