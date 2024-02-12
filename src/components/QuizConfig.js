import React, { useState } from 'react';
import './styles/Homepage.css';

const QuizConfig = ({ onStartQuiz, studyLists, premadeStudyLists }) => {
  // Add state to hold the selected source and level
  const [source, setSource] = useState('level'); // 'level' or 'studyList'
  const [selectedJLPTLevel, setSelectedJLPTLevel] = useState(''); // Define state for selected JLPT Level
  const [selectedKankenLevel, setSelectedKankenLevel] = useState('');
  const [selectedStudyList, setSelectedStudyList] = useState(null);
  const [selectedPremadeList, setSelectedPremadeList] = useState('');
  const [selectedList, setSelectedList] = useState('');
  console.log(premadeStudyLists)


  const handleSubmit = (e) => {
    e.preventDefault();
    const config = {
      source,
      selectedJLPTLevel,
      selectedKankenLevel,
      selectedStudyList,
      selectedPremadeList,
      selectedList,
    };
    onStartQuiz(config);
  };

  const handleSelectionChange = (sourceType, selectedValue) => {
    setSource(sourceType);
    setSelectedJLPTLevel('');
    setSelectedKankenLevel('');
    setSelectedStudyList(null);
    setSelectedPremadeList('');

    switch (sourceType) {
      case 'jlptLevel':
        setSelectedJLPTLevel(selectedValue);
        break;
      case 'kankenLevel':
        setSelectedKankenLevel(selectedValue);
        break;
      case 'studyList':
        setSelectedStudyList(selectedValue);
        break;
      case 'premade':
        setSelectedPremadeList(selectedValue);
        break;
      default:
        break;
    }
  };

  return (
    <form onSubmit={handleSubmit} class="study-list-selection-form">
      <label>
        Select a Study List:
        <select
          value={selectedList}
          onChange={(e) => setSelectedList(e.target.value)}
        >
          <option value="">Select List</option>
          {studyLists.map((list) => (
            <option key={list.id} value={`study-${list.id}`}>
              {list.name}
            </option>
          ))}
          {premadeStudyLists.map((list) => (
            <option key={list.id} value={`premade-${list.id}`}>
              {list.name}
            </option>
          ))}
        </select>
      </label>
      <button type="submit">Start Quiz</button>
    </form>
  );

};

export default QuizConfig;




// {(source === 'jlptLevel' || source === 'kankenLevel') && (
//   <div>
//     <label htmlFor="levelSelect">Select Level:</label>
//     <select
//       id="levelSelect"
//       value={source === 'jlptLevel' ? selectedJLPTLevel : selectedKankenLevel}
//       onChange={e => {
//         const level = e.target.value;

//         if (source === 'jlptLevel') {
//           setSelectedJLPTLevel(level);
//           // Directly find the JLPT list that includes "N" + level
//           const matchingList = premadeStudyLists.find(list => list.name.includes(`N${level}`));
//           setSelectedPremadeList(matchingList ? matchingList.id : '');
//         } else if (source === 'kankenLevel') {
//           setSelectedKankenLevel(level);
//           // Use a RegExp to ensure " Level 1$" or " Level 1 " is matched, not " Level 10"
//           const regex = new RegExp(`Level ${level}( |$)`);
//           const matchingList = premadeStudyLists.find(list => regex.test(list.name));
//           setSelectedPremadeList(matchingList ? matchingList.id : '');
//         }
//       }}
//     >
//       <option value="">Select Level</option>
//       {(source === 'jlptLevel' ? jlptLevels : kankenLevels).map(level => (
//         <option key={level} value={level}>{source === 'jlptLevel' ? `N${level}` : `Level ${level}`}</option>
//       ))}
//     </select>
//   </div>
// )
// }

// {
//   source === 'studyList' && (
//     <div>
//       <label htmlFor="studyListSelect">Select Custom Study List:</label>
//       <select id="studyListSelect" value={selectedStudyList} onChange={e => setSelectedStudyList(e.target.value)}>
//         <option value="">Select Study List</option>
//         {studyLists.map(list => (
//           <option key={list.id} value={list.id}>{list.name}</option>
//         ))}
//       </select>
//     </div>
//   )
// }

// {
//   source === 'premade' && (
//     <div>
//       <label htmlFor="premadeListSelect">Select Premade Study List:</label>
//       <select id="premadeListSelect" value={selectedPremadeList} onChange={e => setSelectedPremadeList(e.target.value)}>
//         <option value="">Select Premade List</option>
//         {premadeStudyLists.map(list => (
//           <option key={list.id} value={list.id}>{list.name}</option>
//         ))}
//       </select>
//     </div>
//   )
// }