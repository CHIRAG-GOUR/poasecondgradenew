const fs = require('fs');

const data = {
  naruto: [
    { question: "A villain is attacking your village! What do YOU do?", options: [{ text: "Jump into action and fight them!" }, { text: "Call the strongest person for help." }, { text: "Run away to a safe place." }] },
    { question: "Your best friend is feeling sad today. How do YOU cheer them up?", options: [{ text: "Take them out for a big meal!" }, { text: "Give them a high-five and a pep talk." }, { text: "Leave them alone." }] },
    { question: "You need to learn a super hard skill for a test. How do YOU practice?", options: [{ text: "Train all night until I master it!" }, { text: "Read a few books about it." }, { text: "Give up, it's too hard." }] },
    { question: "The biggest exam of the year is tomorrow!", options: [{ text: "I'm pumped! I'm ready to win!" }, { text: "I'll study a little bit." }, { text: "I'm going back to sleep." }] },
    { question: "Someone stole your classmate's favorite toy!", options: [{ text: "Chase them down and get it back!" }, { text: "Tell a teacher about it." }, { text: "Keep walking, it's not my problem." }] }
  ],
  pikachu: [
    { question: "Bad guys are trying to steal your snacks! What do YOU do?", options: [{ text: "Zap them with incredible energy!" }, { text: "Hide behind my best friend." }, { text: "Share the snacks with the bad guys." }] },
    { question: "A brand new kid joins your class! How do YOU greet them?", options: [{ text: "Smile big and say hello energetically!" }, { text: "Wave shyly from my desk." }, { text: "Ignore them." }] },
    { question: "You find a magical stone that can change how you look!", options: [{ text: "Refuse it, I like being exactly who I am!" }, { text: "Keep it in my backpack just in case." }, { text: "Throw it away." }] },
    { question: "Your team is practicing for the big sports game.", options: [{ text: "Jump up and down, eager to play!" }, { text: "Sit under a tree and watch them." }, { text: "Take a nap instead." }] },
    { question: "You see your absolute favorite food on the table!", options: [{ text: "Hug it and start eating!" }, { text: "Eat a little bit politely." }, { text: "Push the plate away." }] }
  ],
  tom: [
    { question: "You need to catch something running zooming around your room! What is YOUR plan?", options: [{ text: "Set up a clever (but maybe clumsy) trap!" }, { text: "Wait patiently outside." }, { text: "Go back to sleep." }] },
    { question: "Someone gave you a delicious bowl of ice cream.", options: [{ text: "Eat it all happily!" }, { text: "Save it perfectly for later." }, { text: "Drop it on purpose." }] },
    { question: "A big scary dog is sleeping in the yard.", options: [{ text: "Sneak past him walking on my tiptoes!" }, { text: "Walk directly past him." }, { text: "Yell to wake him up!" }] },
    { question: "You finally win a game against your rival!", options: [{ text: "Shake their hand because we're secretly friends." }, { text: "Brag to everyone." }, { text: "Walk away." }] },
    { question: "Something is falling from the sky!", options: [{ text: "Hold up a tiny umbrella for protection!" }, { text: "Run away as fast as I can!" }, { text: "Stand completely still." }] }
  ],
  jerry: [
    { question: "Someone is guarding the refrigerator! How do YOU get a snack?", options: [{ text: "Sneak through a hidden, tiny path!" }, { text: "Wait for them to fall asleep." }, { text: "Ask them for the snack." }] },
    { question: "You found a giant prize box!", options: [{ text: "Roll the whole thing into my room!" }, { text: "Take one small prize." }, { text: "Leave it alone." }] },
    { question: "Your sibling set up a trap to prank you.", options: [{ text: "Carefully steal the prank and use it on them!" }, { text: "Walk all the way around it." }, { text: "Step right on it by accident." }] },
    { question: "You found a toy hammer.", options: [{ text: "Use it to bonk someone on the foot playfully!" }, { text: "Fix my treehouse." }, { text: "Throw it away." }] },
    { question: "Two kids are arguing on the playground.", options: [{ text: "Laugh and eat a snack while I watch." }, { text: "Run away from the noise." }, { text: "Try to stop the fight." }] }
  ],
  po: [
    { question: "A giant bully returns to the park! How do YOU stop him?", options: [{ text: "Use my awesomeness to surprise them!" }, { text: "Ask the coolest kids for help." }, { text: "Hide inside." }] },
    { question: "Your teacher tells you to study before you can have pizza.", options: [{ text: "Study super hard so I can eat!" }, { text: "Do a little bit of homework." }, { text: "Refuse to work." }] },
    { question: "You find a mysterious golden scroll!", options: [{ text: "Open it and realize the magic is inside me!" }, { text: "Put it back on the shelf." }, { text: "Use it as drawing paper." }] },
    { question: "A giant bowl of your favorite food is ready.", options: [{ text: "Eat it all in one giant bite!" }, { text: "Eat it slowly with manners." }, { text: "Throw it at a wall." }] },
    { question: "You trip and fall down a hill.", options: [{ text: "Bounce down happily!" }, { text: "Complain the whole way down." }, { text: "Cry at the bottom." }] }
  ],
  doraemon: [
    { question: "Your friend is crying about their homework. What do YOU do?", options: [{ text: "Pull out a super cool gadget to help them!" }, { text: "Tell them to do it themselves." }, { text: "Do their homework for them." }] },
    { question: "You find a plate of sweet pancakes!", options: [{ text: "Eat every single one instantly!" }, { text: "Save some for your friends." }, { text: "Throw them away." }] },
    { question: "A bully is being mean at the playground.", options: [{ text: "Use a magical door to escape!" }, { text: "Ask them to stop." }, { text: "Join the bully." }] },
    { question: "There's a tiny mouse in the room!", options: [{ text: "Scream, jump on a chair, and faint!" }, { text: "Try to catch it calmly." }, { text: "Pet the mouse." }] },
    { question: "You need to fix a big mistake from yesterday.", options: [{ text: "Jump into a Time Machine desk drawer!" }, { text: "Apologize normally." }, { text: "Give up." }] }
  ],
  spongebob: [
    { question: "Your boss needs you to work super fast!", options: [{ text: "Shout 'I'm ready!' and do my best!" }, { text: "Work at a normal speed." }, { text: "Quit and go home." }] },
    { question: "Someone tries to steal your secret recipe!", options: [{ text: "Protect it using the power of imagination!" }, { text: "Tell an adult." }, { text: "Let them take it." }] },
    { question: "You have a day off at the park.", options: [{ text: "Run around chasing butterflies and singing!" }, { text: "Sit quietly on a bench." }, { text: "Go back to work for free." }] },
    { question: "Your neighbor asks you to be quiet.", options: [{ text: "Laugh loudly and keep playing!" }, { text: "Whisper very quietly." }, { text: "Yell as loud as I can." }] },
    { question: "You are learning to ride a bike.", options: [{ text: "Panic and crash the bike immediately!" }, { text: "Ride carefully." }, { text: "Walk instead." }] }
  ],
  shinchan: [
    { question: "Your mom asks you to clean your room right now.", options: [{ text: "Do a silly dance and run away!" }, { text: "Clean it up slowly." }, { text: "Cry until she cleans it." }] },
    { question: "You see an awesome toy at the store.", options: [{ text: "Beg mom and roll on the floor until I get it!" }, { text: "Ask politely once." }, { text: "Walk past the toy." }] },
    { question: "A stranger talks to you in the park.", options: [{ text: "Say something totally silly and embarrassing!" }, { text: "Say hello nicely." }, { text: "Run away screaming." }] },
    { question: "You find a box of your favorite cookies!", options: [{ text: "Eat the whole box in 3 seconds!" }, { text: "Save them for after dinner." }, { text: "Throw them away." }] },
    { question: "It's time to play with your pet dog.", options: [{ text: "Roll him into a fuzzy snowball!" }, { text: "Take him for a normal walk." }, { text: "Leave him inside." }] }
  ],
  goku: [
    { question: "A super strong space alien challenges you! What do YOU do?", options: [{ text: "Get super excited for a fight and power up!" }, { text: "Try to talk it out with them." }, { text: "Run away in fear." }] },
    { question: "You just finished playing super hard all day.", options: [{ text: "Eat 50 bowls of food immediately!" }, { text: "Drink some water and rest." }, { text: "Go straight to sleep." }] },
    { question: "Someone tells you they are the strongest kid in school.", options: [{ text: "Say 'Wow, let's race right now!'" }, { text: "Don't believe them." }, { text: "Cry because I want to be strongest." }] },
    { question: "You need to travel very far, very fast.", options: [{ text: "Use teleportation to get there instantly!" }, { text: "Ride a flying cloud." }, { text: "Walk." }] },
    { question: "Your friends are badly hurt in a game.", options: [{ text: "Give them a magic healing bean!" }, { text: "Call for a doctor." }, { text: "Run away to save myself." }] }
  ],
  bheem: [
    { question: "Your village is under attack by a magical giant!", options: [{ text: "Eat some sweet treats and gain super strength!" }, { text: "Tell the King about it." }, { text: "Hide in my house." }] },
    { question: "Someone baked a fresh batch of yummy sweets.", options: [{ text: "Ask politely and eat a giant handful!" }, { text: "Save them for the village." }, { text: "Throw them on the ground." }] },
    { question: "The biggest kid challenges you to a wrestling match.", options: [{ text: "Accept with a smile and win easily!" }, { text: "Refuse the challenge." }, { text: "Run away crying." }] },
    { question: "You need to help your friend carry heavy boxes.", options: [{ text: "Carry them all on my head at once!" }, { text: "Help them carry one box." }, { text: "Tell them to do it themselves." }] },
    { question: "A wild animal has escaped the jungle!", options: [{ text: "Wrestle the animal and tame it!" }, { text: "Call the forest guards." }, { text: "Ignore the animal." }] }
  ],
  motu: [
    { question: "You are feeling very, very hungry.", options: [{ text: "Eat hundreds of snacks immediately!" }, { text: "Eat a normal sandwich." }, { text: "Drink some water." }] },
    { question: "A bad guy is causing trouble in your town!", options: [{ text: "Get snack power and bash him up!" }, { text: "Tell a police officer." }, { text: "Run away." }] },
    { question: "You have an empty stomach.", options: [{ text: "Cry that my brain isn't working!" }, { text: "Wait patiently for lunch." }, { text: "I don't care." }] },
    { question: "Your smart friend has a brilliant plan.", options: [{ text: "Accidentally ruin it by doing something silly!" }, { text: "Follow the plan perfectly." }, { text: "Go to sleep instead." }] },
    { question: "You see a food stall making fresh hot food.", options: [{ text: "Run over and buy the whole batch!" }, { text: "Buy just one." }, { text: "Walk past it." }] }
  ],
  patlu: [
    { question: "Your best friend is stuck in a giant trap!", options: [{ text: "Think fast and invent a clever gadget to save them!" }, { text: "Call for help." }, { text: "Leave them there." }] },
    { question: "A villain challenges you to a battle of wits.", options: [{ text: "Outsmart them with my massive brain power!" }, { text: "Try to fight them with my fists." }, { text: "Run away." }] },
    { question: "Your friend ate all of your food.", options: [{ text: "Sigh and shake my head patiently." }, { text: "Get really angry and yell." }, { text: "Smile and hug them." }] },
    { question: "You found a very complicated puzzle box.", options: [{ text: "Solve it perfectly in just 5 seconds!" }, { text: "Read the instructions." }, { text: "Smash it with a hammer." }] },
    { question: "You need to cross a broken bridge.", options: [{ text: "Use math and ropes to swing across perfectly." }, { text: "Walk all the way around the river." }, { text: "Jump and hope for the best." }] }
  ],
  dora: [
    { question: "A sneaky fox is trying to steal your things!", options: [{ text: "Yell 'No swiping!' three times loudly!" }, { text: "Hide behind a tree." }, { text: "Let him take my things." }] },
    { question: "You don't know the way to the Snowy Mountains!", options: [{ text: "Ask my magical talking Map!" }, { text: "Ask a random stranger." }, { text: "Give up and go home." }] },
    { question: "Your monkey friend is stuck in a tall tree.", options: [{ text: "Find a vine to climb up and save him yourself!" }, { text: "Call a firefighter." }, { text: "Leave him there." }] },
    { question: "You find a secret phrase written on a door.", options: [{ text: "Read it out loud proudly!" }, { text: "Ignore it." }, { text: "Break the door." }] },
    { question: "You need to cross a Troll Bridge.", options: [{ text: "Solve the Troll's tricky puzzle!" }, { text: "Swim across the river instead." }, { text: "Cry until he lets me pass." }] }
  ],
  mickey: [
    { question: "Someone is causing trouble in your clubhouse!", options: [{ text: "Use a magical tool to fix the problem! Hot Dog!" }, { text: "Tell them to go away." }, { text: "Hide in the closet." }] },
    { question: "Your grumpy friend is getting very angry.", options: [{ text: "Say 'Oh boy!' and try to calm them down with a smile." }, { text: "Laugh at them." }, { text: "Yell back at them." }] },
    { question: "You need a special tool to open a locked door.", options: [{ text: "Call out for a magical flying tool!" }, { text: "Kick the door open." }, { text: "Walk away." }] },
    { question: "It's time to dance to your favorite song!", options: [{ text: "Dance and sing along happily with everyone!" }, { text: "Sit perfectly still." }, { text: "Cover my ears." }] },
    { question: "You found a lost puppy in the park.", options: [{ text: "Give him a big hug and find his owner!" }, { text: "Pat him on the head." }, { text: "Run away from him." }] }
  ],
  elsa: [
    { question: "Your town is in terrible danger!", options: [{ text: "Use extreme freezing magic to build a giant shield!" }, { text: "Ask my sister to save it." }, { text: "Run far away up a mountain." }] },
    { question: "You need to cross a giant river of water quickly.", options: [{ text: "Freeze the water instantly and run across!" }, { text: "Build a wooden boat." }, { text: "Swim across normally." }] },
    { question: "Someone asks to see if you have superpowers.", options: [{ text: "Shoot beautiful snowflakes into the sky!" }, { text: "Hide my hands in my pockets." }, { text: "Throw a regular snowball at them." }] },
    { question: "Your snowman friend is melting in the summer sun!", options: [{ text: "Create a personal snow cloud just for him!" }, { text: "Put him in a freezer." }, { text: "Let him melt." }] },
    { question: "It's time to finally let go of your fears.", options: [{ text: "Sing loudly and build a magical castle!" }, { text: "Whisper quietly." }, { text: "Stay totally silent." }] }
  ],
  spiderman: [
    { question: "A super villain is flying over the city! What do YOU do?", options: [{ text: "Shoot a web and swing into action!" }, { text: "Call the real police." }, { text: "Hide under a car." }] },
    { question: "You need to stop a falling bus to save people.", options: [{ text: "Shoot hundreds of webs to hold it back safely!" }, { text: "Push it with my bare hands." }, { text: "Let it crash." }] },
    { question: "Your special danger-sense starts tingling!", options: [{ text: "Do a fast backflip to dodge the invisible danger!" }, { text: "Look around slowly." }, { text: "Ignore it completely." }] },
    { question: "You are late for school.", options: [{ text: "Swing through the city sky to get there fast!" }, { text: "Take the bus." }, { text: "Skip school." }] },
    { question: "You need a picture of a superhero for the newspaper.", options: [{ text: "Set up a camera timer and take an action selfie!" }, { text: "Draw a picture instead." }, { text: "Quit my job." }] }
  ],
  mcqueen: [
    { question: "You are in the final lap of a giant race!", options: [{ text: "Say 'Kachow!' and speed past everyone to win!" }, { text: "Drive at a normal, safe speed." }, { text: "Stop driving." }] },
    { question: "Your rusty friend needs help towing a heavy truck.", options: [{ text: "Use my powerful engine to pull him!" }, { text: "Watch him struggle." }, { text: "Drive away fast." }] },
    { question: "You need a cool new outfit before the big event.", options: [{ text: "Get shiny racing gear with lightning bolts!" }, { text: "Get a boring grey jacket." }, { text: "Don't change my clothes." }] },
    { question: "The race track is totally covered in dirt and mud.", options: [{ text: "Drift around the muddy corners perfectly!" }, { text: "Drive very, very slowly." }, { text: "Crash into the wall." }] },
    { question: "You see a huge fan holding a cheering sign for you.", options: [{ text: "Rev my engine and flash my lights at them!" }, { text: "Drive past quietly." }, { text: "Honk angrily." }] }
  ],
  minion: [
    { question: "A super villain gives you a dangerous laser gear.", options: [{ text: "Accidentally turn it on and laugh uncontrollably!" }, { text: "Hold it very carefully." }, { text: "Throw it in the trash." }] },
    { question: "You see a giant, delicious yellow fruit on the table.", options: [{ text: "Yell 'BANANA!' and tackle the entire table!" }, { text: "Eat it politely." }, { text: "Ignore the fruit." }] },
    { question: "You are supposed to be building a serious machine.", options: [{ text: "Sing a weird gibberish song and hit things with a wrench!" }, { text: "Read the instructions." }, { text: "Take a nap on the floor." }] },
    { question: "Your goofy friend sticks his tongue out at you.", options: [{ text: "Start a giant, hilarious slap fight with him!" }, { text: "Ignore him." }, { text: "Cry loudly." }] },
    { question: "A little girl needs a new toy.", options: [{ text: "Build a chaotic toy out of garbage and super glue!" }, { text: "Buy one from the store." }, { text: "Tell her no." }] }
  ],
  scooby: [
    { question: "You are exploring a haunted, spooky house in the dark.", options: [{ text: "Jump into your friend's arms shaking with fear!" }, { text: "Walk bravely with a flashlight." }, { text: "Chase the ghost." }] },
    { question: "Your smart friend offers you a magical courage snack.", options: [{ text: "Eat it instantly and get super brave!" }, { text: "Say 'No thank you'." }, { text: "Throw it on the floor." }] },
    { question: "A monster is chasing you down the hallway!", options: [{ text: "Run randomly through a bunch of crazy doors side-by-side!" }, { text: "Stand still and fight the monster." }, { text: "Wait to be caught." }] },
    { question: "You hear a very scary noise in the kitchen.", options: [{ text: "Hide under the table." }, { text: "Go outside." }, { text: "Scream a funny catchphrase!" }] },
    { question: "Your friends caught the monster in a clever trap.", options: [{ text: "Pull off the monster's rubber mask!" }, { text: "Watch someone else do it." }, { text: "Run away again just in case." }] }
  ]
};

const fullPath = 'src/data/fallbackQuestions.json';
const db = data;

// Re-inject identical tracking logic 
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
console.log("Successfully rebuilt 95 YOU questions with tracking IDs!");
