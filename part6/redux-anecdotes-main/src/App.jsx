import Anecdotes from './components/Anecdotes';
import AnecdotesForm from './components/NewAnecdotesForm';

const App = () => {

  return (
    <div>
      <h2>Anecdotes</h2>
      <Anecdotes />

      <h2>create new</h2>
      <AnecdotesForm />
    </div>
  );
};

export default App;
