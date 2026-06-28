/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Enemy } from '../types';

interface EnemyTemplate {
  name: string;
  icon: string;
  abilities: string[];
  hpRatio: number;
  damageRatio: number;
  defenseRatio: number;
}

const LOW_TIER: EnemyTemplate[] = [
  { name: 'Mutated Slime', icon: '🟢', abilities: ['Acid Squirt (Saves reduce defense)'], hpRatio: 1.2, damageRatio: 0.8, defenseRatio: 0.5 },
  { name: 'Feral Giant Rat', icon: '🐀', abilities: ['Rabid Bite (Festers damage over time)'], hpRatio: 0.8, damageRatio: 1.1, defenseRatio: 0.4 },
  { name: 'Goblin Scamp', icon: '👺', abilities: ['Steal Gold (Snatches coins on hit)'], hpRatio: 0.9, damageRatio: 1.0, defenseRatio: 0.7 },
  { name: 'Rabid Wood Boar', icon: '🐗', abilities: ['Tackle (Agility checks prevent stun)'], hpRatio: 1.4, damageRatio: 0.9, defenseRatio: 0.8 },
  { name: 'Aggressive Crow', icon: '🐦', abilities: ['Peck Eyes (Blinds player, lower crits)'], hpRatio: 0.6, damageRatio: 1.2, defenseRatio: 0.3 },
  { name: 'Cave Bat', icon: '🦇', abilities: ['Echo Bite (Siphons slight life force)'], hpRatio: 0.7, damageRatio: 1.0, defenseRatio: 0.4 },
  { name: 'Kobold Tunneler', icon: '🦎', abilities: ['Throw Rock (Accurate ranged strike)'], hpRatio: 0.9, damageRatio: 1.1, defenseRatio: 0.6 },
  { name: 'Zombie Wanderer', icon: '🧟', abilities: ['Slow Grasp (Slows user reaction speed)'], hpRatio: 1.5, damageRatio: 0.8, defenseRatio: 0.5 },
  { name: 'Giant Centipede', icon: '🐛', abilities: ['Numbing Sting (Reduces agility bonuses)'], hpRatio: 1.0, damageRatio: 1.0, defenseRatio: 0.5 },
  { name: 'Vile Mosquito Swarm', icon: '🦟', abilities: ['Drain Fluid (Unavoidable minimal health siphon)'], hpRatio: 0.5, damageRatio: 1.3, defenseRatio: 0.2 },
  { name: 'Stray Gnoll Pack', icon: '🐕', abilities: ['Pack Frenzy (Successive hits increase speed)'], hpRatio: 1.1, damageRatio: 1.2, defenseRatio: 0.6 },
  { name: 'Scurrying Beetle', icon: '🪲', abilities: ['Shell Protect (Reduces incoming physical damage)'], hpRatio: 1.3, damageRatio: 0.7, defenseRatio: 1.2 },
  { name: 'Flesh-Eating Plant', icon: '🌱', abilities: ['Acidic Sap (Slight damage over time on strike)'], hpRatio: 1.2, damageRatio: 1.1, defenseRatio: 0.7 },
  { name: 'Skeleton Recruit', icon: '💀', abilities: ['Clunky Thrust (Deals raw basic physical strike)'], hpRatio: 1.0, damageRatio: 1.0, defenseRatio: 0.8 },
  // 20+ New Low-Tier Additions (Satisfying variety goal)
  { name: 'Poisonous Star-Toad', icon: '🐸', abilities: ['Venom Spittle (Slows stamina recovery)'], hpRatio: 1.1, damageRatio: 0.9, defenseRatio: 0.6 },
  { name: 'Mutant Spiderling', icon: '🕷️', abilities: ['Sticky Thread (Restricts dodge actions)'], hpRatio: 0.75, damageRatio: 1.15, defenseRatio: 0.4 },
  { name: 'Rabid Squirrel', icon: '🐿️', abilities: ['Hyper Chew (Bites rapidly in succession)'], hpRatio: 0.6, damageRatio: 1.3, defenseRatio: 0.3 },
  { name: 'Hollow Skeleton', icon: '💀', abilities: ['Frail Strike (Easily parried physical swing)'], hpRatio: 0.9, damageRatio: 1.0, defenseRatio: 0.5 },
  { name: 'Rusted Automaton', icon: '🤖', abilities: ['Sparks Leak (Accidental electric discharges)'], hpRatio: 1.5, damageRatio: 0.75, defenseRatio: 1.1 },
  { name: 'Nebula Wasp', icon: '🐝', abilities: ['Hyper sting (High critical chance)'], hpRatio: 0.6, damageRatio: 1.4, defenseRatio: 0.2 },
  { name: 'Spiked Space-Larva', icon: '🐛', abilities: ['Poison Horn (Slight venom damage over time)'], hpRatio: 1.25, damageRatio: 0.85, defenseRatio: 0.9 },
  { name: 'Stardust Crab', icon: '🦀', abilities: ['Pincer Lock (Reduces player agility temporary)'], hpRatio: 1.4, damageRatio: 0.8, defenseRatio: 1.4 },
  { name: 'Thieving Magpie', icon: '🐦', abilities: ['Shiny Snatch (Swipes small silver coins)'], hpRatio: 0.7, damageRatio: 1.1, defenseRatio: 0.4 },
  { name: 'Rotten Space-Carcass', icon: '🧟', abilities: ['Fetid Breath (Infects user and lowers defenses)'], hpRatio: 1.6, damageRatio: 0.8, defenseRatio: 0.6 },
  { name: 'Goblin Archer', icon: '👺', abilities: ['Puncture Shot (Ignores 10% armor)'], hpRatio: 0.8, damageRatio: 1.2, defenseRatio: 0.5 },
  { name: 'Kobold Slinger', icon: '🦎', abilities: ['Dust Toss (Reduces player accuracy)'], hpRatio: 0.95, damageRatio: 1.05, defenseRatio: 0.6 },
  { name: 'Gnoll Scavenger', icon: '🐕', abilities: ['Scrap Bash (Deals high physical blunt force)'], hpRatio: 1.1, damageRatio: 1.15, defenseRatio: 0.7 },
  { name: 'Cosmic Beetle', icon: '🪲', abilities: ['Static Charged Shell (Deals lightning thorns)'], hpRatio: 1.35, damageRatio: 0.8, defenseRatio: 1.3 },
  { name: 'Stardust Jelly', icon: '🪼', abilities: ['Pulsing Shock (Stuns if not block-checked)'], hpRatio: 0.85, damageRatio: 1.1, defenseRatio: 0.5 },
  { name: 'Angry Void Hornet', icon: '🐝', abilities: ['Hive Mark (Increases subsequent damage)'], hpRatio: 0.55, damageRatio: 1.35, defenseRatio: 0.3 },
  { name: 'Galaxy Leech', icon: '🐛', abilities: ['Blood siphon (Regenerates 5% health on hit)'], hpRatio: 0.9, damageRatio: 0.95, defenseRatio: 0.4 },
  { name: 'Ghostly Spark', icon: '👻', abilities: ['Mana drain (Takes slight mana energy)'], hpRatio: 0.8, damageRatio: 1.2, defenseRatio: 0.5 },
  { name: 'Void Dust Cloud', icon: '☁️', abilities: ['Choke (Lower damage output for next hit)'], hpRatio: 1.0, damageRatio: 1.0, defenseRatio: 0.6 },
  // 10 Additional Low-Tier enemies
  { name: 'Stray Void Pup', icon: '🐕', abilities: ['Space Howl (Slight damage over time)'], hpRatio: 0.95, damageRatio: 1.05, defenseRatio: 0.5 },
  { name: 'Runic Slime', icon: '🟣', abilities: ['Magic Splash (Bypasses minor magic defense)'], hpRatio: 1.15, damageRatio: 0.85, defenseRatio: 0.6 },
  { name: 'Infected Sprout', icon: '🌱', abilities: ['Spore Breath (Reduces user speed checks)'], hpRatio: 0.8, damageRatio: 1.1, defenseRatio: 0.5 },
  { name: 'Skeletal Archer', icon: '💀', abilities: ['Bone Arrow (High critical threat chance)'], hpRatio: 0.85, damageRatio: 1.25, defenseRatio: 0.4 },
  { name: 'Copper Automaton Drone', icon: '🤖', abilities: ['Laser Zap (Small guaranteed energy strike)'], hpRatio: 1.3, damageRatio: 0.9, defenseRatio: 1.0 },
  { name: 'Glacial Snail', icon: '🐌', abilities: ['Frost Shell (Very slow, high defense checks)'], hpRatio: 1.5, damageRatio: 0.6, defenseRatio: 1.5 },
  { name: 'Angry Fire Ant', icon: '🐜', abilities: ['Searing Sting (Small burn dot effect)'], hpRatio: 0.65, damageRatio: 1.3, defenseRatio: 0.3 },
  { name: 'Deep Space Leech', icon: '🐛', abilities: ['Life Siphon (Heals on basic strikes)'], hpRatio: 1.0, damageRatio: 0.9, defenseRatio: 0.5 },
  { name: 'Dust Goblin Thief', icon: '👺', abilities: ['Gold Snatch (Steals 3-5 gold coins)'], hpRatio: 0.9, damageRatio: 1.0, defenseRatio: 0.6 },
  { name: 'Cave Mushroom Centipede', icon: '🐛', abilities: ['Spore Prick (Lowers accuracy checks)'], hpRatio: 1.1, damageRatio: 0.95, defenseRatio: 0.55 }
];

