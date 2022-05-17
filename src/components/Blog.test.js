import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('renders content for unexpanded blog (5.13)', () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    url: 'http://www.testing.com',
    author: 'Wilbur T. Jethro',
    likes: 666,
    user: {
      name: 'Jethro S. Wilbur'
    }
  }

  const { container } = render(<Blog blog={blog} />)


  const div = container.querySelector('.blog')
  expect(div).toHaveTextContent(
    'Component testing is done with react-testing-library'
  )
  expect(div).toHaveTextContent(
    'Wilbur T. Jethro'
  )
  expect(div).not.toHaveTextContent(
    'http://www.testing.com'
  )
  expect(div).not.toHaveTextContent(
    'Likes'
  )
})

test('handles expanded blog when clicked (5.14)', async () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    url: 'http://www.testing.com',
    author: 'Wilbur T. Jethro',
    likes: 666,
    user: {
      name: 'Jethro S. Wilbur'
    }
  }

  const user = userEvent.setup()
  const { container } = render(<Blog blog={blog} />)

  const button = screen.getByText('view')
  await user.click(button)
  screen.debug()

  const div = container.querySelector('.blog')

  expect(div).toHaveTextContent(
    'http://www.testing.com'
  )
  expect(div).toHaveTextContent(
    '666'
  )

})

test('clicking the like button twice calls event handler twice (5.15)', async () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    url: 'http://www.testing.com',
    author: 'Wilbur T. Jethro',
    likes: 666,
    user: {
      name: 'Jethro S. Wilbur'
    }
  }

  const mockHandler = jest.fn()
  const user = userEvent.setup()

  render(<Blog
    blog={blog}
    handleExpand = {mockHandler}
    incLike = {mockHandler}
  />)

  //  screen.debug()

  const button = screen.getByText('view')
  await user.click(button)

  const button2 = screen.getByText('like')
  await user.click(button2)
  await user.click(button2)
  expect(mockHandler.mock.calls).toHaveLength(2)

})