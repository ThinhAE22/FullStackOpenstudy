import { useRef } from 'react'
import ViewBlog from './ViewBlogInfo'

const Blog = ({ blog, addLike, deleteBlog }) => {
  const blogRef = useRef() // Create a ref for each ViewBlog

  return (
    <div data-testid='blog' className="blog">
      <div className='DefaultView'>
        {blog.title} of {blog.author}
        <ViewBlog buttonLabel="view" ref={blogRef} className="viewBlog">
          <p>{blog.url}</p>
          <p data-testid='likes'>
            likes {blog.likes}{' '}
            <button onClick={() => addLike(blog)}>like</button>
          </p>
          <p>{blog.author}</p>
          <p>
            <button onClick={() => deleteBlog(blog)}>remove</button>
          </p>
        </ViewBlog>
      </div>
    </div>
  )
}

export default Blog
