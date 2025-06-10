import React, { useState, useEffect } from 'react';
import { DataStore } from '@aws-amplify/datastore';
import { Note } from './models';
import './App.css';

function App() {
  const [notes, setNotes] = useState([]);
  const [name, setName] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState(null);

  // Load notes from database on startup
  useEffect(() => {
    fetchNotes();
  }, []);

  async function fetchNotes() {
    try {
      const notes = await DataStore.query(Note);
    setNotes(notes);
    } catch (err) {
      setError("Failed to load notes: " + err.message);
    }
    
  }

  async function addNote() {
  if (!name.trim()) {
    setError("Title is required");
    return;
  }
  
  try {
    await DataStore.save(
      new Note({
        name,
        content: content || "", // Ensure content exists
        createdAt: new Date().toISOString()
      })
    );
    setName('');
    setContent('');
    setError(null);
    await fetchNotes();
  } catch (err) {
    setError("Failed to save: " + err.message);
  }
}

  async function deleteNote(id) {
    try {
      const toDelete = await DataStore.query(Note, id);
    if (toDelete) await DataStore.delete(toDelete);
    await fetchNotes(); // Refresh the list
    } catch (err) {
      setError("Failed to delete note: " + err.message);
    }
    
  }

  return (
    <div className='notes-app'>
      <div className='notes-container'>
      <h1>💖 My Notes</h1>
      {error && (
        <div className='notes-error'>
          {error}
          </div>
      )}
      <input
        className='note-input'
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Note name ✏️"
        />
      
        <textarea
          className='note-textarea'
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Note content 💬"
        />
      
      <div className='add-button'>
        <button onClick={addNote}>➕ Add Note</button>
      </div>
      

      <div className='new-note'>
        {notes.map(note => (
          <div key={note.id} className='note-card'>
            <h3>{note.name}</h3>
            <p>{note.content}</p>
            <button onClick={() => deleteNote(note.id)}>🗑️ Delete</button>
          </div>
        ))}
        </div>
        </div>
    </div>
  );
}

export default App;