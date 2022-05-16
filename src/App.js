import { useState, useEffect, useRef } from 'react'
import Header from './components/Header'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import BlogEntryForm from './components/BlogEntryForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState({ 'text': null, 'type': null })

  const togglableLoginRef = useRef()
  const togglableBlogRef = useRef()
  const loginRef = useRef()

  const doMessage = (text, type) => {
    setMessage({ text: text, type: type })
    setTimeout(() => {
      setMessage({ text: null, type: null })
    }, 5000)
  }

  const incLike = async (blog) => {
    const updatedBlog = { ...blog, likes: blog.likes+1 }
    try {
      await blogService.update(blog.id, updatedBlog)
      doMessage(`You liked '${updatedBlog.title}'`, 'confirm')
    } catch(error) {
      console.log(error)
      doMessage(error.response.data.error, 'error')
    }
  }

  const deleteBlog = async (blog) => {
    try {
      const blogDeleted = blog.title
      if(window.confirm(`Confirm removal of '${blogDeleted}'`))
      {
        await blogService.remove(blog.id)
        doMessage(`'${blogDeleted}' deleted`, 'confirm')
      }
    } catch(error) {
      console.log(error)
      doMessage(error.response.data.error, 'error')
    }
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    const username = loginRef.current.username
    const password = loginRef.current.password
    console.log('logging in with', username, password)
    try {
      const user = await loginService.login({
        username, password
      })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      loginRef.current.setUsername('')
      loginRef.current.setPassword('')
      doMessage(`${user.name} logged in`, 'confirm')
    } catch (exception) {
      doMessage('Wrong credentials', 'error')
    }
  }

  const handleLogout = async (event) => {
    event.preventDefault()
    console.log('logging out ', user.username)
    try {
      window.localStorage.removeItem('loggedBlogappUser')
      blogService.setToken(null)
      doMessage(`${user.username} logged out`, 'confirm')
      setUser(null)
      console.log(loginRef.current)
    } catch(error) {
      console.log('logout error', error)
      doMessage(error.message, 'error')
    }
  }

  const createBlog = (blogObject) => {
    togglableBlogRef.current.toggleVisibility()
    blogService
      .create(blogObject)
      .then(returnedBlog => {
        console.log('returnedBlog', returnedBlog)
        setBlogs(blogs.concat(returnedBlog))
        doMessage(`Blog '${returnedBlog.title}' saved`, 'confirm')
      }).catch(error => {
        console.log(error)
        doMessage(error.response.data.error.toString(), 'error')
      })
  }

  useEffect(() => {
    blogService.getAll().then(blogs => setBlogs(blogs))
  }, [blogs])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const loginForm = () => {
    return (
      <div>
        <Togglable buttonLabel='log in' ref={togglableLoginRef}>
          <LoginForm ref={loginRef} onSubmit={handleLogin} />
        </Togglable>
      </div>
    )
  }

  const blogForm = () => (
    <>
      <Togglable buttonLabel='new blog' ref={togglableBlogRef}>
        <BlogEntryForm createBlog = {createBlog} user={user} />
      </Togglable>
    </>
  )

  return (
    <div>
      <Notification message={message.text} messageType={message.type} />
      <Header user={user} handleLogout={handleLogout} />
      {user === null ? loginForm() : blogForm()}
      {blogs.sort((a,b) => (b.likes - a.likes))
        .map(blog =>
          <Blog
            key={blog.id}
            blog={blog}
            incLike={incLike}
            user={user}
            deleteBlog={deleteBlog}
          />
        )}
    </div>
  )
}

export default App