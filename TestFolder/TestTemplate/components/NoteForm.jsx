import { useState } from "react";
import PropTypes from "prop-types";

const NoteForm = ({ createNote }) => {
  const [newNote, setNewNote] = useState("");

  const addNote = (event) => {
    event.preventDefault();
    createNote({
      content: newNote,
      important: true,
    });

    setNewNote("");
  };

  return (
    <div className="formDiv">
      <h2>Create a new note</h2>

      <form onSubmit={addNote}>
        <input
          value={newNote}
          onChange={(event) => setNewNote(event.target.value)}
          placeholder='write note content here'
          id='note-input'
        />

        {/*<input
          value={newNote}
          onChange={(event) => setNewNote(event.target.value)}
        />*/}

        <button type="submit">save</button>
      </form>
    </div>
  );
};

// Define PropTypes
NoteForm.propTypes = {
  createNote: PropTypes.func.isRequired, // Ensure createNote is a function
};

export default NoteForm;
