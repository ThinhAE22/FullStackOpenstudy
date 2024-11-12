//Ex 1.4

const Header = (props) => {
  return <h1>{props.course}</h1>;
};

const Content = (props) => {
  return (
    <div>
      {/* Accessing props.content */}
      {props.content.map((item) => (
        <p>
          {item.part}: {item.exercise} exercises
        </p>
      ))}
    </div>
  );
};

const Total = (props) => {
  const totalExercises = props.Exnum.reduce((sum, item) => sum + item.exercise, 0);
  return <p>Total exercises: {totalExercises}</p>;
};

// Correct the Part component to use only one 'props' argument
const Part = (props) => {
  const PartNumber = props.partnumber;
  return <p>{props.sourcename[PartNumber].part}, exercises: {props.sourcename[PartNumber].exercise}</p>;
};

const App = () => {
  const course = 'Half Stack application development';
  const content = [
    { part: 'Fundamentals of React', exercise: 10 },
    { part: 'Using props to pass data', exercise: 7 },
    { part: 'State of a component', exercise: 14 },
  ];

  return (
    <div>
      <Header course={course} /> {/* This is a comment inside JSX */}
      <Content content={content} /> {/* use props.content */}
      <Total Exnum={content} />

      <Part sourcename={content} partnumber={1} /> {/* Passing content and partnumber to Part */}
    </div>
  );
};

export default App;
