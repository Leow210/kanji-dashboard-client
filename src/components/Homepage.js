// src/components/Homepage.js address
import './styles/Homepage.css';
import './styles/Quiz.css';

import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import KanjiItem from './KanjiItem';
import StudyListManager from './StudyListManager';
import { useAuth } from '../context/AuthContext';
import AddStudyListForm from './AddStudyListForm'
import Quiz from './Quiz';




const Homepage = () => {
  const [kanjiList, setKanjiList] = useState([]);
  const [displayedKanji, setDisplayedKanji] = useState([]); //stores the kanji that will be displayed
  const [searchTerm, setSearchTerm] = useState(''); //implement search feature
  const [selectedJlpt, setSelectedJlpt] = useState('');
  const [selectedKanken, setSelectedKanken] = useState('');
  const [studyLists, setStudyLists] = useState([]);
  const [premadeStudyLists, setPremadeStudyLists] = useState([]);
  const [selectedPremadeList, setSelectedPremadeList] = useState('');
  const { authToken } = useAuth();
  const navigate = useNavigate(); //use useNavigate for navigation


  useEffect(() => {
    fetch('http://localhost:8000/api/kanjis/')
      .then(response => response.json())
      .then(data => {
        setKanjiList(data);
        setDisplayedKanji(data); //initialize with all kanji
      })

      .catch(error => console.error('Error fetching Kanji data:', error));
  }, []);

  useEffect(() => {
    //fetch premade study lists
    fetch('http://localhost:8000/api/premadestudylists/')
      .then(response => response.json())
      .then(data => {
        setPremadeStudyLists(data);
      })
      .catch(error => console.error('Error fetching premade study lists:', error));
  }, []);

  //same logic as in StudyListManager.js
  useEffect(() => {
    const fetchStudyLists = async () => {
      if (!authToken) return; // Return early if authToken is not set

      try {
        const response = await fetch('http://localhost:8000/api/studylists/', {
          method: 'GET',
          headers: {
            'Authorization': `Token ${authToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setStudyLists(data); // Update studyLists state with fetched data
        } else {
          console.error('Failed to fetch study lists');
        }
      } catch (error) {
        console.error('Error fetching study lists:', error);
      }
    };

    fetchStudyLists();
  }, [authToken]); // Rerun useEffect when authToken changes
  useEffect(() => {
    const filterKanji = () => {
      const filteredKanji = kanjiList.filter(kanji => {
        const matchesCharacterOrMeaning = kanji.character.includes(searchTerm) || kanji.meanings.some(meaning => meaning.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesJlpt = selectedJlpt ? kanji.jlpt_new === parseInt(selectedJlpt) : true;
        const matchesKanken = selectedKanken ? kanji.kanken_level === parseInt(selectedKanken) : true;

        return matchesCharacterOrMeaning && matchesJlpt && matchesKanken; //must meet all 3 conditions
      });

      setDisplayedKanji(filteredKanji);
    };

    filterKanji();
  }, [searchTerm, selectedJlpt, selectedKanken, kanjiList]);

  const handlePremadeListChange = (e) => {
    const listId = e.target.value;
    setSelectedPremadeList(listId);
    if (listId) {
      navigate(`/premadelist/${listId}`); // Use navigate to change the route
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    //implement search



  };

  return (
    <div class="homepage">
      <h1>Welcome to KanjiBud!</h1>
      <form onSubmit={handleSearch} class="search-form">
        <input
          type="text"
          placeholder="Search Kanji"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select value={selectedJlpt} onChange={(e) => setSelectedJlpt(e.target.value)}>
          <option value="">Select JLPT Level</option>
          <option value="5">N5</option>
          <option value="4">N4</option>
          <option value="3">N3</option>
          <option value="2">N2</option>
          <option value="1">N1</option>
        </select>
        <select value={selectedKanken} onChange={(e) => setSelectedKanken(e.target.value)}>
          <option value="">Select Kanken Level</option>
          <option value="10">Level 10</option>
          <option value="9">Level 9</option>
          <option value="8">Level 8</option>
          <option value="7">Level 7</option>
          <option value="6">Level 6</option>
          <option value="5">Level 5</option>
        </select>
        <button type="submit">Search</button>
      </form>
      <p><Link to="/login">Login</Link></p> {/* Link to the login page */}
      <p><Link to="/register">Register</Link></p>

      <h2>Study Lists</h2>
      <div class="study-container">
        {authToken && <StudyListManager />}
      </div>

      <div class="premade-list-selection">
        <label htmlFor="premadeListSelect">View Premade Study List:</label>
        <select id="premadeListSelect" value={selectedPremadeList} onChange={handlePremadeListChange}>
          <option value="">Select Premade List</option>
          {premadeStudyLists.map((list) => (
            <option key={list.id} value={list.id}>{list.name}</option>
          ))}
        </select>
      </div> {/* display the premade study lists */}
      <Quiz
        kanjis={displayedKanji}
        studyLists={studyLists}
        premadeStudyLists={premadeStudyLists}
        onQuizComplete={(results) => {
          console.log('Quiz complete!', results);
        }}
      />

      <div class="kanji-container">
        {/*display kanji from the filtered kanji list*/}
        {displayedKanji.map((kanji) => (
          <KanjiItem key={kanji.id} kanji={kanji} />
        ))}
      </div>
    </div >
  );
};




export default Homepage;