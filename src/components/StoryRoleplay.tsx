import React, { useState } from 'react';
import { CharacterId, StoryEpisode, StoryTurn } from '../types';
import { CHARACTERS } from '../data/characters';
import { STORY_EPISODES } from '../data/stories';
import { CharacterAvatar } from './CharacterAvatar';
import { soundManager } from '../utils/audio';
import { Volume2, Sparkles, Send, RotateCcw, Award, BookOpen, Compass, Lightbulb } from 'lucide-react';

interface StoryRoleplayProps {
  activeCharacter: CharacterId;
  onAwardStars: (count: number) => void;
  onAwardBadge: (badgeId: string) => void;
  onOpenCharacterSelect: () => void;
}

export const StoryRoleplay: React.FC<StoryRoleplayProps> = ({
  activeCharacter,
  onAwardStars,
  onAwardBadge,
  onOpenCharacterSelect,
}) => {
  const currentHero = CHARACTERS[activeCharacter];

  const [selectedEpisodeIndex, setSelectedEpisodeIndex] = useState<number>(0);
  const currentEpisode = STORY_EPISODES[selectedEpisodeIndex];

  const [turns, setTurns] = useState<StoryTurn[]>([currentEpisode.initialTurn]);
  const [currentTurnIndex, setCurrentTurnIndex] = useState<number>(0);
  const [isLoadingNext, setIsLoadingNext] = useState<boolean>(false);
  const [customActionText, setCustomActionText] = useState<string>('');
  const [episodeCompleted, setEpisodeCompleted] = useState<boolean>(false);

  const activeTurn = turns[currentTurnIndex] || currentEpisode.initialTurn;

  // Read narration aloud for young kids
  const handleReadNarration = (text: string) => {
    soundManager.speakText(text, 'narrator');
  };

  const handleReadCharacterQuote = (quote: string, speaker: string) => {
    let charKey: CharacterId = 'doraemon';
    if (speaker.toLowerCase().includes('shinchan')) charKey = 'shinchan';
    if (speaker.toLowerCase().includes('boss')) charKey = 'boss_baby';

    soundManager.speakText(`${speaker} says: ${quote}`, charKey);
  };

  // Switch episode
  const handleSelectEpisode = (index: number) => {
    soundManager.playPop();
    setSelectedEpisodeIndex(index);
    const ep = STORY_EPISODES[index];
    setTurns([ep.initialTurn]);
    setCurrentTurnIndex(0);
    setEpisodeCompleted(false);
    handleReadNarration(ep.initialTurn.narration);
  };

  // Handle kid picking a choice or submitting custom action
  const handleMakeChoice = async (choiceText: string) => {
    if (isLoadingNext) return;
    soundManager.playPop();
    setIsLoadingNext(true);

    try {
      const response = await fetch('/api/roleplay/step', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          character: currentHero.name,
          location: currentEpisode.title,
          currentScenario: activeTurn.narration,
          kidAction: choiceText,
          history: turns.map((t) => t.narration),
        }),
      });

      const json = await response.json();
      if (json.success && json.data) {
        const nextTurn: StoryTurn = {
          id: `turn_${Date.now()}`,
          narration: json.data.narration,
          playerReaction: json.data.playerReaction || {
            speaker: currentHero.name,
            quote: `We did it! Let's keep exploring!`,
            action: 'Celebrates happily!',
          },
          buddyReaction1: json.data.buddyReaction1 || {
            speaker: 'Shinchan',
            quote: 'WAHAHAHA! Super cool move!',
            action: 'Does an Action Kamen jump!',
          },
          buddyReaction2: json.data.buddyReaction2 || {
            speaker: 'Boss Baby',
            quote: 'Mission parameters are looking optimal.',
            action: 'Adjusts tie and stamps file.',
          },
          choices: json.data.choices || [
            'Explore the next mystery room!',
            'Celebrate with warm Dorayaki and Chocobi!',
            'Plan our next big cartoon team mission!',
          ],
          soundEffect: json.data.soundEffect || 'fanfare',
          mood: json.data.mood || 'happy',
        };

        soundManager.playByName(nextTurn.soundEffect || 'fanfare');

        const newTurns = [...turns, nextTurn];
        setTurns(newTurns);
        setCurrentTurnIndex(newTurns.length - 1);
        onAwardStars(5);

        // Check if finished 4 steps
        if (newTurns.length >= 4) {
          setEpisodeCompleted(true);
          onAwardStars(15);
          onAwardBadge('story_hero');
          soundManager.playFanfare();
        } else {
          // auto read narration
          soundManager.speakText(nextTurn.narration, 'narrator');
        }
      }
    } catch {
      // Fallback
      soundManager.playFanfare();
    } finally {
      setIsLoadingNext(false);
      setCustomActionText('');
    }
  };

  const resetStory = () => {
    soundManager.playPop();
    const ep = STORY_EPISODES[selectedEpisodeIndex];
    setTurns([ep.initialTurn]);
    setCurrentTurnIndex(0);
    setEpisodeCompleted(false);
  };

  const quickActionIdeas = [
    activeCharacter === 'doraemon'
      ? 'Pull out the Anywhere Door!'
      : activeCharacter === 'shinchan'
      ? 'Perform the Buri-Buri wiggle dance!'
      : 'Call an Executive Baby Corp Meeting!',
    'Share Dorayaki & Chocobi snacks with everyone!',
    'Blast the Action Kamen superhero beam!',
    'Spin the Bamboo Copter to fly to the ceiling!',
  ];

  return (
    <div className="space-y-4 max-w-5xl mx-auto">
      {/* Episodes Navigation Carousel */}
      <div className="bg-white rounded-3xl border-3 border-amber-200 p-3 sm:p-4 shadow-sm">
        <div className="flex items-center justify-between gap-2 mb-2">
          <h2 className="text-sm sm:text-base font-bold text-slate-800 flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-rose-500" />
            <span>Cartoon Story Episodes: Roleplay with Friends!</span>
          </h2>

          <button
            onClick={onOpenCharacterSelect}
            className="text-xs font-bold text-sky-700 hover:text-sky-800 bg-sky-50 px-2.5 py-1 rounded-full border border-sky-200"
          >
            Switch Role ({currentHero.name}) 🔄
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {STORY_EPISODES.map((ep, idx) => {
            const isSelected = selectedEpisodeIndex === idx;
            return (
              <button
                key={ep.id}
                onClick={() => handleSelectEpisode(idx)}
                className={`p-3 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-start gap-2.5 ${
                  isSelected
                    ? 'border-rose-400 bg-rose-50/80 shadow-md ring-2 ring-rose-300'
                    : 'border-slate-200 bg-slate-50 hover:bg-white'
                }`}
              >
                <div className="text-2xl p-1.5 bg-white rounded-xl shadow-xs border border-slate-200">
                  {ep.coverEmoji}
                </div>
                <div className="min-w-0">
                  <h3 className="text-xs sm:text-sm font-bold text-slate-800 truncate">
                    {ep.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 line-clamp-1">{ep.subtitle}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Storybook Scene View */}
      <div className="bg-gradient-to-b from-amber-50 via-white to-rose-50/40 rounded-3xl border-4 border-amber-300 shadow-xl overflow-hidden p-4 sm:p-6 space-y-5">
        {/* Story Episode Header */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-amber-200 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{currentEpisode.coverEmoji}</span>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                {currentEpisode.title}
              </h3>
              <span className="text-xs font-semibold text-rose-600">
                Turn {currentTurnIndex + 1} of 4 • You are roleplaying as: {currentHero.name}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleReadNarration(activeTurn.narration)}
              className="flex items-center gap-1.5 px-3 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 rounded-full text-xs font-bold transition-transform active:scale-95 shadow-xs"
              title="Click to hear the story read aloud!"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Read Aloud 🗣️</span>
            </button>

            <button
              onClick={resetStory}
              className="p-1.5 text-slate-500 hover:text-slate-800 bg-white border border-slate-200 rounded-full transition-transform active:scale-95"
              title="Restart this Episode"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Narrative Box */}
        <div className="relative p-4 rounded-2xl bg-amber-100/70 border-2 border-amber-300 shadow-sm text-sm sm:text-base font-medium text-slate-800 leading-relaxed">
          <span className="font-bold text-amber-800 block mb-1 text-xs uppercase tracking-wide">
            📖 What Happened Next:
          </span>
          <p>{activeTurn.narration}</p>
        </div>

        {/* Comic Dialogue Panels: Character Reactions */}
        <div className="space-y-3">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Cartoon Friends Speaking:
          </span>

          {/* Player's Character Quote (Highlighted) */}
          <div className="p-3 sm:p-4 rounded-2xl bg-sky-50 border-3 border-sky-400 shadow-sm flex items-start gap-3">
            <div className="flex-shrink-0">
              <CharacterAvatar
                characterId={activeCharacter}
                size="md"
                showBadge={true}
                animate={true}
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="text-xs sm:text-sm font-bold text-sky-900 flex items-center gap-1">
                  ⭐ YOU as {activeTurn.playerReaction.speaker}
                </span>
                <button
                  onClick={() =>
                    handleReadCharacterQuote(
                      activeTurn.playerReaction.quote,
                      activeTurn.playerReaction.speaker
                    )
                  }
                  className="text-xs text-sky-700 hover:text-sky-900 flex items-center gap-1 bg-white px-2 py-0.5 rounded-full border border-sky-200"
                >
                  <Volume2 className="w-3 h-3" /> Voice
                </button>
              </div>

              <p className="text-xs sm:text-sm font-bold text-slate-800 italic bg-white p-2 rounded-xl border border-sky-200 shadow-inner">
                "{activeTurn.playerReaction.quote}"
              </p>
              <span className="text-[11px] text-slate-600 block mt-1">
                👉 Action: {activeTurn.playerReaction.action}
              </span>
            </div>
          </div>

          {/* Buddies Quotes Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Buddy 1 */}
            <div className="p-3 rounded-2xl bg-rose-50 border-2 border-rose-300 shadow-xs flex items-start gap-2.5">
              <div className="flex-shrink-0">
                <CharacterAvatar
                  characterId={
                    activeTurn.buddyReaction1.speaker.toLowerCase().includes('shinchan')
                      ? 'shinchan'
                      : activeTurn.buddyReaction1.speaker.toLowerCase().includes('doraemon')
                      ? 'doraemon'
                      : 'boss_baby'
                  }
                  size="sm"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-xs font-bold text-rose-900">
                    {activeTurn.buddyReaction1.speaker}
                  </span>
                  <button
                    onClick={() =>
                      handleReadCharacterQuote(
                        activeTurn.buddyReaction1.quote,
                        activeTurn.buddyReaction1.speaker
                      )
                    }
                    className="text-[10px] text-rose-700 hover:underline"
                  >
                    <Volume2 className="w-2.5 h-2.5 inline" />
                  </button>
                </div>
                <p className="text-xs italic text-slate-800 bg-white p-1.5 rounded-lg border border-rose-200">
                  "{activeTurn.buddyReaction1.quote}"
                </p>
                <span className="text-[10px] text-slate-500 block mt-0.5 truncate">
                  {activeTurn.buddyReaction1.action}
                </span>
              </div>
            </div>

            {/* Buddy 2 */}
            <div className="p-3 rounded-2xl bg-amber-50 border-2 border-amber-300 shadow-xs flex items-start gap-2.5">
              <div className="flex-shrink-0">
                <CharacterAvatar
                  characterId={
                    activeTurn.buddyReaction2.speaker.toLowerCase().includes('boss')
                      ? 'boss_baby'
                      : activeTurn.buddyReaction2.speaker.toLowerCase().includes('shinchan')
                      ? 'shinchan'
                      : 'doraemon'
                  }
                  size="sm"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-xs font-bold text-amber-900">
                    {activeTurn.buddyReaction2.speaker}
                  </span>
                  <button
                    onClick={() =>
                      handleReadCharacterQuote(
                        activeTurn.buddyReaction2.quote,
                        activeTurn.buddyReaction2.speaker
                      )
                    }
                    className="text-[10px] text-amber-700 hover:underline"
                  >
                    <Volume2 className="w-2.5 h-2.5 inline" />
                  </button>
                </div>
                <p className="text-xs italic text-slate-800 bg-white p-1.5 rounded-lg border border-amber-200">
                  "{activeTurn.buddyReaction2.quote}"
                </p>
                <span className="text-[10px] text-slate-500 block mt-0.5 truncate">
                  {activeTurn.buddyReaction2.action}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Episode Completed Banner */}
        {episodeCompleted ? (
          <div className="p-5 rounded-3xl bg-gradient-to-r from-amber-400 via-pink-400 to-rose-400 text-white text-center space-y-3 shadow-lg animate-bounce">
            <div className="text-4xl">🏆 🎉 ⭐</div>
            <h4 className="text-xl font-bold">Episode Completed! Incredible Roleplay!</h4>
            <p className="text-xs sm:text-sm text-white/95 max-w-md mx-auto">
              You and your cartoon buddies solved the mission together! You unlocked{' '}
              <span className="font-bold underline">{currentEpisode.badgeReward}</span> and earned
              +20 Friendship Stars!
            </p>
            <div className="flex justify-center gap-3 pt-1">
              <button
                onClick={resetStory}
                className="px-4 py-2 bg-white text-rose-600 font-bold text-xs sm:text-sm rounded-full shadow hover:bg-amber-50 active:scale-95 cursor-pointer"
              >
                Play This Episode Again 🔄
              </button>
              <button
                onClick={() => handleSelectEpisode((selectedEpisodeIndex + 1) % STORY_EPISODES.length)}
                className="px-4 py-2 bg-slate-900 text-amber-300 font-bold text-xs sm:text-sm rounded-full shadow hover:bg-slate-800 active:scale-95 cursor-pointer"
              >
                Next Story Mission 🚀
              </button>
            </div>
          </div>
        ) : (
          /* Choices Section */
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>What do you do next, {currentHero.name}? Pick an action:</span>
              </span>

              {isLoadingNext && (
                <span className="text-xs font-bold text-rose-600 animate-pulse flex items-center gap-1">
                  Story magic happening... ✨
                </span>
              )}
            </div>

            {/* 3 Interactive Branching Choices */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {activeTurn.choices.map((choice, i) => {
                const choiceIcons = ['🚀', '✨', '⚡'];
                return (
                  <button
                    key={i}
                    disabled={isLoadingNext}
                    onClick={() => handleMakeChoice(choice)}
                    className="p-3 rounded-2xl bg-white hover:bg-amber-50 border-3 border-amber-300 hover:border-amber-400 font-bold text-xs sm:text-sm text-slate-800 text-left shadow-md hover:shadow-lg transition-all hover:scale-102 active:scale-95 disabled:opacity-50 disabled:scale-100 flex items-start gap-2 cursor-pointer group"
                  >
                    <span className="text-xl group-hover:scale-120 transition-transform">
                      {choiceIcons[i % choiceIcons.length]}
                    </span>
                    <span className="leading-snug">{choice}</span>
                  </button>
                );
              })}
            </div>

            {/* Custom Action & Dialogue Prompt Input */}
            <div className="p-3 bg-white rounded-2xl border-2 border-amber-200 space-y-2 shadow-xs">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
                <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                <span>Or invent your own move / say something funny:</span>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (customActionText.trim()) {
                    handleMakeChoice(customActionText.trim());
                  }
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={customActionText}
                  onChange={(e) => setCustomActionText(e.target.value)}
                  placeholder={`Say or do anything as ${currentHero.name}...`}
                  className="flex-1 px-3 py-2 text-xs sm:text-sm rounded-xl border-2 border-slate-300 focus:border-amber-400 focus:outline-hidden bg-slate-50 font-medium"
                />
                <button
                  type="submit"
                  disabled={!customActionText.trim() || isLoadingNext}
                  className="px-4 py-2 bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white font-bold text-xs sm:text-sm rounded-xl shadow transition-transform active:scale-95 disabled:opacity-50 flex items-center gap-1"
                >
                  <span>Go!</span>
                  <Send className="w-3 h-3" />
                </button>
              </form>

              {/* Quick suggestion chips */}
              <div className="flex flex-wrap gap-1 pt-1">
                {quickActionIdeas.map((idea, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleMakeChoice(idea)}
                    className="text-[11px] font-medium bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-full transition-all active:scale-95 cursor-pointer"
                  >
                    💡 {idea}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
