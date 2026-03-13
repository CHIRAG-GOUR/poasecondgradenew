// ============================================================
// CENTRAL ACTIVITY DATA
// All content for "My Favourite Character" – Skillizee Grade 2-3
// ============================================================

export const activityData = {
  id: "skillizee-character",
  title: "My Favourite Character",
  grade: "Grade 2–3",
  subject: "POA – Power of Art",

  modules: [
    {
      id: "module-1",
      slug: "module-1",
      title: "Activity Discovery",
      emoji: "🔍",
      color: "from-blue-400 to-cyan-400",
      bgColor: "bg-blue-50",
      chapters: [
        {
          id: "chapter-1-1",
          slug: "chapter-1-1",
          title: "Introduction",
          emoji: "👋",
          subtitle: "Meet your characters!",
        },
        {
          id: "chapter-1-2",
          slug: "chapter-1-2",
          title: "Watch & Learn",
          emoji: "🎬",
          subtitle: "Observe carefully!",
        },
        {
          id: "chapter-1-3",
          slug: "chapter-1-3",
          title: "Interactive Quiz",
          emoji: "🧩",
          subtitle: "Test what you know!",
        },
      ],
    },
    {
      id: "module-2",
      slug: "module-2",
      title: "Activity Execution",
      emoji: "🎨",
      color: "from-purple-400 to-pink-500",
      bgColor: "bg-purple-50",
      chapters: [
        {
          id: "chapter-2-1",
          slug: "chapter-2-1",
          title: "Problem Statement",
          emoji: "🖼️",
          subtitle: "Show your character!",
        },
        {
          id: "chapter-2-2",
          slug: "chapter-2-2",
          title: "Discussion Time",
          emoji: "🗣️",
          subtitle: "Share your thoughts!",
        },
        {
          id: "chapter-2-3",
          slug: "chapter-2-3",
          title: "Key Takeaways",
          emoji: "⭐",
          subtitle: "Reflect and grow!",
        },
      ],
    },
  ],
};

// ============================================================
// CHAPTER 1.1 – Introduction Content
// ============================================================
export const mentorQuestions = [
  {
    id: "mq1",
    emoji: "🤔",
    question: "Who is your FAVOURITE character from a book, movie, cartoon or comic?",
    color: "from-pink-400 to-rose-400",
  },
  {
    id: "mq2",
    emoji: "💡",
    question: "What makes that character SPECIAL to you?",
    color: "from-yellow-400 to-orange-400",
  },
  {
    id: "mq3",
    emoji: "🌟",
    question: "Which QUALITY of your character would you like to have?",
    color: "from-purple-400 to-indigo-400",
  },
  {
    id: "mq4",
    emoji: "🦸",
    question: "If you could BE your favourite character for a day, what would you do?",
    color: "from-green-400 to-teal-400",
  },
];

export const infographics = [
  {
    id: "ig1",
    title: "Bravery",
    emoji: "🦁",
    description: "Being brave means doing the right thing even when it's scary!",
    color: "from-yellow-400 to-orange-500",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-300",
    examples: ["Standing up for a friend", "Trying something new", "Asking for help"],
    characters: ["Po (Kung Fu Panda)"],
    url: "https://docs.google.com/presentation/d/e/2PACX-1vQBravery/pub?start=false",
    image: "/images/kungfu.jpg",
  },
  {
    id: "ig2",
    title: "Kindness",
    emoji: "💖",
    description: "Kindness is when you care about others and help them feel happy!",
    color: "from-pink-400 to-rose-400",
    bgColor: "bg-pink-50",
    borderColor: "border-pink-300",
    examples: ["Sharing with friends", "Caring for your family", "Helping someone"],
    characters: ["Winnie the Pooh"],
    url: "https://docs.google.com/presentation/d/e/2PACX-1vQKindness/pub",
    image: "/images/winnie.png",
  },
  {
    id: "ig3",
    title: "Intelligence",
    emoji: "🧠",
    description: "Being intelligent means using your brain to solve problems creatively!",
    color: "from-blue-400 to-indigo-500",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-300",
    examples: ["Coming up with new ideas", "Solving puzzles", "Learning new things"],
    characters: ["Harry Potter"],
    url: "https://docs.google.com/presentation/d/e/2PACX-1vQIntelligence/pub",
    image: "/images/harry.png",
  },
  {
    id: "ig4",
    title: "Humor",
    emoji: "😂",
    description: "Humor means making people laugh and bringing joy to others!",
    color: "from-green-400 to-emerald-400",
    bgColor: "bg-green-50",
    borderColor: "border-green-300",
    examples: ["Telling funny jokes", "Being playful", "Making friends smile"],
    characters: ["Tom and Jerry"],
    url: "https://docs.google.com/presentation/d/e/2PACX-1vQHumor/pub",
    image: "/images/tomjerry.png",
  },
  {
    id: "ig5",
    title: "Creativity",
    emoji: "🎨",
    description: "Creativity is using your imagination to make something amazing!",
    color: "from-purple-400 to-pink-500",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-300",
    examples: ["Drawing and painting", "Inventing new moves", "Building new things"],
    characters: ["Naruto"],
    url: "https://docs.google.com/presentation/d/e/2PACX-1vQCreativity/pub",
    image: "/images/naruto_v2.jpg",
  },
];

