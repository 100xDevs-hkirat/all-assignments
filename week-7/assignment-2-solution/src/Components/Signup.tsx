import { useState } from 'react'
import { Link } from 'react-router-dom'
import { SignupResponse } from '../common/interfaces.js'

const Signup = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSignup = async () => {
    const response = await fetch('http://localhost:3000/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })
    // Todo: Create a type for the response that you get back from the server
    const data: SignupResponse = await response.json()
    if (data.token) {
      localStorage.setItem('token', data.token)
      window.location.href = '/todos'
    } else {
      alert('Error while signing up')
    }
  }

  return (
    <div style={{ justifyContent: 'center', display: 'flex', width: '100%' }}>
      <div>
        <h2>Signup</h2>
        <input
          type='text'
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder='Username'
        />
        <input
          type='password'
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder='Password'
        />
        Already signed up? <Link to='/login'>Login</Link>
        <button onClick={handleSignup}>Signup</button>
      </div>
    </div>
  )
}

export default Signup
