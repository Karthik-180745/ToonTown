import React from 'react';
import { CharacterId } from '../types';
import { CHARACTERS } from '../data/characters';
import { BossBabyAvatar } from './BossBabyAvatar';

interface CharacterAvatarProps {
  characterId: CharacterId;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showBadge?: boolean;
  animate?: boolean;
  onClick?: () => void;
}

export const CharacterAvatar: React.FC<CharacterAvatarProps> = ({
  characterId,
  size = 'md',
  className = '',
  showBadge = false,
  animate = false,
  onClick,
}) => {
  const character = CHARACTERS[characterId];

  const sizeDimensions = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
    xl: 'w-32 h-32',
  };

  const badgeIcon = {
    doraemon: '🤖',
    shinchan: '⭐',
    boss_baby: '💼',
  }[characterId];

  const borderStyles = {
    doraemon: 'border-sky-400 bg-sky-100 ring-sky-300',
    shinchan: 'border-red-400 bg-red-100 ring-red-300',
    boss_baby: 'border-amber-400 bg-amber-100 ring-amber-300',
  }[characterId];

  return (
    <div
      onClick={onClick}
      className={`relative inline-flex items-center justify-center select-none ${onClick ? 'cursor-pointer hover:scale-105 transition-transform' : ''} ${className}`}
    >
      {characterId === 'boss_baby' ? (
        <BossBabyAvatar size={size} animate={animate} />
      ) : (
        <div
          className={`relative rounded-full overflow-hidden border-3 shadow-md ${sizeDimensions[size]} ${borderStyles} ${animate ? 'animate-bounce' : ''}`}
        >
          <img
            src={character.avatarUrl}
            alt={character.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center"
            onError={(e) => {
              // Fallback if local asset is loading
              const target = e.currentTarget;
              target.onerror = null;
              target.src = characterId === 'doraemon'
                ? 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=300&auto=format&fit=crop&q=80'
                : 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=300&auto=format&fit=crop&q=80';
            }}
          />
        </div>
      )}

      {showBadge && (
        <span className="absolute -bottom-1 -right-1 text-sm bg-white rounded-full px-1 py-0.5 shadow border border-slate-200">
          {badgeIcon}
        </span>
      )}
    </div>
  );
};
