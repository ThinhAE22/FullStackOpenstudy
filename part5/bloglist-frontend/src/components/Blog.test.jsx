import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import userEvent from '@testing-library/user-event'


// Test that the like div is hidden by default
test('the like div is hidden by default', () => {
  const blog = {
    likes: 5,
    author: "Joel Spolsky",
    title: "The Joel Test: 12 Steps to Better Code",
    url: "https://www.joelonsoftware.com/2000/08/09/the-joel-test-12-steps-to-better-code/"
  }

  render(<Blog blog={blog} addLike={() => {}} deleteBlog={() => {}} />)

  // Find elements
  const findTitle = screen.getByText('The Joel Test: 12 Steps to Better Code', { exact: false })
  const authors = screen.getAllByText('Joel Spolsky', { exact: false })
  const findAuthor = authors[0]

  // Check if they are in the document
  expect(findTitle).toBeDefined()
  expect(findAuthor).toBeDefined()

  // Get the closest parent div
  const parentDiv = findTitle.closest('.DefaultView')
  expect(parentDiv).not.toBeNull()  // Fixes issue with `toBe(true)`

  // Find the div that contains the like count and URL
  const likeDiv = screen.queryByText('likes 5')?.closest('div')
  const urlDiv = screen.queryByText(blog.url)?.closest('div')

  // Ensure the div exists before checking styles
  expect(likeDiv).not.toBeNull()
  expect(urlDiv).not.toBeNull()

  if (likeDiv) {
    expect(window.getComputedStyle(likeDiv).display).toBe('none')
  }
  
  if (urlDiv) {
    expect(window.getComputedStyle(urlDiv).display).toBe('none')
  }
})


test('clicking the like button twice calls event handler twice', async () => {
    const blog = {
      title: 'Testing React Components',
      author: 'John Doe',
      url: 'https://example.com',
      likes: 10,
    }

    const mockAddLike = vi.fn()
    
    const user = userEvent.setup()
    render(<Blog blog={blog} addLike={mockAddLike} deleteBlog={vi.fn()} />)

    // Click "view" button to reveal details
    const viewButton = screen.getByText('view')
    await user.click(viewButton)

    // Find and click the "like" button twice
    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)

    // Verify that mock function is called twice
    expect(mockAddLike).toHaveBeenCalledTimes(2)
})

