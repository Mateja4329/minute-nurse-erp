import React, {useState} from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap'
import { useAuth } from '../context/AuthContext'

const LoginForm = () => {
    // role: The variable from which we read the current value (eg the currently selected role).

    // setRole: The function we call to update the value. It accepts a new value and replaces 
    // the current one.

    // useState('Patient'): This is where we tell React what we want to be in the 
    // container when the user first opens the page.
    
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const navigate = useNavigate()
  const { login, api } = useAuth() // Get the login function from AuthContext hook

  async function handleSubmit(e) {
    e.preventDefault()
    // Here you would typically handle the login logic, such as sending the 
    // email, password, and role to your server for authentication.

    const userData = {
      email: email,
      password: password
    }

    console.log('Logging in with: ', { email, password })

    try{
      const response = await api.post('/api/user/Login', userData)

      // We don't need to check for response.ok because Axios is smart enough to throw an error

      const successData = response.data // returns our LoginResponseDTO object with token and username in json
      await login(successData.user, successData.token)

      console.log("Login successful: ", successData)
      alert('Login uspešan! Dobrodosli ' + successData.user.first_name + ' ' + successData.user.last_name)

      if (successData.user.role === 'Admin') {
        navigate('/Administrator')
      } 
      else if (successData.user.role === 'MedicalStaff') {
        navigate('/MedicalStaff')
      } 
      else if (successData.user.role === 'Patient') {
        navigate('/Patient')
      }

    } catch (error) {
      console.error("Network error: ", error)
      alert("Došlo je do greške prilikom prijavljivanja. Molimo pokušajte ponovo.")
    }
  }

  return (
    <Container>
      {/* Center the login card vertically and horizontally using Bootstrap grid */}
      <Row className="justify-content-center mt-5">
        <Col xs={12} md={8} lg={5}>
          {/* shadow-lg creates a nice 3D pop effect, rounded-lg smooths the corners */}
          <Card className="shadow-lg border-0 rounded-lg">
            
            {/* Custom medical green background for the header to match the Footer */}
            <Card.Header 
              className="text-white text-center py-4" 
              style={{ backgroundColor: '#125447' }}
            >
              <h3 className="fw-bold mb-0">Prijava na sistem</h3>
            </Card.Header>
            
            <Card.Body className="p-5">
              <Form onSubmit={handleSubmit}>
                {/* Email input */}
                <Form.Group className="mb-4">
                  <Form.Label className="text-muted fw-bold">Email adresa</Form.Label>
                  <Form.Control 
                    type="email" 
                    placeholder="Unesite email adresu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    size="lg"
                    required
                  />
                </Form.Group>

                {/* Password input */}
                <Form.Group className="mb-4">
                  <Form.Label className="text-muted fw-bold">Lozinka</Form.Label>
                  <Form.Control 
                    type="password" 
                    placeholder="Unesite lozinku"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    size="lg"
                    required
                  />
                </Form.Group>

                {/* Submit button with custom matching color */}
                <Button 
                  variant="primary" 
                  type="submit" 
                  className="w-100 py-2 fs-5 mt-2 mb-4"
                  style={{ backgroundColor: '#1a7a68', border: 'none' }}
                >
                  Prijavi se
                </Button>
              </Form>

              {/* Registration link for new users smoothly integrated at the bottom */}
              <div className="text-center text-muted border-top pt-4">
                Novi ste na poslu ili ste novi pacijent? <br/>
                <Link to="/register" style={{ color: '#1a7a68', fontWeight: 'bold', textDecoration: 'none' }}>
                  Kreirajte nalog ovde
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default LoginForm
