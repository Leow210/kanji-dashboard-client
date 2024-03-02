import React from 'react';
import { Link } from 'react-router-dom';
import './styles/KanjiItem.css';


const KanjiItem = ({ kanji }) => {

  return (
    <div class="kanji-item">
      <Link to={`/kanji/${kanji.id}`}>
        <h2>{kanji.character}</h2>
        <p>{kanji.meaning}</p>
        <p>JLPT Level: {kanji.jlpt_new}</p>
        <p>Kanji Kentei Level: {kanji.kanken_level}</p>
      </Link>
      {/*could add stuff like buttons here*/}

    </div>
  );
};

export default KanjiItem