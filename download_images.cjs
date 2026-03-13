const fs = require('fs');
const https = require('https');
const path = require('path');

const images = {
    "kungfu.jpg": "https://upload.wikimedia.org/wikipedia/en/7/76/Kungfupanda.jpg",
    "moana.png": "https://upload.wikimedia.org/wikipedia/en/2/21/Moana_%28Disney_character%29.png",
    "harry.jpg": "https://upload.wikimedia.org/wikipedia/en/d/d7/Harry_Potter_character_poster.jpg",
    "tomjerry.jpg": "https://upload.wikimedia.org/wikipedia/en/5/5f/TomandJerryTitleCardc.jpg",
    "naruto.jpg": "https://upload.wikimedia.org/wikipedia/en/9/94/NarutoCoverTankobon1.jpg",
    "elsa.png": "https://upload.wikimedia.org/wikipedia/en/5/5e/Elsa_from_Disney%27s_Frozen.png",
    "spongebob.png": "https://upload.wikimedia.org/wikipedia/en/thumb/3/3b/SpongeBob_SquarePants_character.svg/220px-SpongeBob_SquarePants_character.svg.png",
    "phineas.png": "https://upload.wikimedia.org/wikipedia/en/e/e6/Phineas_Flynn.png",
    "baymax.png": "https://upload.wikimedia.org/wikipedia/en/5/5a/Baymax_from_Big_Hero_6.png",
    "woody.png": "https://upload.wikimedia.org/wikipedia/en/8/86/Sheriff_Woody.png"
};

const outDir = path.join(__dirname, 'public', 'images');
if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
}

Object.entries(images).forEach(([name, url]) => {
    const filePath = path.join(outDir, name);
    https.get(url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
    }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
            https.get(res.headers.location, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res2) => {
                const file = fs.createWriteStream(filePath);
                res2.pipe(file);
                file.on('finish', () => console.log(`Downloaded ${name} successfully`));
            });
        } else {
            const file = fs.createWriteStream(filePath);
            res.pipe(file);
            file.on('finish', () => console.log(`Downloaded ${name} successfully`));
        }
    }).on('error', (err) => {
        console.error(`Error downloading ${name}: ${err.message}`);
    });
});
