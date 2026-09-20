export type CharacterId = 'doraemon' | 'shinchan' | 'boss_baby';

export type LocationId = 'doraemon_room' | 'shinchan_home' | 'baby_corp_hq' | 'toon_park' | 'candy_cloud';

export type TimeOfDay = 'morning' | 'afternoon' | 'sunset' | 'night';

export interface CartoonItem {
  id: string;
  name: string;
  category: 'gadget' | 'snack' | 'toy' | 'executive';
  icon: string;
  description: string;
  characterExclusive?: CharacterId;
  energyBonus?: number;
  funBonus?: number;
  sfx: string;
}

export interface CartoonCharacter {
  id: CharacterId;
  name: string;
  title: string;
  catchphrase: string;
  description: string;
  avatarUrl: string;
  bannerColor: string;
  accentColor: string;
  tagColor: string;
  signatureItems: CartoonItem[];
  defaultRole: string;
  specialSkill: string;
  funFact: string;
}

export interface CartoonLocation {
  id: LocationId;
  name: string;
  tagline: string;
  bgGradient: string;
  accentColor: string;
  interactiveHotspots: {
    id: string;
    title: string;
    description: string;
    icon: string;
    x: number; // percentage
    y: number; // percentage
    actionType: 'gadget' | 'snack' | 'play' | 'secret' | 'minigame';
    rewardStars?: number;
    sfx: string;
  }[];
}

export interface StoryChoice {
  text: string;
  actionKey: string;
  badgeUnlock?: string;
}

export interface StoryTurn {
  id: string;
  narration: string;
  playerReaction: {
    speaker: string;
    quote: string;
    action: string;
  };
  buddyReaction1: {
    speaker: string;
    quote: string;
    action: string;
  };
  buddyReaction2: {
    speaker: string;
    quote: string;
    action: string;
  };
  choices: string[];
  soundEffect?: string;
  mood?: string;
}

export interface StoryEpisode {
  id: string;
  title: string;
  subtitle: string;
  coverEmoji: string;
  badgeReward: string;
  summary: string;
  initialTurn: StoryTurn;
}

export interface Badge {
  id: string;
  title: string;
  emoji: string;
  description: string;
  unlockedAt?: string;
}

export interface SimulationState {
  character: CharacterId;
  location: LocationId;
  timeOfDay: TimeOfDay;
  hunger: number; // 0 (starving) to 100 (full)
  fun: number; // 0 to 100
  energy: number; // 0 to 100
  stars: number;
  coins: number;
  inventory: string[]; // item ids
  unlockedBadges: string[]; // badge ids
}
