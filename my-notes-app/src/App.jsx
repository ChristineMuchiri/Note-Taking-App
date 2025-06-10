import React, { useState, useEffect } from 'react';
import { DataStore } from '@aws-amplify/datastore';
import { Note } from './models';

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
    <div style={{ padding: '20px' }}>
      <h1>My Notes</h1>
      {error && (
        <div style={{ color: 'red', marginBottom: '10px' }}>
          {error}
          </div>
      )}



      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Note name"
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Note content"
      />
      <button onClick={addNote}>Add Note</button>

      <div>
        {notes.map(note => (
          <div key={note.id} style={{ margin: '10px', padding: '10px', border: '1px solid #ccc' }}>
            <h3>{note.name}</h3>
            <p>{note.content}</p>
            <button onClick={() => deleteNote(note.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;