import { DataStore } from 'aws-amplify';
import { Note } from './models';
import logo from './logo.svg';
import './App.css';
import { useEffect } from 'react';
import { withAuthenticator } from '@aws-amplify/ui-react';



function App() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  // fetch notes
  useEffect(() => { DataStore.query(Note).then(setNotes); }, []);

  //add note
  const addNote = async () => {
    await DataStore.save(new Note({ title, content }));
    setTitle(''); setContent('');
  };
  //delete note
  const deleteNote = async (id) => {
    const toDelete = await DataStore.query(Note, id);
    if (toDelete) await DataStore.delete(toDelete);
  };
  return (
    <div>
      <h1>My Notes</h1>
      <input value={title} onChange={(e) => setTitle(e.target.value)} />
      <textarea value={content} onChange={(e) => setContent(e.target.value)} />
      <button onClick={addNote}>Add Note</button>
      {notes.map(note => (
        <div key={note.id}>
          <h3>{note.title}</h3>
          <p>{note.content}</p>
          <button onClick={() => deleteNote(note.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default withAuthenticator(App);
