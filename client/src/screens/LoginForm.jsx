import React, {useState} from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap'

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
                
                {/* Role selection dropdown */}
                <Form.Group className="mb-4">
                  <Form.Label className="text-muted fw-bold">Izaberite ulogu</Form.Label>
                  <Form.Select 
                    value={role} 
                    onChange={(e) => setRole(e.target.value)}
                    size="lg" // Makes the input field larger and more clickable
                  >
                    <option value='administrator'>Administrator</option>
                    <option value='medical-staff'>Medicinsko osoblje</option>
                    <option value='patient'>Pacijent</option>
                  </Form.Select>
                </Form.Group>

                {/* Username input */}
                <Form.Group className="mb-4">
                  <Form.Label className="text-muted fw-bold">Korisničko ime</Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="Unesite korisničko ime"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
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
