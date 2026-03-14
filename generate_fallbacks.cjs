require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const characters = [
  { id: 'naruto', name: 'Naruto', traits: ['Brave', 'Energetic', 'Loyal'] },
  { id: 'pikachu', name: 'Pikachu', traits: ['Loyal', 'Energetic', 'Cute'] },
  { id: 'tom', name: 'Tom', traits: ['Funny', 'Clever', 'Persistent'] },
  { id: 'jerry', name: 'Jerry', traits: ['Smart', 'Funny', 'Quick'] },
  { id: 'po', name: 'Po', traits: ['Brave', 'Funny', 'KungFuMaster'] },
  { id: 'doraemon', name: 'Doraemon', traits: ['Helpful', 'Smart', 'GadgetMaster'] },
  { id: 'spongebob', name: 'SpongeBob', traits: ['Funny', 'Happy', 'Helpful'] },
  { id: 'shinchan', name: 'Shinchan', traits: ['Funny', 'Brave', 'Mischievous'] },
  { id: 'goku', name: 'Goku', traits: ['Brave', 'Strong', 'Fighter'] },
  { id: 'bheem', name: 'Chhota Bheem', traits: ['Brave', 'Strong', 'Helpful'] },
  { id: 'motu', name: 'Motu', traits: ['Funny', 'Foodie', 'Strong'] },
  { id: 'patlu', name: 'Patlu', traits: ['Smart', 'Helpful', 'Clever'] },
  { id: 'dora', name: 'Dora', traits: ['Adventurous', 'Curious', 'Helpful'] },
  { id: 'mickey', name: 'Mickey', traits: ['Cheerful', 'Friendly', 'Brave'] },
  { id: 'elsa', name: 'Elsa', traits: ['Magical', 'Brave', 'Protective'] },
  { id: 'spiderman', name: 'Spider-Man', traits: ['Brave', 'Smart', 'Agile'] },
  { id: 'mcqueen', name: 'Lightning McQueen', traits: ['Fast', 'Determined', 'Friendly'] },
  { id: 'minion', name: 'Minion', traits: ['Funny', 'Loyal', 'Clumsy'] },
  { id: 'scooby', name: 'Scooby-Doo', traits: ['Funny', 'Loyal', 'Cowardly'] }
];

const genAI = new GoogleGenerativeAI(process.env.VITE_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

async function generate() {
  const fallbackDatabase = {};
  console.log(`Starting to generate fallback questions for ${characters.length} characters...`);
  
  for (let i = 0; i < characters.length; i++) {
    const char = characters[i];
    console.log(`[${i+1}/${characters.length}] Generating 25 questions for ${char.name}...`);
    
    const prompt = `
      You are generating a permanent backup database of personality quiz questions for 2nd graders.
      The character is: ${char.name}.
      Traits: ${char.traits.join(', ')}
      
      You must write exactly 25 entirely unique, fun, and interactive multiple-choice questions (A, B, C) for this specific character.
      This corresponds to 5 sets of 5 questions. Do not repeat concepts.
      Keep it incredibly simple for a 7/8-year-old child to read.
      
      Option A should strongly match the character.
      Option B should somewhat match.
      Option C should be a completely opposite or silly action.
      
      Format your response strictly as a JSON array of 25 objects:
      [
        {
          "question": "[Question text]",
          "options": ["[Option A]", "[Option B]", "[Option C]"]
        }
      ]
      
      NO Markdown wrappers. ALL 25 questions must be perfectly formatted JSON.
    `;

    try {
      const result = await model.generateContent(prompt);
      let text = result.response.text().trim();
      
      if (text.startsWith("```json")) text = text.slice(7);
      if (text.endsWith("```")) text = text.slice(0, -3);
      
      const parsed = JSON.parse(text);
      if (!Array.isArray(parsed) || parsed.length < 5) throw new Error("Invalid array returned");
      
      fallbackDatabase[char.id] = parsed;
      console.log(`✅ ${char.name} successful (${parsed.length} questions).`);
    } catch (e) {
      console.error(`❌ ${char.name} failed:`, e.message);
      // Fallback dummy questions
      fallbackDatabase[char.id] = [
        { "question": "What is your favorite color?", "options": ["Red!", "Blue!", "Green!"] },
        { "question": "What do you like to eat?", "options": ["Pizza!", "Apples!", "Nothing!"] },
        { "question": "Where would you go on an adventure?", "options": ["The Moon!", "The Beach!", "My room!"] },
        { "question": "Who is your best friend?", "options": ["A dog!", "A tiger!", "A ghost!"] },
        { "question": "What is your superpower?", "options": ["Flying!", "Invisibility!", "Sleeping!"] }
      ];
    }
    
    // Slight delay to prevent hitting API quotas
    await delay(3000);
  }
  
  fs.writeFileSync('fallbackQuestions.json', JSON.stringify(fallbackDatabase, null, 2));
  console.log(`\n🎉 Finished! Saved to fallbackQuestions.json`);
}

generate();
