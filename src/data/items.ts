/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Item, Rarity, ItemStats } from '../types';

export const RARITIES: Rarity[] = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'];

export const RARITY_THEMES: Record<Rarity, {
  text: string;
  border: string;
  bg: string;
  glow: string;
  label: string;
}> = {
  Common: {
    text: 'text-zinc-400',
    border: 'border-zinc-700',
    bg: 'bg-zinc-900/90',
    glow: 'shadow-zinc-950/40',
    label: 'COMMON'
  },
  Uncommon: {
    text: 'text-emerald-400',
    border: 'border-emerald-700',
    bg: 'bg-emerald-950/50',
    glow: 'shadow-emerald-900/40 ring-1 ring-emerald-950',
    label: 'UNCOMMON'
  },
  Rare: {
    text: 'text-cyan-400',
    border: 'border-cyan-600',
    bg: 'bg-cyan-950/50',
    glow: 'shadow-cyan-900/50 ring-1 ring-cyan-900',
    label: 'RARE'
  },
  Epic: {
    text: 'text-purple-400',
    border: 'border-purple-600',
    bg: 'bg-purple-950/50',
    glow: 'shadow-purple-900/60 ring-2 ring-purple-900 animate-pulse',
    label: 'EPIC'
  },
  Legendary: {
    text: 'text-amber-400',
    border: 'border-amber-500',
    bg: 'bg-amber-950/50',
    glow: 'shadow-amber-600/70 ring-2 ring-amber-500 animate-pulse',
    label: 'LEGENDARY'
  }
};

