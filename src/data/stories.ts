import { StoryEpisode } from '../types';

export const STORY_EPISODES: StoryEpisode[] = [
  {
    id: 'dorayaki_mystery',
    title: 'The Great Dorayaki & Chocobi Mystery',
    subtitle: 'Who took the last sweet pancake and star cookie box?!',
    coverEmoji: '🔍',
    badgeReward: 'Master Detective Badge',
    summary: 'A dramatic cartoon investigation! Doraemon’s golden plate of warm Dorayaki and Shinchan’s prized Action Kamen Chocobi snacks have vanished right before snacktime!',
    initialTurn: {
      id: 'ep1_turn1',
      narration: 'Sirens blare (actually just Boss Baby squeaking his golden duck toy)! Doraemon gasps in horror at the empty kitchen counter. "MY FRESH DORAYAKI IS GONE!" Shinchan slides into the room in his socks, holding an empty green box: "AND MY CHOCOBI STARS ARE MISSING TOO! WAAAAAH!" Boss Baby snaps his briefcase shut on the table: "Gentlemen, we have a code red snack robbery on our hands."',
      playerReaction: {
        speaker: 'Boss Baby',
        quote: 'Alright team, no one panics. We secure the perimeter, interview suspects, and recover our carbohydrate assets before lunchtime!',
        action: 'Draws a chalk line around the plate crumbs with dramatic flair.',
      },
      buddyReaction1: {
        speaker: 'Doraemon',
        quote: 'Wait! Let me check my 4D pocket for the Clue-Tracing Magnifying Glass or the Time Rewind Cloth!',
        action: 'Rummages frantically through his glowing white tummy pocket.',
      },
      buddyReaction2: {
        speaker: 'Shinchan',
        quote: 'I suspect the mailman! Or maybe Shiro the dog! Or maybe... wait, did I eat it in my sleep?! Let me smell my fingers!',
        action: 'Sniffs his pajamas and strikes a dramatic Action Kamen pose.',
      },
      choices: [
        'Use Doraemon\'s "Anywhere Door" to follow the powdered sugar trail outside!',
        'Let Boss Baby interrogate Shiro the puppy with tough corporate business questions!',
        'Have Shinchan put on his Action Kamen mask and launch a superhero stakeout!',
      ],
      soundEffect: 'whoosh',
      mood: 'mystery',
    },
  },
  {
    id: 'moon_board_meeting',
    title: 'Baby Corp Mission: Board Meeting on the Moon',
    subtitle: 'Bamboo Copters, Space Helmets, and Zero-Gravity Chocobi!',
    coverEmoji: '🚀',
    badgeReward: 'Cosmic Explorer Badge',
    summary: 'Boss Baby must present the annual Toy Happiness Report to the Intergalactic Toddler Board on the Moon! Doraemon equips the squad with space gadgets while Shinchan wants to meet moon bunnies!',
    initialTurn: {
      id: 'ep2_turn1',
      narration: 'WHOOOSH! Doraemon pulls out three gleaming yellow Bamboo Copters and transparent bubble Space Helmets. Boss Baby checks his miniature Rolex: "We have 15 minutes to reach Moon Crater #4 for the high-stakes merger." Shinchan floats upside down giggling: "Look Mom, no gravity! My butt is flying to space!"',
      playerReaction: {
        speaker: 'Doraemon',
        quote: 'Everyone hold on tight! I calibrated the Bamboo Copters with the Turbo Cloud Booster!',
        action: 'Pats his propellor hat and adjusts everyone\'s bubble helmet.',
      },
      buddyReaction1: {
        speaker: 'Shinchan',
        quote: 'To infinity and the cookie jar! Action Beam to the Stars! WAHAHAHA!',
        action: 'Tosses a chocolate Chocobi star that floats in slow motion.',
      },
      buddyReaction2: {
        speaker: 'Boss Baby',
        quote: 'Shinchan, maintain formation! You are jeopardizing our interstellar market share!',
        action: 'Holds his briefcase tightly against his miniature astronaut suit.',
      },
      choices: [
        'Accelerate the Bamboo Copters through a colorful star-dust cloud!',
        'Catch the floating Chocobi stars before they drift into an asteroid!',
        'Land smoothly on the Moon Crater and open the portable conference table!',
      ],
      soundEffect: 'fanfare',
      mood: 'excited',
    },
  },
  {
    id: 'toy_rescue_operation',
    title: 'The Great Action Kamen & Pacifier Rescue',
    subtitle: 'Save the golden toys from the giant playground cat tree!',
    coverEmoji: '🦸‍♂️',
    badgeReward: 'Toon Superhero Badge',
    summary: 'A mischievous neighborhood calico cat swooped in and whisked Shinchan’s favorite Action Kamen figurine and Boss Baby’s golden pacifier to the top of the giant oak tree in ToonTown Park!',
    initialTurn: {
      id: 'ep3_turn1',
      narration: 'MEEE-OW! High up in the branches of the Grand Park Oak Tree sits a fluffy calico cat, batting at Shinchan\'s shiny Action Kamen toy and Boss Baby\'s golden pacifier! Shinchan falls to his knees: "ACTION KAMEN! STAY STRONG, MY HERO!" Boss Baby adjusts his sunglasses: "That feline has infringed upon our intellectual property. Operation Scratching Post is officially authorized."',
      playerReaction: {
        speaker: 'Shinchan',
        quote: 'Never fear! When evil strikes, Action Kamen and his loyal apprentice Shinchan will rise!',
        action: 'Waves his red cape and blows through his Giggle Megaphone.',
      },
      buddyReaction1: {
        speaker: 'Doraemon',
        quote: 'Wait, is that a CAT?! Oh no no, wait, it\'s not a mouse... phew! I thought it was a mouse! I can help with this!',
        action: 'Sighs with relief and pulls out the "Small Light" and "Gulliver Tunnel".',
      },
      buddyReaction2: {
        speaker: 'Boss Baby',
        quote: 'Doraemon, arm the treats! Shinchan, prepare the diversion! We retrieve the golden pacifier in 60 seconds flat!',
        action: 'Draws a miniature tactical map in the sand with a baby rattle.',
      },
      choices: [
        'Shine Doraemon\'s "Small Light" to turn the tree into a fun miniature playground!',
        'Let Shinchan perform the irresistible Buri-Buri Dance to make the cat laugh and climb down!',
        'Offer the cat a delicious warm Dorayaki in exchange for a peaceful toy surrender!',
      ],
      soundEffect: 'action_kamen',
      mood: 'triumph',
    },
  },
];
