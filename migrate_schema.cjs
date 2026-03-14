const fs = require('fs');

const dbPath = './fallbackQuestions.json';
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

for (const char in db) {
  db[char] = db[char].map(q => ({
    question: q.question,
    options: q.options.map(o => (typeof o === 'string' ? { text: o } : o))
  }));
}

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
console.log("fallbackQuestions.json successfully migrated to the new schema!");
