import express, { Request, Response } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '5mb' }));

// Lazy GoogleGenAI initialization
let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
  });
});

// AI Cartoon Roleplay Step Endpoint
app.post('/api/roleplay/step', async (req: Request, res: Response) => {
  const { character, location, currentScenario, kidAction, history = [] } = req.body;

  try {
    const ai = getGenAI();

    if (ai) {
      const systemPrompt = `You are the master narrator and cartoon director of a playful, funny, kid-friendly cartoon simulation adventure starring three famous cartoon characters:
1. Doraemon: The futuristic blue robotic cat who has a 4D pocket full of crazy gadgets (Anywhere Door, Bamboo Copter, Small Light, Memory Bread) and LOVES Dorayaki pancakes. He panics if mice are mentioned, and is very helpful but gets exasperated easily.
2. Shinchan (Shinnosuke Nohara): The cheeky, hilarious 5-year-old from Kasukabe who loves Chocobi snacks, Action Kamen, doing the goofy "Buri Buri" dance, asking funny questions, and turning serious situations into silly laughter!
3. Boss Baby: The suit-wearing, briefcase-carrying executive infant from Baby Corp who treats playtime like corporate boardroom mergers, calls everyone "rookie" or "associates", talks about "juice box stock markets", and takes juice breaks dead seriously.

The player kid is roleplaying as: ${character}
Current Location in ToonTown: ${location}
Current Story Context: ${currentScenario || 'Starting a new day of adventure!'}
Kid's Action/Choice: "${kidAction}"

Return a response tailored for 5-11 year old kids. Keep sentences punchy, cartoonish, expressive, and full of onomatopoeia (BAM!, WHOOSH!, BOING!).
Give:
- narration: 2-3 engaging, colorful sentences describing what happens next.
- playerReaction: What ${character} says or does (in their classic voice/mannerism).
- buddyReaction1: One other buddy (e.g. if player is Doraemon, then Shinchan or Boss Baby) reacting funny.
- buddyReaction2: The third buddy reacting funny.
- choices: 3 hilarious or creative action choices the kid can pick from next.
- soundEffect: One of ["boing", "fanfare", "whoosh", "cheer", "laser", "giggle", "gadget", "action_kamen", "boardroom"].
- mood: One of ["happy", "excited", "silly", "mystery", "triumph"].`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `Previous events: ${JSON.stringify(history.slice(-3))}\nKid's action: ${kidAction}`,
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              narration: { type: Type.STRING },
              playerReaction: {
                type: Type.OBJECT,
                properties: {
                  speaker: { type: Type.STRING },
                  quote: { type: Type.STRING },
                  action: { type: Type.STRING },
                },
                required: ['speaker', 'quote', 'action'],
              },
              buddyReaction1: {
                type: Type.OBJECT,
                properties: {
                  speaker: { type: Type.STRING },
                  quote: { type: Type.STRING },
                  action: { type: Type.STRING },
                },
                required: ['speaker', 'quote', 'action'],
              },
              buddyReaction2: {
                type: Type.OBJECT,
                properties: {
                  speaker: { type: Type.STRING },
                  quote: { type: Type.STRING },
                  action: { type: Type.STRING },
                },
                required: ['speaker', 'quote', 'action'],
              },
              choices: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              soundEffect: { type: Type.STRING },
              mood: { type: Type.STRING },
            },
            required: ['narration', 'playerReaction', 'buddyReaction1', 'buddyReaction2', 'choices', 'soundEffect', 'mood'],
          },
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      return res.json({ success: true, data: parsed });
    }
  } catch (err: unknown) {
    console.error('Gemini error, using cartoon story engine fallback:', err);
  }

  // Robust intelligent kid-friendly fallback response engine
  const fallback = generateCartoonStoryFallback(character, location, kidAction);
  return res.json({ success: true, data: fallback });
});

