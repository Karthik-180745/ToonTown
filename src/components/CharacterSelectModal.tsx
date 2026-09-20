import React, { useState, useEffect } from 'react';
import { CharacterId } from '../types';
import { CHARACTERS } from '../data/characters';
import { CharacterAvatar } from './CharacterAvatar';
import { X, Sparkles, Volume2, CheckCircle } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface CharacterSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCharacter: CharacterId;
  onSelectCharacter: (id: CharacterId) => void;
}

export const CharacterSelectModal: React.FC<CharacterSelectModalProps> = ({
  isOpen,
  onClose,
  selectedCharacter,
  onSelectCharacter,
}) => {
  const [previewId, setPreviewId] = useState<CharacterId>(selectedCharacter);

  useEffect(() => {
    if (isOpen) {
      setPreviewId(selectedCharacter);
    }
  }, [isOpen, selectedCharacter]);

  const characters = Object.values(CHARACTERS);
  const currentPreview = CHARACTERS[previewId];

  const handlePlayCatchphrase = (charId: CharacterId) => {
    const char = CHARACTERS[charId];
    if (charId === 'doraemon') soundManager.playGadgetChime();
    if (charId === 'shinchan') soundManager.playActionKamenBeam();
    if (charId === 'boss_baby') soundManager.playExecutiveStamp();

    soundManager.speakText(`${char.name} says: "${char.catchphrase}"`, charId);
  };

  const handleConfirmChoice = () => {
    soundManager.playFanfare();
    onSelectCharacter(previewId);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl border-4 border-amber-300 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Top Header */}
        <div className="bg-gradient-to-r from-sky-400 via-rose-400 to-amber-400 p-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎭</span>
            <div>
              <h2 className="text-xl font-bold leading-tight">Pick Your Cartoon Hero!</h2>
              <p className="text-xs text-white/90">Roleplay as Doraemon, Shinchan, or Boss Baby</p>
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

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
          {/* Character Cards Row */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4">
            {characters.map((char) => {
              const isSelected = previewId === char.id;
              const isCurrentPlaying = selectedCharacter === char.id;

              return (
                <button
                  key={char.id}
                  onClick={() => {
                    setPreviewId(char.id);
                    soundManager.playPop();
                    handlePlayCatchphrase(char.id);
                  }}
                  className={`relative p-3 rounded-2xl border-3 flex flex-col items-center text-center transition-all cursor-pointer ${
                    isSelected
                      ? 'border-amber-400 bg-amber-50/80 shadow-lg scale-102 ring-4 ring-amber-200'
                      : 'border-slate-200 bg-slate-50 hover:bg-white hover:border-slate-300'
                  }`}
                >
                  {isCurrentPlaying && (
                    <span className="absolute -top-2 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
                      Active
                    </span>
                  )}
                  <CharacterAvatar characterId={char.id} size="lg" animate={isSelected} />
                  <h3 className="mt-2 text-sm sm:text-base font-bold text-slate-800 leading-tight">
                    {char.name}
                  </h3>
                  <span className="text-[11px] text-slate-500 line-clamp-1">{char.title}</span>

                  {isSelected && (
                    <div className="mt-2 flex items-center gap-1 text-[11px] font-bold text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">
                      <CheckCircle className="w-3 h-3" /> Selected
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Selected Character Deep Dive Details */}
          <div className="p-4 rounded-2xl bg-amber-50/60 border-2 border-amber-200 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">🌟</span>
                <div>
                  <h4 className="text-base font-bold text-slate-900">{currentPreview.name}</h4>
                  <p className="text-xs text-amber-700 font-semibold">{currentPreview.defaultRole}</p>
                </div>
              </div>

              <button
                onClick={() => handlePlayCatchphrase(currentPreview.id)}
                className="flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-amber-100 border border-amber-300 rounded-full text-xs font-bold text-amber-800 transition-transform active:scale-95 shadow-xs"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Hear Catchphrase</span>
              </button>
            </div>

            {/* Catchphrase Bubble */}
            <div className="p-3 bg-white rounded-xl border border-amber-200 text-xs sm:text-sm italic font-medium text-slate-700 relative shadow-inner">
              <span className="text-amber-500 font-bold text-base not-italic">"</span>
              {currentPreview.catchphrase}
              <span className="text-amber-500 font-bold text-base not-italic">"</span>
            </div>

            {/* Description & Skill */}
            <p className="text-xs sm:text-sm text-slate-600">{currentPreview.description}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs">
              <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                <span className="font-bold text-slate-700 flex items-center gap-1 mb-0.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Special Skill:
                </span>
                <span className="text-slate-600">{currentPreview.specialSkill}</span>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                <span className="font-bold text-slate-700 flex items-center gap-1 mb-0.5">
                  💡 Fun Fact:
                </span>
                <span className="text-slate-600">{currentPreview.funFact}</span>
              </div>
            </div>

            {/* Signature Items */}
            <div>
              <span className="text-xs font-bold text-slate-700 block mb-1.5">Signature Items:</span>
              <div className="flex flex-wrap gap-1.5">
                {currentPreview.signatureItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-full border border-slate-200 text-xs font-medium text-slate-700 shadow-xs"
                  >
                    <span>{item.icon}</span>
                    <span>{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            onClick={() => {
              soundManager.playPop();
              onClose();
            }}
            className="px-4 py-2 rounded-xl border-2 border-slate-300 font-bold text-xs sm:text-sm text-slate-600 hover:bg-slate-100 active:scale-95"
          >
            Cancel
          </button>

          <button
            id="modal-confirm-roleplay-hero-btn"
            onClick={handleConfirmChoice}
            className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white font-bold text-sm sm:text-base shadow-md hover:shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2"
          >
            <span>Roleplay as {currentPreview.name}!</span>
            <span>🚀</span>
          </button>
        </div>
      </div>
    </div>
  );
};
