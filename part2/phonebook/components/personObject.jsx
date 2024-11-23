const Person = ({ personObject, deleteEntries }) => {
  
    return (
      <h3>
        {personObject.name} {personObject.number} <button onClick={deleteEntries}>delete</button>
      </h3>
    )
  }
  
  export default Person