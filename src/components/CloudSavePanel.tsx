/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ActiveCharacter, LegacyState, LegacyUpgrade } from '../types';
import { saveToCloud, loadFromCloud, checkSaveExists } from '../firebase';
import { Cloud, Check, Loader2, Sparkles, Key, Skull, Trophy, Settings } from 'lucide-react';

interface CloudSavePanelProps {
  character: ActiveCharacter | null;
  legacy: LegacyState;
  onLoadSave: (character: ActiveCharacter | null, legacy: LegacyState, saveId: string) => void;
  onUpdateLegacy: (legacy: LegacyState) => void;
}

export const LEGACY_UPGRADES: LegacyUpgrade[] = [
  {
    id: 'ancestral_vigor',
    name: 'Ancestral Vigor',
    description: 'Increases permanent starting Max Health by +10% per level.',
    cost: 5,
    purchased: false,
    maxPurchases: 5,
    currentCount: 0,
    effects: { maxHpPercent: 0.1 }
  },
  {
    id: 'golden_touch',
    name: 'Golden Touch',
    description: 'Earn +15% more gold from battles and random events.',
    cost: 8,
    purchased: false,
    maxPurchases: 5,
    currentCount: 0,
    effects: { goldMultiplier: 0.15 }
  },
  {
    id: 'scavenger_insight',
    name: 'Scavenger Instinct',
    description: 'Grants +3 levels of Scavenging skill at the start of a run.',
    cost: 10,
    purchased: false,
    maxPurchases: 3,
    currentCount: 0,
    effects: { scavengingBoost: 3 }
  },
  {
    id: 'lucky_strike',
    name: 'Lucky Strike',
    description: 'Permanent +3% Critical Strike Chance.',
    cost: 6,
    purchased: false,
    maxPurchases: 5,
    currentCount: 0,
    effects: { critChanceBoost: 3 }
  },
  {
    id: 'wisdom_overflow',
    name: 'Ancestral Wisdom',
    description: 'Gain +10% more Experience points from all sources.',
    cost: 12,
    purchased: false,
    maxPurchases: 5,
    currentCount: 0,
    effects: { expMultiplier: 0.1 }
  }
];

