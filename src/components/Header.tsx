import React from 'react';
import { CharacterId } from '../types';
import { CHARACTERS } from '../data/characters';
import { CharacterAvatar } from './CharacterAvatar';
import { Volume2, VolumeX, Mic, MicOff, Sparkles, Trophy, Gamepad2, BookOpen, Compass } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface HeaderProps {
  activeCharacter: CharacterId;
  activeTab: 'simulation' | 'story' | 'minigames';
  onSelectTab: (tab: 'simulation' | 'story' | 'minigames') => void;
  onOpenCharacterSelect: () => void;
  onOpenBadges: () => void;
  stars: number;
  coins: number;
  energy: number;
  hunger: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  voiceEnabled: boolean;
  onToggleVoice: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeCharacter,
  activeTab,
  onSelectTab,
  onOpenCharacterSelect,
  onOpenBadges,
  stars,
  coins,
  energy,
  hunger,
  soundEnabled,
  onToggleSound,
  voiceEnabled,
  onToggleVoice,
}) => {
  const currentHero = CHARACTERS[activeCharacter];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b-4 border-amber-300 shadow-md px-3 sm:px-6 py-2.5">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Logo & Character Switcher */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 via-pink-400 to-sky-400 flex items-center justify-center text-xl shadow-inner border-2 border-white transform -rotate-3">
              🎪
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-sky-600 via-rose-500 to-amber-500 bg-clip-text text-transparent leading-none tracking-tight">
                ToonTown
              </h1>
              <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                Cartoon Roleplay Simulator <Sparkles className="w-3 h-3 text-amber-400 fill-amber-400" />
              </span>
            </div>
          </div>

          {/* Current Hero Pill - Click to switch */}
          <button
            id="header-switch-character-btn"
            onClick={() => {
              soundManager.playPop();
              onOpenCharacterSelect();
            }}
            className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full bg-amber-50 hover:bg-amber-100 border-2 border-amber-300 transition-all shadow-sm hover:shadow hover:scale-105 active:scale-95 group"
            title="Click to switch your cartoon roleplay character!"
          >
            <CharacterAvatar characterId={activeCharacter} size="sm" showBadge={false} />
            <div className="text-left hidden xs:block">
              <div className="text-[10px] text-amber-700 font-bold uppercase tracking-wider leading-none">
                Playing As
              </div>
              <div className="text-xs font-bold text-slate-800 flex items-center gap-1">
                {currentHero.name}
                <span className="text-[10px] text-amber-600 group-hover:translate-x-0.5 transition-transform">🔄</span>
              </div>
            </div>
          </button>
        </div>

        {/* Navigation Tabs for Kids */}
        <nav className="flex items-center gap-1 sm:gap-2 order-3 sm:order-2 w-full sm:w-auto justify-center">
          <button
            id="nav-tab-simulation"
            onClick={() => {
              soundManager.playPop();
              onSelectTab('simulation');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold text-xs sm:text-sm transition-all border-2 ${
              activeTab === 'simulation'
                ? 'bg-sky-500 text-white border-sky-600 shadow-md scale-105'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-transparent'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Toon World</span>
          </button>

          <button
            id="nav-tab-story"
            onClick={() => {
              soundManager.playPop();
              onSelectTab('story');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold text-xs sm:text-sm transition-all border-2 ${
              activeTab === 'story'
                ? 'bg-rose-500 text-white border-rose-600 shadow-md scale-105'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-transparent'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Story Roleplay</span>
          </button>

          <button
            id="nav-tab-minigames"
            onClick={() => {
              soundManager.playPop();
              onSelectTab('minigames');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold text-xs sm:text-sm transition-all border-2 ${
              activeTab === 'minigames'
                ? 'bg-amber-500 text-white border-amber-600 shadow-md scale-105'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-transparent'
            }`}
          >
            <Gamepad2 className="w-4 h-4" />
            <span>Mini-Games</span>
          </button>
        </nav>

        {/* Stats & Audio Controls */}
        <div className="flex items-center gap-2 sm:gap-3 order-2 sm:order-3">
          {/* Stars & Coins */}
          <div className="flex items-center gap-1.5 bg-amber-50 border-2 border-amber-200 rounded-full px-2.5 py-1 text-xs font-bold text-slate-700 shadow-xs">
            <span className="flex items-center gap-0.5 text-amber-600" title="Friendship Stars">
              ⭐ {stars}
            </span>
            <span className="text-slate-300">|</span>
            <span className="flex items-center gap-0.5 text-yellow-600" title="Cartoon Coins">
              🪙 {coins}
            </span>
          </div>

          {/* Vitals quick indicator */}
          <div className="hidden lg:flex items-center gap-2 bg-slate-100 rounded-full px-2.5 py-1 text-xs font-bold text-slate-600">
            <span title="Energy">⚡ {energy}%</span>
            <span title="Tummy Snacks">🥞 {hunger}%</span>
          </div>

          {/* Badges Trophy */}
          <button
            id="header-badges-btn"
            onClick={() => {
              soundManager.playFanfare();
              onOpenBadges();
            }}
            className="p-1.5 sm:p-2 rounded-full bg-yellow-100 hover:bg-yellow-200 text-yellow-800 border-2 border-yellow-300 transition-transform active:scale-90"
            title="View Trophies & Cartoon Badges!"
          >
            <Trophy className="w-4 h-4" />
          </button>

          {/* Voice Narrator Read-Aloud Toggle */}
          <button
            id="header-voice-toggle-btn"
            onClick={() => {
              soundManager.playPop();
              onToggleVoice();
            }}
            className={`p-1.5 sm:p-2 rounded-full border-2 transition-all active:scale-90 ${
              voiceEnabled
                ? 'bg-rose-100 text-rose-700 border-rose-300'
                : 'bg-slate-100 text-slate-400 border-slate-300'
            }`}
            title={voiceEnabled ? 'Story Voice Read-Aloud: ON' : 'Story Voice Read-Aloud: OFF'}
          >
            {voiceEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
          </button>

          {/* Sound FX Toggle */}
          <button
            id="header-sound-toggle-btn"
            onClick={() => {
              onToggleSound();
            }}
            className={`p-1.5 sm:p-2 rounded-full border-2 transition-all active:scale-90 ${
              soundEnabled
                ? 'bg-sky-100 text-sky-700 border-sky-300'
                : 'bg-slate-100 text-slate-400 border-slate-300'
            }`}
            title={soundEnabled ? 'Cartoon Sound Effects: ON' : 'Cartoon Sound Effects: OFF'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
