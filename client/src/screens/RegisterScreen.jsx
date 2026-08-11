import React from 'react'
import {useState} from 'react'
import {Container, Form, Button, Row, Col} from 'react-bootstrap'
import {Link, useNavigate} from 'react-router-dom'

const RegisterScreen = () => {
    // first, we create states for all the form fields.
    const [f_name, setFirstName] = useState('')
    const [l_name, setLastName] = useState('')
    
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [address, setAddress] = useState('')

    const [role, setRole] = useState('Patient') // default role is 'patient'

    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    // Initialize navigation function
    const navigate = useNavigate()

    // Function which triggers when the user clicks the "Register" button
    const handleSubmit = async (e) => {
        e.preventDefault() // Prevent the default form submission behavior

        // We accept the data from the form and add it to UserCreateDTO object
        const userData = {
            first_name: f_name,
            last_name: l_name,
            email: email,
            phone_number: phone,
            address: address,
            role: role,
            password: password,
            confirm_password: confirmPassword
        }

        try{
            // Now we send POST request to the FastAPI
            const response = await fetch("http://localhost:8000/api/user/Register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(userData)
            })
            // for safety, we will check the password again
            // its faster on frontend than waiting for the backend to respond with an error
            if (password !== confirmPassword){
                console.log("Passwords do not match!")
                alert("Lozinke se ne poklapaju!")
                return
            }

            // We check if API returned an error (e.g. user already exists or passwords don't match)
            if(!response.ok){
                const errorData = await response.json()
                console.error("Error during registration: ", errorData)
                alert("Error: " + JSON.stringify(errorData.detail))
                return
            }
            // If registration is successful, we return the UserResponseDTO object
            const successData = await response.json()
            console.log("Registration successful: ", successData)
            alert('Registracija uspješna! Sada se možete prijaviti.')
            navigate('/login')

        } catch (error) {
            console.error("Network error: ", error)
            alert("Došlo je do greške prilikom registracije. Molimo pokušajte ponovo.")
        }
    }

  return (
    <Container className='my-5'>
        <Row className='justify-content-md-center'>
            {/* We limit the width of the form to 12 columns on small
             and 6 columns on medium screens for a nicer look */}
            <Col xs={12} md={6}>
                <h2 className='mb-4'>Kreirajte nalog</h2>
                {/* Form component from Bootstrap inherits our handleSubmit function */}
                {/* Field for first name */}
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId='f_name' className='mb-3'>
                        <Form.Label>Ime</Form.Label>
                        <Form.Control
                            type='text'
                            placeholder='Unesite ime'
                            value={f_name}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                            // HTML5 validation: the field must be filled out before submitting
                        />
                    </Form.Group>

                    {/* Field for last name */}
                    <Form.Group controlId='l_name' className='mb-3'>
                        <Form.Label>Prezime</Form.Label>
                        <Form.Control
                            type='text'
                            placeholder='Unesite prezime'
                            value={l_name}
                            onChange={(e) => setLastName(e.target.value)}
                            required
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

                    {/* Field for phone number */}
                    <Form.Group controlId = 'phone' className = 'mb_3'>
                        <Form.Label>Broj telefona</Form.Label>
                        <Form.Control
                            type = 'text'
                            placeholder = 'Unesite broj telefona'
                            value = {phone}
                            onChange = {(e) => setPhone(e.target.value)}
                            required
                        />
                    </Form.Group>

                    {/* Field for address */}
                    <Form.Group controlId = 'address' className = 'mb_3'>
                        <Form.Label>Adresa</Form.Label>
                        <Form.Control
                            type = 'text'
                            placeholder = 'Unesite adresu'
                            value = {address}
                            onChange = {(e) => setAddress(e.target.value)}
                            required
                        />
                    </Form.Group>

                    {/* Field for selecting user role (patient or medical staff) */}
                    <Form.Group className="mb-3" controlId="role">
                        <Form.Label>Izaberite ulogu</Form.Label>
                        <Form.Select value={role} onChange={(e) => setRole(e.target.value)}>
                            <option value="Patient">Pacijent</option>
                            <option value="MedicalStaff">Medicinsko osoblje</option>
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
                        Već imate nalog? <Link to='/login'>Prijavite se</Link>
                    </Col>
                </Row>
            </Col>
        </Row>
    </Container>
  )
}

export default RegisterScreen
