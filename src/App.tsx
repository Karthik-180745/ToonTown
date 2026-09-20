/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { CharacterId, LocationId, TimeOfDay, CartoonItem } from './types';
import { CHARACTERS } from './data/characters';
import { Header } from './components/Header';
import { SimulationWorld } from './components/SimulationWorld';
import { StoryRoleplay } from './components/StoryRoleplay';
import { MiniGamesModal } from './components/MiniGamesModal';
import { CharacterSelectModal } from './components/CharacterSelectModal';
import { BadgesModal } from './components/BadgesModal';
import { soundManager } from './utils/audio';
import { Sparkles, Gamepad2, BookOpen, Compass, Heart, Award, HelpCircle } from 'lucide-react';

export default function App() {
  const [activeCharacter, setActiveCharacter] = useState<CharacterId>('doraemon');
  const [activeTab, setActiveTab] = useState<'simulation' | 'story' | 'minigames'>('simulation');
  const [currentLocation, setCurrentLocation] = useState<LocationId>('doraemon_room');
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('morning');

  // Simulation Vitals
  const [hunger, setHunger] = useState<number>(85);
  const [fun, setFun] = useState<number>(90);
  const [energy, setEnergy] = useState<number>(80);
  const [stars, setStars] = useState<number>(25);
  const [coins, setCoins] = useState<number>(45);
  const [unlockedBadges, setUnlockedBadges] = useState<string[]>([
    'first_gadget',
    'dorayaki_feaster',
  ]);

  // Modals
  const [characterSelectOpen, setCharacterSelectOpen] = useState<boolean>(false);
  const [badgesOpen, setBadgesOpen] = useState<boolean>(false);
  const [miniGamesOpen, setMiniGamesOpen] = useState<boolean>(false);

  // Audio settings
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(true);

  // Synchronize audio settings
  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundManager.soundEnabled = next;
    if (next) soundManager.playPop();
  };

  const handleToggleVoice = () => {
    const next = !voiceEnabled;
    setVoiceEnabled(next);
    soundManager.voiceEnabled = next;
    if (next) {
      soundManager.speakText('Voice narrator is turned on! Hello cartoon adventurer!', 'narrator');
    } else {
      soundManager.stopSpeaking();
    }
  };

  // Actions
  const handleFeedSnack = (snackName: string, bonus: number) => {
    setHunger((h) => Math.min(100, h + bonus));
    setFun((f) => Math.min(100, f + 10));
    setCoins((c) => c + 2);
    if (snackName.toLowerCase().includes('dorayaki') && !unlockedBadges.includes('dorayaki_feaster')) {
      handleAwardBadge('dorayaki_feaster');
    }
    if (snackName.toLowerCase().includes('chocobi') && !unlockedBadges.includes('chocobi_cruncher')) {
      handleAwardBadge('chocobi_cruncher');
    }
  };

  const handlePlayAction = (actionName: string, bonus: number) => {
    setFun((f) => Math.min(100, f + bonus));
    setEnergy((e) => Math.max(10, e - 5));
    setCoins((c) => c + 3);
  };

  const handleRest = () => {
    setEnergy(100);
    setHunger((h) => Math.max(10, h - 15));
  };

  const handleUseItem = (item: CartoonItem) => {
    if (item.category === 'gadget' && !unlockedBadges.includes('first_gadget')) {
      handleAwardBadge('first_gadget');
    }
    if (item.id === 'action_kamen_mask' && !unlockedBadges.includes('mischief_master')) {
      handleAwardBadge('mischief_master');
    }
    if (item.id === 'executive_briefcase' && !unlockedBadges.includes('executive_deal')) {
      handleAwardBadge('executive_deal');
    }
  };

  const handleAwardStars = (count: number) => {
    setStars((s) => s + count);
  };

  const handleAwardCoins = (count: number) => {
    setCoins((c) => c + count);
  };

  const handleAwardBadge = (badgeId: string) => {
    if (!unlockedBadges.includes(badgeId)) {
      setUnlockedBadges((prev) => [...prev, badgeId]);
      soundManager.playFanfare();
      // speak congratulation
      soundManager.speakText(`Congratulations! You unlocked a new Cartoon Trophy!`, 'narrator');
    }
  };

  // When changing character, adapt home room if in default
  const handleSelectCharacter = (newChar: CharacterId) => {
    setActiveCharacter(newChar);
    if (newChar === 'doraemon') setCurrentLocation('doraemon_room');
    if (newChar === 'shinchan') setCurrentLocation('shinchan_home');
    if (newChar === 'boss_baby') setCurrentLocation('baby_corp_hq');

    // award super friend badge if player tried all three
    if (!unlockedBadges.includes('super_friend')) {
      handleAwardBadge('super_friend');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-amber-50/50 text-slate-800">
      {/* Top Navigation & Dashboard Header */}
      <Header
        activeCharacter={activeCharacter}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenCharacterSelect={() => setCharacterSelectOpen(true)}
        onOpenBadges={() => setBadgesOpen(true)}
        stars={stars}
        coins={coins}
        energy={energy}
        hunger={hunger}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        voiceEnabled={voiceEnabled}
        onToggleVoice={handleToggleVoice}
      />

      {/* Main Container Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6">
        {/* TAB 1: Simulation World */}
        {activeTab === 'simulation' && (
          <div className="animate-fade-in">
            <SimulationWorld
              activeCharacter={activeCharacter}
              currentLocation={currentLocation}
              onChangeLocation={setCurrentLocation}
              timeOfDay={timeOfDay}
              onChangeTimeOfDay={setTimeOfDay}
              hunger={hunger}
              fun={fun}
              energy={energy}
              onFeedSnack={handleFeedSnack}
              onPlayAction={handlePlayAction}
              onRest={handleRest}
              onUseItem={handleUseItem}
              onAwardStars={handleAwardStars}
              onStartMiniGame={() => setMiniGamesOpen(true)}
            />
          </div>
        )}

        {/* TAB 2: Story Roleplay Mode */}
        {activeTab === 'story' && (
          <div className="animate-fade-in">
            <StoryRoleplay
              activeCharacter={activeCharacter}
              onAwardStars={handleAwardStars}
              onAwardBadge={handleAwardBadge}
              onOpenCharacterSelect={() => setCharacterSelectOpen(true)}
            />
          </div>
        )}

        {/* TAB 3: Mini-Games Hub */}
        {activeTab === 'minigames' && (
          <div className="animate-fade-in space-y-4">
            <div className="bg-gradient-to-r from-amber-400 via-rose-400 to-sky-400 p-6 rounded-3xl text-white shadow-lg text-center space-y-2">
              <span className="text-4xl">🕹️ 🎪 ⭐</span>
              <h2 className="text-xl sm:text-2xl font-bold">ToonTown Arcade & Fun Park</h2>
              <p className="text-xs sm:text-sm text-white/90 max-w-md mx-auto">
                Play quick cartoon mini-games with Doraemon, Shinchan, and Boss Baby to earn coins, stars, and trophies!
              </p>
              <button
                onClick={() => {
                  soundManager.playFanfare();
                  setMiniGamesOpen(true);
                }}
                className="mt-2 px-6 py-2.5 rounded-full bg-slate-900 text-amber-300 font-bold text-sm shadow-md hover:bg-slate-800 transition-transform active:scale-95 cursor-pointer"
              >
                Launch Arcade Machine! 🚀
              </button>
            </div>

            {/* Feature Cards for each game */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div
                onClick={() => {
                  soundManager.playPop();
                  setMiniGamesOpen(true);
                }}
                className="p-4 bg-white rounded-3xl border-3 border-sky-300 shadow-sm hover:shadow-md cursor-pointer transition-all hover:scale-102 flex flex-col items-center text-center space-y-2"
              >
                <div className="w-16 h-16 rounded-2xl bg-sky-100 flex items-center justify-center text-3xl border-2 border-sky-200">
                  🥞
                </div>
                <h3 className="font-bold text-slate-800 text-sm sm:text-base">
                  Doraemon's Dorayaki Catcher
                </h3>
                <p className="text-xs text-slate-500">
                  Fly with Bamboo Copter and catch falling pancakes avoiding tricky mice!
                </p>
                <span className="text-xs font-bold text-sky-600 bg-sky-50 px-3 py-1 rounded-full border border-sky-200">
                  Play Game 🎮
                </span>
              </div>

              <div
                onClick={() => {
                  soundManager.playPop();
                  setMiniGamesOpen(true);
                }}
                className="p-4 bg-white rounded-3xl border-3 border-rose-300 shadow-sm hover:shadow-md cursor-pointer transition-all hover:scale-102 flex flex-col items-center text-center space-y-2"
              >
                <div className="w-16 h-16 rounded-2xl bg-rose-100 flex items-center justify-center text-3xl border-2 border-rose-200">
                  ⭐
                </div>
                <h3 className="font-bold text-slate-800 text-sm sm:text-base">
                  Shinchan's Action Dance
                </h3>
                <p className="text-xs text-slate-500">
                  Match the Action Kamen moves and snack on Chocobi stars to keep the combo alive!
                </p>
                <span className="text-xs font-bold text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
                  Play Game 🎮
                </span>
              </div>

              <div
                onClick={() => {
                  soundManager.playPop();
                  setMiniGamesOpen(true);
                }}
                className="p-4 bg-white rounded-3xl border-3 border-amber-300 shadow-sm hover:shadow-md cursor-pointer transition-all hover:scale-102 flex flex-col items-center text-center space-y-2"
              >
                <div className="w-16 h-16 rounded-2xl bg-amber-100 flex items-center justify-center text-3xl border-2 border-amber-200">
                  💼
                </div>
                <h3 className="font-bold text-slate-800 text-sm sm:text-base">
                  Boss Baby's Fast Sort
                </h3>
                <p className="text-xs text-slate-500">
                  Sort bottles, corporate files, and toys into executive bins before naptime!
                </p>
                <span className="text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                  Play Game 🎮
                </span>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Cheerful Kid-friendly Footer */}
      <footer className="mt-8 border-t-2 border-amber-200 bg-white py-4 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">🎪</span>
            <span className="font-bold text-slate-700">ToonTown Roleplay Simulator</span>
            <span>• Starring Doraemon, Shinchan & Boss Baby</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setCharacterSelectOpen(true)}
              className="text-amber-700 font-bold hover:underline"
            >
              Change Hero
            </button>
            <span>•</span>
            <button
              onClick={() => setBadgesOpen(true)}
              className="text-amber-700 font-bold hover:underline"
            >
              Trophies ({unlockedBadges.length}/7)
            </button>
            <span>•</span>
            <button
              onClick={() => {
                soundManager.playGiggle();
                soundManager.speakText("Buri buri! Keep laughing and enjoying ToonTown!", 'shinchan');
              }}
              className="text-rose-600 font-bold hover:underline"
            >
              Surprise Giggle! 💬
            </button>
          </div>
        </div>
      </footer>

      {/* Character Selector Modal */}
      <CharacterSelectModal
        isOpen={characterSelectOpen}
        onClose={() => setCharacterSelectOpen(false)}
        selectedCharacter={activeCharacter}
        onSelectCharacter={handleSelectCharacter}
      />

      {/* Badges Modal */}
      <BadgesModal
        isOpen={badgesOpen}
        onClose={() => setBadgesOpen(false)}
        unlockedBadgeIds={unlockedBadges}
      />

      {/* Mini-Games Modal */}
      <MiniGamesModal
        isOpen={miniGamesOpen}
        onClose={() => setMiniGamesOpen(false)}
        activeCharacter={activeCharacter}
        onAwardCoins={handleAwardCoins}
        onAwardStars={handleAwardStars}
      />
    </div>
  );
}
