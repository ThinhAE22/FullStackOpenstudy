import axios from 'axios'
const baseUrl = '/api/persons' //3.11
//const baseUrl = "https://render-test-fso-course.onrender.com/api/persons" //Ex 3.10
//const baseUrl = 'http://localhost:3001/api/persons' //Ex 3.9
//const baseUrl = 'http://localhost:3001/persons' //Ex 2 og

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = newObject => {
  const request = axios.post(baseUrl, newObject)
  return request.then(response => response.data)
}

const deleteEntry = (id) => {
  return axios.delete(`${baseUrl}/${id}`);
};

const updateNumber = (id, updatedPerson) => {
  const request = axios.put(`${baseUrl}/${id}`, updatedPerson);
  return request.then(response => response.data)
};


export default { getAll, create, deleteEntry , updateNumber};