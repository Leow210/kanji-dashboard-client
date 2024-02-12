import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // Import useParams if you're using React Router
import KanjiItem from './KanjiItem';

import './styles/StudyListDetailPage.css';

const StudyListDetailPage = () => {
  const [studyListDetails, setStudyListDetails] = useState(null); //state to store the study list details
  const { studyListId } = useParams(); //get the studyListId from URL parameters 
  const authToken = localStorage.getItem('authToken');

  useEffect(() => {
    const fetchStudyListDetails = async () => {
      const response = await fetch(`/api/studylists/${studyListId}/`, {
        headers: {
          'Authorization': `Token ${authToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStudyListDetails(data);
      } else {
        console.error('Failed to fetch study list details');
      }
    };

    if (studyListId) {
      fetchStudyListDetails();
    }
  }, [studyListId, authToken]); //depnd on the studyListId and authToken to re-run useEffect when they change

  if (!studyListDetails) {
    return <div>Loading...</div>; // Show loading state
  }

  return (
    <div class="study-list-detail">
      <h1>Study List Detail Page</h1>
      <h2>{studyListDetails.name}</h2>
      <div class="kanji-container">
        {studyListDetails.kanjis.map((kanji) => (
          //<li key={kanji.id}>{kanji.character}</li> // Adjust based on your actual data structure
          <KanjiItem key={kanji.id} kanji={kanji} />
        ))}
      </div>
    </div>
  );
};

export default StudyListDetailPage; 