// ============================================================
// CHAPTER 1.2 – Watch & Learn Content
// ============================================================
export const videos = [
  {
    id: "v1",
    title: "Guess the Cartoon Character | Cartoon Quiz Challenge",
    description: "Can you guess them all? Have fun playing this quiz!",
    youtubeId: "_Y3eiDxtnIM",
    emoji: "🎬",
    questions: [
      "What brave thing did the character do?",
      "How did the character feel before being brave?",
      "Have you ever felt like this character?",
    ],
  },
  {
    id: "v2",
    title: "Can You Guess the Cartoon Character In 3 Seconds",
    description: "A fast and fun challenge with 101 characters!",
    youtubeId: "wrOk8V4RHvA",
    emoji: "💝",
    questions: [
      "What kind action did you see in the video?",
      "How did kindness help in this story?",
      "What quality do these characters have?",
    ],
  },
];

export const observationQuestions = [
  {
    id: "oq1",
    emoji: "👀",
    question: "What qualities do these characters have?",
    placeholder: "Write what you noticed about the characters...",
    color: "border-blue-300 bg-blue-50",
  },
  {
    id: "oq2",
    emoji: "🤝",
    question: "How do they behave in tough situations?",
    placeholder: "Describe how the character reacted...",
    color: "border-purple-300 bg-purple-50",
  },
  {
    id: "oq3",
    emoji: "🪞",
    question: "Which character do YOU feel similar to?",
    placeholder: "Tell us why you relate to that character...",
    color: "border-pink-300 bg-pink-50",
  },
];

// ============================================================
// CHAPTER 1.3 – Interactive Quiz Content
// ============================================================
export const quizQuestions = [
  {
    id: "q1",
    type: "mcq",
    emoji: "🦁",
    question: "Po the Panda fought Tai Lung to save his friends even when he was scared. What quality is this?",
    options: ["Kindness", "Bravery", "Humor", "Creativity"],
    correct: 1,
    explanation: "Bravery means being courageous and facing danger! 🦁",
    image: "/images/kungfu.png",
  },
  {
    id: "q2",
    type: "mcq",
    emoji: "💖",
    question: "Winnie the Pooh shares his honey with all his friends in the Hundred Acre Wood. What quality is this?",
    options: ["Intelligence", "Bravery", "Kindness", "Humor"],
    correct: 2,
    explanation: "Being caring and helpful to your friends is Kindness! 💖",
    image: "/images/winnie.png",
  },
  {
    id: "q3",
    type: "mcq",
    emoji: "🧠",
    question: "Harry Potter reads books and solves hard magical problems. What quality does he show?",
    options: ["Humor", "Creativity", "Intelligence", "Bravery"],
    correct: 2,
    explanation: "Using your brain to solve problems is Intelligence! 🧠",
    image: "/images/harry.png",
  },
  {
    id: "q4",
    type: "mcq",
    emoji: "🎨",
    question: "Naruto uses his shadow clones in unexpected and clever ways during battle. What quality is this?",
    options: ["Creativity", "Kindness", "Humor", "Intelligence"],
    correct: 0,
    explanation: "Using your imagination to create unexpected solutions is Creativity! 🎨",
    image: "/images/naruto_v2.jpg",
  },
  {
    id: "q5",
    type: "mcq",
    emoji: "😂",
    question: "Tom and Jerry are always chasing each other and doing silly things. What quality do they show?",
    options: ["Bravery", "Humor", "Intelligence", "Creativity"],
    correct: 1,
    explanation: "Making people laugh with silly chases is Humor! 😂",
    image: "/images/tomjerry.png",
  },
];

export const riddleCards = [
  {
    id: "r1",
    emoji: "🦁",
    riddle: "I face my fears and never run away. I help others even when times are tough. What quality am I?",
    answer: "BRAVERY",
    hint: "Think of Po the Panda!",
    color: "from-yellow-400 to-orange-400",
  },
  {
    id: "r2",
    emoji: "🌈",
    riddle: "I share my lunch, I help a friend who is sad, and I always say please and thank you. What am I?",
    answer: "KINDNESS",
    hint: "Think of Winnie the Pooh!",
    color: "from-pink-400 to-rose-400",
  },
  {
    id: "r3",
    emoji: "🎭",
    riddle: "I love to tell jokes, make silly faces, and see everyone smile. Laughter is my superpower!",
    answer: "HUMOR",
    hint: "Think of Tom and Jerry!",
    color: "from-green-400 to-teal-400",
  },
];

