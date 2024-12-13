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
    <div className="kanji-detail">
      {kanjiDetail ? (
        <div>
          <h1>{kanjiDetail.character}</h1>

          <div className="info-grid">
            <div className="info-card">
              <div className="info-label">Meanings</div>
              <div className="info-content">{kanjiDetail.meanings.join(', ')}</div>
            </div>

            <div className="info-card">
              <div className="info-label">Strokes</div>
              <div className="info-content">{kanjiDetail.strokes}</div>
            </div>

            <div className="info-card">
              <div className="info-label">JLPT Level</div>
              <div className="info-content">N{kanjiDetail.jlpt_new}</div>
            </div>

            <div className="info-card">
              <div className="info-label">Kanken Level</div>
              <div className="info-content">{kanjiDetail.kanken_level}</div>
            </div>
          </div>

          <div className="readings-container">
            <div className="readings-title">Readings</div>
            <div className="readings-grid">
              <div className="reading-type">
                <div className="info-label">On (音)</div>
                <div className="info-content">{kanjiDetail.readings_on.join(', ')}</div>
              </div>
              <div className="reading-type">
                <div className="info-label">Kun (訓)</div>
                <div className="info-content">{kanjiDetail.readings_kun.join(', ')}</div>
              </div>
            </div>
          </div>
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