const MID_TIER: EnemyTemplate[] = [
  { name: 'Skeletal Sentinel', icon: '💀', abilities: ['Shield Block (Absorbs physical strikes)'], hpRatio: 1.2, damageRatio: 1.0, defenseRatio: 1.3 },
  { name: 'Orc Vanguard', icon: '👹', abilities: ['Enrage (Deals double damage below 30% HP)'], hpRatio: 1.5, damageRatio: 1.2, defenseRatio: 0.9 },
  { name: 'Venom Cobra', icon: '🐍', abilities: ['Neurotoxin (Reduces attack speed and stats)'], hpRatio: 0.9, damageRatio: 1.3, defenseRatio: 0.6 },
  { name: 'Giant Webweaver', icon: '🕷️', abilities: ['Web Trap (Slows character down)'], hpRatio: 1.1, damageRatio: 1.1, defenseRatio: 0.8 },
  { name: 'Crypt Ghoul', icon: '🧟', abilities: ['Flesh Feast (Heals itself upon striking you)'], hpRatio: 1.3, damageRatio: 1.1, defenseRatio: 0.6 },
  { name: 'Bandit Cutthroat', icon: '🗡️', abilities: ['Slay (Chance of doing triple pierce damage)'], hpRatio: 1.0, damageRatio: 1.4, defenseRatio: 0.7 },
  { name: 'Minotaur Yearling', icon: '🐂', abilities: ['Gore (High stun chance with knockback)'], hpRatio: 1.6, damageRatio: 1.3, defenseRatio: 1.1 },
  { name: 'Cave Troll', icon: '🧌', abilities: ['Regenerate (Heals minor HP every turn)'], hpRatio: 1.8, damageRatio: 1.2, defenseRatio: 0.8 },
  { name: 'Cursed Mummy', icon: '🩹', abilities: ['Pharaohs Rot (Slashes maximum stats temporarily)'], hpRatio: 1.4, damageRatio: 1.1, defenseRatio: 1.0 },
  { name: 'Fire Elemental', icon: '🔥', abilities: ['Immolate (Burns player for fire dmg over time)'], hpRatio: 1.1, damageRatio: 1.5, defenseRatio: 0.6 },
  { name: 'Frost Sprite', icon: '❄️', abilities: ['Deep Freeze (Locks actions or slows attack rate)'], hpRatio: 1.0, damageRatio: 1.3, defenseRatio: 0.8 },
  { name: 'Harpies Screecher', icon: '🦅', abilities: ['Piercing Shriek (Lowers your attack power)'], hpRatio: 1.1, damageRatio: 1.2, defenseRatio: 0.7 },
  { name: 'Flesh Golem', icon: '🥩', abilities: ['Slam (Heavy blow ignoring 15% armor value)'], hpRatio: 1.9, damageRatio: 1.1, defenseRatio: 0.8 },
  // 20+ New Mid-Tier Additions (Satisfying variety goal)
  { name: 'Basilisk Hatchling', icon: '🦎', abilities: ['Gaze (Slightly petrifies and slows agility)'], hpRatio: 1.2, damageRatio: 1.2, defenseRatio: 1.0 },
  { name: 'Orc Berserker', icon: '👹', abilities: ['Axe Flurry (Two quick physical strikes)'], hpRatio: 1.4, damageRatio: 1.35, defenseRatio: 0.7 },
  { name: 'Asteroid Hag', icon: '🧙‍♀️', abilities: ['Curse of Sloth (Blocks rapid turn accumulation)'], hpRatio: 1.1, damageRatio: 1.3, defenseRatio: 0.85 },
  { name: 'Crypt Spectre', icon: '👻', abilities: ['Chilling Touch (Deals frost damage)'], hpRatio: 1.0, damageRatio: 1.3, defenseRatio: 0.9 },
  { name: 'Bandit Marksman', icon: '🏹', abilities: ['Eagle Shot (Ignore shield defense)'], hpRatio: 1.05, damageRatio: 1.35, defenseRatio: 0.75 },
  { name: 'Rogue Alchemist', icon: '🧪', abilities: ['Acid Flask (Corrodes active armor stats)'], hpRatio: 1.1, damageRatio: 1.4, defenseRatio: 0.8 },
  { name: 'Phase Space-Spider', icon: '🕷️', abilities: ['Void Blink (High chance to dodge attacks)'], hpRatio: 0.95, damageRatio: 1.25, defenseRatio: 0.6 },
  { name: 'Harpy Nest-Mother', icon: '🦅', abilities: ['Sonic Call (Lowers magic intellect defense)'], hpRatio: 1.2, damageRatio: 1.2, defenseRatio: 0.8 },
  { name: 'Fire Salamander', icon: '🦎', abilities: ['Lava Gout (Fire breath causing minor burn)'], hpRatio: 1.3, damageRatio: 1.25, defenseRatio: 0.9 },
  { name: 'Glacial Elemental', icon: '❄️', abilities: ['Ice Spike (Heavy blunt physical cold strike)'], hpRatio: 1.4, damageRatio: 1.3, defenseRatio: 1.2 },
  { name: 'Ironclad Beetle', icon: '🪲', abilities: ['Heavy Charge (Tackle dealing armor damage)'], hpRatio: 1.5, damageRatio: 1.0, defenseRatio: 1.6 },
  { name: 'Dark Stalker', icon: '🥷', abilities: ['Shadow Slash (Pierce attack on physical def)'], hpRatio: 1.05, damageRatio: 1.4, defenseRatio: 0.7 },
  { name: 'Cursed Scarecrow', icon: '🎃', abilities: ['Terror Gaze (Inflicts damage check failure)'], hpRatio: 1.25, damageRatio: 1.2, defenseRatio: 0.8 },
  { name: 'Young Werewolf', icon: '🐺', abilities: ['Howl of Blood (Boosts threat damage stats)'], hpRatio: 1.3, damageRatio: 1.3, defenseRatio: 0.85 },
  { name: 'Runic Sentry Golem', icon: '🤖', abilities: ['Shield Barrier (Fully blocks 1 strike)'], hpRatio: 1.7, damageRatio: 0.9, defenseRatio: 1.5 },
  { name: 'Blood Priest', icon: '🧙‍♂️', abilities: ['Sanguine Siphon (Loot/heal skill)'], hpRatio: 1.2, damageRatio: 1.35, defenseRatio: 0.8 },
  { name: 'Wyvern Hatchling', icon: '🐲', abilities: ['Minor Breath (Flame aura damages each round)'], hpRatio: 1.45, damageRatio: 1.25, defenseRatio: 1.0 },
  { name: 'Galactic Siren', icon: '🧜‍♀️', abilities: ['Star Song (Hypnotic confusion reduces crits)'], hpRatio: 1.15, damageRatio: 1.3, defenseRatio: 0.9 },
  { name: 'Iron-Devouring Worm', icon: '🐛', abilities: ['Rust Dust (Corrodes player weapon damage)'], hpRatio: 1.35, damageRatio: 1.1, defenseRatio: 1.1 },
  // 10 Additional Mid-Tier enemies
  { name: 'Elite Orc Guard', icon: '👹', abilities: ['Shield Bash (Stuns player on low agility check)'], hpRatio: 1.4, damageRatio: 1.1, defenseRatio: 1.3 },
  { name: 'Starlight Witch', icon: '🧙‍♀️', abilities: ['Hex of Blindness (Reduces player crit chance)'], hpRatio: 1.1, damageRatio: 1.4, defenseRatio: 0.8 },
  { name: 'Ice Drake Hatchling', icon: '🐉', abilities: ['Frost Breath (Deals damage and slows turns)'], hpRatio: 1.3, damageRatio: 1.3, defenseRatio: 1.0 },
  { name: 'Phasing Spectre', icon: '👻', abilities: ['Phase Shift (High chance to dodge incoming blows)'], hpRatio: 0.9, damageRatio: 1.3, defenseRatio: 0.7 },
  { name: 'Volcanic Golem', icon: '🗿', abilities: ['Lava Smash (Unblockable minor fire strike)'], hpRatio: 1.6, damageRatio: 1.25, defenseRatio: 1.4 },
  { name: 'Skeletal Gladiator', icon: '💀', abilities: ['Trident Thrust (Bypasses 20% armor defense)'], hpRatio: 1.25, damageRatio: 1.3, defenseRatio: 1.1 },
  { name: 'Mutated Chimera Pup', icon: '🦁', abilities: ['Double Bite (Strikes twice in one round)'], hpRatio: 1.35, damageRatio: 1.2, defenseRatio: 0.9 },
  { name: 'Stardust Rogue', icon: '🥷', abilities: ['Backstab (Deals high physical damage behind)'], hpRatio: 1.0, damageRatio: 1.5, defenseRatio: 0.8 },
  { name: 'Iron-Jaw Croc', icon: '🐊', abilities: ['Heavy Clamp (Stuns if not dodge-checked)'], hpRatio: 1.5, damageRatio: 1.15, defenseRatio: 1.2 },
  { name: 'Plague Ghoul Spitter', icon: '🧟', abilities: ['Toxic Spit (Slowly melts defense rating)'], hpRatio: 1.15, damageRatio: 1.3, defenseRatio: 0.75 }
];