const BASES = {
  helmet: [
    { name: 'Leather Cap', icon: '🪖', desc: 'Basic leather protection' },
    { name: 'Iron Coif', icon: '🪖', desc: 'Sturdy chainmail hood' },
    { name: 'Steel Helm', icon: '🪖', desc: 'Plate headgear' },
    { name: 'Great Helmet', icon: '🪖', desc: 'Heavy protection for knights' },
    { name: 'Sages Hood', icon: '🧙', desc: 'Mana channeler hood' },
    { name: 'Crown of Torment', icon: '👑', desc: 'Glows with forgotten power' },
    { name: 'Assassins Mask', icon: '🥷', desc: 'Conceals identity and sharpens focus' },
    { name: 'Berserkers Band', icon: '🤠', desc: 'Slightly bloodstained headwrap' },
    { name: 'Feathered Tricorne', icon: '🎩', desc: 'Styled hat for agile duelists' },
    { name: 'Vanguard Visor', icon: '⛑️', desc: 'Reinforced heavy combat mask' },
    { name: 'Templars Crown', icon: '👑', desc: 'Blessed circlet emitting light' },
    // 15 New Helmets (Loot expansion)
    { name: 'Ranger Hood', icon: '🪖', desc: 'Camouflaged forest gear' },
    { name: 'Barbarian Horned Helmet', icon: '🪖', desc: 'Intimidating steel skullcap' },
    { name: 'Necromancers Cowl', icon: '🧙', desc: 'Smells of ancient graveyard dust' },
    { name: 'Solar Tiara', icon: '👑', desc: 'Shines with the power of noon' },
    { name: 'Deep Space Mask', icon: '🥷', desc: 'Enables safe breathing in nebulas' },
    { name: 'Eldritch Eye-Mask', icon: '👁️', desc: 'Provides premonition of blows' },
    { name: 'Dragon Horn Crown', icon: '👑', desc: 'Forged from the horns of a drake' },
    { name: 'Stardust Circlet', icon: '👑', desc: 'Bejeweled headpiece channeling starlight' },
    { name: 'Glacial Faceguard', icon: '⛑️', desc: 'Heavy frost protection visor' },
    { name: 'Arcane Mitre', icon: '🎩', desc: 'Tall hat worn by celestial wizards' },
    { name: 'Warlords Faceguard', icon: '⛑️', desc: 'Thick plate protecting the neck' },
    { name: 'Runic Visor', icon: '🪖', desc: 'Infused with ancient protection words' },
    { name: 'Shadow Cowl', icon: '🥷', desc: 'Absorbs light from surrounding tiles' },
    { name: 'Royal Headdress', icon: '👑', desc: 'Extremely expensive gold headwrap' },
    { name: 'Void Hood', icon: '🧙', desc: 'An endless abyss where a face should be' },
    // 10 Additional Helmets (Goal: 10 new types to every option)
    { name: 'Cybernetic Monocle', icon: '🧐', desc: 'A sci-fi lens displaying threat indicators' },
    { name: 'Abyssal Crown', icon: '👑', desc: 'Infused with dark gravity' },
    { name: 'Plague Doctor Mask', icon: '🎭', desc: 'Provides immunity to space spores' },
    { name: 'Ancient Kabuto', icon: '🪖', desc: 'Decorated steel helmet of a samurai' },
    { name: 'Stardust Greathelm', icon: '🪖', desc: 'Forged from cooled stellar crust' },
    { name: 'Prismatic Tiara', icon: '👑', desc: 'Refracts magic spells into light' },
    { name: 'Chrono Goggles', icon: '🥽', desc: 'Predicts target strikes 1 second ahead' },
    { name: 'Wraith Mask', icon: '🎭', desc: 'Turns the wearer into a shadowy entity' },
    { name: 'Glacial Horns', icon: '🪖', desc: 'Horns of eternal ice that never melt' },
    { name: 'Nova Crown', icon: '👑', desc: 'Worn by the rulers of the sun' }
  ],
  chestplate: [
    { name: 'Ragged Tunic', icon: '👕', desc: 'Provides basic decency' },
    { name: 'Leather Jerkin', icon: '👕', desc: 'Flexible hide protection' },
    { name: 'Chainmail Hauberk', icon: '🛡️', desc: 'Linked metal rings' },
    { name: 'Steel Breastplate', icon: '🥋', desc: 'Heavy solid steel sheet' },
    { name: 'Robe of Embers', icon: '👘', desc: 'Warm woven arcane fibers' },
    { name: 'Dragon-Scale Plate', icon: '🧛', desc: 'Crafted from dragon hide' },
    { name: 'Shadow Cloak', icon: '🧥', desc: 'Woven with dark fibers that absorb sound' },
    { name: 'Plate of the Titan', icon: '🛡️', desc: 'Massive double-layered steel plate' },
    { name: 'Runesmith Smock', icon: '🎽', desc: 'Engraved with ancient defensive wards' },
    { name: 'Necromancers Shroud', icon: '👘', desc: 'Cold to the touch, carrying death energy' },
    { name: 'Phoenix Vestment', icon: '🥋', desc: 'Fiery fabric that warms the user' },
    // 15 New Chestplates
    { name: 'Studded Leather Vest', icon: '👕', desc: 'Leather reinforced with iron studs' },
    { name: 'Warlord Plate', icon: '🛡️', desc: 'Dented but incredibly thick steel' },
    { name: 'Celestial Robes', icon: '👘', desc: 'Woven from real space nebulas' },
    { name: 'Obsidian Shell', icon: '🥋', desc: 'Carved from deep subterranean glass' },
    { name: 'Elven Leaf Armor', icon: '👕', desc: 'Lightweight leaf mail that moves naturally' },
    { name: 'Void Silk Cloak', icon: '🧥', desc: 'Siphons surrounding magic attacks' },
    { name: 'Gilded Cuirass', icon: '🛡️', desc: 'Gold plated breastplate of high nobility' },
    { name: 'Frostborn Tunic', icon: '👕', desc: 'Cold to the touch, ignores flame burns' },
    { name: 'Lich King Shroud', icon: '👘', desc: 'Pulsates with bone chilling death magic' },
    { name: 'Aetherial Plate', icon: '🛡️', desc: 'Ghostly armor that exists halfway in another dimension' },
    { name: 'Vampire Lord Cape', icon: '🧥', desc: 'Velvet cape soaked in ancient blood' },
    { name: 'Titanium Carapace', icon: '🥋', desc: 'Sci-fi metal chestguard' },
    { name: 'Ranger Coat', icon: '🧥', desc: 'Comes with many pockets for tools' },
    { name: 'Spiked Breastplate', icon: '🥋', desc: 'Hurts enemies who attempt to hug or tackle' },
    { name: 'Plague Guard Robes', icon: '👘', desc: 'Thick treated leather impervious to toxins' },
    // 10 Additional Chestplates
    { name: 'Graphene Nano-Suit', icon: '🥋', desc: 'Ultra-light carbon protection' },
    { name: 'Rune Hauberk', icon: '🛡️', desc: 'Infused with arcane deflection' },
    { name: 'Dreadlord Plate', icon: '🛡️', desc: 'Thick black steel spiked armor' },
    { name: 'Stardust Robes', icon: '👘', desc: 'Silky robes woven with stellar gas' },
    { name: 'Samurai Do Armor', icon: '🥋', desc: 'Lacquered plates tied with silk' },
    { name: 'Pegasus Feathers Coat', icon: '🧥', desc: 'Increases evasion and agility' },
    { name: 'Molten Core Shell', icon: '🥋', desc: 'Emanates a searing shield' },
    { name: 'Aether-Mesh Vest', icon: '👕', desc: 'Woven with high-energy matrix' },
    { name: 'Lich Lords Cape', icon: '🧥', desc: 'Provides a chilling unholy aura' },
    { name: 'Astral Plate', icon: '🛡️', desc: 'Reflects the starry void' }
  ],
  boots: [
    { name: 'Worn Sandals', icon: '🥾', desc: 'Barely holding together' },
    { name: 'Leather Boots', icon: '🥾', desc: 'Fitted for heavy travel' },
    { name: 'Iron Sabatons', icon: '🥾', desc: 'Heavy metal footsteps' },
    { name: 'Swift Greaves', icon: '👟', desc: 'Feather-light movement boots' },
    { name: 'Arcane Slippers', icon: '👞', desc: 'Slightly levitating slippers' },
    { name: 'Shadow Treads', icon: '👟', desc: 'Makes footsteps perfectly silent' },
    { name: 'Pegasus Wingtips', icon: '👟', desc: 'Enchanted shoes that feel weightless' },
    { name: 'Spiked Sabatons', icon: '🥾', desc: 'Steel-toed boots for extra leverage' },
    { name: 'Glacier Walkers', icon: '🥾', desc: 'Frost-insulated sturdy boots' },
    { name: 'Plague Ward Soles', icon: '👞', desc: 'Reinforced soles protecting from hazards' },
    // 15 New Boots
    { name: 'Hardwood Clogs', icon: '🥾', desc: 'Noisy but surprisingly tough' },
    { name: 'Slayer Greaves', icon: '🥾', desc: 'Heavy steel protectors designed for kicking' },
    { name: 'Hermes Winged Sandals', icon: '👟', desc: 'Enables quick double-steps' },
    { name: 'Obsidian Boots', icon: '🥾', desc: 'Can walk on volcanic molten rock' },
    { name: 'Stardust Treads', icon: '👟', desc: 'Leaves a trail of glowing particles' },
    { name: 'Elven Boots', icon: '👟', desc: 'Made from silent moss fibers' },
    { name: 'Void-Warped Sabatons', icon: '🥾', desc: 'Blinks slightly ahead during sprints' },
    { name: 'Celestial Soles', icon: '👞', desc: 'Never touch dirt; floats 1 millimeter high' },
    { name: 'Plated Greaves of Might', icon: '🥾', desc: 'Greatly increases footing stability' },
    { name: 'Thunder Walkers', icon: '🥾', desc: 'Stomps produce a faint thunder crack' },
    { name: 'Glacial Slippers', icon: '👞', desc: 'Slides quickly over icy platforms' },
    { name: 'Titanium Greaves', icon: '🥾', desc: 'Unbelievably heavy but indestructible' },
    { name: 'Bone Sabatons', icon: '🥾', desc: 'Assembled from fossilized dragon ribs' },
    { name: 'Gilded Slippers', icon: '👞', desc: 'Extremely shiny and distracting' },
    { name: 'Phantoms Treads', icon: '👟', desc: 'No physical weight, walks on water or dust' },
    // 10 Additional Boots
    { name: 'Magnetic Soles', icon: '🥾', desc: 'Clings to meteorite surfaces easily' },
    { name: 'Star-Strider Greaves', icon: '🥾', desc: 'Designed for running on light-waves' },
    { name: 'Stealth Ninja Tabi', icon: '👟', desc: 'Lightweight split-toe silent boots' },
    { name: 'Molten Greaves', icon: '🥾', desc: 'Leaves scorched footsteps' },
    { name: 'Runic Sabatons', icon: '🥾', desc: 'Sabatons that glow with speed wards' },
    { name: 'Witchs Slippers', icon: '👞', desc: 'Infused with dark flight magic' },
    { name: 'Archangels Greaves', icon: '🥾', desc: 'Floats gracefully over terrain' },
    { name: 'Temporal Soles', icon: '👟', desc: 'Increases action speed significantly' },
    { name: 'Vampiric Sabatons', icon: '🥾', desc: 'Absorbs the blood of crushed enemies' },
    { name: 'Quasar Sneakers', icon: '👟', desc: 'High-tech footwear pulsing with energy' }
  ],
  weapon: [
    { name: 'Wooden Club', icon: '🪵', desc: 'Better than punching' },
    { name: 'Rusty Dagger', icon: '🗡️', desc: 'Short and corroded' },
    { name: 'Shortsword', icon: '⚔️', desc: 'Standard issue backup' },
    { name: 'Broadsword', icon: '⚔️', desc: 'Heavy double-edged blade' },
    { name: 'Runic Staff', icon: '🪄', desc: 'Focuses internal spellcraft' },
    { name: 'Executioner Greatsword', icon: '🗡️', desc: 'Gigantic cleaving sword' },
    { name: 'Scepter of Light', icon: '🔱', desc: 'Gleams with spiritual energy' },
    { name: 'Void Spellblade', icon: '⚔️', desc: 'A crystalline sword pulsing with dark energy' },
    { name: 'Assassins Kris', icon: '🔪', desc: 'Wavy dagger designed for vital strikes' },
    { name: 'War Hammer', icon: '🔨', desc: 'Heavy blunt instrument that crushes skulls' },
    { name: 'Elven Bow', icon: '🏹', desc: 'Perfectly balanced composite longbow' },
    { name: 'Hellfire Halberd', icon: '🪓', desc: 'Polearm infused with eternal embers' },
    // 15 New Weapons
    { name: 'Heavy Mace', icon: '🪵', desc: 'Crushes through basic shields' },
    { name: 'Poison Dirk', icon: '🗡️', desc: 'Coated in star-adder venom' },
    { name: 'Silver Bastard Sword', icon: '⚔️', desc: 'Effective against unholy monstrosities' },
    { name: 'Star-Shatter Hammer', icon: '🔨', desc: 'A sledgehammer carrying stellar kinetic mass' },
    { name: 'Elder Oak Wand', icon: '🪄', desc: 'Ancient wood that stores spells' },
    { name: 'Executioners Battleaxe', icon: '🪓', desc: 'Double-bitted massive decapitation tool' },
    { name: 'Sunfire Claymore', icon: '⚔️', desc: 'Blades edges glow white-hot' },
    { name: 'Dark-Matter Scythe', icon: '🗡️', desc: 'Cleaves through spatial fabric' },
    { name: 'Radiant Spellblade', icon: '⚔️', desc: 'Combines raw swordsmanship with laser force' },
    { name: 'Phoenix composite Bow', icon: '🏹', desc: 'Fires flaming arrows of pure light' },
    { name: 'Void-Warp Halberd', icon: '🪓', desc: 'Warp-strike from 3 meters away' },
    { name: 'Archmages Staff', icon: '🪄', desc: 'Topped with a pulsing singularity core' },
    { name: 'Gilded Rapier', icon: '⚔️', desc: 'Elegant and incredibly fast' },
    { name: 'Obsidian Great-club', icon: '🪵', desc: 'Heavier than lead, deals massive blunt stun' },
    { name: 'Demonic Spellblade', icon: '🗡️', desc: 'Thirsts for the blood of its bearer and foes alike' },
    // 10 Additional Weapons
    { name: 'Cosmic Katana', icon: '⚔️', desc: 'Sharp enough to slice spacetime' },
    { name: 'Plasma Cutlass', icon: '🗡️', desc: 'Deals searing plasma damage' },
    { name: 'Stardust Rapier', icon: '⚔️', desc: 'A fencing sword tipped with stardust' },
    { name: 'Quasar Staff', icon: '🪄', desc: 'Generates mini-black holes' },
    { name: 'Mjolnir-Type Hammer', icon: '🔨', desc: 'Crackles with celestial lightning' },
    { name: 'Void Scythe', icon: '🗡️', desc: 'Reaps the lifeforce of enemies' },
    { name: 'Luminous Spear', icon: '🔱', desc: 'Blessed spear radiating holy energy' },
    { name: 'Eldritch Wand', icon: '🪄', desc: 'Made from the bone of a space leviathan' },
    { name: 'Demonic Cleaver', icon: '🪓', desc: 'A massive bloody cleaver' },
    { name: 'Gravity Mace', icon: '🪵', desc: 'Increases kinetic weight on hit' }
  ],
  offhand: [
    { name: 'Wooden Buckler', icon: '🛡️', desc: 'Small wooden shield' },
    { name: 'Kite Shield', icon: '🛡️', desc: 'Metal defensive plating' },
    { name: 'Ancient Tome', icon: '📖', desc: 'Spell focus with unreadable script' },
    { name: 'Parrying Dagger', icon: '🔪', desc: 'Offhand defense and offense' },
    { name: 'Tower Shield', icon: '🧱', desc: 'An absolute wall of steel' },
    { name: 'Oracles Orb', icon: '🔮', desc: 'Pulsates with premonition visions' },
    { name: 'Mirror Shield', icon: '🛡️', desc: 'Highly polished surface reflecting rays' },
    { name: 'Demonic Skull', icon: '💀', desc: 'Chattering fossil channeling curses' },
    { name: 'Aegis Defender', icon: '🛡️', desc: 'Glows with a permanent runic barrier' },
    // 15 New Offhands
    { name: 'Round Iron Shield', icon: '🛡️', desc: 'Reliable warrior protection' },
    { name: 'Titan Aegis Shield', icon: '🧱', desc: 'Blocks high velocity asteroids' },
    { name: 'Grimoire of Whispers', icon: '📖', desc: 'Tome that speaks secret spells to the user' },
    { name: 'Ornate Catalyst book', icon: '📖', desc: 'Increases spell casting speed' },
    { name: 'Star Navigators Compass', icon: '🧭', desc: 'Tracks spatial distortions' },
    { name: 'Glowing Skull of Lich', icon: '💀', desc: 'Whispers dark, protective wards' },
    { name: 'Radiant Shield', icon: '🛡️', desc: 'Blinds attackers with holy glow' },
    { name: 'Eldritch Lantern', icon: '🏮', desc: 'Shows invisible dimensional traps' },
    { name: 'Shadow Buckler', icon: '🛡️', desc: 'Absorbs arrows and projectiles into darkness' },
    { name: 'Crystal Orb of Fate', icon: '🔮', desc: 'Predicts incoming damage with 80% accuracy' },
    { name: 'Dragon Scale Buckler', icon: '🛡️', desc: 'Absorbs fire damage easily' },
    { name: 'Catalyst Prism', icon: '🔮', desc: 'Splits raw mana into multiple elemental shards' },
    { name: 'Force Shield Generator', icon: '🛡️', desc: 'Sci-fi energy barrier shield' },
    { name: 'Obsidian Ward Shield', icon: '🛡️', desc: 'Hardened volcanic guard' },
    { name: 'Aetherial Aegis', icon: '🛡️', desc: 'Floats on your side, hands-free protection' },
    // 10 Additional Offhands
    { name: 'Quasar Prism Catalyst', icon: '🔮', desc: 'Focuses and amplifies spell damage' },
    { name: 'Egis of the Sun', icon: '🛡️', desc: 'Shines with the heat of a dwarf star' },
    { name: 'Necrotic Grimoire', icon: '📖', desc: 'Written in the blood of dead stars' },
    { name: 'Chrono-Shield Generator', icon: '🛡️', desc: 'Slows down incoming projectiles' },
    { name: 'Dragon Core Orb', icon: '🔮', desc: 'Pulsates with draconic flame' },
    { name: 'Spiked Iron Buckler', icon: '🛡️', desc: 'Provides counter-attack damage' },
    { name: 'Void Lantern', icon: '🏮', desc: 'Illuminates hidden path anomalies' },
    { name: 'Mirror Shield of Stars', icon: '🛡️', desc: 'Reflects laser and energy attacks' },
    { name: 'Sages Celestial Scroll', icon: '📖', desc: 'Contains cosmic wisdom of old' },
    { name: 'Magnetic Barrier Field', icon: '🛡️', desc: 'Deploys a strong physical shield' }
  ],
  ring: [
    { name: 'Copper Ring', icon: '💍', desc: 'Green skin stain guarantee' },
    { name: 'Silver Signet', icon: '💍', desc: 'Noble family mark' },
    { name: 'Gold Band', icon: '💍', desc: 'Heavily polished ring' },
    { name: 'Onyx Ring', icon: '💍', desc: 'Black gem that devours light' },
    { name: 'Ruby Ring', icon: '💍', desc: 'Warm to the touch' },
    { name: 'Sapphire Loop', icon: '💍', desc: 'Calming ocean blue gem' },
    { name: 'Emerald Band', icon: '💍', desc: 'Brimming with vital life energy' },
    { name: 'Chrono Ring', icon: '💍', desc: 'Tiny gears spin around the band' },
    { name: 'Dragon-Eye Ring', icon: '💍', desc: 'Slit pupil watches you closely' },
    { name: 'Abyssal Ring', icon: '💍', desc: 'Whispers dark ideas into your consciousness' },
    // 15 New Rings
    { name: 'Garnet Signet', icon: '💍', desc: 'Increases basic life health' },
    { name: 'Amethyst Loop', icon: '💍', desc: 'Chock-full of magical capacity' },
    { name: 'Topaz Band', icon: '💍', desc: 'Absorbs electrical discharges' },
    { name: 'Stardust Loop', icon: '💍', desc: 'Carved from a meteor core' },
    { name: 'Void Signet', icon: '💍', desc: 'Warped loop that makes fingers tickle' },
    { name: 'Plague Cure Band', icon: '💍', desc: 'Increases immunity to decay' },
    { name: 'Diamond Signet', icon: '💍', desc: 'Incredibly hard, shines bright' },
    { name: 'Opal loop of Luck', icon: '💍', desc: 'Constantly shifts color hues' },
    { name: 'Lich Lords band', icon: '💍', desc: 'Smells of decay but boosts critical spells' },
    { name: 'Solar Ring', icon: '💍', desc: 'Always warm, shines in deep caves' },
    { name: 'Nebula Loop', icon: '💍', desc: 'Woven space gas hardened into crystal' },
    { name: 'Obsidian Ring', icon: '💍', desc: 'Protects from fire damage' },
    { name: 'Titanium Loop', icon: '💍', desc: 'Incredibly durable modern band' },
    { name: 'Angels Ring', icon: '💍', desc: 'Floats slightly above your finger' },
    { name: 'Cursed Demon Sigil', icon: '💍', desc: 'Guarantees critical hits but drains HP' },
    // 10 Additional Rings
    { name: 'Nova Star Ring', icon: '💍', desc: 'Infused with the heat of a supernova' },
    { name: 'Vampiric Loop', icon: '💍', desc: 'Siphons life on critical strike' },
    { name: 'Stardust Signet', icon: '💍', desc: 'Attracts celestial stardust' },
    { name: 'Gravity Ring', icon: '💍', desc: 'Reduces the physical weight of gear' },
    { name: 'Chrono Loop of Haste', icon: '💍', desc: 'Provides slight turn acceleration' },
    { name: 'Prismatic Band', icon: '💍', desc: 'Increases all core attributes' },
    { name: 'Cursed Star Sigil', icon: '💍', desc: 'Increases attack power at HP cost' },
    { name: 'Archangels Promise', icon: '💍', desc: 'Provides a second wind when low HP' },
    { name: 'Glacial Loop', icon: '💍', desc: 'Slightly freezes enemies on hit' },
    { name: 'Eldritch Eye Ring', icon: '💍', desc: 'Watches the battle and increases luck' }
  ]
};

