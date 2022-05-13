import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [newTitle, setNewTitle] = useState('')
  const [newUrl, setNewUrl] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('') 
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState({ 'text': null, 'type': null })

  const handleTitleChange = (event) => {
    setNewTitle(event.target.value)
  }

  const handleUrlChange = (event) => {
    setNewUrl(event.target.value)
  }
  const handleAuthorChange = (event) => {
    setNewAuthor(event.target.value)
  }

  const doMessage = (text, type) => {
    setMessage({ text: text, type: type })
    setTimeout(() => {
    setMessage({ text: null, type: null })
    }, 5000)
  }

  const handleLogin =async (event) => {
    event.preventDefault()
    console.log('logging in with', username, password)
    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      ) 
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      doMessage(`${user.name} logged in`, 'confirm')
    } catch (exception) {
      doMessage('Wrong credentials', 'error')
    } 
  }


  const handleLogout = async (event) => {
    event.preventDefault()
    console.log('logging out with', user.name)
    try {
      window.localStorage.removeItem('loggedBlogappUser')
      blogService.setToken(null)
      doMessage(`${user.name} logged out`, 'confirm')
      setUser(null)
      setUsername('')
      setPassword('')         
    } catch {
      doMessage('Logout Error', 'error')
    }
  }

  const addBlog = (event) => {
    event.preventDefault()
    const blogObject = {
      title: newTitle,
      author: newAuthor,
      url: newUrl,
    }

    blogService
      .create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        doMessage(`Blog '${returnedBlog.title}' saved`, 'confirm')
        setNewTitle('')
        setNewUrl('')
        setNewAuthor('')
      }).catch(error => {
        console.log(error)
        doMessage(error.response.data.error.toString(), 'error')
      })
  }

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const loginForm = () => (
    <form onSubmit={handleLogin} style={{ width: '50%' }}>
      <table><tbody><tr>
        <td>
          username
            <input
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </td>
        <td>
          password
            <input
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </td>
        <td>
          <button type="submit" style={{ align: 'right' }}>login</button>
        </td>
      </tr></tbody></table>
    </form>
  )
  
  const blogForm = () => (
    <>
      <table style={{width: '50%'}}><tbody><tr>
        <td>{user.name} logged in</td>
        <td style={{align: 'right'}}><button onClick={handleLogout}>Log out</button></td>
      </tr></tbody></table>
      
      <form onSubmit={addBlog}>
        <table style={{width: '50%'}}><tbody>
          <tr><td>
            Title
            <input value={newTitle} onChange={handleTitleChange} />
            </td><td>
            URL
            <input value={newUrl} onChange={handleUrlChange} />
            </td><td>
            Author
            <input value={newAuthor} onChange={handleAuthorChange} />
            </td><td>
            <button type="submit">save</button>
            </td>
          </tr>
        </tbody></table>
      </form>
    </>
  )

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={message.text} messageType={message.type} />
      {user === null ? loginForm() : blogForm()}
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App