const fs = require('fs');

const data = {
  naruto: [
    { question: "A villain is attacking the Hidden Leaf Village! What do you do?", options: [{ text: "Use Shadow Clones to fight him!" }, { text: "Call for the Hokage!" }, { text: "Run away crying." }] },
    { question: "Your friend is feeling sad. How do you cheer them up?", options: [{ text: "Buy them a bowl of Ichiraku Ramen!" }, { text: "Give them a high-five." }, { text: "Ignore them." }] },
    { question: "You need to learn a super hard jutsu. How do you train?", options: [{ text: "Practice all night until I master it!" }, { text: "Read a book about it." }, { text: "Give up, it's too hard." }] },
    { question: "The ninja exams are tomorrow!", options: [{ text: "I'm pumped and ready to win!" }, { text: "I guess I'll study a bit." }, { text: "I'm going back to sleep." }] },
    { question: "Someone stole your friend's scroll!", options: [{ text: "Chase them down using ninja speed!" }, { text: "Tell a teacher about it." }, { text: "It's not my problem." }] }
  ],
  pikachu: [
    { question: "Team Rocket is trying to steal your snacks! What do you do?", options: [{ text: "Use Thunderbolt to zap them!" }, { text: "Run behind Ash for cover." }, { text: "Share the snacks with them." }] },
    { question: "A wild Pokémon appears! How do you greet them?", options: [{ text: "Say 'Pika Pika!' with a big smile." }, { text: "Wave shyly from a distance." }, { text: "Ignore them completely." }] },
    { question: "You find a shiny Thunder Stone!", options: [{ text: "Refuse it, I like being me!" }, { text: "Put it in my backpack." }, { text: "Throw it in the river." }] },
    { question: "Ash wants to train for the Gym Battle.", options: [{ text: "Jump up and down with electric energy!" }, { text: "Sit under a tree and watch." }, { text: "Take a nap instead." }] },
    { question: "You see ketchup on the table!", options: [{ text: "Hug the bottle, it's my favorite!" }, { text: "Put some on my fries." }, { text: "Push it off the table." }] }
  ],
  tom: [
    { question: "You see a tiny mouse hole in the wall. What's your plan?", options: [{ text: "Set up a clever (but clumsy) trap!" }, { text: "Wait patiently outside." }, { text: "Go to sleep." }] },
    { question: "The house owner gave you a bowl of milk.", options: [{ text: "Drink it all happily!" }, { text: "Save it for later." }, { text: "Spill it on purpose." }] },
    { question: "A bulldog is sleeping in the yard.", options: [{ text: "Sneak past him on tiptoes!" }, { text: "Walk normally." }, { text: "Pull his ears!" }] },
    { question: "You finally caught the mouse!", options: [{ text: "Let him go because we're secretly friends." }, { text: "Show him to the owner." }, { text: "Eat him." }] },
    { question: "A piano is falling from the sky!", options: [{ text: "Hold up a tiny umbrella!" }, { text: "Run away very fast." }, { text: "Stand still and wait." }] }
  ],
  jerry: [
    { question: "A cat is guarding the refrigerator!", options: [{ text: "Sneak through a tiny mouse hole!" }, { text: "Wait for the cat to fall asleep." }, { text: "Walk up and ask for cheese." }] },
    { question: "You found a giant block of Swiss cheese!", options: [{ text: "Roll it all the way home!" }, { text: "Eat a tiny piece." }, { text: "Leave it there." }] },
    { question: "The cat set up a mouse trap.", options: [{ text: "Carefully steal the cheese without snapping it." }, { text: "Walk around it." }, { text: "Step right on it." }] },
    { question: "You found a tiny hammer.", options: [{ text: "Use it to bonk the cat on the foot!" }, { text: "Fix my mouse house." }, { text: "Throw it away." }] },
    { question: "The dog starts chasing the cat.", options: [{ text: "Laugh and eat cheese while watching." }, { text: "Run away with them." }, { text: "Try to stop the fight." }] }
  ],
  po: [
    { question: "Tai Lung has returned! How do you stop him?", options: [{ text: "Use the Wuxi Finger Hold! Skadoosh!" }, { text: "Ask the Furious Five for help." }, { text: "Hide in the noodle shop." }] },
    { question: "Master Shifu tells you to train before eating.", options: [{ text: "Train super hard so I can have dumplings!" }, { text: "Do a little bit of training." }, { text: "Cry and refuse to train." }] },
    { question: "You find the legendary Dragon Scroll!", options: [{ text: "Open it and realize the power was inside me!" }, { text: "Put it back on the ceiling." }, { text: "Use it as a napkin." }] },
    { question: "A giant bowl of noodles is on the table.", options: [{ text: "Eat it all in one giant slurp!" }, { text: "Eat it slowly with chopsticks." }, { text: "Throw it at a wall." }] },
    { question: "You trip and fall down 100 stairs.", options: [{ text: "Bounce down happily because I'm squishy!" }, { text: "Complain the whole way down." }, { text: "Cry at the bottom." }] }
  ],
  doraemon: [
    { question: "Nobita is crying about his homework again. What do you do?", options: [{ text: "Pull a futuristic gadget from my 4D pocket!" }, { text: "Tell him to do it himself." }, { text: "Do his homework for him." }] },
    { question: "You find a plate of Dorayaki (red bean pancakes)!", options: [{ text: "Eat all of them instantly!" }, { text: "Save some for Nobita." }, { text: "Throw them in the trash." }] },
    { question: "Gian is bullying someone at the playground.", options: [{ text: "Use the Any-Where Door to escape!" }, { text: "Ask him to stop." }, { text: "Join Gian." }] },
    { question: "There's a mouse in the room!", options: [{ text: "Scream, jump on the table, and faint!" }, { text: "Try to catch it calmly." }, { text: "Pet it." }] },
    { question: "We need to travel back in time to fix a mistake.", options: [{ text: "Jump into the Time Machine in the desk drawer!" }, { text: "Use a regular airplane." }, { text: "Give up." }] }
  ],
  spongebob: [
    { question: "Mr. Krabs needs you to flip Krabby Patties fast!", options: [{ text: "Use my golden spatula! I'm ready!" }, { text: "Flip them as normal." }, { text: "Quit my job and go home." }] },
    { question: "Plankton is trying to steal the secret formula!", options: [{ text: "Protect it using the power of imagination!" }, { text: "Tell Mr. Krabs." }, { text: "Give it to Plankton." }] },
    { question: "You have a day off at Jellyfish Fields.", options: [{ text: "Run around with my jellyfish net singing!" }, { text: "Sit quietly on a rock." }, { text: "Go back to work for free." }] },
    { question: "Squidward asks you to be quiet.", options: [{ text: "Laugh my special laugh and keep playing!" }, { text: "Whisper very quietly." }, { text: "Yell as loud as I can." }] },
    { question: "You need to learn how to drive a boat.", options: [{ text: "Panic and crash the boat immediately!" }, { text: "Drive carefully." }, { text: "Walk instead." }] }
  ],
  shinchan: [
    { question: "Your mom asks you to clean your room.", options: [{ text: "Do a funny dance and run away!" }, { text: "Clean it up slowly." }, { text: "Cry until she cleans it." }] },
    { question: "You see pretty Action Kamen toys at the store.", options: [{ text: "Beg mom and roll on the floor!" }, { text: "Ask politely once." }, { text: "Walk past the toys." }] },
    { question: "A stranger talks to you in the park.", options: [{ text: "Say something totally embarrassing!" }, { text: "Say hello nicely." }, { text: "Run away screaming." }] },
    { question: "You find a box of Chocobi snacks!", options: [{ text: "Eat the whole box in 3 seconds!" }, { text: "Save them for after dinner." }, { text: "Throw them away." }] },
    { question: "It's time to play with Shiro (your dog).", options: [{ text: "Roll him into a fuzzy snowball!" }, { text: "Take him for a normal walk." }, { text: "Leave him inside." }] }
  ],
  goku: [
    { question: "A super strong alien wants to destroy the planet!", options: [{ text: "Get super excited for a good fight and power up!" }, { text: "Try to talk it out with them." }, { text: "Run away in fear." }] },
    { question: "You just finished a 10-hour training session.", options: [{ text: "Eat 50 bowls of rice and meat immediately!" }, { text: "Drink some water and rest." }, { text: "Go straight to sleep." }] },
    { question: "Someone tells you they are the strongest in the universe.", options: [{ text: "Say 'Wow, let's fight right now!'" }, { text: "Don't believe them." }, { text: "Cry because I want to be strongest." }] },
    { question: "You need to travel very far, very fast.", options: [{ text: "Use Instant Transmission!" }, { text: "Ride the Flying Nimbus cloud." }, { text: "Walk." }] },
    { question: "Your friends are badly hurt in battle.", options: [{ text: "Give them a magic Senzu Bean!" }, { text: "Call an ambulance." }, { text: "Run away to save myself." }] }
  ],
  bheem: [
    { question: "Dholakpur is under attack by a magical demon!", options: [{ text: "Eat some Laddoos and gain super strength!" }, { text: "Tell the King about it." }, { text: "Hide in my house." }] },
    { question: "Tuntun Mausi made a fresh batch of Laddoos.", options: [{ text: "Ask politely and eat a giant handful!" }, { text: "Save them for the village." }, { text: "Throw them on the ground." }] },
    { question: "Kalia is challenging you to a wrestling match.", options: [{ text: "Accept with a smile and win easily!" }, { text: "Refuse the challenge." }, { text: "Run away crying." }] },
    { question: "You need to help Chutki carry heavy baskets.", options: [{ text: "Carry all of them on my head!" }, { text: "Help her carry one." }, { text: "Tell her to carry them herself." }] },
    { question: "A tiger has escaped the jungle!", options: [{ text: "Wrestle the tiger and tame him!" }, { text: "Call the forest guards." }, { text: "Ignore the tiger." }] }
  ],
  motu: [
    { question: "You are feeling very, very hungry.", options: [{ text: "Eat hundreds of Samosas immediately!" }, { text: "Eat a normal sandwich." }, { text: "Drink some water." }] },
    { question: "John the Don is causing trouble in Furfuri Nagar!", options: [{ text: "Get Samosa power and bash him up!" }, { text: "Tell Inspector Chingum." }, { text: "Run away." }] },
    { question: "You have an empty stomach.", options: [{ text: "Cry that my brain isn't working!" }, { text: "Wait patiently for lunch." }, { text: "I don't care." }] },
    { question: "Patlu has a brilliant plan to catch a thief.", options: [{ text: "Accidentally ruin the plan by doing something silly!" }, { text: "Follow the plan perfectly." }, { text: "Go to sleep instead." }] },
    { question: "You see a chaiwala (tea seller) making fresh samosas.", options: [{ text: "Run over and buy the whole batch!" }, { text: "Buy just one." }, { text: "Walk past it." }] }
  ],
  patlu: [
    { question: "Motu is stuck in a giant trap!", options: [{ text: "Think super fast and invent a clever gadget to save him!" }, { text: "Call for help." }, { text: "Leave him there." }] },
    { question: "John the Don challenges you to a battle of wits.", options: [{ text: "Outsmart him with my brain power!" }, { text: "Try to fight him with my fists." }, { text: "Run away." }] },
    { question: "Motu ate all your food.", options: [{ text: "Sigh and say 'Oh Motu...'" }, { text: "Get really angry and yell." }, { text: "Smile and hug him." }] },
    { question: "You found a complicated puzzle box.", options: [{ text: "Solve it in 5 seconds!" }, { text: "Read the instructions." }, { text: "Smash it with a hammer." }] },
    { question: "You need to cross a broken bridge.", options: [{ text: "Use math and ropes to swing across perfectly." }, { text: "Walk around the river." }, { text: "Jump and hope for the best." }] }
  ],
  dora: [
    { question: "Swiper the Fox is trying to sneak up!", options: [{ text: "Yell 'Swiper, no swiping!' three times!" }, { text: "Hide behind a tree." }, { text: "Let him swipe my things." }] },
    { question: "We don't know the way to the Snowy Mountains!", options: [{ text: "Look in the magical Backpack!" }, { text: "Ask Map!" }, { text: "Give up and go home." }] },
    { question: "Boots the Monkey is stuck in a tall tree.", options: [{ text: "Find a vine to climb up and save him!" }, { text: "Call a firefighter." }, { text: "Leave him there." }] },
    { question: "We found a secret Spanish phrase on a door.", options: [{ text: "Read it out loud: ¡Abrete!" }, { text: "Ignore it." }, { text: "Break the door." }] },
    { question: "You need to cross the Troll Bridge.", options: [{ text: "Solve the Grumpy Old Troll's riddle!" }, { text: "Swim across the river instead." }, { text: "Cry." }] }
  ],
  mickey: [
    { question: "Pete is causing trouble in the clubhouse!", options: [{ text: "Use a Mouseketool to fix the problem! Hot Dog!" }, { text: "Tell him to go away." }, { text: "Hide in the closet." }] },
    { question: "Donald Duck is getting very angry.", options: [{ text: "Say 'Oh boy!' and try to calm him down." }, { text: "Laugh at him." }, { text: "Yell back at him." }] },
    { question: "You need a special tool to open a door.", options: [{ text: "Call Toodles for a Mouseketool!" }, { text: "Kick the door open." }, { text: "Walk away." }] },
    { question: "It's time for the Hot Dog Dance!", options: [{ text: "Dance and sing along happily!" }, { text: "Sit perfectly still." }, { text: "Cover my ears." }] },
    { question: "You found Pluto lost in the park.", options: [{ text: "Give him a big hug and a bone!" }, { text: "Pat him on the head." }, { text: "Run away from him." }] }
  ],
  elsa: [
    { question: "The kingdom of Arendelle is in danger!", options: [{ text: "Use my ice magic to build a giant shield!" }, { text: "Ask Anna to save it." }, { text: "Run up the North Mountain." }] },
    { question: "You need to cross a giant river of water.", options: [{ text: "Freeze the water and run across!" }, { text: "Build a wooden boat." }, { text: "Swim across normally." }] },
    { question: "Someone asks to see your powers.", options: [{ text: "Shoot beautiful snowflakes into the sky!" }, { text: "Hide my hands in my pockets." }, { text: "Throw a snowball at them." }] },
    { question: "Olaf is melting in the summer sun!", options: [{ text: "Create a magical personal snow flurry for him!" }, { text: "Put him in a freezer." }, { text: "Let him melt." }] },
    { question: "It's time to let it go.", options: [{ text: "Sing loudly and build an ice castle!" }, { text: "Whisper quietly." }, { text: "Stay silent." }] }
  ],
  spiderman: [
    { question: "The Green Goblin is flying over the city!", options: [{ text: "Shoot a web and swing into action!" }, { text: "Call the police." }, { text: "Hide under a car." }] },
    { question: "You need to stop a falling train car.", options: [{ text: "Shoot hundreds of webs to hold it back!" }, { text: "Push it with my bare hands." }, { text: "Let it crash." }] },
    { question: "Your Spidey-Sense starts tingling!", options: [{ text: "Do a backflip to dodge the danger!" }, { text: "Look around slowly." }, { text: "Ignore it." }] },
    { question: "You are late for school.", options: [{ text: "Web-swing through the city to get there fast!" }, { text: "Take the bus." }, { text: "Skip school." }] },
    { question: "You need to take a picture of Spider-Man for the newspaper.", options: [{ text: "Set up a camera with a web-timer and take a selfie!" }, { text: "Draw a picture instead." }, { text: "Quit my job." }] }
  ],
  mcqueen: [
    { question: "You are in the final lap of the Piston Cup!", options: [{ text: "Say 'Kachow!' and speed past everyone!" }, { text: "Drive at a normal speed." }, { text: "Stop driving." }] },
    { question: "Mater needs help towing a heavy truck.", options: [{ text: "Use my engine power to help pull him!" }, { text: "Watch him struggle." }, { text: "Drive away fast." }] },
    { question: "You need a new paint job before the big race.", options: [{ text: "Get shiny red paint with lightning bolts!" }, { text: "Get boring grey paint." }, { text: "Don't get painted." }] },
    { question: "The track is covered in dirt and mud.", options: [{ text: "Drift around the corners perfectly!" }, { text: "Drive very slowly." }, { text: "Crash into the wall." }] },
    { question: "You see a fan holding your cheering sign.", options: [{ text: "Rev my engine and flash my headlights!" }, { text: "Drive past quietly." }, { text: "Honk angrily." }] }
  ],
  minion: [
    { question: "Gru gives you a very important laser gun to hold.", options: [{ text: "Accidentally shoot my friend and laugh ('Hehe, bottom')!" }, { text: "Hold it very carefully." }, { text: "Throw it in the trash." }] },
    { question: "You see a giant banana on the table.", options: [{ text: "Yell 'BANANA!' and tackle the table!" }, { text: "Eat it politely." }, { text: "Ignore the banana." }] },
    { question: "You are supposed to be building a rocket.", options: [{ text: "Sing a weird gibberish song and hit things with a wrench!" }, { text: "Read the blueprints." }, { text: "Take a nap." }] },
    { question: "Another minion sticks his tongue out at you.", options: [{ text: "Start a giant slap fight!" }, { text: "Ignore him." }, { text: "Cry." }] },
    { question: "Agnes needs a new unicorn toy.", options: [{ text: "Build a chaotic toy out of garbage and glue!" }, { text: "Go to the store." }, { text: "Tell her no." }] }
  ],
  scooby: [
    { question: "You are exploring a haunted, spooky house.", options: [{ text: "Jump into Shaggy's arms and shake with fear!" }, { text: "Walk bravely with a flashlight." }, { text: "Chase the ghost." }] },
    { question: "Velma offers you a Scooby Snack.", options: [{ text: "Eat it instantly and get brave!" }, { text: "Say 'No thank you'." }, { text: "Throw it on the floor." }] },
    { question: "The ghost is chasing you down the hallway!", options: [{ text: "Run through a bunch of crazy doors in a sequence!" }, { text: "Stand still and punch the ghost." }, { text: "Wait to be caught." }] },
    { question: "You hear a scary noise in the kitchen.", options: [{ text: "Hide under the table." }, { text: "Go outside." }, { text: "Scream 'Ruh-Roh!'" }] },
    { question: "Fred caught the monster in a trap.", options: [{ text: "Pull off the monster's rubber mask!" }, { text: "Watch him do it." }, { text: "Run away again." }] }
  ]
};

const fullPath = 'src/data/fallbackQuestions.json';
fs.writeFileSync(fullPath, JSON.stringify(data, null, 2));
console.log("Successfully wrote 95 high-quality scenario questions perfectly bypassing API limits!");
