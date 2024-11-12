//Ex 1.5

const Header = (props) => {
  return <h1>{props.course.name}</h1>;
};

const Content = (props) => {
  return (
    <div>
      {/* Accessing props.content */}
      {props.content.parts.map((item) => (
        <p>
          {item.name}: {item.exercises} exercises
        </p>
      ))}
    </div>
  );
};

const Total = (props) => {
  const totalExercises = props.Exnum.parts.reduce((sum, item) => sum + item.exercises, 0);
  return <p>Total exercises: {totalExercises}</p>;
};


const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }

  return (
    <div>
      <Header course={course} /> {/* This is a comment inside JSX */}
      <Content content={course} /> {/* use props.content */}
      <Total Exnum={course} />
    </div>
  );
};

export default App;

