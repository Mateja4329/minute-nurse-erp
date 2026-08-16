import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap'
import { useAuth } from '../../context/AuthContext'

const Profile = () => {
    const { user, setUser, api } = useAuth()
    const [isEditing, setIsEditing] = useState(false)

    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        phone_number: '',
        address: ''
    })

    const [message, setMessage] = useState({type: '', text: ''})

    useEffect(() => {
        if (user) {
            setFormData({
                first_name: user.first_name || '',
                last_name: user.last_name || '',
                email: user.email || '',
                phone_number: user.phone_number || '',
                address: user.address || '',
                role: user.role || ''
            })
        }
    }, [user])

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value})
    }

     const handleSubmit = async (e) => {
        e.preventDefault()
        setMessage({type: '', text: ''})

        try{
            const response = await api.put('api/user/UpdateProfile', formData)

            setUser(response.data)
            setIsEditing(false)
            setMessage({type: 'success', text: 'Profil je uspešno ažuriran!'})

            setTimeout(() => setMessage({type: '', text: ''}), 3000)
        }
        catch (error) {
            setMessage({ type: 'danger', text: 'Došlo je do greške prilikom ažuriranja profila.' })
        }
    }

    if (!user) return <Container className="mt-5 text-center">Učitavanje profila...</Container>

    return (
        <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow-sm border-0">
            <Card.Header className="bg-white pt-4 pb-3">
              <h4 className="mb-0 fw-bold" style={{ color: '#125447' }}>Moj Profil</h4>
            </Card.Header>
            <Card.Body className="p-4">
              
              {message.text && (
                <Alert variant={message.type}>{message.text}</Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Ime</Form.Label>
                      <Form.Control 
                        type="text" 
                        name="first_name" 
                        value={formData.first_name} 
                        onChange={handleChange} 
                        disabled={!isEditing} 
                        required 
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Prezime</Form.Label>
                      <Form.Control 
                        type="text" 
                        name="last_name" 
                        value={formData.last_name} 
                        onChange={handleChange} 
                        disabled={!isEditing} 
                        required 
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Email adresa (samo za prikaz)</Form.Label>
                  <Form.Control 
                    type="email" 
                    value={user.email} 
                    disabled 
                    className="bg-light"
                  />
                  <Form.Text className="text-muted">
                    Promena email adrese i lozinke se vrši kroz posebna podešavanja.
                  </Form.Text>
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-4">
                      <Form.Label>Telefon</Form.Label>
                      <Form.Control 
                        type="text" 
                        name="phone_number" 
                        value={formData.phone_number} 
                        onChange={handleChange} 
                        disabled={!isEditing} 
                        required 
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-4">
                      <Form.Label>Adresa</Form.Label>
                      <Form.Control 
                        type="text" 
                        name="address" 
                        value={formData.address} 
                        onChange={handleChange} 
                        disabled={!isEditing} 
                        required 
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row className="justify-content-center">
                  <Col md={4}>
                    <Form.Group className="mb-4 text-center">
                      <Form.Label>Uloga</Form.Label>
                      <Form.Control 
                        type="text" 
                        name="role" 
                        value={formData.role} 
                        disabled
                        className="text-center bg-light fw-bold text-success"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <div className="d-flex justify-content-end gap-2 border-top pt-3">
                  {!isEditing ? (
                    <Button 
                      variant="primary" 
                      onClick={(e) => { e.preventDefault(); setIsEditing(true); }}
                      style={{ backgroundColor: '#1a7a68', border: 'none' }}
                    >
                      ✎ Izmeni podatke
                    </Button>
                  ) : (
                    <>
                      <Button variant="secondary" onClick={() => setIsEditing(false)}>
                        Odustani
                      </Button>
                      <Button type="submit" variant="success" style={{ backgroundColor: '#16a085', border: 'none' }}>
                        💾 Sačuvaj izmene
                      </Button>
                    </>
                  )}
                </div>
              </Form>
              
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
    )
}

export default Profile