export default function CloudSavePanel({
  character,
  legacy,
  onLoadSave,
  onUpdateLegacy
}: CloudSavePanelProps) {
  const [saveIdInput, setSaveIdInput] = useState(
    localStorage.getItem('pixel_crawler_cloud_id') || ''
  );
  const [passcodeInput, setPasscodeInput] = useState(
    localStorage.getItem('pixel_crawler_passcode') || ''
  );
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'cloud' | 'legacy' | 'graveyard'>('cloud');
  const [currentCloudId, setCurrentCloudId] = useState<string | null>(
    localStorage.getItem('pixel_crawler_cloud_id')
  );

  const handleCloudSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!saveIdInput.trim() || !passcodeInput.trim()) {
      setStatus({ type: 'error', text: 'Enter both Save Code and Passcode!' });
      return;
    }
    setLoading(true);
    setStatus(null);
    try {
      await saveToCloud(saveIdInput, passcodeInput, character, legacy);
      localStorage.setItem('pixel_crawler_cloud_id', saveIdInput.trim().toLowerCase());
      localStorage.setItem('pixel_crawler_passcode', passcodeInput);
      setCurrentCloudId(saveIdInput.trim().toLowerCase());
      setStatus({ type: 'success', text: `Saved successfully! Your progress is backed up under code: "${saveIdInput.trim().toLowerCase()}"` });
    } catch (err: any) {
      setStatus({ type: 'error', text: err.message || 'Failed to save.' });
    } finally {
      setLoading(false);
    }
  };

  const handleCloudLoad = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!saveIdInput.trim() || !passcodeInput.trim()) {
      setStatus({ type: 'error', text: 'Enter both Save Code and Passcode!' });
      return;
    }
    setLoading(true);
    setStatus(null);
    try {
      const data = await loadFromCloud(saveIdInput, passcodeInput);
      if (data) {
        localStorage.setItem('pixel_crawler_cloud_id', saveIdInput.trim().toLowerCase());
        localStorage.setItem('pixel_crawler_passcode', passcodeInput);
        setCurrentCloudId(saveIdInput.trim().toLowerCase());
        onLoadSave(data.character, data.legacy, saveIdInput.trim().toLowerCase());
        setStatus({ type: 'success', text: 'Load successful! Cloud state restored.' });
      } else {
        setStatus({ type: 'error', text: 'No save file found with that Save Code. Try saving first!' });
      }
    } catch (err: any) {
      setStatus({ type: 'error', text: err.message || 'Incorrect passcode!' });
    } finally {
      setLoading(false);
    }
  };

  const handleQuickSync = async () => {
    const savedId = localStorage.getItem('pixel_crawler_cloud_id');
    const savedCode = localStorage.getItem('pixel_crawler_passcode');
    if (!savedId || !savedCode) {
      setStatus({ type: 'error', text: 'No local cloud credentials stored. Enter them manually below.' });
      return;
    }
    setLoading(true);
    setStatus(null);
    try {
      await saveToCloud(savedId, savedCode, character, legacy);
      setStatus({ type: 'success', text: `Synced! Saved progress to cloud code: "${savedId}"` });
    } catch (err: any) {
      setStatus({ type: 'error', text: err.message || 'Sync failed.' });
    } finally {
      setLoading(false);
    }
  };

  const purchaseUpgrade = (upgradeId: string) => {
    const upgrade = LEGACY_UPGRADES.find(u => u.id === upgradeId);
    if (!upgrade) return;

    const currentCount = legacy.unlockedUpgrades[upgradeId] || 0;
    if (currentCount >= upgrade.maxPurchases) return;

    const actualCost = upgrade.cost * (currentCount + 1); // Cost scales with level
    if (legacy.legacyPoints < actualCost) {
      setStatus({ type: 'error', text: 'Not enough Legacy Points! Crawl and die to earn more!' });
      return;
    }

    const updatedUpgrades = {
      ...legacy.unlockedUpgrades,
      [upgradeId]: currentCount + 1
    };

    const updatedLegacy: LegacyState = {
      ...legacy,
      legacyPoints: legacy.legacyPoints - actualCost,
      unlockedUpgrades: updatedUpgrades
    };

    onUpdateLegacy(updatedLegacy);
    setStatus({ type: 'success', text: `Purchased ${upgrade.name} Level ${currentCount + 1}!` });
  };

  return (
    <div id="cloud-save-container" className="retro-glass-panel-heavy rounded-xl p-5 shadow-2xl h-full flex flex-col">
      {/* Navigation Tabs */}
      <div className="flex border-b border-zinc-800 pb-3 gap-2 shrink-0">
        <button
          id="tab-cloud-btn"
          onClick={() => { setActiveTab('cloud'); setStatus(null); }}
          className={`flex-1 py-2 px-3 text-xs font-mono font-bold tracking-wider rounded-lg transition duration-200 flex items-center justify-center gap-1.5 ${
            activeTab === 'cloud'
              ? 'bg-red-500/20 text-red-400 border border-red-500/30'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-900/50'
          }`}
        >
          <Cloud className="w-3.5 h-3.5" />
          CLOUD SYNC
        </button>
        <button
          id="tab-legacy-btn"
          onClick={() => { setActiveTab('legacy'); setStatus(null); }}
          className={`flex-1 py-2 px-3 text-xs font-mono font-bold tracking-wider rounded-lg transition duration-200 flex items-center justify-center gap-1.5 ${
            activeTab === 'legacy'
              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-900/50'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          LEGACY PERKS ({legacy.legacyPoints} LP)
        </button>
        <button
          id="tab-graveyard-btn"
          onClick={() => { setActiveTab('graveyard'); setStatus(null); }}
          className={`flex-1 py-2 px-3 text-xs font-mono font-bold tracking-wider rounded-lg transition duration-200 flex items-center justify-center gap-1.5 ${
            activeTab === 'graveyard'
              ? 'bg-zinc-800 text-zinc-300 border border-zinc-700'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-900/50'
          }`}
        >
          <Skull className="w-3.5 h-3.5" />
          CEMETERY
        </button>
      </div>

      <div className="flex-1 overflow-y-auto mt-4 pr-1 min-h-[300px]">
        {/* Status Prompt */}
        {status && (
          <div
            id="status-prompt"
            className={`p-3 rounded-lg text-xs font-mono mb-4 border ${
              status.type === 'success'
                ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
                : 'bg-rose-950/40 border-rose-500/30 text-rose-300'
            }`}
          >
            {status.text}
          </div>
        )}

        {/* Tab Content 1: Cloud Sync */}
        {activeTab === 'cloud' && (
          <div className="space-y-4">
            <div className="bg-zinc-900/40 border border-zinc-850 p-4 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-zinc-400">Current Saved Code:</span>
                <span className="text-xs font-mono font-bold text-red-400">
                  {currentCloudId ? `"${currentCloudId.toUpperCase()}"` : 'Guest Mode (Local Only)'}
                </span>
              </div>
              {currentCloudId && (
                <div className="flex items-center justify-between text-[11px] font-mono border-t border-zinc-850 pt-2 pb-1">
                  <span className="text-zinc-500">Your Private Passcode:</span>
                  <span className="text-zinc-300 font-bold tracking-wider bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800">
                    {localStorage.getItem('pixel_crawler_passcode') || 'N/A'}
                  </span>
                </div>
              )}
              {currentCloudId && (
                <button
                  id="quick-cloud-sync-btn"
                  onClick={handleQuickSync}
                  disabled={loading}
                  className="w-full bg-red-600/90 hover:bg-red-500 text-white font-mono py-2 rounded-lg text-xs font-bold transition duration-200 flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Cloud className="w-3.5 h-3.5" />}
                  QUICK BACKUP ACTIVE STATE
                </button>
              )}
            </div>

            <form onSubmit={(e) => e.preventDefault()} className="space-y-3">
              <div className="space-y-1">
                <label className="block text-[10px] font-mono text-zinc-400 tracking-wider">SAVE CODE</label>
                <input
                  type="text"
                  placeholder="e.g. crawler_hero_99"
                  value={saveIdInput}
                  onChange={(e) => setSaveIdInput(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs font-mono text-white focus:outline-none focus:ring-1 focus:ring-red-500"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-mono text-zinc-400 tracking-wider">SECRET PASSCODE</label>
                <div className="relative">
                  <input
                    type="password"
                    placeholder="Enter private key"
                    value={passcodeInput}
                    onChange={(e) => setPasscodeInput(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 pl-8 text-xs font-mono text-white focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                  <Key className="w-3.5 h-3.5 absolute left-2.5 top-3 text-zinc-500" />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  id="backup-save-btn"
                  onClick={handleCloudSave}
                  disabled={loading}
                  className="flex-1 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-200 font-mono py-2 px-3 rounded-lg text-xs font-bold transition duration-200 flex items-center justify-center gap-1"
                >
                  {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Cloud className="w-3.5 h-3.5" />}
                  BACKUP STATE
                </button>
                <button
                  id="restore-load-btn"
                  onClick={handleCloudLoad}
                  disabled={loading}
                  className="flex-1 bg-red-600 hover:bg-red-500 text-white font-mono py-2 px-3 rounded-lg text-xs font-bold transition duration-200 flex items-center justify-center gap-1 shadow-lg shadow-red-950/50"
                >
                  {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                  RESTORE LOAD
                </button>
              </div>
            </form>

            <div className="text-[10px] text-zinc-500 font-mono text-center">
              * Enter any save code & passcode. If it is new, it registers a secure slot. If it is occupied, it requests the correct passcode to overwrite/retrieve.
            </div>
          </div>
        )}

        {/* Tab Content 2: Legacy Perks */}
        {activeTab === 'legacy' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-amber-950/20 border border-amber-900/30 p-3 rounded-xl">
              <div>
                <p className="text-[10px] font-mono text-amber-500 uppercase tracking-wider">AVAILABLE PERSISTENT POINTS</p>
                <h3 className="text-xl font-mono font-bold text-amber-400">{legacy.legacyPoints} LP</h3>
              </div>
              <Sparkles className="w-6 h-6 text-amber-400 animate-pulse" />
            </div>

            <p className="text-[10px] font-mono text-zinc-400 leading-relaxed">
              Upon permadeath, your dead adventurer&apos;s level and turns are turned into Legacy Points (LP). Spend them on permanent buffs that apply to all future characters!
            </p>

            <div className="space-y-2.5">
              {LEGACY_UPGRADES.map(upgrade => {
                const count = legacy.unlockedUpgrades[upgrade.id] || 0;
                const isMaxed = count >= upgrade.maxPurchases;
                const currentCost = upgrade.cost * (count + 1);

                return (
                  <div
                    key={upgrade.id}
                    className="bg-zinc-900 border border-zinc-800 p-3 rounded-xl flex items-center justify-between gap-3 transition hover:border-zinc-700"
                  >
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-zinc-100">{upgrade.name}</span>
                        <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-zinc-800 text-amber-400">
                          Lv {count}/{upgrade.maxPurchases}
                        </span>
                      </div>
                      <p className="text-[10px] font-mono text-zinc-400 leading-normal">{upgrade.description}</p>
                    </div>
                    <button
                      id={`upgrade-btn-${upgrade.id}`}
                      disabled={isMaxed || legacy.legacyPoints < currentCost}
                      onClick={() => purchaseUpgrade(upgrade.id)}
                      className={`font-mono text-[10px] font-bold py-1.5 px-3 rounded-lg transition duration-200 whitespace-nowrap ${
                        isMaxed
                          ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                          : legacy.legacyPoints >= currentCost
                          ? 'bg-amber-500 text-black hover:bg-amber-400 shadow-md shadow-amber-950/30'
                          : 'bg-zinc-800 text-zinc-400 border border-zinc-750'
                      }`}
                    >
                      {isMaxed ? 'MAX LEVEL' : `${currentCost} LP`}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab Content 3: Cemetery / Cemetery of Dead Heroes */}
        {activeTab === 'graveyard' && (
          <div className="space-y-4">
            <div className="flex gap-2">
              <div className="flex-1 bg-zinc-900 border border-zinc-850 p-3 rounded-lg text-center">
                <span className="text-[9px] font-mono text-zinc-400 tracking-wider">HIGHEST LEVEL</span>
                <p className="text-lg font-mono font-bold text-red-400">{legacy.highScores.maxLevel}</p>
              </div>
              <div className="flex-1 bg-zinc-900 border border-zinc-850 p-3 rounded-lg text-center">
                <span className="text-[9px] font-mono text-zinc-400 tracking-wider">LONGEST RUN (TURNS)</span>
                <p className="text-lg font-mono font-bold text-red-400">{legacy.highScores.maxTurns}</p>
              </div>
            </div>

            <h3 className="text-xs font-mono font-bold text-zinc-300 tracking-wider border-b border-zinc-800 pb-1.5 flex items-center gap-1.5">
              <Skull className="w-3.5 h-3.5 text-zinc-500" />
              RESTING SOULS ({legacy.highScores.deadHeroes.length})
            </h3>

            {legacy.highScores.deadHeroes.length === 0 ? (
              <div className="text-center py-8 bg-zinc-900/20 border border-zinc-900 rounded-lg">
                <Trophy className="w-8 h-8 text-zinc-700 mx-auto mb-2" />
                <p className="text-xs font-mono text-zinc-500">No brave adventurers have fallen yet.</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                {legacy.highScores.deadHeroes.map((hero, idx) => (
                  <div
                    key={idx}
                    className="bg-zinc-900/50 border border-zinc-850 p-3 rounded-lg flex items-center justify-between gap-3 font-mono"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-zinc-200">{hero.name}</span>
                        <span className="text-[10px] text-zinc-500">Level {hero.level}</span>
                      </div>
                      <p className="text-[10px] text-zinc-500">
                        Slain by <span className="text-red-400">{hero.slainBy}</span> after {hero.turns} turns
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-amber-500 font-bold">{hero.gold} gold</span>
                      <p className="text-[8px] text-zinc-600">{new Date(hero.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
