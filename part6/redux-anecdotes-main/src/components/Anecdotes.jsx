import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

const Anecdotes = () => {
  // Fetch anecdotes from the Redux state
  const anecdotes = useSelector(state => state);
  
  // Sort anecdotes by votes in descending order
  const sortedAnecdotes = [...anecdotes].sort((a, b) => b.votes - a.votes);

  const dispatch = useDispatch();

  const vote = (id) => {
    console.log('vote', id);
    dispatch({
      type: 'VOTE',
      id
    });
  };

  return (
    <div>
      {sortedAnecdotes.map(anecdote => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote.id)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Anecdotes;
