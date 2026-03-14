const BACKEND_URL = 'http://localhost:3001/api/gemini';

/**
 * Generates 5 personality questions based on a specific character.
 * @param {Object} character 
 * @returns {Promise<Array>} Array of question objects
 */
export async function generateCharacterQuestions(character) {
  try {
    const res = await fetch(`${BACKEND_URL}/questions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        characterName: character.name,
        characterDescription: character.description,
        traits: character.traits,
        topTraits: Object.entries(character.scores || {})
          .sort(([,a], [,b]) => b - a).slice(0,3)
          .map(([k]) => ({ name: k, description: `High ${k}` }))
      })
    });
    
    if (!res.ok) throw new Error("Failed to fetch questions from backend");
    return await res.json();
  } catch (error) {
    console.error("Backend Error - Questions:", error);
    return null; // Fallback handled appropriately by caller
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
    return null;
  }
}
