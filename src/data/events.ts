/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { RandomEvent, ActiveCharacter, SkillName, Item } from '../types';
import { generateProceduralItem, generatePotion } from './items';

// Helper to check skill success
function rollSkillCheck(char: ActiveCharacter, skill: SkillName, difficulty: number): boolean {
  const skillLvl = char.skills[skill].level;
  // Base chance is 40%. Each skill level adds 6%. Luck adds up to 15%. Agility adds some for stealth.
  let luckBonus = Math.floor(char.skills.scavenging.level * 1.5) + Math.floor(char.turnCount % 10 === 0 ? 5 : 0);
  let chance = 40 + (skillLvl - difficulty) * 8 + luckBonus;
  
  // Bound chance between 5% and 95%
  chance = Math.max(5, Math.min(95, chance));
  return Math.random() * 100 < chance;
}

export const EVENTS: RandomEvent[] = [
  {
    id: 'sphinx',
    title: 'The Silent Sphinx',
    description: 'A colossal sandstone Sphinx blocks your path. Its glowing purple eyes fixate on you. "Answer my riddle, crawler, or pay with your flesh."',
    imageTheme: 'bg-gradient-to-br from-amber-950 via-orange-950 to-amber-900 border-amber-600',
    options: [
      {
        text: 'Solve the Sphinx\'s riddle (Requires Arcane / Lore check)',
        resolve: (char: ActiveCharacter) => {
          const success = rollSkillCheck(char, 'arcane', char.level + 1);
          if (success) {
            const xpReward = 40 + char.level * 10;
            const item = generateProceduralItem(char.level, 'Rare');
            return {
              logText: `[Success] Sphinx bows in respect. "Incredible wisdom." Learned +XP and obtained ${item.rarity} [${item.name}]!`,
              xpReward,
              itemReward: item,
              skillsLevelUp: ['arcane']
            };
          } else {
            const damage = Math.round(char.maxHp * 0.25);
            return {
              logText: `[Failure] Sphinx shrieks in anger. "Wrong! Your mind is weak!" The psychic backlash deals ${damage} damage.`,
              hpChange: -damage,
              skillsLevelUp: ['arcane'] // Failures still award skill experience!
            };
          }
        }
      },
      {
        text: 'Persuade the Sphinx with flattery (Charisma check)',
        resolve: (char: ActiveCharacter) => {
          const success = rollSkillCheck(char, 'charisma', char.level);
          if (success) {
            const gold = 50 + char.level * 15;
            return {
              logText: `[Success] You praise its divine carvings. Sphinx blushes. "You speak truth. Take this ancient pocket-change." Earned ${gold} Gold!`,
              goldChange: gold,
              skillsLevelUp: ['charisma']
            };
          } else {
            return {
              logText: `[Failure] Sphinx is insulted. "Vain crawler! Your words are cheap." It swipes at you, dealing 15 damage.`,
              hpChange: -15,
              skillsLevelUp: ['charisma']
            };
          }
        }
      },
      {
        text: 'Attack the Sphinx head-on! (Melee check)',
        resolve: (char: ActiveCharacter) => {
          const success = rollSkillCheck(char, 'melee', char.level + 2);
          if (success) {
            const item = generateProceduralItem(char.level, 'Epic');
            return {
              logText: `[Success] You slice through its magical stone tail! The Sphinx crumbles into gold-dust, leaving behind Epic [${item.name}]!`,
              itemReward: item,
              xpReward: 60,
              skillsLevelUp: ['melee']
            };
          } else {
            const damage = Math.round(char.maxHp * 0.35);
            return {
              logText: `[Failure] Your weapon bounces off the sandstone. Sphinx counter-attacks brutally, dealing ${damage} damage!`,
              hpChange: -damage,
              skillsLevelUp: ['melee', 'defense']
            };
          }
        }
      }
    ]
  },
  {
    id: 'merchant',
    title: 'The Wandering Goblin Trader',
    description: 'A hunched goblin dragging a heavy rucksack approaches. "Pssst, crawler. I got elite gear... if you got coins. Or maybe you want to gamble?"',
    imageTheme: 'bg-gradient-to-br from-emerald-950 via-zinc-900 to-amber-950 border-emerald-600',
    options: [
      {
        text: 'Buy a high-tier random item (Costs 100 Gold)',
        resolve: (char: ActiveCharacter) => {
          if (char.gold < 100) {
            return {
              logText: `[Denied] "No coins, no deal!" The merchant spits on your boots and wanders away.`,
            };
          }
          const item = generateProceduralItem(char.level, Math.random() > 0.7 ? 'Rare' : 'Uncommon');
          return {
            logText: `[Bought] You hand over 100 Gold. "Pleasure doing business!" Received ${item.rarity} [${item.name}].`,
            goldChange: -100,
            itemReward: item
          };
        }
      },
      {
        text: 'Haggle for a steep discount (Charisma check)',
        resolve: (char: ActiveCharacter) => {
          const success = rollSkillCheck(char, 'charisma', char.level);
          if (success) {
            const item = generateProceduralItem(char.level, 'Rare');
            const cost = 40;
            if (char.gold < cost) {
              return {
                logText: `[Success but poor] You charmed him into offering a Rare item for ${cost} Gold, but you don't even have that much!`,
                skillsLevelUp: ['charisma']
              };
            }
            return {
              logText: `[Success] "Aiyee! You drive a hard bargain, slick-talker!" Bought Rare [${item.name}] for only ${cost} Gold!`,
              goldChange: -cost,
              itemReward: item,
              skillsLevelUp: ['charisma']
            };
          } else {
            return {
              logText: `[Failure] "You think I'm stupid?!" Trader gets offended and raises prices. Lost 15 Gold in administrative insults.`,
              goldChange: -15,
              skillsLevelUp: ['charisma']
            };
          }
        }
      },
      {
        text: 'Steal from his rucksack (Stealth check)',
        resolve: (char: ActiveCharacter) => {
          const success = rollSkillCheck(char, 'stealth', char.level + 1);
          if (success) {
            const item = generateProceduralItem(char.level, Math.random() > 0.5 ? 'Epic' : 'Rare');
            return {
              logText: `[Success] You deftly slice his bag string while nodding along. Obtained ${item.rarity} [${item.name}] completely free!`,
              itemReward: item,
              skillsLevelUp: ['stealth']
            };
          } else {
            const damage = 20 + char.level * 2;
            return {
              logText: `[Caught] "THIEF!" The merchant throws explosive smoke bombs and strikes you. Took ${damage} fire damage and lost 30 Gold!`,
              hpChange: -damage,
              goldChange: Math.max(-char.gold, -30),
              skillsLevelUp: ['stealth']
            };
          }
        }
      }
    ]
  },
  {
    id: 'shrine',
    title: 'Altar of the Lost Ancestor',
    description: 'An ancient stone sarcophagus, draped in heavy ivy and moss, hums with holy vibrations. Warm light shafts illuminate the inscription.',
    imageTheme: 'bg-gradient-to-br from-indigo-950 via-slate-900 to-sky-950 border-sky-500',
    options: [
      {
        text: 'Pray for a divine blessing (Faith check)',
        resolve: (char: ActiveCharacter) => {
          const success = rollSkillCheck(char, 'faith', char.level - 1);
          if (success) {
            const heal = Math.round(char.maxHp * 0.5);
            return {
              logText: `[Success] A glowing halo descends on you. Healed ${heal} HP and gained a massive boost to Faith XP!`,
              hpChange: heal,
              xpReward: 30,
              skillsLevelUp: ['faith', 'faith'] // Double boost!
            };
          } else {
            return {
              logText: `[Silent] The divine spirits remain quiet, but your meditative breathing restores 10 HP.`,
              hpChange: 10,
              skillsLevelUp: ['faith']
            };
          }
        }
      },
      {
        text: 'Ransom the shrine for offerings (Scavenging check)',
        resolve: (char: ActiveCharacter) => {
          const success = rollSkillCheck(char, 'scavenging', char.level);
          if (success) {
            const gold = 75 + char.level * 10;
            const item = generatePotion(char.level);
            return {
              logText: `[Success] You pry open the secret compartment! Found ${gold} Gold and a [${item.name}]!`,
              goldChange: gold,
              itemReward: item,
              skillsLevelUp: ['scavenging']
            };
          } else {
            return {
              logText: `[Cursed] Prying the relic triggers a lightning bolt! You are struck for 20 divine damage!`,
              hpChange: -20,
              skillsLevelUp: ['scavenging']
            };
          }
        }
      }
    ]
  },
  {
    id: 'well',
    title: 'The Echoing Abyss',
    description: 'You stand before a profound, bottomless masonry well. A distant metallic sound echoes from deep inside.',
    imageTheme: 'bg-gradient-to-br from-zinc-950 via-slate-950 to-zinc-900 border-zinc-500',
    options: [
      {
        text: 'Rappel down using old vines (Athletics check)',
        resolve: (char: ActiveCharacter) => {
          const success = rollSkillCheck(char, 'athletics', char.level);
          if (success) {
            const gold = 120;
            const item = generateProceduralItem(char.level, 'Rare');
            return {
              logText: `[Success] You execute a flawless climb and discover a sunken chests. Found ${gold} Gold and ${item.rarity} [${item.name}]!`,
              goldChange: gold,
              itemReward: item,
              skillsLevelUp: ['athletics']
            };
          } else {
            const damage = Math.round(char.maxHp * 0.2);
            return {
              logText: `[Failure] A vine snaps! You plummet into the dark, fracturing your ribs for ${damage} damage before climbing back up.`,
              hpChange: -damage,
              skillsLevelUp: ['athletics']
            };
          }
        }
      },
      {
        text: 'Toss a gold coin and make a wish (Costs 20 Gold, tests Luck)',
        resolve: (char: ActiveCharacter) => {
          if (char.gold < 20) {
            return {
              logText: `[Too Poor] You search your pockets but don't even have 20 Gold to throw away.`
            };
          }
          const luckChance = 40 + char.skills.scavenging.level * 8;
          const success = Math.random() * 100 < luckChance;
          if (success) {
            const item = generateProceduralItem(char.level, 'Legendary');
            return {
              logText: `[Divine Miracle!] You toss the gold. The water sparkles and spits out a LEGENDARY [${item.name}]!`,
              goldChange: -20,
              itemReward: item,
              skillsLevelUp: ['scavenging']
            };
          } else {
            return {
              logText: `[Nothing Happens] You hear a faint "plop". You feel slightly sillier but peaceful. Lost 20 Gold.`,
              goldChange: -20,
              skillsLevelUp: ['scavenging']
            };
          }
        }
      }
    ]
  },
  {
    id: 'camp',
    title: 'The Sleeping Drake\'s Mound',
    description: 'A minor Fire Drake is curled up asleep on top of a heap of charred bones and armored plates. A magnificent glowing sword peeks from its tail.',
    imageTheme: 'bg-gradient-to-br from-red-950 via-orange-950 to-zinc-950 border-red-600',
    options: [
      {
        text: 'Steal the glowing sword silently (Stealth check, High Risk)',
        resolve: (char: ActiveCharacter) => {
          const success = rollSkillCheck(char, 'stealth', char.level + 3);
          if (success) {
            const item = generateProceduralItem(char.level, 'Legendary');
            return {
              logText: `[UNBELIEVABLE SUCCESS!] You hold your breath, slip past the smoking nostrils, and pull out Legendary [${item.name}]!`,
              itemReward: item,
              xpReward: 100,
              skillsLevelUp: ['stealth', 'scavenging']
            };
          } else {
            const damage = Math.round(char.maxHp * 0.45);
            return {
              logText: `[AMBUSHED] The Drake awakens with a roar! It blasts you point-blank with Magma breath, dealing ${damage} fire damage!`,
              hpChange: -damage,
              skillsLevelUp: ['stealth', 'defense']
            };
          }
        }
      },
      {
        text: 'Scavenge around the edge of the mound (Scavenging check)',
        resolve: (char: ActiveCharacter) => {
          const success = rollSkillCheck(char, 'scavenging', char.level);
          if (success) {
            const item = generateProceduralItem(char.level, 'Rare');
            const gold = 60;
            return {
              logText: `[Success] You find pristine battle leftovers at the edge. Recovered ${gold} Gold and ${item.rarity} [${item.name}].`,
              goldChange: gold,
              itemReward: item,
              skillsLevelUp: ['scavenging']
            };
          } else {
            return {
              logText: `[Failure] You kick a skull, creating a loud echo. The Drake snorts and burns your hand. Took 10 fire damage.`,
              hpChange: -10,
              skillsLevelUp: ['scavenging']
            };
          }
        }
      }
    ]
  }
];
export function generateRandomEvent(): RandomEvent {
  const ev = EVENTS[Math.floor(Math.random() * EVENTS.length)];
  // Create a deep copy to preserve original functions and items
  return { ...ev };
}
