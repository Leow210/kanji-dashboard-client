// src/components/AddStudyListForm.js

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './styles/AddStudyListForm.css';

const AddStudyListForm = ({ onListAdded }) => {
  const [listName, setListName] = useState('');
  const { authToken } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('/api/studylists/', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${authToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: listName }),
    });

    if (response.ok) {
      const newList = await response.json(); // Assume the API returns the created list
      onListAdded(newList); // Pass the new list to the callback
      setListName(''); // Reset the form
    } else {
      console.error('Failed to create the study list');
    }
  };

  return (
    <form onSubmit={handleSubmit} class="add-study-list-form">
      <input
        type="text"
        placeholder="Enter List Name"
        value={listName}
        onChange={(e) => setListName(e.target.value)}
        required
      />
      <button type="submit">Create New Study List</button>
    </form>
  );
};

export default AddStudyListForm;