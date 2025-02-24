import { useState, forwardRef, useImperativeHandle } from 'react'

const ViewBlog = forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  useImperativeHandle(ref, () => ({
    toggleVisibility,
  }))

  return (
    <div>
      <div style={hideWhenVisible} >
        <button onClick={toggleVisibility}>{props.buttonLabel}</button>
      </div>
      <div style={showWhenVisible} className="viewBlogContent">
        {props.children}
        <button onClick={toggleVisibility}>hide</button>
      </div>
    </div>
  )
})

ViewBlog.displayName = 'ViewBlog'

export default ViewBlog
