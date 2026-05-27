import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom'

const LoginForm = () => {
    // role: The variable from which we read the current value (eg the currently selected role).

    // setRole: The function we call to update the value. It accepts a new value and replaces 
    // the current one.

    // useState('Patient'): This is where we tell React what we want to be in the 
    // container when the user first opens the page.
    
  const [role, setRole] = useState('patient')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const navigate = useNavigate()

  function handleSubmit(e) {
    e.preventDefault()
    // Here you would typically handle the login logic, such as sending the 
    // username, password, and role to your server for authentication.
    console.log('Logging in with: ', { role, username, password })

    if (role === 'administrator') {
        navigate('/Administrator')
    } else if (role === 'medical-staff') {
        navigate('/MedicalStaff')
    } else if (role === 'patient') {
        navigate('/Patient')
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        
        <label>Choose your role: </label>
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value='administrator'>Administrator</option>
          <option value='medical-staff'>Medical staff</option>
          <option value='patient'>Patient</option>
        </select>
        
        <p>You have selected: {role}</p>
        
        <input type='text' value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
        <input type='password' value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
        
        <button type='submit'>Login</button>
      
      </form>
    </div>
  )
}

export default LoginForm