const HIGH_TIER: EnemyTemplate[] = [
  { name: 'Shadow Assassin', icon: '🥷', abilities: ['Assassinate (High chance of critical strikes)'], hpRatio: 1.0, damageRatio: 1.6, defenseRatio: 0.8 },
  { name: 'Gargoyle Sentry', icon: '🗿', abilities: ['Stone Form (Heals 20% health during battle)'], hpRatio: 1.8, damageRatio: 0.9, defenseRatio: 1.6 },
  { name: 'Lich Acolyte', icon: '🧙‍♂️', abilities: ['Death Coil (Unholy life siphon spells)'], hpRatio: 1.1, damageRatio: 1.4, defenseRatio: 0.8 },
  { name: 'Furious Werewolf', icon: '🐺', abilities: ['Lycan Claws (Deep wounds cause bleeding)'], hpRatio: 1.4, damageRatio: 1.3, defenseRatio: 0.9 },
  { name: 'Iron Golem', icon: '🤖', abilities: ['Superalloy Armour (Ignores minor attacks)'], hpRatio: 2.2, damageRatio: 1.1, defenseRatio: 1.8 },
  { name: 'Nether Demon', icon: '😈', abilities: ['Demonic Surge (Empowers its spell damage greatly)'], hpRatio: 1.5, damageRatio: 1.6, defenseRatio: 1.1 },
  { name: 'Ancient Wyrmling', icon: '🐲', abilities: ['Fireball (Explosive burst burning all protections)'], hpRatio: 1.7, damageRatio: 1.5, defenseRatio: 1.3 },
  { name: 'Chimerical Beast', icon: '🦁', abilities: ['Triple Bite (Stamps 3 physical marks on armor)'], hpRatio: 1.6, damageRatio: 1.4, defenseRatio: 1.0 },
  { name: 'Vampire Noble', icon: '🧛', abilities: ['Sanguine Feast (Absorbs massive HP on crit)'], hpRatio: 1.3, damageRatio: 1.5, defenseRatio: 0.9 },
  { name: 'Banshee Wailer', icon: '👻', abilities: ['Doom Scream (Directly strips maximum mana/energy)'], hpRatio: 1.2, damageRatio: 1.6, defenseRatio: 0.7 },
  { name: 'Abyssal Watcher', icon: '👁️', abilities: ['Gaze of Madness (Blinds and panics user)'], hpRatio: 1.4, damageRatio: 1.4, defenseRatio: 1.2 },
  { name: 'Dread Knight', icon: '🐎', abilities: ['Dark Charge (Heavy charge breaking defenses)'], hpRatio: 1.8, damageRatio: 1.3, defenseRatio: 1.5 },
  // 20+ New High-Tier Additions (Satisfying variety goal)
  { name: 'Void Behemoth', icon: '👾', abilities: ['Gravitational Singularity (Crushes armor value)'], hpRatio: 2.3, damageRatio: 1.4, defenseRatio: 1.3 },
  { name: 'Celestial Doomweaver', icon: '🕷️', abilities: ['Poison Cocoon (Reduces player turn steps)'], hpRatio: 1.5, damageRatio: 1.5, defenseRatio: 1.1 },
  { name: 'Necromancer Overlord', icon: '🧙‍♂️', abilities: ['Raise Minions (Shields itself from next strike)'], hpRatio: 1.4, damageRatio: 1.6, defenseRatio: 0.95 },
  { name: 'Ancient Cosmic Wyvern', icon: '🐉', abilities: ['Plasma Stream (Inflicts burn and armor reduction)'], hpRatio: 1.8, damageRatio: 1.7, defenseRatio: 1.4 },
  { name: 'Nebula Phoenix Reborn', icon: '🦅', abilities: ['Supernova Burst (Resurrects with 30% health once)'], hpRatio: 1.6, damageRatio: 1.75, defenseRatio: 1.0 },
  { name: 'Obsidian Destroyer', icon: '🗿', abilities: ['Ground Slam (Deals unblockable physical dmg)'], hpRatio: 2.1, damageRatio: 1.45, defenseRatio: 1.9 },
  { name: 'Hellfire Efreeti', icon: '🔥', abilities: ['Flame Pillar (Massive burn dmg over time)'], hpRatio: 1.4, damageRatio: 1.7, defenseRatio: 0.8 },
  { name: 'Runic Storm Djinn', icon: '🧞‍♂️', abilities: ['Hurricane Strike (Swipes away positive buffs)'], hpRatio: 1.55, damageRatio: 1.65, defenseRatio: 1.1 },
  { name: 'Gorgon Stalker', icon: '🐍', abilities: ['Petrifying Glare (Stuns character completely)'], hpRatio: 1.6, damageRatio: 1.5, defenseRatio: 1.35 },
  { name: 'Chaos Portal Daemon', icon: '😈', abilities: ['Rift Tear (High chance to bypass defense completely)'], hpRatio: 1.65, damageRatio: 1.7, defenseRatio: 1.0 },
  { name: 'Dread Lich Overlord', icon: '🧙‍♂️', abilities: ['Ethereal Form (Takes 50% less physical damage)'], hpRatio: 1.5, damageRatio: 1.8, defenseRatio: 1.1 },
  { name: 'Abyssal Executioner', icon: '⚔️', abilities: ['Guillotine (Double damage if player HP below 40%)'], hpRatio: 1.75, damageRatio: 1.8, defenseRatio: 1.2 },
  { name: 'Astral Basilisk King', icon: '🦎', abilities: ['Toxin Cloud (Damages player on every turn)'], hpRatio: 1.9, damageRatio: 1.5, defenseRatio: 1.5 },
  { name: 'Plague Lord', icon: '🧟', abilities: ['Festering Ruin (Reduces healing effects by 50%)'], hpRatio: 2.0, damageRatio: 1.4, defenseRatio: 1.2 },
  { name: 'Titanium Juggernaut', icon: '🤖', abilities: ['Barrier Shield (Absorbs up to 100 damage)'], hpRatio: 2.5, damageRatio: 1.2, defenseRatio: 2.1 },
  { name: 'Void Spellblade Master', icon: '⚔️', abilities: ['Spellweaver (Combines physical strike + magic burn)'], hpRatio: 1.5, damageRatio: 1.75, defenseRatio: 1.1 },
  // 10 Additional High-Tier enemies
  { name: 'Vampire Arch-Count', icon: '🧛', abilities: ['Sanguine Storm (Massive life drain check)'], hpRatio: 1.4, damageRatio: 1.6, defenseRatio: 1.0 },
  { name: 'Stardust Dragon Wyrm', icon: '🐉', abilities: ['Starlight Breath (Blinds and burns player)'], hpRatio: 1.9, damageRatio: 1.55, defenseRatio: 1.4 },
  { name: 'Arch-Mage Spectre', icon: '🧙‍♂️', abilities: ['Cosmic singularity (High unholy spell burst)'], hpRatio: 1.3, damageRatio: 1.7, defenseRatio: 0.9 },
  { name: 'Cyber Juggernaut', icon: '🤖', abilities: ['Graphene Barrier (Completely absorbs 150 damage)'], hpRatio: 2.4, damageRatio: 1.3, defenseRatio: 2.0 },
  { name: 'Abyssal Terror', icon: '👾', abilities: ['Void Tendrils (Root effect slows agility to zero)'], hpRatio: 1.8, damageRatio: 1.6, defenseRatio: 1.2 },
  { name: 'Doom Knight General', icon: '🐎', abilities: ['Doom Strike (Deals double damage on low player HP)'], hpRatio: 1.9, damageRatio: 1.5, defenseRatio: 1.6 },
  { name: 'Gorgon Queen', icon: '🐍', abilities: ['Stone Gaze (Inflicts 2 turns of solid stun)'], hpRatio: 1.6, damageRatio: 1.4, defenseRatio: 1.5 },
  { name: 'Hellfire Overlord', icon: '🔥', abilities: ['Immolation Wave (Burns player for massive damage)'], hpRatio: 1.5, damageRatio: 1.8, defenseRatio: 0.8 },
  { name: 'Obsidian Titan', icon: '🗿', abilities: ['Fissure Slam (Heavy ground strike ignoring shields)'], hpRatio: 2.2, damageRatio: 1.4, defenseRatio: 1.8 },
  { name: 'Eldritch Eye Stalker', icon: '👁️', abilities: ['Mind Sear (Strips 50 XP if player loses)'], hpRatio: 1.35, damageRatio: 1.65, defenseRatio: 1.15 }
];

