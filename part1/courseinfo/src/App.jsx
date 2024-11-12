//Ex 1.1, 1.2, 1.3
const Header = (props) => {
  return <h1>{props.course}</h1>;
};

const Content = (props) => {
  const partName = props.partName
  return (
    <div>    {/* like this prop.content*/}
      {props.partName.name}, exercises: {props.partName.exercises}
    </div>
  );
};

const Total = (props) => {
  let totalExercises = 0;

  //initiate a for loop
  for (let i = 0;i < props.parts.length;i++) {
    totalExercises += props.parts[i].exercises;
  }

  return <p>Total exercises: {totalExercises}</p>;
};



const App = () => {
  const course = 'Half Stack application development'
  const part1 = {
    name: 'Fundamentals of React',
    exercises: 10
  }
  const part2 = {
    name: 'Using props to pass data',
    exercises: 7
  }
  const part3 = {
    name: 'State of a component',
    exercises: 14
  }

   // an array to make the total easier to calculate
   const parts = [part1, part2, part3];

  return (
    <div>
      <Header course={course} /> {/* This is a comment inside JSX */}
      <Content partName={part1} />
      <Content partName={part2} />
      <Content partName={part3} />
      <Total parts={parts} />


    </div>
  );
};

export default App;