const PREFIXES = [
  { text: 'Dull', multi: 0.8 },
  { text: 'Worn', multi: 0.9 },
  { text: 'Heavy', multi: 1.1, stats: { strength: 2, defense: 2 } },
  { text: 'Sharp', multi: 1.2, stats: { agility: 1, critChance: 4 } },
  { text: 'Shining', multi: 1.3, stats: { intellect: 2, luck: 2 } },
  { text: 'Ancient', multi: 1.4, stats: { defense: 4, maxHp: 15 } },
  { text: 'Runic', multi: 1.5, stats: { intellect: 4, arcaneBonus: 2 } },
  { text: 'Cursed', multi: 1.7, stats: { strength: 8, intellect: 8, maxHp: -20 } },
  { text: 'Blessed', multi: 1.6, stats: { maxHp: 25, defense: 6, luck: 4 } },
  { text: 'Mythical', multi: 2.0, stats: { strength: 6, intellect: 6, agility: 6, maxHp: 30 } },
  { text: 'Prismatic', multi: 1.8, stats: { intellect: 5, luck: 5, critChance: 5 } },
  { text: 'Vampiric', multi: 1.5, stats: { strength: 4, agility: 4, meleeBonus: 3 } },
  { text: 'Grounded', multi: 1.3, stats: { defense: 8, maxHp: 20 } },
  { text: 'Temporal', multi: 1.6, stats: { agility: 6, luck: 3 } },
  { text: 'Flaming', multi: 1.4, stats: { strength: 5, meleeBonus: 4 } },
  { text: 'Frozen', multi: 1.4, stats: { defense: 5, intellect: 4 } },
  { text: 'Whispering', multi: 1.5, stats: { intellect: 6, critChance: 3 } },
  { text: 'Titanium', multi: 1.7, stats: { defense: 10, maxHp: 35 } },
  { text: 'Astral', multi: 2.1, stats: { strength: 8, intellect: 8, luck: 8 } },
  // 15 New Prefixes
  { text: 'Celestial', multi: 2.2, stats: { intellect: 10, luck: 5 } },
  { text: 'Solar', multi: 1.9, stats: { strength: 7, defense: 5, maxHp: 15 } },
  { text: 'Quantum', multi: 2.0, stats: { agility: 8, critChance: 6 } },
  { text: 'Corrupted', multi: 1.8, stats: { strength: 12, maxHp: -15 } },
  { text: 'Angelic', multi: 1.9, stats: { defense: 8, maxHp: 40 } },
  { text: 'Obsidian', multi: 1.7, stats: { defense: 12, strength: 3 } },
  { text: 'Stellar', multi: 2.1, stats: { luck: 10, critChance: 4 } },
  { text: 'Vexing', multi: 1.4, stats: { intellect: 7, maxHp: -5 } },
  { text: 'Glacial', multi: 1.6, stats: { defense: 10, intellect: 3 } },
  { text: 'Eldritch', multi: 2.3, stats: { intellect: 12, luck: 4 } },
  { text: 'Gilded', multi: 1.5, stats: { luck: 12 } },
  { text: 'Volcanic', multi: 1.6, stats: { strength: 8, maxHp: 10 } },
  { text: 'Lethal', multi: 1.8, stats: { strength: 6, critChance: 10 } },
  { text: 'Ghostly', multi: 1.5, stats: { agility: 7, luck: 3 } },
  { text: 'Chaotic', multi: 2.0, stats: { strength: 10, intellect: 10, maxHp: -10 } },
  // 10 Additional Prefixes
  { text: 'Magnetic', multi: 1.4, stats: { luck: 6, defense: 4 } },
  { text: 'Quasar', multi: 2.3, stats: { intellect: 14, agility: 8 } },
  { text: 'Spiked', multi: 1.3, stats: { strength: 6, meleeBonus: 6 } },
  { text: 'Necrotic', multi: 1.7, stats: { intellect: 10, maxHp: -10 } },
  { text: 'Chrono', multi: 1.8, stats: { agility: 10, luck: 5 } },
  { text: 'Unbreakable', multi: 2.0, stats: { defense: 15, maxHp: 50 } },
  { text: 'Prism', multi: 1.9, stats: { strength: 6, intellect: 6, agility: 6, defense: 6 } },
  { text: 'Luminous', multi: 1.6, stats: { intellect: 8, luck: 8 } },
  { text: 'Feral', multi: 1.5, stats: { strength: 8, agility: 6 } },
  { text: 'Void-Touched', multi: 2.2, stats: { strength: 14, intellect: 14, maxHp: -25 } }
];

