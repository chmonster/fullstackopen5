import { useState, forwardRef, useImperativeHandle } from 'react'

const LoginForm = forwardRef((props, ref) => {

  const onSubmit = props.onSubmit

  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('') 
  const handleUsernameChange = (event) => setUsername(event.target.value)
  const handlePasswordChange = (event) => setPassword(event.target.value)

  useImperativeHandle(ref, () => {
    return {username, password, setUsername, setPassword}
  })

  return (
    <>
      <form onSubmit={onSubmit} style={{ textAlign: 'center'}}> 
        Username:
          <input
          type="text"
          value={username}
          name="Username"
          onChange={handleUsernameChange}
        />
        Password:
          <input
          type="password"
          value={password}
          name="Password"
          onChange={handlePasswordChange}
        />
        <br />
        <button type="submit">log in</button>
      </form>
    </>
  )
})

export default LoginForm