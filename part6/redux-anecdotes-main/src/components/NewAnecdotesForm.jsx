import React from 'react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';

const AnecdotesForm = () => {
    const dispatch = useDispatch();
    const [newAnecdote, setNewAnecdote] = useState('');

    const createAnecdote = (event) => {
        event.preventDefault();
        if (newAnecdote.trim()) {
          dispatch({
            type: 'CREATE',
            content: newAnecdote
          });
          setNewAnecdote(''); // Reset input after submit
        }
      };
  return (
    <div>
      <form onSubmit={createAnecdote}>
        <div>
          <input
            value={newAnecdote}
            onChange={(e) => setNewAnecdote(e.target.value)}
          />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  );
};

export default AnecdotesForm;