const SUFFIXES = [
  { text: 'of the Boar', stats: { strength: 3, maxHp: 10 } },
  { text: 'of the Falcon', stats: { agility: 3, critChance: 3 } },
  { text: 'of the Phoenix', stats: { intellect: 4, arcaneBonus: 1 } },
  { text: 'of the Turtle', stats: { defense: 5, maxHp: 15 } },
  { text: 'of the Eclipse', stats: { intellect: 3, agility: 3 } },
  { text: 'of Abundance', stats: { luck: 5 } },
  { text: 'of the Vanguard', stats: { strength: 4, defense: 3 } },
  { text: 'of Carnage', stats: { strength: 5, critChance: 5 } },
  { text: 'of the Dragon', stats: { strength: 6, maxHp: 20, defense: 4 } },
  { text: 'of the Kraken', stats: { strength: 5, defense: 6, maxHp: 15 } },
  { text: 'of the Reaper', stats: { strength: 4, critChance: 8 } },
  { text: 'of the Stars', stats: { intellect: 6, luck: 6 } },
  { text: 'of the Shadows', stats: { agility: 6, critChance: 4 } },
  { text: 'of the Titan', stats: { defense: 8, maxHp: 30 } },
  { text: 'of Judgement', stats: { strength: 5, intellect: 5 } },
  { text: 'of Eternity', stats: { maxHp: 40, defense: 5 } },
  { text: 'of the Sphinx', stats: { intellect: 8, defense: 2 } },
  // 15 New Suffixes
  { text: 'of the Void', stats: { intellect: 6, maxHp: -10 } },
  { text: 'of Doom', stats: { strength: 7, critChance: 5 } },
  { text: 'of the Cosmos', stats: { strength: 4, intellect: 4, agility: 4 } },
  { text: 'of Storms', stats: { agility: 6, luck: 4 } },
  { text: 'of the Angel', stats: { defense: 6, maxHp: 25 } },
  { text: 'of Blood', stats: { strength: 5, meleeBonus: 5 } },
  { text: 'of Whispers', stats: { intellect: 7, critChance: 3 } },
  { text: 'of Gilded Fortune', stats: { luck: 8 } },
  { text: 'of Runic Might', stats: { intellect: 5, defense: 5 } },
  { text: 'of the Abyss', stats: { strength: 8, intellect: 8, maxHp: -20 } },
  { text: 'of Time', stats: { agility: 8 } },
  { text: 'of Retribution', stats: { defense: 4, strength: 4, defenseBonus: 3 } },
  { text: 'of Sovereign Rule', stats: { maxHp: 30, defense: 6 } },
  { text: 'of the Sun', stats: { strength: 6, intellect: 6 } },
  { text: 'of the Moon', stats: { intellect: 6, agility: 6 } },
  // 10 Additional Suffixes
  { text: 'of the Phoenix Reborn', stats: { maxHp: 50, intellect: 5 } },
  { text: 'of Galactic Fury', stats: { strength: 10, critChance: 8 } },
  { text: 'of the Silent Rogue', stats: { agility: 10, critChance: 6 } },
  { text: 'of Eternal Ice', stats: { defense: 10, intellect: 5 } },
  { text: 'of the Solar Flare', stats: { strength: 8, meleeBonus: 8 } },
  { text: 'of the Deep Rift', stats: { intellect: 12, maxHp: -15 } },
  { text: 'of Infinite Luck', stats: { luck: 15 } },
  { text: 'of the Golem Core', stats: { defense: 12, maxHp: 30 } },
  { text: 'of the Star-Weaver', stats: { intellect: 10, luck: 8 } },
  { text: 'of the Void King', stats: { strength: 12, intellect: 12, maxHp: -30 } }
];

