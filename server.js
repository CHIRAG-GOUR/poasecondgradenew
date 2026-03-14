require('dotenv').config({ path: '.env.local' });
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// Initialize Google Gemini
const apiKey = process.env.VITE_GEMINI_API_KEY;
if (!apiKey) {
  console.error("FATAL ERROR: VITE_GEMINI_API_KEY is missing from .env.local");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

// Route: Generate Questions
app.post('/api/gemini/questions', async (req, res) => {
  try {
    const { characterName, characterDescription, traits, topTraits } = req.body;
    
    const prompt = `
      You are an engaging kids' game host for 2nd graders!
      The player has selected the character: ${characterName}.
      Character Description: ${characterDescription}
      Character Traits: ${traits.join(', ')}

      Based on these top traits:
      ${topTraits.map(t => `- ${t.name}: ${t.description}`).join('\n')}

      Write exactly 5 fun, interactive personality questions to ask the child to see if they are similar to ${characterName}.
      
      RULES:
      1. Keep language super simple, fun, and easy for a 7/8-year-old child to understand.
      2. Each question MUST ONLY have 3 options (A, B, C).
      3. Option A should strongly match the character's traits.
      4. Option B should somewhat match.
      5. Option C should be the opposite or a silly distraction.
      6. Provide the response as a valid JSON array of objects.

      FORMAT:
      [
        {
          "question": "[The fun question]",
          "options": ["[Option A]", "[Option B]", "[Option C]"]
        }
      ]
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    
    let text = result.response.text().trim();
    if (text.startsWith("```json")) text = text.slice(7);
    if (text.endsWith("```")) text = text.slice(0, -3);

    const questions = JSON.parse(text);
    res.json(questions);
  } catch (error) {
    console.error("Gemini API Error (Questions):", error);
    res.status(500).json({ error: "Failed to generate questions" });
  }
});

// Route: Generate Report
app.post('/api/gemini/report', async (req, res) => {
  try {
    const { studentName, characterName, traits, answers } = req.body;
    
    // Convert answers dictionary into an array of strings
    const answerList = Object.entries(answers).map(([qIdx, answer]) => `Q: ${answer.question} | A: ${answer.selectedOption}`);
    
    const prompt = `
      You are generating a highly personalized "Hero Report Card" for a 2nd-grade student named ${studentName} who picked ${characterName} as their favorite hero.
      
      The student answered these 5 questions indicating their choices:
      ${answerList.join('\n')}
      
      Character Traits of ${characterName}: ${traits.join(', ')}

      Based entirely on their answers, generate a personalized report in exactly this JSON format:
      {
        "relationship": "A 2-3 sentence extremely encouraging paragraph telling ${studentName} exactly why they are like ${characterName} based on their answers. Use their name. Make it exciting and heroic!",
        "matchPercentage": [A number between 40 and 99 representing how perfectly their answers align with ${characterName}],
        "topQualities": [
          {"name": "Short Quality Name (e.g. Brainiac)", "emoji": "🧠"},
          {"name": "Quality 2", "emoji": "⚡"},
          {"name": "Quality 3", "emoji": "🎯"}
        ],
        "combatStats": {
          "power": [Number 1-100],
          "fightIq": [Number 1-100],
          "speed": [Number 1-100],
          "cuteness": [Number 1-100],
          "humour": [Number 1-100],
          "bravery": [Number 1-100]
        }
      }
      
      Make the Combat Stats fun, totally subjective, and related to their specific answers. Return ONLY raw JSON without markdown formatting.
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    
    let text = result.response.text().trim();
    if (text.startsWith("```json")) text = text.slice(7);
    if (text.endsWith("```")) text = text.slice(0, -3);

    const reportData = JSON.parse(text);
    res.json(reportData);
  } catch (error) {
    console.error("Gemini API Error (Report):", error);
    res.status(500).json({ error: "Failed to generate report" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Backend server running on http://localhost:${PORT}`);
});
