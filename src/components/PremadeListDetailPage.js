import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import KanjiItem from './KanjiItem';
import './styles/StudyListDetailPage.css';

const PremadeListDetailPage = () => {
  const [premadeListDetails, setPremadeListDetails] = useState(null); // state to store the premade study list details
  const { listId } = useParams(); // Use useParams to get listId from URL
  const authToken = localStorage.getItem('authToken'); // Retrieve the auth token from localStorage

  useEffect(() => {
    const fetchPremadeListDetails = async () => {
      const response = await fetch(`http://localhost:8000/api/premadestudylists/${listId}/`, {
        headers: {
          'Authorization': `Token ${authToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPremadeListDetails(data);
      } else {
        console.error('Failed to fetch premade study list details');
      }
    };

    if (listId) {
      fetchPremadeListDetails();
    }
  }, [listId, authToken]); // Depend on listId and authToken to re-run useEffect when they change

  if (!premadeListDetails) {
    return <div>Loading...</div>; // Show loading state while data is being fetched
  }

  return (
    <div class="study-list-detail">
      <h1>Premade Study List</h1>
      <h2>{premadeListDetails.name}</h2>
      <div class="kanji-container">
        {premadeListDetails.kanjis && premadeListDetails.kanjis.map((kanji) => (
          <KanjiItem key={kanji.id} kanji={kanji} />
        ))}
      </div>
    </div>
  );
};

export default PremadeListDetailPage;