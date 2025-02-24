import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CreateForm from './CreateForm'  // Update to the correct component name

describe('<CreateForm />', () => {
  test('calls createBlog with correct details when form is submitted', async () => {
    const mockCreateBlog = vi.fn()
    const user = userEvent.setup()

    render(<CreateForm createBlog={mockCreateBlog} />) // Use CreateForm

    // Fill in the form
    const titleInput = screen.getByRole('textbox', { name: /title/i })
    const authorInput = screen.getByRole('textbox', { name: /author/i })
    const urlInput = screen.getByRole('textbox', { name: /url/i })
    const submitButton = screen.getByRole('button', { name: /create/i })

    await user.type(titleInput, 'Testing Blog Forms')
    await user.type(authorInput, 'John Doe')
    await user.type(urlInput, 'https://example.com')

    // Submit the form
    await user.click(submitButton)

    // Ensure createBlog was called once with the correct data
    expect(mockCreateBlog).toHaveBeenCalledTimes(1)
    expect(mockCreateBlog).toHaveBeenCalledWith({
      title: 'Testing Blog Forms',
      author: 'John Doe',
      url: 'https://example.com',
    })
  })
})
