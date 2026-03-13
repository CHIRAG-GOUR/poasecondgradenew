import urllib.request
import os

images = {
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
}

out_dir = r"E:\1. Skillizee\POA 2nd Grade\public\images"
os.makedirs(out_dir, exist_ok=True)

opener = urllib.request.build_opener()
opener.addheaders = [('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36')]
urllib.request.install_opener(opener)

for name, url in images.items():
    path = os.path.join(out_dir, name)
    try:
        urllib.request.urlretrieve(url, path)
        print(f"Downloaded {name}")
    except Exception as e:
        print(f"Failed to download {name}: {e}")
