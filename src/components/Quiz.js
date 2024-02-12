import './styles/Quiz.css';


import React, { useState } from 'react';
import QuizConfig from './QuizConfig';

const Quiz = ({ kanjis, studyLists, premadeStudyLists, onQuizComplete }) => {
  const [quizConfig, setQuizConfig] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [userAnswers, setUserAnswers] = useState([]);

  const startQuiz = async (config) => {
    let kanjiData = [];
    const { selectedList } = config;
    if (selectedList) {
      const [listType, listId] = selectedList.split('-'); // Split the selectedList value to get listType and listId

      let url;
      // Determine the URL based on listType
      if (listType === 'study') {
        url = `http://localhost:8000/api/studylists/${listId}/`;
      } else if (listType === 'premade') {
        url = `http://localhost:8000/api/premadestudylists/${listId}/`;
      }

      if (url) {
        try {
          const response = await fetch(url, {
            headers: {
              'Content-Type': 'application/json',
              // Include authorization header if needed
            },
          });

          if (response.ok) {
            const data = await response.json();
            kanjiData = data.kanjis; // Assuming the response contains a 'kanjis' field
          } else {
            console.error('Failed to fetch kanji data');
          }
        } catch (error) {
          console.error('Error fetching kanji data:', error);
        }
      }
    }

    // Proceed with randomizing the kanji data and generating questions
    const randomizedKanjis = shuffleArray(kanjiData);
    const generatedQuestions = generateQuestions(randomizedKanjis, config);

    setQuestions(generatedQuestions);
    setCurrentQuestion(generatedQuestions[0]);
    setQuizConfig(config);
  };

  const distractorWords = [
    //these words are used to generate the incorrect options
    'Mountain', 'River', 'Ocean', 'Tree', 'Sun', 'Moon', 'Star', 'Flower', 'Bird', 'Fish'
  ];

  const jlptLevels = [5, 4, 3, 2, 1];
  const kankenLevels = [10, 9, 8, 7, 6, 5];

  const getRandomOptions = (correctMeaning) => {
    // Filter out the correct meaning if it accidentally exists in distractorWords
    const availableDistractors = distractorWords.filter(word => word !== correctMeaning);

    // Shuffle the distractors to randomize selection
    const shuffledDistractors = shuffleArray(availableDistractors);

    // Select the first 3 distractors (or however many you need) from the shuffled list
    return shuffledDistractors.slice(0, 3);
  };

  //shuffle the array to randomize the order of the options
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
    return array;
  };

  const submitAnswer = (answer) => {
    const isCorrect = answer === currentQuestion.correctAnswer;

    setUserAnswers([...userAnswers, { answer, isCorrect }]);

    // Provide immediate feedback here, e.g., by updating a state variable or showing an alert
    alert(isCorrect ? "Correct!" : "Wrong answer");

    //get the next question
    const nextQuestionIndex = currentQuestionIndex + 1;
    if (nextQuestionIndex < questions.length) {
      setCurrentQuestionIndex(nextQuestionIndex);
      setCurrentQuestion(questions[nextQuestionIndex]);
      setCurrentAnswer(''); // Reset current answer for the next question
    } else {
      onQuizComplete(userAnswers);
      setQuizConfig(null); // Reset quizConfig to allow restarting the quiz
    }
  };

  const handleOptionChange = (event) => {//handle the change of the radio button
    setCurrentAnswer(event.target.value);
  };

  const generateQuestions = (kanjis, config) => {
    // Example: Generate multiple-choice questions based on Kanji info
    return kanjis.slice(0, config.numberOfQuestions).map((kanji) => {
      // Assume `kanji.meanings` is an array of possible meanings
      // and `kanji.character` is the Kanji character
      const correctAnswer = kanji.meanings[0]; //assume first meaning is correct (for now)
      const options = [correctAnswer, ...getRandomOptions(kanji.meanings, correctAnswer)]; //pass the meanings and correct answer to the getRandomOptions function

      return {
        text: `What is the meaning of "${kanji.character}"?`,
        options: shuffleArray(options), //shuffle the options
        correctAnswer,
      };
    });
  };



  if (!quizConfig) {
    return <QuizConfig studyLists={studyLists} premadeStudyLists={premadeStudyLists} onStartQuiz={startQuiz} />;
  }

  if (!currentQuestion) {
    return <div>Loading question...</div>; //a placeholder while the next question is being fetched
  }


  return (

    <div class="quiz-container">
      <div class="question">{currentQuestion.text}</div>
      <form onSubmit={(e) => { e.preventDefault(); submitAnswer(currentAnswer); }}>
        {currentQuestion.options.map((option, index) => (
          <div key={index} class="options">
            <input
              type="radio"
              id={`option-${index}`}
              name="option"
              value={option}
              onChange={handleOptionChange}
              checked={currentAnswer === option}
            />
            <label htmlFor={`option-${index}`}>{option}</label>
          </div>
        ))}
        <button type="submit" class="submit-btn">Submit Answer</button>
      </form>
    </div>


  );
};

export default Quiz;


// const getRandomOptions = (meanings, correctAnswer) => {
//   //select incorrect options by filtering out the correct answer
//   let incorrectOptions = meanings.filter(meaning => meaning !== correctAnswer);
//   //shuffle incorrect options
//   incorrectOptions = shuffleArray(incorrectOptions);
//   //select the first 3 incorrect options
//   return incorrectOptions.slice(0, 3);
// };

// console.log("Starting quiz with config:", config); // Add logging
//     let filteredKanjis;
//     console.log("Filtered Kanjis:", filteredKanjis);
//     if (config.source === 'level') {
//       // Filter kanjis by the selected level
//       filteredKanjis = kanjis.filter(kanji => kanji.level === config.selectedLevel);
//     } else if (config.source === 'studyList') {
//       // Find the selected study list and use its kanjis
//       const selectedList = studyLists.find(list => list.id === config.selectedStudyList);

//       if (selectedList && Array.isArray(selectedList.kanjis)) {
//         filteredKanjis = selectedList.kanjis;
//       } else {
//         console.error("No matching premade list found or the list has no kanjis");
//         // Handle the error appropriately, maybe set filteredKanjis to an empty array
//         filteredKanjis = [];
//       }
//     }

//     else if (config.source === 'premade') {
//       // Find the selected premade study list and use its kanjis
//       const selectedList = premadeStudyLists.find(list => list.id === config.selectedPremadeList);
//       console.log('Selected Premade List:', selectedList);

//       if (selectedList && Array.isArray(selectedList.kanjis) && selectedList.kanjis.length > 0) {
//         filteredKanjis = selectedList.kanjis;
//       } else {
//         console.error("No matching premade list found or the list has no kanjis");
//         // Handle the error appropriately, maybe set filteredKanjis to an empty array
//         filteredKanjis = [];
//       }
//     }

//     if (!filteredKanjis || filteredKanjis.length === 0) {
//       console.error("No kanjis found for the selected premade list or the list is empty.");
//       return; // Exit if no kanjis found or list is empty
//     }