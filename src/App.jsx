import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)


  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedInUserJSON = window.localStorage.getItem('loggedInUser')

    if(loggedInUserJSON){
      const user = JSON.parse(loggedInUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    console.log('logging in with ', username, password)

    try {
      const user = await loginService.login({
        username, password,
      })
      console.log(user)
      window.localStorage.setItem(
        'loggedInUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')

    } catch (err) {
      setErrorMessage('Invalid username or password')
      setTimeout(() => setErrorMessage(null), 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.clear()
    setUser(null)
    blogService.setToken(null)
  }

  const handleNewBlog = async (event) => {
    event.preventDefault()

    try{
      const blogObject = {
        title: newTitle,
        author: newAuthor,
        url: newUrl
      }

      const createdBlog = await blogService.create(blogObject)
      console.log(createdBlog)
      setBlogs(blogs.concat(createdBlog))
      setNewTitle('')
      setNewAuthor('')
      setNewUrl('')
    }catch(err){
      console.log("error creating blog", err)
    }
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
    {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
        <div>
          username
          <input
          required
          type='text'
          value={username}
          name='Username'
          onChange={({target}) => setUsername(target.value)}
          />
        </div>

        <div>
          password
          <input
          required
          type='password'
          value={password}
          name='Password'
          onChange={({target}) => setPassword(target.value)}
          />
        </div>
        <button type='submit'>Login</button>
      </form>
  )

  if(user === null){
    return loginForm()
  }

  return (
    <div>
      <h2>blogs</h2>
      <h3>{user.name} is logged in</h3>

      <p>Create new blog</p>
      <form onSubmit={handleNewBlog}>
        <div>
        title
        <input
         name='title'
         value={newTitle}
         onChange={(event) => setNewTitle(event.target.value)}
         required
        />
        </div>
        <div>
        author
        <input
         name='author'
         value={newAuthor}
         onChange={(event) => setNewAuthor(event.target.value)}
         required
        />
        </div>
        <div>
        url
        <input
         name='url'
         value={newUrl}
         onChange={(event) => setNewUrl(event.target.value)}
        />
        </div>
        <button type='submit'>Create</button>                
      </form>
      <button onClick={handleLogout}>Logout</button>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

// TODO: work on notifications

export default App