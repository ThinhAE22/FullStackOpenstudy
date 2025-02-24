import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Logout from './components/Logoutbut'
import CreateBlog from './components/CreateForm'
import Error from './components/Error'
import CStatus from './components/ConfirmStatus'
import './index.css'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [errorMessage, setErrorMessage] = useState(null)
  const [cstatusMessage, setCStatusMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  //Login visible
  const [loginVisible, setLoginVisible] = useState(false)

  // Show blogs
  const [showAll, setShowAll] = useState(true)

  // access to a component's functions from outside the component
  const blogFormRef = useRef()

  // Check for logged-in user from localStorage
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  // Fetch blogs after login
  useEffect(() => {
    if (user) {
      blogService.getAll().then((blogs) => setBlogs(blogs))
    }
  }, [user]) // Triggered whenever "user" changes

  ///////////////////////////////////////////////////////////////////////////////////

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username,
        password,
      })

      window.localStorage.setItem('loggedNoteappUser', JSON.stringify(user))

      setUser(user)
      blogService.setToken(user.token) // Set the token for authenticated requests
      setUsername('')
      setPassword('')
    } catch (error) {
      setErrorMessage('Wrong user name or password')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const loginForm = () => {
    const hideWhenVisible = { display: loginVisible ? 'none' : '' }
    const showWhenVisible = { display: loginVisible ? '' : 'none' }

    return (
      <div>
        <div style={hideWhenVisible}>
          <button onClick={() => setLoginVisible(true)}>log in</button>
        </div>
        <div style={showWhenVisible}>
          <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleLogin}
          />
          <button onClick={() => setLoginVisible(false)}>cancel</button>
        </div>
      </div>
    )
  }

  const handleLogout = () => {
    window.localStorage.clear()
    setUser(null)
    setBlogs([])
  }

  ///////////////////////////////////////////////////////////////////////////////////

  const handleCreateBlog = async ({ title, author, url }) => {
    try {
      blogFormRef.current.toggleVisibility()
      const newBlog = await blogService.create({
        title,
        author,
        url,
      })
      setBlogs(blogs.concat(newBlog))
      setCStatusMessage(
        `A new blog ${newBlog.title} by ${newBlog.author} added`,
      )
      setTimeout(() => {
        setErrorMessage(null)
        setCStatusMessage(null)
      }, 5000)
    } catch (exception) {
      setErrorMessage('Failed to create blog')
      setTimeout(() => {
        setErrorMessage(null)
        setCStatusMessage(null)
      }, 5000)
    }
  }

  ////////////////////////////////////////////////////////////////////////////////////

  const handleAddLike = async (blog) => {
    // Optimistic UI update: update the like count immediately
    const updatedBlog = { ...blog, likes: blog.likes + 1 }
    setBlogs(blogs.map((b) => (b.id === blog.id ? updatedBlog : b)))
    try {
      const response = await blogService.update(blog.id, updatedBlog)
      setCStatusMessage(
        `You just liked "${updatedBlog.title}" by ${updatedBlog.author}`,
      )
      setTimeout(() => {
        setErrorMessage(null)
        setCStatusMessage(null)
      }, 5000)
    } catch (exception) {
      setErrorMessage('Failed to update blog')
      setTimeout(() => {
        setErrorMessage(null)
        setCStatusMessage(null)
      }, 5000)
    }
  }

  ////////////////////////////////////////////////////////////////////////////////////
  //Sort blogs by likes
  let blogstoShow = showAll
    ? blogs
    : [...blogs].sort((a, b) => b.likes - a.likes)

  ////////////////////////////////////////////////////////////////////////////////////
  //Handle delete
  const handleDelete = async (blog) => {
    if (window.confirm(`Delete ${blog.title} by ${blog.author}?`)) {
      setBlogs(blogs.filter((b) => b.id !== blog.id))
      try {
        const response = await blogService.deleteBlog(blog.id)
        setCStatusMessage(
          `You just deleted blog "${blog.title}" by ${blog.author}`,
        )
        setTimeout(() => {
          setErrorMessage(null)
          setCStatusMessage(null)
        }, 5000)
      } catch (exception) {
        setErrorMessage('Failed to delete blog')
        setTimeout(() => {
          setErrorMessage(null)
          setCStatusMessage(null)
        }, 5000)
      }
    }
  }

  return (
    <div>
      <Error message={errorMessage} />
      <CStatus message={cstatusMessage} />
      {user === null ? (
        loginForm()
      ) : (
        <div>
          <div>
            <p>
              {user.name} logged-in <Logout clearlocalstore={handleLogout} />
            </p>
          </div>
          <div>
            <Togglable buttonLabel="new blog" ref={blogFormRef}>
              <CreateBlog createBlog={handleCreateBlog} />
            </Togglable>
          </div>
          <div>
            <h1>blogs</h1>
            <button onClick={() => setShowAll(!showAll)}>
              Sort {showAll ? 'by like' : 'none'}
            </button>
            {blogstoShow.map((blog) => (
              <Blog
                key={blog.id}
                blog={blog}
                addLike={handleAddLike}
                deleteBlog={handleDelete}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default App
