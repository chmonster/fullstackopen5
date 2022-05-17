import { useState } from 'react'
import PropTypes from 'prop-types'

const BlogEntryForm = ({ createBlog }) => {

  BlogEntryForm.propTypes = {
    createBlog: PropTypes.func.isRequired
  }

  const [newTitle, setNewTitle] = useState('')
  const [newUrl, setNewUrl] = useState('')
  const [newAuthor, setNewAuthor] = useState('')

  const handleTitleChange = (event) => setNewTitle(event.target.value)
  const handleUrlChange = (event) => setNewUrl(event.target.value)
  const handleAuthorChange = (event) => setNewAuthor(event.target.value)

  const addBlog = (event) => {
    event.preventDefault()
    const blogObject = {
      title: newTitle,
      author: newAuthor,
      url: newUrl,
    }
    console.log(blogObject)
    createBlog(blogObject)
    setNewTitle('')
    setNewUrl('')
    setNewAuthor('')
  }

  return (
    <div className='blogEntryForm'>
      <h2 style={{ textAlign: 'center' }}>Enter a Blog</h2>
      <form onSubmit={addBlog}>
        <table><tbody>
          <tr style={{ display: 'flex', justifyContent: 'center' }}>
            <td>
              <input id='title' value={newTitle} onChange={handleTitleChange} placeholder = 'title' />
            </td>
            <td>
              <input id='url' value={newUrl} onChange={handleUrlChange} placeholder = 'URL' />
            </td>
            <td>
              <input id='author' value={newAuthor} onChange={handleAuthorChange} placeholder='author' />
            </td>
            <td>
              <button id='save-button' type="submit">save</button>
            </td>
          </tr>
        </tbody></table>
      </form>
    </div>
  )
}

export default BlogEntryForm