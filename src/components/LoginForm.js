import { useState, forwardRef, useImperativeHandle } from 'react'
import PropTypes from 'prop-types'

const LoginForm = forwardRef((props, ref) => {
  LoginForm.displayName = 'LoginForm'
  LoginForm.propTypes = {
    onSubmit: PropTypes.func.isRequired
  }

  const onSubmit = props.onSubmit

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const handleUsernameChange = (event) => setUsername(event.target.value)
  const handlePasswordChange = (event) => setPassword(event.target.value)

  useImperativeHandle(ref, () => {
    return { username, password, setUsername, setPassword }
  })

  return (
    <div className='loginform'>
      <form onSubmit={onSubmit} style={{ textAlign: 'center' }}>
        Username:
        <input
          type="text"
          value={username}
          name="Username"
          id='username'
          onChange={handleUsernameChange}
        />
        Password:
        <input
          type="password"
          value={password}
          name="Password"
          id='password'
          onChange={handlePasswordChange}
        />
        <br />
        <button id='login-button' type="submit">log in</button>
      </form>
    </div>
  )
})

export default LoginForm