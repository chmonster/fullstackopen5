import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import BlogEntryForm from './BlogEntryForm'
import userEvent from '@testing-library/user-event'

test('<BlogEntryForm /> updates parent state and calls createBlog (5.16)', async () => {
  const createBlog = jest.fn()
  const user = userEvent.setup()

  render(<BlogEntryForm createBlog={createBlog} />)
  screen.debug()

  const input1 = screen.getByPlaceholderText('title')
  const input2 = screen.getByPlaceholderText('URL')
  const input3 = screen.getByPlaceholderText('author')
  const sendButton = screen.getByText('save')

  await user.type(input1, 'This is a Test' )
  await user.type(input2, 'www.testing.com' )
  await user.type(input3, 'Robert J. Test' )
  await user.click(sendButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  console.log(createBlog.mock.calls)
  expect(createBlog.mock.calls[0][0].title).toBe('This is a Test' )
  expect(createBlog.mock.calls[0][0].author).toBe('Robert J. Test' )
  expect(createBlog.mock.calls[0][0].url).toBe('www.testing.com' )
})