// Smart cartoon fallback generator when AI key is absent or offline
function generateCartoonStoryFallback(character: string, location: string, kidAction: string) {
  const isDoraemon = character.toLowerCase().includes('doraemon');
  const isShinchan = character.toLowerCase().includes('shinchan');
  const isBossBaby = character.toLowerCase().includes('boss');

  if (isDoraemon) {
    return {
      narration: `*DING DONG!* Doraemon's 4D pocket sparkles brightly! Your choice to "${kidAction}" caused a magical whirlwind of dorayaki sprinkles across ${location}!`,
      playerReaction: {
        speaker: 'Doraemon',
        quote: 'Yattaa! Good thing I kept my Bamboo Copter and Anywhere Door calibrated today!',
        action: 'Spins his propellor hat happily and grabs a warm Dorayaki pancake!',
      },
      buddyReaction1: {
        speaker: 'Shinchan',
        quote: 'Wooohoo! Action Kamen would totally approve of this cool move! Let me do the noodle dance!',
        action: 'Wiggles his hips and munches a Chocobi star snack.',
      },
      buddyReaction2: {
        speaker: 'Boss Baby',
        quote: 'Listen up team: our Fun Index just spiked 340% in the afternoon quarter. Good job, operative!',
        action: 'Adjusts his yellow tie and stamps the mission file APPROVED.',
      },
      choices: [
        'Pull out the "Anywhere Door" to visit the Secret Candy Cloud!',
        'Offer Boss Baby a warm Dorayaki to stop his serious meeting!',
        'Help Shinchan practice the Action Kamen super beam pose!',
      ],
      soundEffect: 'gadget',
      mood: 'excited',
    };
  } else if (isShinchan) {
    return {
      narration: `*WAHAHAHA!* Shinchan unleashes the ultimate cartoon mischief! By choosing to "${kidAction}", the whole ${location} explodes with giggles and bouncy balloons!`,
      playerReaction: {
        speaker: 'Shinchan',
        quote: 'Hehehe! Hey Doraemon, does your 4D pocket have endless boxes of chocolate Chocobi?!',
        action: 'Puts on his red Action Kamen mask and strikes a heroic goofy pose!',
      },
      buddyReaction1: {
        speaker: 'Doraemon',
        quote: 'Shinchan, wait! Don\'t press that gadget button with sticky chocolate fingers!!',
        action: 'Frantically checks his pocket for the Cleaning Cloth gadget.',
      },
      buddyReaction2: {
        speaker: 'Boss Baby',
        quote: 'Who authorized this level of chaos? Where is the agenda? ...Wait, that Chocobi actually tastes like high-yield stock.',
        action: 'Secretly takes a bite while checking his golden baby bottle.',
      },
      choices: [
        'Challenge Boss Baby to a goofy dance-off in the executive lounge!',
        'Borrow Doraemon\'s "Small Light" to turn giant toys into pocket treasures!',
        'Broadcast an emergency Action Kamen cartoon message across town!',
      ],
      soundEffect: 'giggle',
      mood: 'silly',
    };
  } else {
    // Boss Baby
    return {
      narration: `*TAP TAP TAP!* Boss Baby taps his golden pacifier against the executive boardroom whiteboard! "${kidAction}" is executed with precision toddler efficiency!`,
      playerReaction: {
        speaker: 'Boss Baby',
        quote: 'Team, take notes! That is how Baby Corp closes a deal before naptime!',
        action: 'Snaps his mini briefcase shut and slips on cool sunglasses.',
      },
      buddyReaction1: {
        speaker: 'Doraemon',
        quote: 'Wow Boss Baby, your planning is almost as fast as my 22nd-century computer!',
        action: 'Claps his round white hands cheerfully.',
      },
      buddyReaction2: {
        speaker: 'Shinchan',
        quote: 'Mr. Suit Baby, why are you wearing a tie to play tag? Ties can\'t even do the booty dance!',
        action: 'Crawls under the conference table pretending to be a spy.',
      },
      choices: [
        'Deploy the Baby Corp Helicopter to scout ToonTown playground!',
        'Assign Doraemon to create an auto-Dorayaki dispenser gadget!',
        'Let Shinchan lead the Team Morale goofy cheer session!',
      ],
      soundEffect: 'boardroom',
      mood: 'triumph',
    };
  }
}

// Vite middleware setup
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Cartoon Simulation server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