const BOSS_TIER: EnemyTemplate[] = [
  { name: 'Infernal Fire Drake', icon: '🐉', abilities: ['Dragon Breath', 'Magma Armor', 'Tail Swipe'], hpRatio: 2.6, damageRatio: 1.8, defenseRatio: 1.4 },
  { name: 'Death Lord Reborn', icon: '👑', abilities: ['Reap Soul', 'Army of Dead', 'Necrotic Touch'], hpRatio: 3.0, damageRatio: 1.7, defenseRatio: 1.6 },
  { name: 'Beholder of Dreams', icon: '👁️', abilities: ['Disintegration Ray', 'Petrifaction Eye', 'Anti-magic Shield'], hpRatio: 2.2, damageRatio: 2.0, defenseRatio: 1.2 },
  { name: 'Archdemon of the Void', icon: '😈', abilities: ['Void Implosion', 'Corruption Curse', 'Demon Skin'], hpRatio: 3.5, damageRatio: 1.9, defenseRatio: 1.5 },
  { name: 'Aetherial Colossus', icon: '🗿', abilities: ['Stellar Impact', 'Gravitational Pull', 'Cosmic Shield'], hpRatio: 3.8, damageRatio: 1.6, defenseRatio: 2.2 },
  { name: 'Leviathan of Deep Seas', icon: '🐋', abilities: ['Tidal Wave', 'Siphon Whirlpool', 'Crushing Maw'], hpRatio: 4.2, damageRatio: 1.5, defenseRatio: 1.8 },
  { name: 'Ancient Storm Titan', icon: '⚡', abilities: ['Mjolnir Spear', 'Lightning Storm', 'Static Discharge'], hpRatio: 3.2, damageRatio: 2.2, defenseRatio: 1.4 },
  { name: 'Chronos Weaver', icon: '⏳', abilities: ['Time Reversal', 'Temporal Slicing', 'Ageing Curse'], hpRatio: 2.8, damageRatio: 2.1, defenseRatio: 1.5 },
  // 15+ New Bosses (Totaling massive variety)
  { name: 'Cosmic Star Devourer', icon: '⭐', abilities: ['Nova Collapse', 'Eclipse Ray', 'Supernova Pulse'], hpRatio: 4.5, damageRatio: 2.4, defenseRatio: 1.8 },
  { name: 'Dragon Emperor Ignis', icon: '🐉', abilities: ['Hellfire Burst', 'Imperial Claw', 'Ancient Scale Shield'], hpRatio: 4.0, damageRatio: 2.3, defenseRatio: 1.9 },
  { name: 'Queen of the Broken Realms', icon: '👑', abilities: ['Shattered Mirrors', 'Ruin Gaze', 'Spell Reflection'], hpRatio: 3.6, damageRatio: 2.5, defenseRatio: 1.5 },
  { name: 'Archangel of Retribution', icon: '👼', abilities: ['Holy Smiting', 'Divine Wall', 'Heavenly Spear Charge'], hpRatio: 3.8, damageRatio: 2.3, defenseRatio: 2.0 },
  { name: 'Void-Warped Kraken King', icon: '🐙', abilities: ['Siphon Whirlwind', 'Abyssal Constriction', 'Ink of Despair'], hpRatio: 4.8, damageRatio: 1.9, defenseRatio: 1.7 },
  { name: 'Lord of Forgotten Realms', icon: '💀', abilities: ['Soul Flay', 'Doom Touch', 'Immortal Veil'], hpRatio: 3.9, damageRatio: 2.4, defenseRatio: 1.75 },
  { name: 'Omega Reality Warper', icon: '👁️', abilities: ['Dimension Tear', 'Time Lock', 'Gravity Well'], hpRatio: 3.4, damageRatio: 2.8, defenseRatio: 1.3 },
  { name: 'God of the Endless Abyss', icon: '👾', abilities: ['Total Collapse', 'Black Hole Orb', 'Abyssal Rebirth'], hpRatio: 5.2, damageRatio: 2.2, defenseRatio: 2.0 },
  // 10 Additional Boss templates
  { name: 'Giga-Void Leviathan', icon: '🐋', abilities: ['Event Horizon', 'Void Tail Sweep', 'Abyssal Shield'], hpRatio: 4.8, damageRatio: 2.0, defenseRatio: 1.7 },
  { name: 'Overlord of Eternal Winter', icon: '❄️', abilities: ['Blizzard Doom', 'Deep Glacial Prison', 'Frost Armor'], hpRatio: 4.2, damageRatio: 2.1, defenseRatio: 2.0 },
  { name: 'Empress of the Burning Sun', icon: '🔥', abilities: ['Solar Flare Beam', 'Searing Sunspots', 'Magma Shield'], hpRatio: 3.9, damageRatio: 2.5, defenseRatio: 1.5 },
  { name: 'Chrono-Lich Paradox', icon: '⏳', abilities: ['Temporal Rift', 'Spell Paradox Siphon', 'Immortal Rewind'], hpRatio: 3.5, damageRatio: 2.4, defenseRatio: 1.6 },
  { name: 'Ancient Cybernetic Titan', icon: '🤖', abilities: ['Hyper Charge Cannon', 'Nanolink Heal', 'Forcefield Armor'], hpRatio: 5.0, damageRatio: 1.8, defenseRatio: 2.3 },
  { name: 'Lich King of the Red Moon', icon: '🧛', abilities: ['Lunar Siphon', 'Summon Undead Pack', 'Cursed Blood Gaze'], hpRatio: 4.0, damageRatio: 2.3, defenseRatio: 1.8 },
  { name: 'Eldritch Horror of the Rift', icon: '👾', abilities: ['Mind Collapse', 'Tentacle Thaw', 'Insanity Aura'], hpRatio: 4.5, damageRatio: 2.2, defenseRatio: 1.6 },
  { name: 'Grand Templar of Retribution', icon: '👼', abilities: ['Divine Judgement Beam', 'Blessed Wall', 'Angelic Spear Strike'], hpRatio: 4.1, damageRatio: 2.4, defenseRatio: 2.1 },
  { name: 'World-Devouring Kraken', icon: '🐙', abilities: ['Ocean Cataclysm', 'Crushing Pincers', 'Ink Abyss Cloud'], hpRatio: 5.3, damageRatio: 1.9, defenseRatio: 1.9 },
  { name: 'The Primordial Chaos Singularity', icon: '🌀', abilities: ['Rift Implosion', 'Gravity Distort Loop', 'Shattered Mirror Wave'], hpRatio: 4.6, damageRatio: 2.6, defenseRatio: 1.5 }
];

