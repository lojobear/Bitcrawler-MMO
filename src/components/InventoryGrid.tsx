/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Item, ActiveCharacter } from '../types';
import { Trash2, AlertTriangle, ShieldCheck, Sparkles, Coins, RefreshCw } from 'lucide-react';
import { RARITY_THEMES } from '../data/items';

interface InventoryGridProps {
  character: ActiveCharacter;
  onEquipItem: (item: Item) => void;
  onScrapItem: (itemId: string) => void;
  onUsePotion: (item: Item) => void;
  onGenerateSprite: (itemId: string, name: string, description: string) => Promise<{ success: boolean; imageUrl?: string; error?: string }>;
}

export default function InventoryGrid({
  character,
  onEquipItem,
  onScrapItem,
  onUsePotion,
  onGenerateSprite
}: InventoryGridProps) {
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const maxCapacity = 24;

  const handleItemClick = (item: Item) => {
    setSelectedItem(selectedItem?.id === item.id ? null : item);
    setGenerationError(null);
  };

  // Build a fixed 24-slot grid (filling empty slots with null)
  const gridSlots: Array<Item | null> = [...character.inventory];
  while (gridSlots.length < maxCapacity) {
    gridSlots.push(null);
  }

  const isFull = character.inventory.length >= maxCapacity;

  return (
    <div id="inventory-pane" className="retro-glass-panel-heavy rounded-2xl p-5 shadow-2xl h-full flex flex-col font-mono select-none">
      
      {/* Inventory capacity progress */}
      <div className="flex justify-between items-center border-b border-zinc-850 pb-3 mb-4 shrink-0">
        <div>
          <h3 className="text-xs font-bold text-zinc-100 flex items-center gap-1.5 uppercase tracking-wider">
            🎒 ADVENTURE STORAGE
          </h3>
          <p className="text-[9px] text-zinc-500 uppercase tracking-widest mt-0.5">Procedural Pixel Loot Grid</p>
        </div>
        <div className="text-right">
          <span className={`text-xs font-bold px-2 py-1 rounded-md ${
            isFull ? 'bg-red-500/10 border border-red-500/30 text-red-400' : 'bg-zinc-900 border border-zinc-800 text-zinc-400'
          }`}>
            {character.inventory.length} / {maxCapacity} slots
          </span>
        </div>
      </div>

      {isFull && (
        <div className="bg-rose-950/20 border border-rose-900/40 p-2.5 rounded-lg text-[9px] text-rose-300 flex items-center gap-1.5 mb-4 shrink-0 animate-pulse">
          <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
          <span>INVENTORY FULL! You cannot obtain any new step loot. Equip or scrap items!</span>
        </div>
      )}

      {/* Grid structure */}
      <div className="flex-1 overflow-y-auto pr-1">
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2.5">
          {gridSlots.map((item, idx) => {
            if (!item) {
              return (
                <div
                  key={`empty-${idx}`}
                  className="aspect-square rounded-lg bg-zinc-900/30 border border-zinc-900 flex items-center justify-center text-xs text-zinc-800 pointer-events-none"
                >
                  ·
                </div>
              );
            }

            const theme = RARITY_THEMES[item.rarity];
            const isSelected = selectedItem?.id === item.id;

            return (
              <div key={item.id} className="relative aspect-square">
                <button
                  id={`inv-item-${item.id}`}
                  onClick={() => handleItemClick(item)}
                  className={`w-full h-full rounded-lg ${theme.bg} border ${isSelected ? 'border-red-500 ring-1 ring-red-500' : theme.border} ${theme.glow} flex items-center justify-center overflow-hidden text-xl transition hover:scale-105 active:scale-95 cursor-pointer relative`}
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

                  {/* Loading indicator for rare AI loot waiting for its sprite */}
                  {!item.imageUrl && item.isAiGenerated && ['Rare', 'Epic', 'Legendary'].includes(item.rarity) && (
                    <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                      <RefreshCw className="w-3.5 h-3.5 text-rose-500 animate-spin" />
                    </div>
                  )}
                </button>

                {/* Micro notification tag for potions */}
                {item.type === 'potion' && (
                  <div className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-rose-500" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Item Detail Sheet (When an item is selected) */}
      {selectedItem && (() => {
        const theme = RARITY_THEMES[selectedItem.rarity];
        return (
          <div
            id="item-details-popup"
            className="mt-4 p-4 rounded-xl bg-zinc-900/55 border border-zinc-850 space-y-3 shrink-0 relative animate-in fade-in slide-in-from-bottom-2 duration-200"
          >
            {/* Close detail window */}
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute right-3 top-3 text-zinc-500 hover:text-white text-xs cursor-pointer font-bold"
            >
              ✕
            </button>

            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-lg ${theme.bg} border ${theme.border} ${theme.glow} flex items-center justify-center overflow-hidden text-2xl shrink-0 relative`}>
                {selectedItem.imageUrl ? (
                  <img
                    src={selectedItem.imageUrl}
                    alt={selectedItem.name}
                    className="w-full h-full object-cover pixelated"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  selectedItem.icon
                )}

                {/* Details view loading indicator */}
                {!selectedItem.imageUrl && selectedItem.isAiGenerated && ['Rare', 'Epic', 'Legendary'].includes(selectedItem.rarity) && (
                  <div className="absolute inset-0 bg-black/75 flex items-center justify-center">
                    <RefreshCw className="w-4 h-4 text-rose-500 animate-spin" />
                  </div>
                )}
              </div>
              <div>
                <h4 className={`text-xs font-bold ${theme.text}`}>{selectedItem.name}</h4>
                <p className="text-[9px] font-bold text-zinc-400 tracking-wide uppercase flex items-center gap-1">
                  <span>{selectedItem.rarity}</span>
                  <span>•</span>
                  <span>{selectedItem.type.replace('chestplate', 'Armor').replace('offhand', 'Shield/Offhand')}</span>
                </p>
              </div>
            </div>

            <p className="text-[10px] text-zinc-400 italic leading-relaxed">&quot;{selectedItem.description}&quot;</p>

            {/* Stat Modifiers Display */}
            {selectedItem.type !== 'potion' && Object.keys(selectedItem.stats).length > 0 && (
              <div className="bg-zinc-950 p-2 rounded-lg border border-zinc-900 space-y-1 text-[9px]">
                <p className="text-zinc-500 font-bold uppercase tracking-wider mb-1">EQUIPMENT STAT BONUSES</p>
                {Object.entries(selectedItem.stats).map(([stat, val]) => (
                  <div key={stat} className="flex justify-between text-zinc-300">
                    <span className="capitalize">{stat.replace('Bonus', ' bonus').replace('maxHp', 'health')}</span>
                    <span className="text-emerald-400 font-bold">+{val}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Forge Pixel Art Button (Manual) */}
            {selectedItem.type !== 'potion' && !selectedItem.imageUrl && (
              <div className="bg-zinc-950/60 p-2.5 rounded-lg border border-zinc-850/60 space-y-2">
                <div className="flex justify-between items-center text-[9px]">
                  <span className="text-zinc-400 font-bold uppercase tracking-wider">🌟 PIXEL ART CUSTOMIZER</span>
                  <span className="text-amber-500 font-bold flex items-center gap-0.5"><Sparkles className="w-2.5 h-2.5 animate-pulse" /> Gemini AI</span>
                </div>
                <button
                  onClick={async () => {
                    if (isGenerating) return;
                    setIsGenerating(true);
                    setGenerationError(null);
                    const res = await onGenerateSprite(selectedItem.id, selectedItem.name, selectedItem.description);
                    setIsGenerating(false);
                    if (res.success && res.imageUrl) {
                      setSelectedItem({ ...selectedItem, imageUrl: res.imageUrl });
                    } else {
                      setGenerationError(res.error || "Mage energy low. Try again later!");
                    }
                  }}
                  disabled={isGenerating}
                  className={`w-full py-2 px-3 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1.5 transition ${
                    isGenerating
                      ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-950/55 cursor-pointer'
                  }`}
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
                  {isGenerating ? "FORGING PIXEL ART..." : "FORGE AI PIXEL ART"}
                </button>
                {generationError && (
                  <p className="text-[8px] text-red-400 leading-snug text-center font-bold">
                    ⚠️ {generationError}
                  </p>
                )}
              </div>
            )}

            {/* Use / Equip Buttons */}
            <div className="flex gap-2 text-[10px]">
              {selectedItem.type === 'potion' ? (
                <button
                  id="potion-use-btn"
                  onClick={() => {
                    onUsePotion(selectedItem);
                    setSelectedItem(null);
                  }}
                  className="flex-1 bg-rose-600 hover:bg-rose-500 text-white font-bold py-2 rounded-lg transition duration-200 flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  DRINK POTION
                </button>
              ) : (
                <button
                  id="item-equip-btn"
                  onClick={() => {
                    onEquipItem(selectedItem);
                    setSelectedItem(null);
                  }}
                  className="flex-1 bg-red-600 hover:bg-red-500 text-white font-bold py-2 rounded-lg transition duration-200 flex items-center justify-center gap-1.5 shadow-md shadow-red-950/40"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  EQUIP GEAR
                </button>
              )}

              <button
                id="item-scrap-btn"
                onClick={() => {
                  onScrapItem(selectedItem.id);
                  setSelectedItem(null);
                }}
                className="bg-zinc-800 border border-zinc-750 hover:bg-zinc-700 hover:border-zinc-650 text-zinc-300 font-bold px-3 rounded-lg transition duration-200 flex items-center justify-center gap-1.5"
                title="Sell item for Gold"
              >
                <Coins className="w-3.5 h-3.5 text-amber-500" />
                SCRAP ({selectedItem.goldValue}G)
              </button>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
