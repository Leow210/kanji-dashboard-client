import React, { useState, useEffect } from 'react';
import KanjiItem from './KanjiItem';
import { Link } from 'react-router-dom';

const KanjiList = () => {
  const [kanjis, setKanjis] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/kanjis/');
        const data = await response.json();
        setKanjis(data);
      }

      catch (error) {
        console.error("Failed to cactch Kanji data: ", error);
      }


    };

    fetchData();
  }, []);


  return (
    < div >
      <h1>Kanji List</h1>
      <ul>
        {kanjis.map(kanji => (
          <li key={kanji.id}>
            <Link to={`/kanji/${kanji.id}`}>{kanji.character}</Link>
          </li>
        ))}
      </ul>
    </div >
  );
};

export default KanjiList;