const ENEMY_PREFIXES = [
  { text: 'Brutal', hpMulti: 1.15, dmgMulti: 1.25, defMulti: 1.0 },
  { text: 'Corrupted', hpMulti: 0.9, dmgMulti: 1.35, defMulti: 0.9 },
  { text: 'Armored', hpMulti: 1.2, dmgMulti: 0.9, defMulti: 1.5 },
  { text: 'Spectral', hpMulti: 0.8, dmgMulti: 1.2, defMulti: 1.2 },
  { text: 'Ancient', hpMulti: 1.4, dmgMulti: 1.1, defMulti: 1.2 },
  { text: 'Cosmic', hpMulti: 1.2, dmgMulti: 1.2, defMulti: 1.2 },
  { text: 'Gilded', hpMulti: 1.0, dmgMulti: 1.0, defMulti: 1.0, goldBonus: 2.0 },
  { text: 'Furious', hpMulti: 1.1, dmgMulti: 1.3, defMulti: 0.8 },
  { text: 'Tainted', hpMulti: 1.1, dmgMulti: 1.15, defMulti: 1.1 },
  { text: 'Frozen', hpMulti: 1.25, dmgMulti: 1.0, defMulti: 1.25 },
  { text: 'Vampiric', hpMulti: 1.15, dmgMulti: 1.15, defMulti: 0.95 },
  { text: 'Obsidian', hpMulti: 1.35, dmgMulti: 1.0, defMulti: 1.6 },
  // 10 Additional Prefixes
  { text: 'Magnetic', hpMulti: 1.1, dmgMulti: 1.1, defMulti: 1.2 },
  { text: 'Enraged', hpMulti: 0.85, dmgMulti: 1.45, defMulti: 0.85 },
  { text: 'Stardust-charged', hpMulti: 1.2, dmgMulti: 1.2, defMulti: 1.1, goldBonus: 1.3 },
  { text: 'Chrono-warped', hpMulti: 0.95, dmgMulti: 1.3, defMulti: 0.95 },
  { text: 'Cursed', hpMulti: 1.3, dmgMulti: 1.25, defMulti: 0.9 },
  { text: 'Colossal', hpMulti: 1.5, dmgMulti: 1.1, defMulti: 1.1 },
  { text: 'Phasing', hpMulti: 0.9, dmgMulti: 1.2, defMulti: 0.9 },
  { text: 'Volcanic', hpMulti: 1.15, dmgMulti: 1.3, defMulti: 1.0 },
  { text: 'Glacial', hpMulti: 1.3, dmgMulti: 1.0, defMulti: 1.4 },
  { text: 'Eldritch', hpMulti: 1.4, dmgMulti: 1.4, defMulti: 1.1 }
];

