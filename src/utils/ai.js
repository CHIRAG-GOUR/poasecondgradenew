import fallbackDatabase from '../data/fallbackQuestions.json';

const BACKEND_URL = 'http://localhost:3001/api/gemini';

/**
 * Generates 5 personality questions based on a specific character.
 * @param {Object} character 
 * @returns {Promise<Array>} Array of question objects
 */
export async function generateCharacterQuestions(character) {
  try {
    const backups = fallbackDatabase[character.id];
    
    if (!backups || backups.length === 0) {
      // Final absolute fail-safe if the character ID isn't in JSON
      return [
        { "question": "What is your favorite color?", "options": [{ "text": "Red!" }, { "text": "Blue!" }, { "text": "Green!" }] },
        { "question": "What do you like to eat?", "options": [{ "text": "Pizza!" }, { "text": "Apples!" }, { "text": "Nothing!" }] },
        { "question": "Where would you go on an adventure?", "options": [{ "text": "The Moon!" }, { "text": "The Beach!" }, { "text": "My room!" }] },
        { "question": "Who is your best friend?", "options": [{ "text": "A dog!" }, { "text": "A tiger!" }, { "text": "A ghost!" }] },
        { "question": "What is your superpower?", "options": [{ "text": "Flying!" }, { "text": "Invisibility!" }, { "text": "Sleeping!" }] }
      ];
    }
    
    // Shuffle the available 25 backup questions for this character and slice exactly 5
    const shuffled = [...backups].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 5);
  } catch (error) {
    console.error("Local Error - Questions:", error);
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
  try {
    const res = await fetch(`${BACKEND_URL}/report`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentName: studentInfo.name || "Hero",
        characterName: character.name,
        traits: character.traits,
        answers: userAnswers
      })
    });

    if (!res.ok) throw new Error("Failed to fetch report from backend");
    return await res.json();
  } catch (error) {
    console.error("Backend Error - Report:", error);
    
    // Browser-side Failover: If the server is offline or the user forgot to start the Node.js backend
    return {
      "relationship": `Wow ${studentInfo.name || "Hero"}! You are incredibly brave and smart, just like ${character.name}! Your choices show that you have the heart of a true hero!`,
      "matchPercentage": Math.floor(Math.random() * 20) + 80, // Random 80-99
      "combatStats": {
        "power": 85,
        "fightIq": 90,
        "speed": 88,
        "cuteness": 95,
        "humour": 80,
        "bravery": 99
      },
      "topQualities": [
        { "emoji": "🌟", "name": "Super Star" },
        { "emoji": "🛡️", "name": "Brave Heart" },
        { "emoji": "🧠", "name": "Smart Thinker" }
      ]
    };
  }
}
