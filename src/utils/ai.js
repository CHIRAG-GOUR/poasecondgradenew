import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: 'gemini-2.5-flash',
  generationConfig: {
    temperature: 0.7,
    topK: 40,
    topP: 0.95,
    maxOutputTokens: 2048,
  },
});

/**
 * Generates 5 personality questions based on a specific character.
 * @param {Object} character 
 * @returns {Promise<Array>} Array of question objects
 */
export async function generateCharacterQuestions(character) {
  const prompt = `
You are designing an engaging personality quiz for 2nd grade kids.
The child has just selected the character: ${character.name}.
Their traits are: ${character.traits.join(', ')}.
Their lore is: ${character.description}.

Generate exactly 5 fun, simple, and imaginative multiple-choice questions (4 options each: A, B, C, D) to find out how much the child is like ${character.name}.
The questions should put the child in fun fictional scenarios related to the character's world or personality.

For each option, assign a "traits" object that maps to the following standard combat stats using numbers from 0 to 5 (where 5 is highest correlation to that stat):
brave, funny, helpful, curious, smart, adventurous

IMPORTANT: You MUST return ONLY a valid JSON array of exactly 5 objects. No markdown formatting, no code blocks, just the JSON array.

Example format:
[
  {
    "id": "q1",
    "question": "You see a giant bowl of noodles! What do you do?",
    "options": [
      { "id": "A", "text": "Eat it all in one bite like Po!", "traits": { "funny": 5, "adventurous": 3 } },
      { "id": "B", "text": "Share it with my friends.", "traits": { "helpful": 5, "smart": 2 } },
      { "id": "C", "text": "Save it for later in my backpack.", "traits": { "smart": 4, "curious": 2 } },
      { "id": "D", "text": "Use the noodles as a rope to swing!", "traits": { "brave": 4, "adventurous": 5 } }
    ]
  }
]
`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    // Clean up potential markdown formatting
    const cleanedText = text.replace(/```json\n|\n```|```/g, '').trim();
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("Error generating character questions:", error);
    // Fallback static questions if AI fails
    return null;
  }
}

/**
 * Generates the final dynamic report based on the student's answers.
 * @param {Object} studentInfo { name, className, section }
 * @param {Object} character The selected character
 * @param {Array} userAnswers Array of objects { question: "...", answer: "..." }
 * @returns {Promise<Object>} The generated report data
 */
export async function generateDynamicReport(studentInfo, character, userAnswers) {
  const prompt = `
You are generating a final "Hero Report Card" for a 2nd grade student named ${studentInfo.name} in Class ${studentInfo.className} (Section ${studentInfo.section}).
They selected the character: ${character.name}.

Here is how ${studentInfo.name} answered 5 personality questions:
${JSON.stringify(userAnswers, null, 2)}

Based heavily on these specific answers, generate a personalized character report in valid JSON format.
The tone should be highly encouraging, magical, and easy for an 8-year-old child to understand.

You must return EXACTLY this JSON structure. Do NOT wrap in markdown.
{
  "relationship": "A 2-3 sentence paragraph directly addressing the student by name, explaining EXACTLY why they are like ${character.name} based heavily on their specific quiz answers.",
  "matchPercentage": <number between 40 and 99 representing how well their answers align with ${character.name}>,
  "combatStats": {
    "power": <number 0-100 based on their adventurous/brave answers>,
    "fightIq": <number 0-100 based on their smart/curious answers>,
    "speed": <number 0-100 based on their quick/active answers>,
    "cuteness": <number 0-100 based on their helpful/friendly answers>,
    "humour": <number 0-100 based on their funny answers>,
    "bravery": <number 0-100 based on their brave answers>
  },
  "topQualities": [
    { "emoji": "⚡", "name": "Short punchy quality name (e.g., Lightning Fast, Super Helper)" },
    { "emoji": "🛡️", "name": "Another quality" },
    { "emoji": "🌟", "name": "A third quality" }
  ]
}
`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const cleanedText = text.replace(/```json\n|\n```|```/g, '').trim();
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("Error generating dynamic report:", error);
    return null;
  }
}
