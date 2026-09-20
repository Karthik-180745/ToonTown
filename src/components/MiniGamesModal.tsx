import React, { useState, useEffect } from 'react';
import { CharacterId } from '../types';
import { CHARACTERS } from '../data/characters';
import { soundManager } from '../utils/audio';
import { X, Play, RotateCcw, Award, ArrowLeft, ArrowRight, Sparkles, Check } from 'lucide-react';

interface MiniGamesModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeCharacter: CharacterId;
  onAwardCoins: (count: number) => void;
  onAwardStars: (count: number) => void;
}

export const MiniGamesModal: React.FC<MiniGamesModalProps> = ({
  isOpen,
  onClose,
  activeCharacter,
  onAwardCoins,
  onAwardStars,
}) => {
  const [selectedGame, setSelectedGame] = useState<'catcher' | 'dance' | 'sort'>('catcher');

  // Game 1: Catcher state
  const [catcherScore, setCatcherScore] = useState<number>(0);
  const [catcherPos, setCatcherPos] = useState<number>(50); // 10 to 90%
  const [fallingItems, setFallingItems] = useState<{ id: number; icon: string; x: number; y: number; type: 'dorayaki' | 'gadget' | 'mouse' }[]>([]);
  const [isCatcherActive, setIsCatcherActive] = useState<boolean>(false);
  const [catcherGameOver, setCatcherGameOver] = useState<boolean>(false);

  // Game 2: Dance state
  const [danceScore, setDanceScore] = useState<number>(0);
  const [dancePrompt, setDancePrompt] = useState<'beam' | 'chocobi' | 'wiggle'>('beam');
  const [danceCombo, setDanceCombo] = useState<number>(0);
  const [isDancing, setIsDancing] = useState<boolean>(false);

  // Game 3: Sort state
  const [sortScore, setSortScore] = useState<number>(0);
  const [currentItemToSort, setCurrentItemToSort] = useState<{ name: string; icon: string; target: 'milk' | 'file' | 'toy' }>({
    name: 'Baby Bottle',
    icon: '🍼',
    target: 'milk',
  });
  const [isSortActive, setIsSortActive] = useState<boolean>(false);

  // Catcher Game Loop
  useEffect(() => {
    if (!isOpen || !isCatcherActive || selectedGame !== 'catcher') return;

    const interval = setInterval(() => {
      // Spawn new item
      if (Math.random() < 0.4) {
        const itemType = Math.random() < 0.2 ? 'mouse' : Math.random() < 0.6 ? 'dorayaki' : 'gadget';
        const icons = {
          dorayaki: '🥞',
          gadget: '🚁',
          mouse: '🐭',
        };
        setFallingItems((prev) => [
          ...prev,
          {
            id: Date.now() + Math.random(),
            icon: icons[itemType],
            x: Math.floor(Math.random() * 80) + 10,
            y: 0,
            type: itemType,
          },
        ]);
      }

      // Move items down
      setFallingItems((prev) => {
        const next: typeof prev = [];
        for (const it of prev) {
          const newY = it.y + 7;
          // Check collision with catcher at bottom (y ~ 80 to 95)
          if (newY >= 80 && newY <= 95 && Math.abs(it.x - catcherPos) < 15) {
            if (it.type === 'dorayaki') {
              soundManager.playSnackBite();
              setCatcherScore((s) => s + 10);
            } else if (it.type === 'gadget') {
              soundManager.playGadgetChime();
              setCatcherScore((s) => s + 15);
            } else {
              soundManager.playBoing();
              setCatcherScore((s) => Math.max(0, s - 5));
            }
          } else if (newY < 100) {
            next.push({ ...it, y: newY });
          }
        }
        return next;
      });
    }, 120);

    return () => clearInterval(interval);
  }, [isCatcherActive, selectedGame, catcherPos]);

  const startCatcherGame = () => {
    soundManager.playFanfare();
    setCatcherScore(0);
    setFallingItems([]);
    setIsCatcherActive(true);
    setCatcherGameOver(false);

    // Stop after 25 seconds
    setTimeout(() => {
      setIsCatcherActive(false);
      setCatcherGameOver(true);
      soundManager.playFanfare();
      onAwardCoins(15);
      onAwardStars(5);
    }, 25000);
  };

  // Dance Game actions
  const startDanceGame = () => {
    soundManager.playActionKamenBeam();
    setDanceScore(0);
    setDanceCombo(0);
    setIsDancing(true);
    pickNextDancePrompt();
  };

  const pickNextDancePrompt = () => {
    const prompts: ('beam' | 'chocobi' | 'wiggle')[] = ['beam', 'chocobi', 'wiggle'];
    const next = prompts[Math.floor(Math.random() * prompts.length)];
    setDancePrompt(next);
  };

  const handleDanceAction = (action: 'beam' | 'chocobi' | 'wiggle') => {
    if (action === dancePrompt) {
      if (action === 'beam') soundManager.playActionKamenBeam();
      if (action === 'chocobi') soundManager.playSnackBite();
      if (action === 'wiggle') soundManager.playGiggle();

      setDanceScore((s) => s + 10 + danceCombo * 2);
      setDanceCombo((c) => c + 1);
      pickNextDancePrompt();
      onAwardCoins(2);
    } else {
      soundManager.playBoing();
      setDanceCombo(0);
    }
  };

  // Sort Game items
  const sortPool: { name: string; icon: string; target: 'milk' | 'file' | 'toy' }[] = [
    { name: 'Super Formula', icon: '🍼', target: 'milk' },
    { name: 'Warm Bottle', icon: '🍼', target: 'milk' },
    { name: 'Playground Strategy', icon: '📁', target: 'file' },
    { name: 'Naptime Schedule', icon: '📄', target: 'file' },
    { name: 'Teddy Bear', icon: '🧸', target: 'toy' },
    { name: 'Action Dinosaur', icon: '🦖', target: 'toy' },
    { name: 'Baby Corp Briefcase', icon: '💼', target: 'file' },
  ];

  const handleSortChoice = (target: 'milk' | 'file' | 'toy') => {
    if (target === currentItemToSort.target) {
      soundManager.playExecutiveStamp();
      setSortScore((s) => s + 10);
      onAwardCoins(3);
    } else {
      soundManager.playBoing();
    }
    // pick next
    const next = sortPool[Math.floor(Math.random() * sortPool.length)];
    setCurrentItemToSort(next);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl border-4 border-amber-300 shadow-2xl overflow-hidden max-h-[94vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-400 via-rose-400 to-sky-400 p-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🕹️</span>
            <div>
              <h2 className="text-lg sm:text-xl font-bold leading-tight">ToonTown Arcade Mini-Games</h2>
              <p className="text-xs text-white/90">Play fun cartoon games to earn coins and stars!</p>
            </div>
          </div>
          <button
            onClick={() => {
              soundManager.playPop();
              onClose();
            }}
            className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-transform active:scale-90"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Game Selector Tabs */}
        <div className="p-3 bg-slate-100 border-b border-slate-200 flex gap-2 justify-center flex-wrap">
          <button
            onClick={() => {
              soundManager.playPop();
              setSelectedGame('catcher');
            }}
            className={`px-3 py-1.5 rounded-full font-bold text-xs sm:text-sm transition-all border-2 ${
              selectedGame === 'catcher'
                ? 'bg-sky-500 text-white border-sky-600 shadow-sm scale-105'
                : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200'
            }`}
          >
            🥞 Doraemon's Dorayaki Catch
          </button>

          <button
            onClick={() => {
              soundManager.playPop();
              setSelectedGame('dance');
            }}
            className={`px-3 py-1.5 rounded-full font-bold text-xs sm:text-sm transition-all border-2 ${
              selectedGame === 'dance'
                ? 'bg-rose-500 text-white border-rose-600 shadow-sm scale-105'
                : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200'
            }`}
          >
            ⭐ Shinchan's Action Dance
          </button>

          <button
            onClick={() => {
              soundManager.playPop();
              setSelectedGame('sort');
            }}
            className={`px-3 py-1.5 rounded-full font-bold text-xs sm:text-sm transition-all border-2 ${
              selectedGame === 'sort'
                ? 'bg-amber-500 text-white border-amber-600 shadow-sm scale-105'
                : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200'
            }`}
          >
            💼 Boss Baby's Fast Sort
          </button>
        </div>

        {/* Game Arena */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 flex flex-col justify-center items-center">
          {/* GAME 1: CATCHER */}
          {selectedGame === 'catcher' && (
            <div className="w-full max-w-lg space-y-3 text-center">
              <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-700 bg-sky-50 p-2.5 rounded-2xl border border-sky-200">
                <span>Catch: 🥞 (+10) 🚁 (+15) Avoid: 🐭 (-5)</span>
                <span className="text-sky-700 text-base">Score: {catcherScore}</span>
              </div>

              {/* Catching canvas simulation box */}
              <div className="relative w-full h-64 bg-gradient-to-b from-sky-100 to-sky-200 rounded-3xl border-3 border-sky-300 overflow-hidden shadow-inner">
                {!isCatcherActive ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/40 text-white p-4 space-y-2 backdrop-blur-xs">
                    <span className="text-4xl">🚁 🥞</span>
                    <h4 className="text-base sm:text-lg font-bold">
                      {catcherGameOver ? `Game Over! Score: ${catcherScore}!` : "Catch the Dorayaki!"}
                    </h4>
                    <p className="text-xs max-w-xs text-center text-white/90">
                      Use left/right arrows to steer Doraemon's basket and catch tasty snacks!
                    </p>
                    <button
                      onClick={startCatcherGame}
                      className="px-6 py-2 rounded-full bg-gradient-to-r from-amber-400 to-rose-500 text-white font-bold text-sm shadow-md hover:scale-105 active:scale-95 transition-transform"
                    >
                      {catcherGameOver ? 'Play Again 🔄' : 'Start Catching! 🚀'}
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Falling items */}
                    {fallingItems.map((it) => (
                      <span
                        key={it.id}
                        className="absolute text-2xl transition-transform"
                        style={{ left: `${it.x}%`, top: `${it.y}%`, transform: 'translate(-50%, -50%)' }}
                      >
                        {it.icon}
                      </span>
                    ))}

                    {/* Catcher Basket / Doraemon at Bottom */}
                    <div
                      className="absolute bottom-2 -translate-x-1/2 flex flex-col items-center transition-all duration-75"
                      style={{ left: `${catcherPos}%` }}
                    >
                      <span className="text-3xl">🧺</span>
                      <span className="text-xs font-bold bg-sky-600 text-white px-2 py-0.5 rounded-full shadow">
                        Doraemon
                      </span>
                    </div>
                  </>
                )}
              </div>

              {/* Movement controls for mobile / kid clickers */}
              <div className="flex items-center justify-center gap-4 pt-1">
                <button
                  onClick={() => {
                    soundManager.playPop();
                    setCatcherPos((p) => Math.max(10, p - 12));
                  }}
                  className="px-6 py-3 bg-sky-500 hover:bg-sky-600 text-white rounded-2xl font-bold shadow active:scale-90 flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span>Left</span>
                </button>

                <button
                  onClick={() => {
                    soundManager.playPop();
                    setCatcherPos((p) => Math.min(90, p + 12));
                  }}
                  className="px-6 py-3 bg-sky-500 hover:bg-sky-600 text-white rounded-2xl font-bold shadow active:scale-90 flex items-center gap-1 cursor-pointer"
                >
                  <span>Right</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* GAME 2: DANCE */}
          {selectedGame === 'dance' && (
            <div className="w-full max-w-lg space-y-4 text-center">
              <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-700 bg-rose-50 p-2.5 rounded-2xl border border-rose-200">
                <span>Combo: 🔥 {danceCombo}</span>
                <span className="text-rose-700 text-base">Score: {danceScore}</span>
              </div>

              <div className="p-6 rounded-3xl bg-gradient-to-b from-rose-100 to-amber-100 border-3 border-rose-300 space-y-4">
                <div className="text-4xl animate-bounce">🦸‍♂️ 🕺</div>
                <h4 className="text-sm sm:text-base font-bold text-slate-800">
                  Tap the matching Action Kamen move when it pops up!
                </h4>

                {/* Target Prompt Box */}
                <div className="p-4 bg-white rounded-2xl border-2 border-rose-300 shadow-md inline-block">
                  <span className="text-xs font-bold text-slate-500 block mb-1">CURRENT MOVE:</span>
                  <span className="text-xl sm:text-2xl font-black text-rose-600 animate-pulse">
                    {dancePrompt === 'beam' && '⚡ ACTION BEAM!'}
                    {dancePrompt === 'chocobi' && '⭐ CHOCOBI CRUNCH!'}
                    {dancePrompt === 'wiggle' && '🎵 BURI-BURI WIGGLE!'}
                  </span>
                </div>

                {/* Rhythm Action Buttons */}
                <div className="grid grid-cols-3 gap-2 pt-2">
                  <button
                    onClick={() => handleDanceAction('beam')}
                    className="p-3 bg-amber-400 hover:bg-amber-500 text-slate-900 rounded-2xl font-bold text-xs sm:text-sm shadow-md active:scale-90 transition-transform cursor-pointer border-2 border-amber-500"
                  >
                    ⚡ Action Beam
                  </button>

                  <button
                    onClick={() => handleDanceAction('chocobi')}
                    className="p-3 bg-emerald-400 hover:bg-emerald-500 text-slate-900 rounded-2xl font-bold text-xs sm:text-sm shadow-md active:scale-90 transition-transform cursor-pointer border-2 border-emerald-500"
                  >
                    ⭐ Chocobi
                  </button>

                  <button
                    onClick={() => handleDanceAction('wiggle')}
                    className="p-3 bg-rose-400 hover:bg-rose-500 text-white rounded-2xl font-bold text-xs sm:text-sm shadow-md active:scale-90 transition-transform cursor-pointer border-2 border-rose-500"
                  >
                    🎵 Buri Wiggle
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* GAME 3: SORT */}
          {selectedGame === 'sort' && (
            <div className="w-full max-w-lg space-y-4 text-center">
              <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-700 bg-amber-50 p-2.5 rounded-2xl border border-amber-200">
                <span>Baby Corp Executive Filing</span>
                <span className="text-amber-800 text-base">Score: {sortScore}</span>
              </div>

              <div className="p-6 rounded-3xl bg-gradient-to-b from-amber-50 to-yellow-100 border-3 border-amber-300 space-y-4">
                <span className="text-xs font-bold text-slate-500 block">ITEM ON CONVEYOR:</span>

                {/* Conveyor item */}
                <div className="p-4 bg-white rounded-3xl border-3 border-amber-400 shadow-lg inline-flex flex-col items-center justify-center w-36 h-36">
                  <span className="text-5xl mb-1">{currentItemToSort.icon}</span>
                  <span className="text-xs font-bold text-slate-800">{currentItemToSort.name}</span>
                </div>

                <p className="text-xs text-slate-600 font-medium">
                  Which executive department does this belong to?
                </p>

                {/* 3 Sorting Target Bins */}
                <div className="grid grid-cols-3 gap-2 pt-2">
                  <button
                    onClick={() => handleSortChoice('milk')}
                    className="p-3 bg-sky-100 hover:bg-sky-200 text-sky-900 rounded-2xl font-bold text-xs border-2 border-sky-300 shadow active:scale-95 flex flex-col items-center gap-1 cursor-pointer"
                  >
                    <span className="text-2xl">🍼</span>
                    <span>Baby Milk</span>
                  </button>

                  <button
                    onClick={() => handleSortChoice('file')}
                    className="p-3 bg-slate-800 hover:bg-slate-900 text-amber-300 rounded-2xl font-bold text-xs border-2 border-amber-400 shadow active:scale-95 flex flex-col items-center gap-1 cursor-pointer"
                  >
                    <span className="text-2xl">📁</span>
                    <span>Secret Files</span>
                  </button>

                  <button
                    onClick={() => handleSortChoice('toy')}
                    className="p-3 bg-pink-100 hover:bg-pink-200 text-pink-900 rounded-2xl font-bold text-xs border-2 border-pink-300 shadow active:scale-95 flex flex-col items-center gap-1 cursor-pointer"
                  >
                    <span className="text-2xl">🧸</span>
                    <span>Toy Box</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 px-6">
          <span>Earn +3 coins and +5 friendship stars per victory!</span>
          <button
            onClick={() => {
              soundManager.playPop();
              onClose();
            }}
            className="px-4 py-1.5 rounded-full bg-slate-200 hover:bg-slate-300 font-bold text-slate-700 active:scale-95"
          >
            Done Playing
          </button>
        </div>
      </div>
    </div>
  );
};
