const fs = require('fs');
const path = require('path');
const https = require('https');
const tts = require('google-tts-api');
const cheerio = require('cheerio');

const characters = [
  { id: 'naruto', name: 'Naruto', themeQuery: 'naruto theme' },
  { id: 'pikachu', name: 'Pikachu', themeQuery: 'pokemon theme' },
  { id: 'tom', name: 'Tom', themeQuery: 'tom and jerry theme' },
  { id: 'jerry', name: 'Jerry', themeQuery: 'tom and jerry theme' },
  { id: 'po', name: 'Po', themeQuery: 'kung fu panda theme' },
  { id: 'doraemon', name: 'Doraemon', themeQuery: 'doraemon theme' },
  { id: 'spongebob', name: 'SpongeBob', themeQuery: 'spongebob theme' },
  { id: 'shinchan', name: 'Shinchan', themeQuery: 'shinchan theme' },
  { id: 'goku', name: 'Goku', themeQuery: 'dragon ball z theme' },
  { id: 'bheem', name: 'Chhota Bheem', themeQuery: 'chhota bheem theme' },
  { id: 'motu', name: 'Motu', themeQuery: 'motu patlu theme' },
  { id: 'patlu', name: 'Patlu', themeQuery: 'motu patlu theme' },
  { id: 'elsa', name: 'Elsa', themeQuery: 'let it go frozen' },
  { id: 'mcqueen', name: 'Lightning McQueen', themeQuery: 'life is a highway cars' },
  { id: 'mickey', name: 'Mickey Mouse', themeQuery: 'mickey mouse clubhouse theme' },
  { id: 'minion', name: 'Minion', themeQuery: 'minions banana song' },
  { id: 'scooby', name: 'Scooby-Doo', themeQuery: 'scooby doo theme' },
  { id: 'spiderman', name: 'Spider-Man', themeQuery: 'spiderman theme' },
  { id: 'dora', name: 'Dora', themeQuery: 'dora the explorer theme' },
];

const ANN_DIR = path.join(__dirname, 'public', 'sounds', 'announcements');
const THEMES_DIR = path.join(__dirname, 'public', 'sounds', 'themes');

if (!fs.existsSync(ANN_DIR)) fs.mkdirSync(ANN_DIR, { recursive: true });
if (!fs.existsSync(THEMES_DIR)) fs.mkdirSync(THEMES_DIR, { recursive: true });

async function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return downloadFile(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        reject(new Error(`Failed to download ${url}: ${res.statusCode}`));
        return;
      }
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

// 1. Download TTS Announcer files
async function fetchAnnouncers() {
  for (const char of characters) {
    const dest = path.join(ANN_DIR, `${char.id}.mp3`);
    if (fs.existsSync(dest)) continue;
    try {
      // Use an energetic/loud string and a language that has a good deep voice if possible
      // standard en-US is fine, we'll pitch it down in the browser
      const url = tts.getAudioUrl(`${char.name}!`, {
        lang: 'en-GB', // GB voice often sounds a bit deeper/more formal
        slow: false,
        host: 'https://translate.google.com',
      });
      await downloadFile(url, dest);
      console.log(`✅ Downloaded announcer for ${char.name}`);
    } catch (e) {
      console.error(`❌ Failed announcer for ${char.name}:`, e.message);
    }
    await new Promise(r => setTimeout(r, 500)); // be nice to api
  }
}

// 2. Scrape MyInstants for Theme Songs
async function fetchThemes() {
  // Use node-fetch via dynamic import
  const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
  
  for (const char of characters) {
    // using the mapping in activityData: /sounds/themes/naruto.mp3, etc.
    // However, in activityData.js the theme keys are generic (e.g. pokemon, tomjerry). 
    // We should name it exactly as char.id to fix the mismatches easily.
    const dest = path.join(THEMES_DIR, `${char.id}.mp3`);
    if (fs.existsSync(dest)) continue;
    
    try {
      const resp = await fetch(`https://www.myinstants.com/en/search/?name=${encodeURIComponent(char.themeQuery)}`);
      const html = await resp.text();
      const $ = cheerio.load(html);
      
      let foundAudioUrl = null;
      // Find the first instance button
      $('.instant').each((i, el) => {
        const onclick = $(el).find('button.small-button').attr('onclick');
        if (onclick) {
          // play('.../media/sounds/something.mp3')
          const match = onclick.match(/play\(['"]([^'"]+)['"]/);
          if (match && match[1]) {
            foundAudioUrl = 'https://www.myinstants.com' + match[1];
            return false; // break loop
          }
        }
      });
      
      if (foundAudioUrl) {
        await downloadFile(foundAudioUrl, dest);
        console.log(`🥊 Downloaded theme for ${char.name}`);
      } else {
        console.log(`⚠️ No theme found on MyInstants for ${char.name} (${char.themeQuery})`);
      }
    } catch (e) {
      console.error(`❌ Failed theme for ${char.name}:`, e.message);
    }
    await new Promise(r => setTimeout(r, 1000)); // be nice to myinstants
  }
}

async function main() {
  console.log("Downloading announcer files...");
  await fetchAnnouncers();
  console.log("\nSearching and downloading theme songs from MyInstants...");
  await fetchThemes();
  console.log("\nComplete!");
}

main();
