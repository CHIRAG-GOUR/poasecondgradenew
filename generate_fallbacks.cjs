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
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

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
      
      You must write exactly 25 entirely unique, scenario-based multiple-choice questions (A, B, C) that place the child directly in ${char.name}'s world.
      
      CRITICAL INSTRUCTION: **DO NOT ASK GENERIC QUESTIONS.** 
      Do NOT ask "What is your favorite color?", "What do you like to eat?", "Who is your best friend?".
      Instead, ask highly specific, engaging scenarios. Example: "A giant monster is attacking your neighborhood! How do you save everyone like ${char.name}?" or "You find a mysterious glowing map, what do you do?"
      
      This corresponds to 5 sets of 5 questions. Do not repeat concepts.
      Keep the language fun, exciting, and simple for a 7/8-year-old child to read.
      
      Option A should strongly match ${char.name}'s traits.
      Option B should somewhat match.
      Option C should be a completely opposite or silly action.
      
      Format your response strictly as a JSON array of 25 objects:
      [
        {
          "question": "[Engaging Scenario Question]",
          "options": [
            { "text": "[Option A]" },
            { "text": "[Option B]" },
            { "text": "[Option C]" }
          ]
        }
      ]
      
      NO Markdown wrappers. ALL 25 questions must be perfectly formatted JSON.
    `;

    let success = false;
    let attempts = 0;
    
    while (!success && attempts < 3) {
      try {
        attempts++;
        const result = await model.generateContent(prompt);
        let text = result.response.text().trim();
        
        if (text.startsWith("```json")) text = text.slice(7);
        if (text.endsWith("```")) text = text.slice(0, -3);
        
        const parsed = JSON.parse(text);
        if (!Array.isArray(parsed) || parsed.length < 5) throw new Error("Invalid array returned");
        
        fallbackDatabase[char.id] = parsed;
        console.log(`✅ ${char.name} successful (${parsed.length} questions).`);
        success = true;
      } catch (e) {
        console.error(`❌ ${char.name} failed (Attempt ${attempts}):`, e.message);
        await delay(5000); // Wait longer on fail
      }
    }
    
    if (!success) {
      console.error(`🚨 FALLBACK HIT FOR ${char.name} - Using extreme backup.`);
      // Extreme fallback only if absolutely necessary
      fallbackDatabase[char.id] = [
        { "question": `You see a villain trying to steal the neighborhood's snacks! What do you do?`, "options": [{ "text": `Stop them like ${char.name}!` }, { "text": "Call for backup!" }, { "text": "Run away!" }] },
        { "question": `You find a magical gadget on the ground. How do you use it?`, "options": [{ "text": `Use it to help my friends!` }, { "text": "Try to figure out how it works." }, { "text": "Leave it alone." }] },
        { "question": `Your friends are lost in a spooky forest. How do you lead them out?`, "options": [{ "text": `Bravely march forward!` }, { "text": "Look for clues on the ground." }, { "text": "Cry until someone finds us." }] },
        { "question": `It's time for the ultimate tournament! How do you prepare?`, "options": [{ "text": `Train super hard all day!` }, { "text": "Eat a big meal for energy." }, { "text": "Take a nap." }] },
        { "question": `Someone dropped their wallet on the street. What's your move?`, "options": [{ "text": `Pick it up and find the owner!` }, { "text": "Give it to a police officer." }, { "text": "Ignore it." }] }
      ];
    }
    
    // Increased delay to prevent hitting API quotas
    await delay(4000);
  }
  
  fs.writeFileSync('src/data/fallbackQuestions.json', JSON.stringify(fallbackDatabase, null, 2));
  console.log(`\n🎉 Finished! Saved to src/data/fallbackQuestions.json`);
}

generate();
