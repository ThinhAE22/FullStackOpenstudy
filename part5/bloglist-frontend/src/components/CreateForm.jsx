import { useState } from 'react'

const CreateBlog = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({ title, author, url })
    
    // Reset fields after submission
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <div>
      <h1>Create New</h1>
      <form onSubmit={addBlog}>
        <div>
          <label htmlFor="title">Title:</label>
          <input
            data-testid='title'
            id="title"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="author">Author:</label>
          <input
            data-testid='author'
            id="author"
            type="text"
            value={author}
            onChange={(event) => setAuthor(event.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="url">URL:</label>
          <input
            data-testid='url'
            id="url"
            type="text"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            required
          />
        </div>
        <button type="submit">Create</button>
      </form>
    </div>
  )
}

export default CreateBlog
