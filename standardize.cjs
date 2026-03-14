const fs = require('fs');
const path = require('path');
const file = path.join('E:/1. Skillizee/POA 2nd Grade/src/data/activityData.js');
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/id:\s*"([^"]+)"[\s\S]*?image:\s*"([^"]+)"[\s\S]*?gif:\s*"([^"]+)"[\s\S]*?themeSong:\s*"([^"]+)"/g, (match, id, img, oldGif, oldTheme) => {
  return match
    .replace(oldGif, `/images/characters/${id}.gif`)
    .replace(oldTheme, `/sounds/themes/${id}.mp3`);
});

fs.writeFileSync(file, content);
console.log('activityData.js standardized!');
