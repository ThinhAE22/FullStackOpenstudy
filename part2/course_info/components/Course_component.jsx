const Course = ({ courses }) => {
    return (
      <div>
        {courses.map(course => {
          const total = course.parts.reduce((sum, part) => sum + part.exercises, 0);
  
          return (
            <div key={course.id}>
              <h1>{course.name}</h1>
              {course.parts.map(part => (
                <h3 key={part.id}>
                  {part.name} {part.exercises}
                </h3>
              ))}
              <h3>total of {total} exercises</h3>
            </div>
          );
        })}
      </div>
    );
  }; 

  export default Course;