import React, { useState, useEffect } from 'react';
import KanjiItem from './KanjiItem';
import { useAuth } from '../context/AuthContext';
import { useParams } from 'react-router-dom';
import Cookies from 'js-cookie'
import './styles/KanjiDetail.css';

const KanjiDetail = () => {
  const [kanjiDetail, setKanjiDetail] = useState(null);
  const [studyLists, setStudyLists] = useState([]);
  const [selectedList, setSelectedList] = useState('');
  const { kanjiId } = useParams();
  const { authToken } = useAuth(); // Use authentication token from context
  const csrftoken = Cookies.get('csrftoken');

  useEffect(() => {
    // Fetch Kanji details
    fetch(`http://localhost:8000/api/kanjis/${kanjiId}/`)
      .then(response => response.json())
      .then(data => setKanjiDetail(data))
      .catch(error => console.error('Error fetching Kanji detail:', error));

    // Fetch Study Lists
    if (authToken) {
      fetch('http://localhost:8000/api/studylists/', {
        headers: {
          'Authorization': `Token ${authToken}`,
        },
      })
        .then(response => response.json())
        .then(data => setStudyLists(data))
        .catch(error => console.error('Error fetching study lists:', error));
    }
  }, [kanjiId, authToken]);

  const addKanjiToList = async () => {
    if (!selectedList) {
      alert('Please select a study list.');
      return;
    }

    const response = await fetch(`http://localhost:8000/api/studylists/${selectedList}/kanjis/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${authToken}`,
        'X-CSRFToken': csrftoken,
      },
      body: JSON.stringify({ kanji_id: kanjiId }),
    });

    if (response.ok) {
      alert('Kanji added to your study list.');
    } else {
      console.error('Failed to add Kanji to the study list');
    }
  };

  return (
    <div class="kanji-detail">
      {kanjiDetail ? (
        <div>
          <h1>{kanjiDetail.character}</h1>
          <p>Meanings: {kanjiDetail.meanings.join(', ')}</p>
          <p>Strokes: {kanjiDetail.strokes}</p>
          <p>Readings: On(音) - {kanjiDetail.readings_on.join(', ')}, Kun(訓) - {kanjiDetail.readings_kun.join(', ')}</p>
          <p>JLPT Level: {kanjiDetail.jlpt_new}</p>
          <p>Kanken Level (漢字検定): {kanjiDetail.kanken_level}</p>
          <p>Wanikani Level: {kanjiDetail.wk_level}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
      <div id="add-to-list">
        <select value={selectedList} onChange={(e) => setSelectedList(e.target.value)}>
          <option value="">Select Study List</option>
          {studyLists.map((list) => (
            <option key={list.id} value={list.id}>{list.name}</option>
          ))}
        </select>
        <button onClick={addKanjiToList}>Add Kanji to Selected List</button>
      </div>
    </div>
  );
};

export default KanjiDetail;