import React from 'react'
import {useState} from 'react'
import {Container, Form, Button, Row, Col} from 'react-bootstrap'
import {Link, useNavigate} from 'react-router-dom'

const RegisterScreen = () => {
    // first, we create states for all the form fields.
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [role, setRole] = useState('patient') // default role is 'patient'
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    // Initialize navigation function
    const navigate = useNavigate()

    // Function which triggers when the user clicks the "Register" button
    const handleSubmit = (e) => {
        e.preventDefault() // Prevent the default form submission behavior

        if (password !== confirmPassword) {
            alert('Lozinke se ne poklapaju!')
            return
        }

        console.log("Registering user with details: ", {name, email, role, password})

        // after successful registration, navigate the user to the login page
        alert('Registracija uspješna! Sada se možete prijaviti.')
        navigate('/login')
    }

  return (
    <Container className='my-5'>
        <Row className='justify-content-md-center'>
            {/* We limit the width of the form to 12 columns on small
             and 6 columns on medium screens for a nicer look */}
            <Col xs={12} md={6}>
                <h2 className='mb-4'>Kreirajte nalog</h2>
                {/* Form component from Bootstrap inherits our handleSubmit function */}
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId='name' className='mb-3'>
                        <Form.Label>Ime i prezime</Form.Label>
                        <Form.Control
                            type='text'
                            placeholder='Unesite ime i prezime'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            // HTML5 validation: the field must be filled out before submitting
                        />
                    </Form.Group>

                    {/* Field for email address */}
                    <Form.Group className="mb-3" controlId="email">
                      <Form.Label>Email adresa</Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="Unesite email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </Form.Group>
                

                    {/* Field for selecting user role (patient or medical staff) */}
                    <Form.Group className="mb-3" controlId="role">
                        <Form.Label>Izaberite ulogu</Form.Label>
                        <Form.Select value={role} onChange={(e) => setRole(e.target.value)}>
                            <option value="patient">Pacijent</option>
                            <option value="medical-staff">Medicinsko osoblje</option>
                        </Form.Select>
                    </Form.Group>

                    {/* Field for password */}
                    <Form.Group className="mb-3" controlId="password">
                        <Form.Label>Lozinka</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Unesite lozinku"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </Form.Group>

                    {/* Field for confirming password */}
                    <Form.Group className="mb-3" controlId="confirmPassword">
                        <Form.Label>Potvrdite lozinku</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Ponovno unesite lozinku"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Button variant="primary" type="submit" className='w-100'>
                        Registruj se
                    </Button>
                </Form>

                {/* Link to the login page for users who already have an account */}
                <Row className='mt-3'>
                    <Col>
                        Već imate nalog? <Link to='/'>Prijavite se</Link>
                    </Col>
                </Row>
            </Col>
        </Row>
    </Container>
  )
}

export default RegisterScreen
