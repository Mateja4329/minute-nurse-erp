import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Table, Button, Badge, Modal, Form, Spinner } from 'react-bootstrap'
import { useAuth } from '../../context/AuthContext'

const PatientPanel = () => {
  // Get Axios instance from AuthContext to make API calls with JWT token and cookies
  const { api } = useAuth()

  const [appointments, setAppointments] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const [history] = useState([
        { id: 1, date: '2026-04-15', diagnosis: 'Akutni bronhitis', therapy: 'Antibiotik 7 dana, mirovanje.' },
        { id: 2, date: '2026-01-10', diagnosis: 'Redovni sistematski pregled', therapy: 'Sve u granicama normale.' }
  ])

  // States for the popup window (Modal)
  const [showModal, setShowModal] = useState(false)
  const [newDate, setNewDate] = useState('')
  const [newTime, setNewTime] = useState('')
  const [newService, setNewService] = useState('Infuzija')
  const [newLocation, setNewLocation] = useState('BW Ambulanta') // be careful for enums

  // Send feedback and review (chat box)
  const [patientFeedback, setPatientFeedback] = useState('')
  const [stars, setStars] = useState(0)

  // Get today's date in YYYY-MM-DD format to prevent past scheduling
  const today = new Date().toISOString().split('T')[0];

  // Calculate the maximum allowed date (exactly 1 year from today)
  const maxDateObj = new Date();
  maxDateObj.setFullYear(maxDateObj.getFullYear() + 1);
  const maxDate = maxDateObj.toISOString().split('T')[0];

  // Functions for opening and closing the modal
  const closeModal = () => setShowModal(false)
  const openModal = () => setShowModal(true)

  // READ: Fetch appointments from the backend API when the component mounts
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
          const response = await api.get('/api/appointment/my_calendar')
          setAppointments(response.data)
      } catch (error) {
          console.error("Greška pri povlačenju termina:", error)
      } finally {
          setIsLoading(false)
      }
    }
    fetchAppointments()
  }, [api]) // Dependency array includes 'api' to ensure the effect runs when 'api' changes

  // CREATE: Sending ServiceRequest to the backend API
  const scheduleAnAppointment = async (e) => {
    e.preventDefault()

    const requestPayload = {
        service_type: newService,
        location_preference: newLocation,
        preferred_date: newDate,
        // Formating the time to include HH:MM for Pydantic
        preferred_time: newTime.length === 5 ? `${newTime}:00` : newTime 
    }

    try {
        await api.post('/api/service_request/send_service_request', requestPayload)
        alert("Zahtev za uslugu je uspešno poslat Adminu na odobrenje!")
        
        // Clean the format and close modal
        setNewDate('')
        setNewTime('')
        closeModal()
    } catch (error) {
        console.error("Error while sending service request: ", error)
        alert("Došlo je do greške. Proverite podatke i pokušajte ponovo.")
    }
  }

  const setStatusColor = (status) => {
    if (status === 'SCHEDULED' || status === 'Zakazano') return 'success'
    if (status === 'WAITING' || status === 'Čekanje') return 'warning'
    return 'secondary'
  }

  const sendFeedback = (e) => {
    e.preventDefault()

    if (stars === 0) {
      alert('Molimo Vas da izaberete ocenu od 1 do 5!');
      return;
    }

    alert(`Vaša recenzija je uspešno poslata! Odgovorićemo Vam na email {/* Later will add patient's email when I implement the database */}`);
    setPatientFeedback('');
    setStars(0);
  }

  return (
      <Container className="mt-4">
          <Row className="align-items-center mb-4">
              <Col>
                  <h2>Kontrolna tabla pacijenta</h2>
                  <p className="text-muted">Dobrodošli! Ovde možete pratiti svoje termine, usluge i zdravstveni karton.</p>
              </Col>
              <Col className="text-end">
                  <Button variant="primary" size="lg" onClick={openModal} style={{ backgroundColor: '#1a7a68', border: 'none' }}>
                      + Zatraži novu uslugu
                  </Button>
              </Col>
          </Row>
          <Row>
              {/* --- Prava tabela iz baze --- */}
              <Col lg={7} className="mb-4">
                  <Card className="shadow-sm border-0 h-100">
                      <Card.Header className="bg-white border-bottom-0 pt-4 pb-0">
                          <h5 className="fw-bold" style={{ color: '#125447' }}>Zakazani pregledi</h5>
                      </Card.Header>
                      <Card.Body>
                          {isLoading ? (
                              <div className="text-center py-4"><Spinner animation="border" variant="success" /></div>
                          ) : (
                              <div style={{ overflowX: 'auto' }}>
                                  <Table responsive hover className="mt-2 align-middle">
                                      <thead className="table-light">
                                          <tr>
                                              <th>Datum i vreme</th>
                                              <th>Osoblje (ID)</th>
                                              <th>Status</th>
                                          </tr>
                                      </thead>
                                      <tbody>
                                          {appointments.map((app) => (
                                              <tr key={app.id}>
                                                  <td>
                                                      <strong>{app.scheduled_date}</strong> <br/> 
                                                      <small className="text-muted">{app.scheduled_time}</small>
                                                  </td>
                                                  <td><small>{app.staff_id}</small></td>
                                                  <td>
                                                      <Badge bg={setStatusColor(app.schedule)}>
                                                          {app.schedule}
                                                      </Badge>
                                                  </td>
                                              </tr>
                                          ))}
                                          {appointments.length === 0 && (
                                              <tr>
                                                  <td colSpan="3" className="text-center text-muted py-4">Nemate zakazanih usluga.</td>
                                              </tr>
                                          )}
                                      </tbody>
                                  </Table>
                              </div>
                          )}
                      </Card.Body>
                  </Card>
              </Col>
              {/* --- Mock Karton --- */}
              <Col lg={5} className="mb-4">
                  <Card className="shadow-sm border-0 h-100 bg-light">
                      <Card.Header className="bg-light border-bottom-0 pt-4 pb-0">
                          <h5 className="fw-bold" style={{ color: '#125447' }}>Istorija poseta (Karton)</h5>
                      </Card.Header>
                      <Card.Body>
                          {history.map((record) => (
                              <div key={record.id} className="mb-3 p-3 bg-white rounded shadow-sm border-start border-4 border-success">
                                  <div className="d-flex justify-content-between align-items-center mb-2">
                                      <span className="fw-bold text-dark">{record.diagnosis}</span>
                                      <small className="text-muted">{record.date}</small>
                                  </div>
                                  <p className="mb-0 small"><strong>Terapija: </strong> {record.therapy}</p>
                              </div>
                          ))}
                      </Card.Body>
                  </Card>
              </Col>
          </Row>
          {/* --- Feedback and Review Section --- */}
          <Row className="align-items-md-stretch mt-2 mb-5">
            <Col md={12}>
              <Card className="bg-light rounded shadow-sm border-0 p-4">
                <h4 className="fw-bold mb-3" style={{ color: '#125447' }}>Povratne informacije i recenzije</h4>
                <p className="text-muted small mb-4">
                  Vaše mišljenje nam je važno! Ostavite povratne informacije o vašem iskustvu sa našim uslugama i osobljem.
                </p>
                <Form onSubmit={sendFeedback}>
                  <Row>
                    <Col md={8}>
                      <Form.Group className="mb-3" controlId="feedbackEmail">
                        <Form.Control
                          as="textarea"
                          rows={2}
                          placeholder="Napišite vaše iskustvo ovde..."
                          value={patientFeedback}
                          style={{resize: 'none'}}
                          onChange={(e) => setPatientFeedback(e.target.value)}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group className="mb-3" controlId="feedbackStars">
                        <Form.Label className="fw-bold small mb-2">Ocena usluge:</Form.Label>
                        <div className="d-flex gap-1 mb-3">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Button 
                              key={star} 
                              variant={stars >= star ? 'warning' : 'outline-secondary'} 
                              size="sm"
                              onClick={() => setStars(star)}
                            >
                              ★ {star}
                            </Button>
                          ))}
                        </div>
                        <Button variant="success" type="submit" className="w-100" disabled={stars === 0}>
                          Pošalji recenziju
                        </Button>
                      </Form.Group>
                    </Col>
                  </Row>
                </Form>
              </Card>
            </Col>
          </Row>
          {/* --- MODAL --- */}
          <Modal show={showModal} onHide={closeModal} centered size="lg">
              <Modal.Header closeButton className="bg-light">
                  <Modal.Title style={{ color: '#125447' }}>Zahtev za novu uslugu</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                  <Form onSubmit={scheduleAnAppointment}>
                      <Row>
                          <Col md={6}>
                              <Form.Group className="mb-3">
                                  <Form.Label>Vrsta medicinske usluge</Form.Label>
                                  <Form.Select 
                                      value={newService}
                                      onChange={(e) => setNewService(e.target.value)}
                                  >
                                      <option value="Previjanje">Previjanje</option>
                                      <option value="Druženje">Druženje</option>
                                      <option value="Infuzija">Infuzija</option>
                                      <option value="Inekcija">Inekcija</option>
                                      <option value="Ishrana">Ishrana</option>
                                  </Form.Select>
                              </Form.Group>
                          </Col>
                          <Col md={6}>
                              <Form.Group className="mb-4">
                                  <Form.Label>Lokacija pružanja usluge</Form.Label>
                                  <Form.Select 
                                      value={newLocation}
                                      onChange={(e) => setNewLocation(e.target.value)}
                                  >
                                    <option value="BW Ambulanta">BW Ambulanta</option>
                                    <option value="Trenutna adresa">Trenutna adresa</option>
                                  </Form.Select>
                              </Form.Group>
                          </Col>
                      </Row>
                      <Row>
                          <Col md={6}>
                              <Form.Group className="mb-3">
                                  <Form.Label>Datum</Form.Label>
                                  <Form.Control 
                                      type="date" 
                                      value={newDate}
                                      min={today}
                                      max={maxDate}
                                      onChange={(e) => setNewDate(e.target.value)}
                                      required
                                  />
                              </Form.Group>
                          </Col>
                          <Col md={6}>
                              <Form.Group className="mb-3">
                                  <Form.Label>Željeno vreme</Form.Label>
                                  <Form.Control 
                                      type="time" 
                                      value={newTime}
                                      onChange={(e) => setNewTime(e.target.value)}
                                      required
                                  />
                              </Form.Group>
                          </Col>
                      </Row>
                      <div className="d-flex justify-content-end gap-2 border-top pt-3 mt-2">
                          <Button variant="secondary" onClick={closeModal}>Odustani</Button>
                          <Button variant="primary" type="submit" style={{ backgroundColor: '#1a7a68', border: 'none' }}>
                              Pošalji zahtev
                          </Button>
                      </div>
                  </Form>
              </Modal.Body>
          </Modal>
      </Container>
  )
}

export default PatientPanel