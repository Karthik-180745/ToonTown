import React from 'react';
import { ALL_BADGES } from '../data/badges';
import { soundManager } from '../utils/audio';
import { X, Trophy, Sparkles, CheckCircle2, Lock } from 'lucide-react';

interface BadgesModalProps {
  isOpen: boolean;
  onClose: () => void;
  unlockedBadgeIds: string[];
}

export const BadgesModal: React.FC<BadgesModalProps> = ({
  isOpen,
  onClose,
  unlockedBadgeIds,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl border-4 border-amber-300 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-400 via-yellow-400 to-rose-400 p-4 text-slate-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-7 h-7 text-amber-900" />
            <div>
              <h2 className="text-xl font-bold leading-tight">ToonTown Trophy Room</h2>
              <p className="text-xs text-amber-900/80 font-semibold">
                Unlocked: {unlockedBadgeIds.length} of {ALL_BADGES.length} Badges
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              soundManager.playPop();
              onClose();
            }}
            className="w-9 h-9 rounded-full bg-black/10 hover:bg-black/20 text-slate-900 flex items-center justify-center transition-transform active:scale-90"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Badges Grid */}
        <div className="p-4 sm:p-6 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-3">
          {ALL_BADGES.map((badge) => {
            const isUnlocked = unlockedBadgeIds.includes(badge.id);

            return (
              <div
                key={badge.id}
                className={`p-3.5 rounded-2xl border-2 flex items-start gap-3 transition-all ${
                  isUnlocked
                    ? 'bg-amber-50/70 border-amber-300 shadow-sm'
                    : 'bg-slate-50 border-slate-200 opacity-60'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-sm border-2 ${
                    isUnlocked
                      ? 'bg-amber-200 border-amber-400 text-slate-900 animate-pulse'
                      : 'bg-slate-200 border-slate-300 grayscale text-slate-400'
                  }`}
                >
                  {isUnlocked ? badge.emoji : <Lock className="w-5 h-5 text-slate-400" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h3 className="text-xs sm:text-sm font-bold text-slate-800 leading-tight">
                      {badge.title}
                    </h3>
                    {isUnlocked && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-1 leading-snug">{badge.description}</p>
                  <span
                    className={`inline-block mt-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isUnlocked
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {isUnlocked ? 'Unlocked! ⭐' : 'Locked'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={() => {
              soundManager.playPop();
              onClose();
            }}
            className="px-5 py-1.5 rounded-full bg-slate-900 text-white font-bold text-xs sm:text-sm hover:bg-slate-800 active:scale-95 cursor-pointer"
          >
            Close Trophy Room
          </button>
        </div>
      </div>
    </div>
  );
};
