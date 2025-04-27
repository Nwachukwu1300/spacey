// This file contains the structured content for the Mars Rover Mission lesson

export const lessonScript = {
    introduction: {
      id: 'intro',
      avatarState: 'excited',
      content: [
        {
          text: "Hi there, space explorer! I'm Cosmo, and I'll be your guide on an exciting Mars Rover Mission! Are you ready to discover the Red Planet?",
          animation: 'greeting',
          pauseAfter: 1000,
        },
        {
          text: "First, let me make sure I can see you. Can you allow your camera so we can explore Mars together?",
          animation: 'pointing',
          waitForWebcam: true,
        },
        {
          text: "Great! Now we can begin our journey to Mars! Let's get started with our mission briefing.",
          animation: 'excited',
          transition: 'fadeToMars',
        }
      ]
    },
    
    mainContent: [
      {
        id: 'section1',
        title: 'What is Mars Like?',
        avatarState: 'explaining',
        content: [
          {
            text: "Mars is called the Red Planet because of its rusty red soil. It's about half the size of Earth and is the fourth planet from the Sun.",
            animation: 'pointing',
            visual: 'mars-comparison.png',
          },
          {
            text: "Mars has the largest volcano in our solar system called Olympus Mons, and a canyon system that would stretch across the United States!",
            animation: 'surprised',
            visual: 'mars-features.png',
          },
          {
            text: "The temperature on Mars can be as cold as -195 degrees Fahrenheit (-125 Celsius). That's colder than the coldest place on Earth!",
            animation: 'shivering',
            visual: 'mars-temperature.png',
          }
        ]
      },
      {
        id: 'section2',
        title: 'The Mars Rovers',
        avatarState: 'teaching',
        content: [
          {
            text: "NASA has sent several rovers to explore Mars. A rover is like a remote-controlled car with scientific instruments that can drive around on the planet's surface.",
            animation: 'explaining',
            visual: 'rover-diagram.png',
          },
          {
            text: "The most recent rover is called Perseverance, which landed in 2021. It's about the size of a car and has a special helicopter drone called Ingenuity!",
            animation: 'excited',
            visual: 'perseverance-rover.png',
          },
          {
            text: "These rovers have special tools like cameras, drills, and scientific instruments that help them study rocks, soil, and the Martian atmosphere.",
            animation: 'demonstrating',
            visual: 'rover-tools.png',
            interaction: 'roverToolsExplorer',
          }
        ]
      },
      {
        id: 'section3',
        title: 'The Mission: Finding Signs of Life',
        avatarState: 'mission',
        content: [
          {
            text: "One of the most important jobs of the Mars rovers is to look for signs that Mars once had water or even simple life forms!",
            animation: 'searching',
            visual: 'water-on-mars.png',
          },
          {
            text: "The rovers collect rock samples and analyze them with special tools. They've already discovered that Mars once had lakes and rivers billions of years ago!",
            animation: 'analyzing',
            visual: 'mars-past.png',
          },
          {
            text: "Scientists hope that one day, these samples will be brought back to Earth for more detailed study. There's even a plan to send humans to Mars in the future!",
            animation: 'dreaming',
            visual: 'future-mars-mission.png',
          }
        ]
      }
    ],
    
    quizQuestions: [
      {
        id: 'q1',
        question: "Why is Mars called the Red Planet?",
        options: [
          "Because it's the hottest planet in our solar system",
          "Because of its rusty red soil",
          "Because it's covered in red plants",
          "Because it's always sunset there"
        ],
        correctAnswer: 1,
        feedback: {
          correct: "That's right! The rusty red color comes from iron oxide (rust) in the Martian soil.",
          incorrect: "Not quite. Mars gets its reddish appearance from iron oxide (rust) in its soil."
        }
      },
      {
        id: 'q2',
        question: "What is the name of the most recent Mars rover that landed in 2021?",
        options: [
          "Curiosity",
          "Opportunity",
          "Perseverance",
          "Discovery"
        ],
        correctAnswer: 2,
        feedback: {
          correct: "Correct! Perseverance landed on Mars in February 2021 and brought along a helicopter drone called Ingenuity.",
          incorrect: "That's not right. The most recent rover is called Perseverance, which landed in February 2021."
        }
      },
      {
        id: 'q3',
        question: "What is one of the main things Mars rovers are looking for?",
        options: [
          "Alien buildings",
          "Gold and diamonds",
          "Signs of water and past life",
          "Plants and animals"
        ],
        correctAnswer: 2,
        feedback: {
          correct: "Excellent! The rovers are searching for evidence that Mars once had water and possibly simple life forms.",
          incorrect: "Not quite. Mars rovers are primarily searching for evidence of past water and potential signs of ancient microbial life."
        }
      },
      {
        id: 'q4',
        question: "About how large is the Perseverance rover?",
        options: [
          "The size of a toy car",
          "The size of a microwave",
          "The size of a car",
          "The size of a house"
        ],
        correctAnswer: 2,
        feedback: {
          correct: "That's right! Perseverance is about the size of a car - specifically about 10 feet long, 9 feet wide, and 7 feet tall.",
          incorrect: "Not quite. Perseverance is actually about the size of a car, making it one of the largest rovers sent to Mars."
        }
      },
      {
        id: 'q5',
        question: "What has been discovered about Mars' past?",
        options: [
          "It was once covered in jungle forests",
          "It once had oceans, lakes and rivers",
          "It was once part of Earth",
          "It was once inhabited by dinosaurs"
        ],
        correctAnswer: 1,
        feedback: {
          correct: "Correct! Evidence shows Mars once had liquid water in the form of lakes, rivers and possibly even oceans billions of years ago.",
          incorrect: "That's not correct. Evidence from rovers shows that Mars once had liquid water in the form of lakes, rivers and possibly even oceans."
        }
      }
    ],
    
    conclusion: {
      id: 'conclusion',
      avatarState: 'excited',
      content: [
        {
          text: "You've done an amazing job learning about Mars rovers! Your mission has been a complete success!",
          animation: 'celebrating',
        },
        {
          text: "Remember, every discovery we make brings us one step closer to understanding our solar system and maybe even sending humans to Mars one day!",
          animation: 'inspired',
        },
        {
          text: "Now let's see how much you've learned with a short quiz. Are you ready?",
          animation: 'questioning',
          transitionToQuiz: true,
        }
      ]
    },
    
    badges: {
      completion: {
        name: "Mars Explorer",
        image: "mars-explorer-badge.png",
        description: "Awarded for completing the Mars Rover Mission lesson"
      },
      perfectScore: {
        name: "Mars Scientist",
        image: "mars-scientist-badge.png",
        description: "Awarded for answering all quiz questions correctly"
      }
    },
    
    feedbackMessages: {
      perfect: "Wow! You're a true Mars expert! You answered all questions correctly!",
      great: "Great job! You've learned so much about Mars rovers!",
      good: "Good work! You're on your way to becoming a Mars expert.",
      needsPractice: "You're making progress! Let's review what we learned about Mars rovers."
    }
  };
  
  export default lessonScript;