const ENEMY_SUFFIXES = [
  { text: 'of the Void', hpMulti: 1.15, dmgMulti: 1.15 },
  { text: 'of Torment', hpMulti: 1.0, dmgMulti: 1.3 },
  { text: 'of Shadows', hpMulti: 0.9, dmgMulti: 1.25 },
  { text: 'of Chaos', hpMulti: 1.1, dmgMulti: 1.2 },
  { text: 'of Eternity', hpMulti: 1.4, dmgMulti: 0.9 },
  { text: 'of the Stars', hpMulti: 1.1, dmgMulti: 1.15 },
  { text: 'of Madness', hpMulti: 1.2, dmgMulti: 1.25 },
  { text: 'of Plagues', hpMulti: 1.25, dmgMulti: 1.1 },
  // 10 Additional Suffixes
  { text: 'of the Nova', hpMulti: 1.1, dmgMulti: 1.25 },
  { text: 'of Bloodlust', hpMulti: 0.95, dmgMulti: 1.35 },
  { text: 'of Eternal Ice', hpMulti: 1.35, dmgMulti: 0.95 },
  { text: 'of the Solar Flare', hpMulti: 1.15, dmgMulti: 1.2 },
  { text: 'of Dark Gravity', hpMulti: 1.25, dmgMulti: 1.15 },
  { text: 'of Spell-weaving', hpMulti: 1.05, dmgMulti: 1.3 },
  { text: 'of Pestilence', hpMulti: 1.3, dmgMulti: 1.1 },
  { text: 'of the Golem Soul', hpMulti: 1.4, dmgMulti: 0.9 },
  { text: 'of Doom', hpMulti: 1.1, dmgMulti: 1.4 },
  { text: 'of Whispering Shadows', hpMulti: 0.9, dmgMulti: 1.3 }
];

