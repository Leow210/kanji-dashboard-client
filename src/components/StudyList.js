// src/components/StudyList.js

import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import './styles/StudyList.css';

const csrftoken = Cookies.get('csrftoken');




const StudyList = ({ list, onUpdate, onDelete }) => {
  const [kanjis, setKanjis] = useState([]);
  const [selectedKanji, setSelectedKanji] = useState(null); // The Kanji selected to be added to the list
  const { authToken } = useAuth();

  useEffect(() => {
    const fetchKanjis = async () => {
      const response = await fetch('/api/kanjis/', {
        headers: {
          'Authorization': `Token ${authToken}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setKanjis(data);
      }
    };

    // Immediately invoked async function inside useEffect
    (async () => {
      await fetchKanjis();
    })();
  }, [authToken]);
  const navigate = useNavigate(); //use navigate hook to redirect to the study list detail page

  const handleStudyListClick = () => {
    navigate(`/studylists/${list.id}`); //redirect to the study list detail page
  };




  const deleteList = async () => {
    //ask user to confirm before deleting
    if (window.confirm(`Are you sure you want to delete the list "${list.name}"?`)) {
      const response = await fetch(`/api/studylists/${list.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Token ${localStorage.getItem('authToken')}`,
        },
      });
      if (response.ok) {
        onDelete(list.id); //call the onDelete prop function to remove the list from the display of the parent component
      } else {
        console.error('Failed to delete study list');
      }
    }
  };

  const addKanjiToList = async () => {
    if (!selectedKanji) {
      alert('Please select a Kanji to add.');
      return;
    }

    // Check if the Kanji is already in the study list
    const isKanjiInList = list.kanjis.some(kanji => kanji.id === selectedKanji);
    if (isKanjiInList) {
      alert('This Kanji is already in your study list.');
      return;
    }

    const response = await fetch(`/api/studylists/${list.id}/kanjis/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${authToken}`,
        'X-CSRFToken': csrftoken,
      },
      body: JSON.stringify({ kanji_id: selectedKanji }),
    });

    if (response.ok) {
      alert('Kanji added to your study list.');
      onUpdate(); // Trigger update in parent component to refresh the list
    } else {
      console.error('Failed to add Kanji to the study list');
    }
  };

  return (
    <div class="study-list">
      <h3 onClick={handleStudyListClick}>{list.name}</h3>
      <select value={selectedKanji} onChange={(e) => setSelectedKanji(e.target.value)}>
        <option value="">Select Kanji</option>
        {kanjis.map((kanji) => (
          <option key={kanji.id} value={kanji.id}>
            {kanji.character}
          </option>
        ))}
      </select>
      <button onClick={addKanjiToList}>Add Kanji to List</button>

      {/* add Kanji here - check if already in then add*/}
    </div>
  );
};

export default StudyList;



// const handleAddKanji = async () => {
//   if (selectedKanji === null) {
//     console.error('No Kanji selected');
//     return;
//   }

//   try {
//     const response = await fetch(`/api/studylists/${list.id}/add_kanji/${selectedKanji}/`, {
//       method: 'POST',
//       headers: {
//         'Authorization': `Token ${authToken}`,
//         'Content-Type': 'application/json',
//       },
//     });

//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     const newKanji = await response.json();
//     setKanjis([...kanjis, newKanji]);
//   } catch (error) {
//     console.error('Failed to add Kanji to the list', error);
//   }
// };

// const handleAddKanji = async (listId, kanjiId) => {
//   const response = await fetch(`/api/add_kanji_to_list/${listId}/${kanjiId}/`, {
//     method: 'POST',
//     headers: {
//       'Authorization': `Token ${authToken}`,
//       'Content-Type': 'application/json',
//     },
//   });

//   if (response.ok) {
//     const data = await response.json();
//     if (data.status === 'success') {
//       // Kanji was successfully added to the list
//     } else {
//       // There was an error adding the Kanji to the list
//       console.error(data.message);
//     }
//   } else {
//     // There was an error with the request
//     console.error(`HTTP error! status: ${response.status}`);
//   }
// };

// const addKanjiToList = async (event) => {
//   event.preventDefault(); // Prevent the default form submission

//   const response = await fetch(`/api/studylists/${list.id}/add_kanji/${selectedKanji}/`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       'X-CSRFToken': csrfToken,
//       'Authorization': `Token ${localStorage.getItem('authToken')}`,
//     },
//     body: JSON.stringify({ list_id: list.id, kanji_id: selectedKanji }),
//   });

//   if (response.ok) {
//     // Handle successful response
//   } else {
//     console.error('Failed to add Kanji to list');
//   }
// };

// const removeKanjiFromList = async (kanjiId) => {
//   const response = await fetch(`/api/studylists/${list.id}/kanjis/${kanjiId}`, {
//     method: 'DELETE',
//     headers: {
//       'Content-Type': 'application/json',
//       'Authorization': `Token ${localStorage.getItem('authToken')}`,
//     },
//   });
//   if (response.ok) {
//     //update local state to reflects changes
//     setKanjis(kanjis.filter(kanji => kanji.id !== kanjiId));
//     onUpdate(); //call the onUpdate prop function to refresh the list in the parent component
//   } else {
//     console.error('Failed to remove Kanji from list');
//   }
// };