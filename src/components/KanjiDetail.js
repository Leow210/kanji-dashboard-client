import React, { useState, useEffect } from 'react';
import KanjiItem from './KanjiItem';
import { useParams } from 'react-router-dom';
import './styles/KanjiDetail.css';

const KanjiDetail = () => {
  const [kanjiDetail, setKanjiDetail] = useState(null);
  const { kanjiId } = useParams();

  useEffect(() => {
    fetch(`http://localhost:8000/api/kanjis/${kanjiId}/`)  // Adjust the URL based on your API endpoint
      .then(response => response.json())
      .then(data => setKanjiDetail(data))
      .catch(error => console.error('Error fetching Kanji detail:', error));
  }, [kanjiId]);

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
    </div>
  );
};

export default KanjiDetail;