// ============================================================
// CHAPTER 2.1 – Problem Statement Content
// ============================================================
export const taskInstructions = [
  {
    id: "t1",
    step: "1",
    emoji: "🎭",
    title: "Choose Your Character",
    desc: "Pick your favourite character — from a book, cartoon, movie or story!",
    color: "from-blue-400 to-cyan-400",
  },
  {
    id: "t2",
    step: "2",
    emoji: "🖼️",
    title: "Draw or Upload",
    desc: "Draw your character OR upload a picture. Show us what they look like!",
    color: "from-purple-400 to-pink-400",
  },
  {
    id: "t3",
    step: "3",
    emoji: "✍️",
    title: "Answer Questions",
    desc: "Tell us WHY you love this character and what quality you want to be like them!",
    color: "from-orange-400 to-yellow-400",
  },
  {
    id: "t4",
    step: "4",
    emoji: "🚀",
    title: "Submit Your Work",
    desc: "Submit your activity when you're done. Great work, superstar!",
    color: "from-green-400 to-emerald-400",
  },
];

// ============================================================
// CHAPTER 2.2 – Discussion Prompts
// ============================================================
export const presentationPrompts = [
  {
    id: "pp1",
    emoji: "🎭",
    prompt: "Explain who your character is and where they are from.",
    color: "bg-blue-100 border-blue-300",
  },
  {
    id: "pp2",
    emoji: "💭",
    prompt: "Explain WHY you relate to this character.",
    color: "bg-purple-100 border-purple-300",
  },
  {
    id: "pp3",
    emoji: "⭐",
    prompt: "Share ONE special quality of your character that you admire.",
    color: "bg-yellow-100 border-yellow-300",
  },
];

export const peerQuestions = [
  {
    id: "pq1",
    emoji: "❓",
    question: "Why is this your favourite character?",
    points: 1,
  },
  {
    id: "pq2",
    emoji: "🤔",
    question: "What would you do in their place?",
    points: 1,
  },
  {
    id: "pq3",
    emoji: "🌟",
    question: "What quality do you want to learn from them?",
    points: 1,
  },
  {
    id: "pq4",
    emoji: "🎬",
    question: "Which scene from the story did you like most?",
    points: 1,
  },
  {
    id: "pq5",
    emoji: "🦸",
    question: "Would you like to be this character? Why?",
    points: 1,
  },
];

// ============================================================
// CHAPTER 2.3 – Key Takeaways
// ============================================================
export const reflectionCards = [
  {
    id: "rc1",
    title: "Self Awareness",
    emoji: "🪞",
    desc: "You learned about yourself — what qualities you have and which ones you want to grow!",
    color: "from-blue-400 to-indigo-500",
    bgColor: "bg-blue-50",
    insight: "Like Elsa (Frozen), I know myself better now!",
    image: "/images/elsa.png",
  },
  {
    id: "rc2",
    title: "Communication Skills",
    emoji: "🗣️",
    desc: "You practiced sharing your ideas clearly and listening to your classmates.",
    color: "from-purple-400 to-pink-500",
    bgColor: "bg-purple-50",
    insight: "Like Pikachu, I can express my thoughts clearly!",
    image: "/images/spongebob.png",
  },
  {
    id: "rc3",
    title: "Creativity",
    emoji: "🎨",
    desc: "You used your imagination to draw, create and express your character in a unique way!",
    color: "from-orange-400 to-yellow-400",
    bgColor: "bg-orange-50",
    insight: "Like Phineas, my imagination is powerful!",
    image: "/images/phineas.png",
  },
  {
    id: "rc4",
    title: "Empathy",
    emoji: "💗",
    desc: "You thought about how characters feel and why they act the way they do.",
    color: "from-pink-400 to-rose-500",
    bgColor: "bg-pink-50",
    insight: "Like Pooh, I can feel and understand others!",
    image: "/images/winnie.png",
  },
  {
    id: "rc5",
    title: "Collaboration",
    emoji: "🤝",
    desc: "You worked together, listened to each other, and learned from your classmates!",
    color: "from-green-400 to-teal-500",
    bgColor: "bg-green-50",
    insight: "Like Woody and Buzz, we learn better together!",
    image: "/images/collaboration_new.jpg",
  },
];
