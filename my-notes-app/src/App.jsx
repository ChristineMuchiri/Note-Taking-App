import React, { useState, useEffect } from 'react';
import { DataStore } from '@aws-amplify/datastore';
import { Note } from './models';

function App() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const setError = useState('');

  // Load notes from database on startup
  useEffect(() => {
    fetchNotes();
  }, []);

  async function fetchNotes() {
    const notes = await DataStore.query(Note);
    setNotes(notes);
  }

  async function addNote() {
  if (!title.trim()) {
    setError("Title is required");
    return;
  }
  
  try {
    await DataStore.save(
      new Note({
        title,
        content: content || "", // Ensure content exists
        createdAt: new Date().toISOString()
      })
    );
    setTitle('');
    setContent('');
    await fetchNotes();
  } catch (err) {
    setError("Failed to save: " + err.message);
  }
}

  async function deleteNote(id) {
    const toDelete = await DataStore.query(Note, id);
    if (toDelete) await DataStore.delete(toDelete);
    fetchNotes(); // Refresh the list
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>My Notes</h1>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Note title"
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
            <h3>{note.title}</h3>
            <p>{note.content}</p>
            <button onClick={() => deleteNote(note.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;