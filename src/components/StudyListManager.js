// src/components/StudyListManager.js
import React, { useEffect, useState, useCallback } from 'react';
import StudyList from './StudyList';
import { useAuth } from '../context/AuthContext';
import AddStudyListForm from './AddStudyListForm';

const StudyListManager = () => {
  const [studyLists, setStudyLists] = useState([]);
  const { authToken } = useAuth(); //get the authToken from AuthContext

  const fetchStudyLists = useCallback(async () => {
    if (!authToken) return; //return early if authToken is not set

    const response = await fetch('http://localhost:8000/api/studylists/', {
      method: 'GET',
      headers: {
        'Authorization': `Token ${authToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      setStudyLists(data);
    } else {
      console.error('Failed to fetch study lists');
    }
  }, [authToken]);

  useEffect(() => {
    fetchStudyLists();
  }, [authToken, fetchStudyLists]); //Rrrun useEffect when the authToken changes

  const handleListAdded = (newList) => {
    setStudyLists(prevLists => [...prevLists, newList]); //add new list to existing lists
  };

  const handleUpdate = async () => {
    await fetchStudyLists(); // Re-fetch study lists to update UI
    // Optionally, you can include logic to show a notification or perform other UI updates
    console.log('Study lists updated');
  };

  return (
    <div>
      <AddStudyListForm onListAdded={handleListAdded} />
      {studyLists.map((list) => (
        <StudyList key={list.id} list={list} onUpdate={handleUpdate} />
      ))}
    </div>
  );
};

export default StudyListManager;