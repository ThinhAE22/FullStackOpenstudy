const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =                                                  //default name will be test not noteApp
  `mongodb+srv://Thinh:${password}@cluster0.9613r.mongodb.net/noteApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})
//Schema need to refer in singular eg note not notes
const Note = mongoose.model('Note', noteSchema)

//Saving a new note
/*
const note = new Note({
  content: 'HTML is easy',
  important: true,
})


note.save().then(result => {
  console.log('note saved!')
  mongoose.connection.close()
})
*/

//print out new note
//Note.find({ important: true }).then(result => { add find param like this
Note.find({}).then(result => {
  result.forEach(note => {
    console.log(note)
  })
  mongoose.connection.close()
})