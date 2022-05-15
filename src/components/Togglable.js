import { useState, forwardRef, useImperativeHandle } from 'react'

const Togglable = forwardRef ((props, ref) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  useImperativeHandle(ref, () => {
    return {
      toggleVisibility
    }
  })

  const buttonStyle = { 
    display: 'flex',
    justifyContent: 'center',
    marginLeft: 'auto',
    marginRight: 'auto'
  }

  return (
    <div style={{ justifyContent: 'center'}}>
      <div style={hideWhenVisible}>
        <button onClick={toggleVisibility} style={buttonStyle}>{props.buttonLabel}</button>
      </div>
      <div style={showWhenVisible}>
        {props.children}
        <button onClick={toggleVisibility} style={buttonStyle}>cancel</button>
      </div>
    </div>
  )
})

export default Togglable