import React from 'react'
import {Container, Button, Card, Row, Col, ListGroup, Form} from 'react-bootstrap'
import {Link} from 'react-router-dom'
import { useState } from 'react'

const HomeScreen = () => {

  const [query, setQuery] = useState('')
  const [guestEmail, setGuestEmail] = useState('')

  const announcements = [
    { id: 1, date: '28. Maj 2026.', text: 'Počela je sezona vakcinacije protiv gripa. Zakažite svoj termin.' },
    { id: 2, date: '25. Maj 2026.', text: 'Novo radno vreme laboratorije: od 07:00 do 15:00 svakog radnog dana.' },
    { id: 3, date: '20. Maj 2026.', text: 'Uveli smo novog specijalistu kardiologije u naš tim!' }
  ]

  const sendAnInquiry = (e) => {
    e.preventDefault()

    alert(`Vaš upit je uspešno poslat! Odgovorićemo Vam na email: ${guestEmail}`);
    setQuery('');
    setGuestEmail('');
  }

  return (
    // 'bg-light' adds a soft gray background, 'p-5' adds padding on all sides,
    //  'rounded-3' wraps the edges
    <Container className="mt-5">
      <div className="p-5 mb-4 bg-light rounded-3 border shadow-sm text-center">
        <Container fluid className="py-5">
          <h1 className="display-5 fw-bold">Dobrodošli u MinuteNurse ERP</h1>
          <p className="col-md-12 fs-4 text-muted">
            Savremeni informacioni sistem za efikasno upravljanje medicinskim osobljem, 
            evidenciju pacijenata i brzu koordinaciju zdravstvenih usluga u realnom vremenu.
          </p>
          <div className="d-flex justify-content-center gap-3 mt-4">
            {/* Dugme koje vodi direktno na formu za prijavu */}
            <Button as={Link} to="/login" variant="primary" size="lg">
              Prijavite se na sistem
            </Button>
            {/* Dugme koje vodi na formu za kreiranje novog naloga */}
            <Button as={Link} to="/register" variant="outline-secondary" size="lg">
              Kreirajte nalog
            </Button>
          </div>
        </Container>
      </div>

      {/* informative cards whicg describe the roles in the system */}
      <Row className="align-items-md-stretch mt-4">
        <Col md={4} className="mb-3">
            <Card className="h-100  border-0">
                <Card.Body style={{backgroundImage: 'url(/patient_image.jpg)', backgroundSize: '100%', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundColor: '#f8f9fa'}}>
                    <Card.Title className="fw-bold" style={{backgroundColor: 'rgba(255, 255, 255, 0.5)', padding: '10px', borderRadius: '5px'}}>Za Pacijente</Card.Title>
                    <Card.Text className="text-muted" style={{backgroundColor: 'rgba(255, 255, 255, 0.6)', padding: '15px', borderRadius: '5px'}}>
                        Brzo zakazivanje pregleda, uvid u istoriju bolesti i 
                        direktna komunikacija sa medicinskim timom.
                    </Card.Text>
                </Card.Body>
            </Card>
        </Col>
        <Col md={4} className="mb-3">
          <Card className="h-100">
            <Card.Body style={{backgroundImage: 'url(/medical-staff-image.jpg)', backgroundSize: '100%', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundColor: '#f8f9fa'}}>
              <Card.Title className="fw-bold" style={{backgroundColor: 'rgba(255, 255, 255, 0.5)', padding: '10px', borderRadius: '5px'}}>Za Medicinsko Osoblje</Card.Title>
              <Card.Text className="text-muted" style={{backgroundColor: 'rgba(255, 255, 255, 0.6)', padding: '15px', borderRadius: '5px'}}>
                Efikasno vođenje smena, upravljanje zdravstvenim kartonima i trenutni pristup hitnim zadacima.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-3">
          <Card className="h-100">
            <Card.Body style={{backgroundImage: 'url(/admi_image.jpg)', backgroundSize: '100%', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundColor: '#f8f9fa'}}>
              <Card.Title className="fw-bold" style={{backgroundColor: 'rgba(255, 255, 255, 0.5)', padding: '10px', borderRadius: '5px'}}>Za Administratore</Card.Title>
              <Card.Text className="text-muted" style={{backgroundColor: 'rgba(255, 255, 255, 0.6)', padding: '15px', borderRadius: '5px'}}>
                Potpuna kontrola nad korisničkim nalozima, CRUD operacije nad bazom podataka i praćenje rada sistema.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Announcements and guest contact form */}
      <hr className='my-5'/>
      <Row className="mb-5">
        {/* Left column: live avaliable announcements */}
        <Col md={6} className="mb-4">
          <h3 className="fw-bold mb-3">Aktuelna obaveštenja</h3>
          <ListGroup variant="flush" border="dark" className="bg-white rounded shadow-sm p-3">
            {announcements.map((announcement) => (
              <ListGroup.Item key={announcement.id} className="px-3 py-3">
                <div className="fw-bold text-primary small mb-1">{announcement.date}</div>
                <div>{announcement.text}</div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>

        {/* Right column: contact form for unregistered */}
        <Col md={6}>
          <Card className="bg-light rounded shadow-sm border-0 p-4">
            <h3 className="fw-bold mb-3">Imate pitanje?</h3>
            <p className="text-muted small mb-4">
              Niste registrovani, a potrebna Vam je informacija? Pošaljite nam brzi upit i naša dežurna služba će Vam odgovoriti.
            </p>
            <Form onSubmit={sendAnInquiry}>
              <Form.Group className="mb-3" controlId="guestEmail">
                <Form.Control 
                  type="email" 
                  placeholder="Vaša email adresa" 
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="guestQuestion">
                <Form.Control 
                  as="textarea" 
                  rows={3} 
                  placeholder="Kako možemo da Vam pomognemo?" 
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  style={{resize: 'none'}}
                  required
                />
              </Form.Group>
              <Button variant="dark" type="submit" className="w-100">
                Pošalji upit
              </Button>
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default HomeScreen
