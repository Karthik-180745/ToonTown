import React, { useState } from 'react';
import { CharacterId, LocationId, TimeOfDay, CartoonItem } from '../types';
import { CHARACTERS } from '../data/characters';
import { LOCATIONS } from '../data/locations';
import { CharacterAvatar } from './CharacterAvatar';
import { soundManager } from '../utils/audio';
import { Sparkles, Sun, Sunset, Moon, Coffee, Heart, Play, Music, Flame, Award } from 'lucide-react';

interface SimulationWorldProps {
  activeCharacter: CharacterId;
  currentLocation: LocationId;
  onChangeLocation: (loc: LocationId) => void;
  timeOfDay: TimeOfDay;
  onChangeTimeOfDay: (time: TimeOfDay) => void;
  hunger: number;
  fun: number;
  energy: number;
  onFeedSnack: (snackName: string, hungerBonus: number) => void;
  onPlayAction: (actionName: string, funBonus: number) => void;
  onRest: () => void;
  onUseItem: (item: CartoonItem) => void;
  onAwardStars: (count: number) => void;
  onStartMiniGame: (gameId?: string) => void;
}

export const SimulationWorld: React.FC<SimulationWorldProps> = ({
  activeCharacter,
  currentLocation,
  onChangeLocation,
  timeOfDay,
  onChangeTimeOfDay,
  hunger,
  fun,
  energy,
  onFeedSnack,
  onPlayAction,
  onRest,
  onUseItem,
  onAwardStars,
  onStartMiniGame,
}) => {
  const character = CHARACTERS[activeCharacter];
  const location = LOCATIONS[currentLocation];

  const [activeSpeech, setActiveSpeech] = useState<string>(
    `Hi! I'm ${character.name}! Click around the room or use my gadgets!`
  );
  const [characterAnimation, setCharacterAnimation] = useState<'idle' | 'dancing' | 'flying' | 'eating' | 'thinking'>('idle');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const timeAtmosphere = {
    morning: 'from-amber-100 via-sky-100 to-blue-50 text-slate-800',
    afternoon: 'from-sky-100 via-amber-50 to-emerald-50 text-slate-800',
    sunset: 'from-orange-200 via-rose-100 to-purple-100 text-slate-800',
    night: 'from-slate-900 via-indigo-950 to-blue-950 text-white',
  }[timeOfDay];

  const handleHotspotClick = (hotspot: typeof location.interactiveHotspots[0]) => {
    soundManager.playByName(hotspot.sfx);

    if (hotspot.rewardStars) {
      onAwardStars(hotspot.rewardStars);
    }

    if (hotspot.actionType === 'minigame') {
      onStartMiniGame();
      return;
    }

    if (hotspot.actionType === 'snack') {
      onFeedSnack(hotspot.title, 20);
      setCharacterAnimation('eating');
      setActiveSpeech(`Mmmm! ${hotspot.title} is delicious! My tummy is happy!`);
      showToast(`+${hotspot.rewardStars} Stars! Yummy Snack! 🥞`);
      setTimeout(() => setCharacterAnimation('idle'), 2200);
    } else if (hotspot.actionType === 'secret') {
      onPlayAction(hotspot.title, 25);
      setCharacterAnimation('flying');
      setActiveSpeech(`WOW! Look what happened at the ${hotspot.title}!`);
      showToast(`Secret Discovered! ⭐ +${hotspot.rewardStars} Stars!`);
      setTimeout(() => setCharacterAnimation('idle'), 2500);
    } else {
      onPlayAction(hotspot.title, 15);
      setCharacterAnimation('dancing');
      setActiveSpeech(`Wheee! Playing with the ${hotspot.title} is so fun!`);
      showToast(`Playing around! 🎪 +${hotspot.rewardStars} Stars!`);
      setTimeout(() => setCharacterAnimation('idle'), 2000);
    }

    soundManager.speakText(hotspot.description, activeCharacter);
  };

  const handleCharacterTap = () => {
    soundManager.playByName(character.signatureItems[0]?.sfx || 'boing');
    setCharacterAnimation('dancing');
    const quotes = [
      character.catchphrase,
      `I love hanging out with you in ${location.name}!`,
      activeCharacter === 'doraemon'
        ? "Don't worry Nobita! I mean, my friend! I have just the gadget!"
        : activeCharacter === 'shinchan'
        ? "Action Kamen is the greatest hero in the universe! Buri buri!"
        : "Baby Corp board approval is at an all-time high today, partner!",
    ];
    const picked = quotes[Math.floor(Math.random() * quotes.length)];
    setActiveSpeech(picked);
    soundManager.speakText(picked, activeCharacter);
    showToast(`Fun Boost! 🎉`);
    onPlayAction('Hero Hug & Joke', 10);
    setTimeout(() => setCharacterAnimation('idle'), 2000);
  };

  const locationsList = Object.values(LOCATIONS);

  return (
    <div className="space-y-4">
      {/* Location Navigation & Time Controls Bar */}
      <div className="bg-white rounded-3xl border-3 border-amber-200 p-3 sm:p-4 shadow-sm flex flex-wrap items-center justify-between gap-3">
        {/* Location selector pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 max-w-full no-scrollbar">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-1 hidden sm:inline">
            Places:
          </span>
          {locationsList.map((loc) => {
            const isActive = loc.id === currentLocation;
            const iconMap = {
              doraemon_room: '🚪',
              shinchan_home: '📺',
              baby_corp_hq: '💼',
              toon_park: '🎪',
              candy_cloud: '🌈',
            }[loc.id];

            return (
              <button
                key={loc.id}
                onClick={() => {
                  soundManager.playWhoosh();
                  onChangeLocation(loc.id);
                  showToast(`Traveled to ${loc.name}! 🚀`);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold text-xs whitespace-nowrap transition-all border-2 cursor-pointer ${
                  isActive
                    ? 'bg-amber-400 text-slate-900 border-amber-500 shadow-md scale-105'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200'
                }`}
              >
                <span>{iconMap}</span>
                <span>{loc.name.split("'")[0]}</span>
              </button>
            );
          })}
        </div>

        {/* Time of Day Switcher */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-full border border-slate-200">
          <button
            onClick={() => {
              soundManager.playPop();
              onChangeTimeOfDay('morning');
            }}
            className={`p-1.5 rounded-full transition-all ${
              timeOfDay === 'morning' ? 'bg-amber-300 text-amber-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
            title="Morning"
          >
            <Sun className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              soundManager.playPop();
              onChangeTimeOfDay('afternoon');
            }}
            className={`p-1.5 rounded-full transition-all ${
              timeOfDay === 'afternoon' ? 'bg-sky-300 text-sky-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
            title="Afternoon"
          >
            <Sparkles className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              soundManager.playPop();
              onChangeTimeOfDay('sunset');
            }}
            className={`p-1.5 rounded-full transition-all ${
              timeOfDay === 'sunset' ? 'bg-orange-300 text-orange-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
            title="Sunset"
          >
            <Sunset className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              soundManager.playPop();
              onChangeTimeOfDay('night');
            }}
            className={`p-1.5 rounded-full transition-all ${
              timeOfDay === 'night' ? 'bg-indigo-700 text-indigo-100 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
            title="Night Time"
          >
            <Moon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Interactive Cartoon Stage / Room */}
      <div
        className={`relative w-full rounded-3xl border-4 border-amber-300 shadow-xl overflow-hidden min-h-[460px] sm:min-h-[520px] bg-gradient-to-b ${timeAtmosphere} transition-colors duration-700 flex flex-col justify-between p-4 sm:p-6`}
      >
        {/* Floating Toast Notification */}
        {toastMessage && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 bg-slate-900/90 text-white font-bold text-xs sm:text-sm px-4 py-1.5 rounded-full shadow-lg border-2 border-amber-400 animate-bounce">
            {toastMessage}
          </div>
        )}

        {/* Top Room Banner / Header */}
        <div className="relative z-10 flex flex-wrap items-start justify-between gap-3">
          <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl border-2 border-amber-300 shadow-sm max-w-sm">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-1.5 leading-tight">
              <span>{location.name}</span>
            </h2>
            <p className="text-xs text-slate-600 font-medium">{location.tagline}</p>
          </div>

          {/* Character Vibe Status Bars */}
          <div className="bg-white/90 backdrop-blur-md px-3 py-2 rounded-2xl border-2 border-amber-200 shadow-sm flex items-center gap-3 text-xs font-bold text-slate-700">
            {/* Tummy */}
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-amber-800 font-semibold">🥞 Tummy</span>
              <div className="w-16 h-2.5 bg-slate-200 rounded-full overflow-hidden border border-slate-300 mt-0.5">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-rose-400 transition-all duration-300"
                  style={{ width: `${Math.min(100, Math.max(5, hunger))}%` }}
                />
              </div>
            </div>

            {/* Fun */}
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-rose-800 font-semibold">🎉 Fun</span>
              <div className="w-16 h-2.5 bg-slate-200 rounded-full overflow-hidden border border-slate-300 mt-0.5">
                <div
                  className="h-full bg-gradient-to-r from-rose-400 to-pink-500 transition-all duration-300"
                  style={{ width: `${Math.min(100, Math.max(5, fun))}%` }}
                />
              </div>
            </div>

            {/* Energy */}
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-sky-800 font-semibold">⚡ Energy</span>
              <div className="w-16 h-2.5 bg-slate-200 rounded-full overflow-hidden border border-slate-300 mt-0.5">
                <div
                  className="h-full bg-gradient-to-r from-sky-400 to-indigo-500 transition-all duration-300"
                  style={{ width: `${Math.min(100, Math.max(5, energy))}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Hotspots within the cartoon room */}
        <div className="relative flex-1 w-full my-4 min-h-[260px]">
          {/* Night Time Stars Background Decoration */}
          {timeOfDay === 'night' && (
            <div className="absolute inset-0 pointer-events-none">
              <span className="absolute top-4 left-10 text-yellow-200 text-xl animate-pulse">✨</span>
              <span className="absolute top-16 right-20 text-yellow-100 text-sm animate-ping">⭐</span>
              <span className="absolute top-8 left-1/2 text-yellow-200 text-base animate-pulse">✨</span>
              <span className="absolute top-24 left-1/4 text-yellow-300 text-lg">🌟</span>
            </div>
          )}

          {location.interactiveHotspots.map((hotspot) => (
            <button
              key={hotspot.id}
              onClick={() => handleHotspotClick(hotspot)}
              style={{
                left: `${hotspot.x}%`,
                top: `${hotspot.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
              className="absolute group z-20 focus:outline-hidden"
              title={`${hotspot.title}: ${hotspot.description}`}
            >
              {/* Pulsing ring indicator for kids to click */}
              <span className="absolute -inset-2 rounded-full bg-amber-400/40 animate-ping group-hover:bg-rose-400/50" />

              <div className="relative flex flex-col items-center">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/95 border-3 border-amber-400 group-hover:border-rose-500 group-hover:scale-115 group-active:scale-90 transition-all shadow-lg flex items-center justify-center text-2xl sm:text-3xl cursor-pointer">
                  {hotspot.icon}
                </div>

                <div className="mt-1 bg-slate-900/85 text-white font-bold text-[10px] sm:text-xs px-2 py-0.5 rounded-full whitespace-nowrap shadow opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all">
                  {hotspot.title}
                </div>
              </div>
            </button>
          ))}

          {/* Central Hero Character in the Room */}
          <div
            className="absolute left-1/2 bottom-4 -translate-x-1/2 z-20 flex flex-col items-center cursor-pointer group"
            onClick={handleCharacterTap}
          >
            {/* Speech Bubble */}
            <div className="relative mb-2 max-w-xs bg-white/95 border-3 border-amber-400 p-2.5 rounded-2xl shadow-lg text-xs sm:text-sm font-bold text-slate-800 text-center animate-fade-in group-hover:scale-105 transition-transform">
              <span>{activeSpeech}</span>
              {/* Bubble Triangle tail */}
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-r-3 border-b-3 border-amber-400 transform rotate-45" />
            </div>

            {/* The Animated Cartoon Avatar */}
            <div
              className={`transition-all duration-300 ${
                characterAnimation === 'dancing'
                  ? 'animate-bounce'
                  : characterAnimation === 'flying'
                  ? 'animate-pulse scale-110 -translate-y-4'
                  : characterAnimation === 'eating'
                  ? 'scale-105 rotate-3'
                  : 'hover:scale-105'
              }`}
            >
              <CharacterAvatar characterId={activeCharacter} size="xl" showBadge={true} />
            </div>

            {/* Click to interact hint */}
            <span className="mt-1 text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-full shadow-xs">
              Tap me to talk or dance! 💬
            </span>
          </div>
        </div>

        {/* Bottom Simulation Action Dock */}
        <div className="relative z-10 bg-white/90 backdrop-blur-md p-3 rounded-2xl border-2 border-amber-300 shadow-md space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>{character.name}'s Action & Gadget Bar</span>
            </span>

            {/* Quick Play & Nap Buttons */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => {
                  soundManager.playGiggle();
                  onPlayAction('Buri-Buri Funny Dance', 20);
                  setCharacterAnimation('dancing');
                  setActiveSpeech("Look at my goofy dance moves! WAHAHAHA!");
                  showToast('Laughter Boost! 🎉 +20 Fun');
                  setTimeout(() => setCharacterAnimation('idle'), 2000);
                }}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-100 hover:bg-rose-200 text-rose-800 border border-rose-300 text-xs font-bold transition-transform active:scale-95 cursor-pointer"
              >
                <Music className="w-3.5 h-3.5" />
                <span>Funny Dance</span>
              </button>

              <button
                onClick={() => {
                  soundManager.playPop();
                  onRest();
                  setCharacterAnimation('thinking');
                  setActiveSpeech("Zzz... Taking a quick 5-minute cartoon power nap! Energy restored!");
                  showToast('Naptime! ⚡ +30 Energy');
                  setTimeout(() => setCharacterAnimation('idle'), 2000);
                }}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-indigo-100 hover:bg-indigo-200 text-indigo-800 border border-indigo-300 text-xs font-bold transition-transform active:scale-95 cursor-pointer"
              >
                <Coffee className="w-3.5 h-3.5" />
                <span>Quick Nap</span>
              </button>
            </div>
          </div>

          {/* Signature Gadgets & Snacks Carousel */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {character.signatureItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  soundManager.playByName(item.sfx);
                  onUseItem(item);
                  if (item.category === 'snack') {
                    onFeedSnack(item.name, item.energyBonus || 25);
                    setCharacterAnimation('eating');
                  } else {
                    onPlayAction(item.name, item.funBonus || 25);
                    setCharacterAnimation('flying');
                  }
                  setActiveSpeech(`Used ${item.name}! ${item.description}`);
                  showToast(`Used ${item.name}! 🌟`);
                  setTimeout(() => setCharacterAnimation('idle'), 2000);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-xs font-bold text-slate-800 transition-all hover:scale-105 active:scale-95 shadow-xs whitespace-nowrap cursor-pointer"
              >
                <span className="text-base">{item.icon}</span>
                <span>{item.name}</span>
                <span className="text-[10px] text-amber-700 bg-amber-200/80 px-1 rounded">
                  {item.category}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
