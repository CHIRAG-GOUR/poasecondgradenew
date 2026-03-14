const fs = require('fs');

const fullPath = 'src/data/fallbackQuestions.json';
const db = JSON.parse(fs.readFileSync(fullPath, 'utf8'));

// Inject unique IDs for every question and option so CharacterContext tracking works.
for (const charId in db) {
  db[charId] = db[charId].map((q, qIndex) => {
    return {
      id: `${charId}_q${qIndex}`, // unique question ID
      question: q.question,
      options: q.options.map((opt, optIndex) => ({
        id: `${charId}_q${qIndex}_opt${optIndex}`, // unique option ID
        text: opt.text
      }))
    };
  });
}

fs.writeFileSync(fullPath, JSON.stringify(db, null, 2));
console.log("Successfully injected unique tracking IDs into all offline questions!");