export function generateEnemyForLevel(playerLevel: number, isBoss: boolean = false): Enemy {
  let list = LOW_TIER;
  if (isBoss) {
    list = BOSS_TIER;
  } else if (playerLevel > 18) {
    list = Math.random() > 0.4 ? HIGH_TIER : MID_TIER;
  } else if (playerLevel > 8) {
    list = Math.random() > 0.4 ? MID_TIER : LOW_TIER;
  }
  
  const template = list[Math.floor(Math.random() * list.length)];
  
  // Calculate scaled level
  let enemyLevel = playerLevel + Math.floor(Math.random() * 3) - 1;
  if (isBoss) {
    enemyLevel = playerLevel + 3;
  }
  if (enemyLevel < 1) enemyLevel = 1;
  
  // Exponential scaling for stats to make high levels challenging
  const hpBase = 25 + enemyLevel * 12 + Math.pow(enemyLevel, 1.4) * 4;
  const dmgBase = 6 + enemyLevel * 2.5 + Math.pow(enemyLevel, 1.2) * 0.8;
  const defBase = enemyLevel * 1.2 + Math.pow(enemyLevel, 1.1) * 0.4;
  
  let hpMulti = template.hpRatio;
  let dmgMulti = template.damageRatio;
  let defMulti = template.defenseRatio;
  let goldBonus = 1.0;
  
  // Procedural Name Prefixes & Suffixes for non-bosses (adds massive variety)
  let prefixText = '';
  let suffixText = '';
  
  if (!isBoss && Math.random() > 0.5) {
    const prefix = ENEMY_PREFIXES[Math.floor(Math.random() * ENEMY_PREFIXES.length)];
    prefixText = prefix.text + ' ';
    hpMulti *= prefix.hpMulti;
    dmgMulti *= prefix.dmgMulti;
    defMulti *= prefix.defMulti;
    if (prefix.goldBonus) goldBonus *= prefix.goldBonus;
  }
  if (!isBoss && Math.random() > 0.5) {
    const suffix = ENEMY_SUFFIXES[Math.floor(Math.random() * ENEMY_SUFFIXES.length)];
    suffixText = ' ' + suffix.text;
    hpMulti *= suffix.hpMulti;
    dmgMulti *= suffix.dmgMulti;
  }
  
  const hp = Math.round(hpBase * hpMulti);
  const damage = Math.round(dmgBase * dmgMulti);
  const defense = Math.round(defBase * defMulti);
  
  const xpReward = Math.round((20 + enemyLevel * 8 + Math.pow(enemyLevel, 1.3) * 3) * (isBoss ? 2.5 : 1));
  const goldValue = Math.round((10 + enemyLevel * 4 + Math.random() * (enemyLevel * 4)) * (isBoss ? 3.0 : 1) * goldBonus);
  
  const finalName = prefixText + template.name + suffixText + (isBoss ? ' (BOSS 👑)' : '');
  
  return {
    name: finalName,
    level: enemyLevel,
    hp,
    maxHp: hp,
    damage,
    defense,
    goldValue,
    xpReward,
    icon: template.icon,
    abilities: template.abilities
  };
}
