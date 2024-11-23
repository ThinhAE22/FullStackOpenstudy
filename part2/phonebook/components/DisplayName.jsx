import PersonObject from '../components/personObject'; 

const DisplayName = ({ persons_list, handleDelete }) => {
  return (
    <ul>
      {persons_list.map(person => (
        <PersonObject 
          key={person.id} //for the map not the instances of the PersonObject
          personObject={person} 
          deleteEntries={() => handleDelete(person.id)} 
        />
      ))}
    </ul>
  );
};

export default DisplayName;
