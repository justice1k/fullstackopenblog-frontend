import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')


  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    console.log('logging in with ', username, password)

    try {
      const user = await loginService.login({
        username, password,
      })
      console.log(user)
      setUser(user)
      setUsername('')
      setPassword('')

    } catch (err) {
      console.log('err: ',err)
    }
  }

  const loginForm = () => (

    <form onSubmit={handleLogin}>
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
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App