/**
 * Procedurally generates an item based on player level and custom weights
 */
export function generateProceduralItem(level: number, forceRarity?: Rarity): Item {
  const id = 'item_' + Math.random().toString(36).substring(2, 9);
  
  // Rarity rolls
  let rarity: Rarity = 'Common';
  if (forceRarity) {
    rarity = forceRarity;
  } else {
    const roll = Math.random() * 100;
    if (roll < 1) rarity = 'Legendary';
    else if (roll < 5) rarity = 'Epic';
    else if (roll < 15) rarity = 'Rare';
    else if (roll < 40) rarity = 'Uncommon';
  }
  
  const types: Array<keyof typeof BASES> = ['helmet', 'chestplate', 'boots', 'weapon', 'offhand', 'ring'];
  const type = types[Math.floor(Math.random() * types.length)];
  
  const typeBases = BASES[type];
  const base = typeBases[Math.floor(Math.random() * typeBases.length)];
  
  // Decide prefix and suffix (higher rarity -> higher chance of prefixes/suffixes)
  let prefix = null;
  let suffix = null;
  
  if (rarity === 'Uncommon' && Math.random() > 0.4) {
    prefix = PREFIXES[Math.floor(Math.random() * PREFIXES.length)];
  } else if (rarity === 'Rare') {
    if (Math.random() > 0.3) prefix = PREFIXES[Math.floor(Math.random() * PREFIXES.length)];
    if (Math.random() > 0.5) suffix = SUFFIXES[Math.floor(Math.random() * SUFFIXES.length)];
  } else if (rarity === 'Epic' || rarity === 'Legendary') {
    prefix = PREFIXES[Math.floor(Math.random() * PREFIXES.length)];
    suffix = SUFFIXES[Math.floor(Math.random() * SUFFIXES.length)];
  }
  
  // Name building
  let name = base.name;
  if (prefix) name = `${prefix.text} ${name}`;
  if (suffix) name = `${name} ${suffix.text}`;
  
  // Base stats generator based on level and rarity
  const rarityMultiplier: Record<Rarity, number> = {
    Common: 1.0,
    Uncommon: 1.3,
    Rare: 1.8,
    Epic: 2.5,
    Legendary: 4.0
  };
  
  const mult = rarityMultiplier[rarity] * (1 + (level - 1) * 0.1);
  const stats: ItemStats = {};
  
  // Populate base stats for equipment types
  if (type === 'weapon') {
    stats.strength = Math.round((2 + Math.random() * 3) * mult);
    if (Math.random() > 0.5) stats.critChance = Math.round((2 + Math.random() * 4) * mult);
    stats.meleeBonus = Math.round((1 + Math.random() * 2) * mult);
  } else if (type === 'offhand') {
    stats.defense = Math.round((3 + Math.random() * 4) * mult);
    stats.maxHp = Math.round((10 + Math.random() * 15) * mult);
    stats.defenseBonus = Math.round((1 + Math.random() * 2) * mult);
  } else if (type === 'helmet') {
    stats.defense = Math.round((2 + Math.random() * 2) * mult);
    stats.intellect = Math.round((1 + Math.random() * 3) * mult);
    stats.maxHp = Math.round((5 + Math.random() * 10) * mult);
  } else if (type === 'chestplate') {
    stats.defense = Math.round((4 + Math.random() * 5) * mult);
    stats.maxHp = Math.round((15 + Math.random() * 25) * mult);
  } else if (type === 'boots') {
    stats.agility = Math.round((2 + Math.random() * 3) * mult);
    stats.defense = Math.round((1 + Math.random() * 2) * mult);
  } else if (type === 'ring') {
    stats.luck = Math.round((2 + Math.random() * 4) * mult);
    stats.intellect = Math.round((1 + Math.random() * 3) * mult);
    stats.critChance = Math.round((2 + Math.random() * 3) * mult);
  }
  
  // Merge prefix stats
  if (prefix && prefix.stats) {
    Object.entries(prefix.stats).forEach(([stat, val]) => {
      const k = stat as keyof ItemStats;
      stats[k] = Math.round(((stats[k] || 0) + (val as number)) * (prefix?.multi || 1.0));
    });
  }
  
  // Merge suffix stats
  if (suffix && suffix.stats) {
    Object.entries(suffix.stats).forEach(([stat, val]) => {
      const k = stat as keyof ItemStats;
      stats[k] = Math.round((stats[k] || 0) + (val as number));
    });
  }
  
  // Clean up stats (no negatives unless cursed, remove zeroes)
  Object.keys(stats).forEach(key => {
    const k = key as keyof ItemStats;
    if (stats[k] === 0) delete stats[k];
  });
  
  // Gold value calculation
  const goldValue = Math.round(15 * mult * (prefix ? 1.5 : 1) * (suffix ? 1.5 : 1));
  const theme = RARITY_THEMES[rarity];
  
  return {
    id,
    name,
    type,
    rarity,
    stats,
    goldValue,
    icon: base.icon,
    color: theme.text,
    bgGlow: theme.bg,
    description: base.desc
  };
}

/**
 * Generates a health potion
 */
export function generatePotion(level: number): Item {
  const id = 'potion_' + Math.random().toString(36).substring(2, 9);
  const types = [
    { name: 'Minor HP Potion', heal: 30, val: 10, icon: '🧪', color: 'text-rose-400' },
    { name: 'Average HP Potion', heal: 75, val: 25, icon: '🧪', color: 'text-rose-500' },
    { name: 'Major HP Potion', heal: 150, val: 60, icon: '🧪', color: 'text-rose-600' },
    { name: 'Elixir of Life', heal: 400, val: 150, icon: '🏺', color: 'text-fuchsia-400' }
  ];
  
  let pIndex = 0;
  if (level > 25) pIndex = 3;
  else if (level > 12) pIndex = 2;
  else if (level > 5) pIndex = 1;
  
  const template = types[pIndex];
  const theme = RARITY_THEMES['Common'];
  
  return {
    id,
    name: template.name,
    type: 'potion',
    rarity: 'Common',
    stats: {},
    goldValue: template.val,
    icon: template.icon,
    color: template.color,
    bgGlow: theme.bg,
    description: `Restores ${template.heal} Health Points immediately on use.`,
    healingAmount: template.heal
  };
}
