import React, { useState } from 'react'
import { Container, Row, Col, Card, Table, Button, Badge, Modal, Form } from 'react-bootstrap'

const PatientPanel = () => {

  // Mock data: scheduled examinations (Ažurirano sa uslugama, cenom i lokacijom)
  const [examinations, setExaminations] = useState([
      { id: 1, date: '2026-05-30', time: '10:00', doctor: 'Dr. Milan Jovanović', service: 'Lekarski pregled', location: 'Kućna poseta', price: '6000 rsd', status: 'Zakazano' },
      { id: 2, date: '2026-06-05', time: '14:30', doctor: 'Sestra Ana Nikolić', service: 'Nega rane / Previjanje', location: 'Ambulanta BW', price: '3000 rsd', status: 'Na čekanju' }
    ]);

  // Mock data: medical history
  const [history] = useState([
    { id: 1, date: '2026-04-15', diagnosis: 'Akutni bronhitis', therapy: 'Antibiotik 7 dana, mirovanje.' },
    { id: 2, date: '2026-01-10', diagnosis: 'Redovni sistematski pregled', therapy: 'Sve u granicama normale.' }
  ])

  // States for the popup window (Modal)
  const [showModal, setShowModal] = useState(false)
  const [newDate, setNewDate] = useState('')
  const [newTime, setNewTime] = useState('')
  const [newService, setNewService] = useState('Davanje terapije (Infuzija)')
  const [newLocation, setNewLocation] = useState('Ambulanta BW') // NOVO: State za lokaciju

  // Send feedback and review (chat box)
  const [patientFeedback, setPatientFeedback] = useState('')
  const [stars, setStars] = useState(0)

  const sendFeedback = (e) => {
    e.preventDefault()

    if (stars === 0) {
      alert('Molimo Vas da izaberete ocenu od 1 do 5!');
      return;
    }

    alert(`Vaša recenzija je uspešno poslata! Odgovorićemo Vam na email: ${patientFeedback}`);
    setPatientFeedback('');
    setStars(0);
  }

  // Get today's date in YYYY-MM-DD format to prevent past scheduling
  const today = new Date().toISOString().split('T')[0];

  // Calculate the maximum allowed date (exactly 1 year from today)
  const maxDateObj = new Date();
  maxDateObj.setFullYear(maxDateObj.getFullYear() + 1);
  const maxDate = maxDateObj.toISOString().split('T')[0];

  // Functions for opening and closing the modal
  const closeModal = () => setShowModal(false)
  const openModal = () => setShowModal(true)

  // CREATE operation: Handles form submission
  const scheduleAnAppointment = (e) => {
    e.preventDefault()

    // Jednostavna logika za simulaciju cene na osnovu izabrane usluge
    let calculatedPrice = 'Na upit'
    if (newService.includes('terapije')) calculatedPrice = '5000 rsd'
    if (newService.includes('Nega rane')) calculatedPrice = '3000 rsd'
    if (newService.includes('Gerontološka')) calculatedPrice = '4500 rsd'
    if (newService.includes('Lekarski pregled')) calculatedPrice = '6000 rsd'

    // Ako je kućna poseta, možemo simulirati dodatak na cenu izlaska na teren
    if (newLocation === 'Kućna poseta' && calculatedPrice !== 'Na upit') {
      const basePrice = parseInt(calculatedPrice.split(' ')[0])
      calculatedPrice = `${basePrice + 1000} rsd` // +1000 rsd za izlazak na teren
    }

    // Create a new examination object
    const newExamination = {
      id: examinations.length + 1,
      date: newDate,
      time: newTime,
      service: newService,
      location: newLocation,
      price: calculatedPrice,
      doctor: 'Dodeljuje se...', 
      status: 'Na čekanju'
    }

    // Create a copy of the old array and add the new object
    setExaminations([...examinations, newExamination])

    // Clear the form fields
    setNewDate('')
    setNewTime('')
    setNewService('Davanje terapije (Infuzija)')
    setNewLocation('Ambulanta BW')

    // Close the modal window
    closeModal()
  }

  // Helper function that colors the badge depending on the examination status
  const setStatusColor = (status) => {
    if (status === 'Zakazano') return 'success'
    if (status === 'Na čekanju') return 'warning'
    return 'secondary'
  }

  return (
    <Container className="mt-4">
      {/* --- Panel Header --- */}
      <Row className="align-items-center mb-4">
        <Col>
          <h2>Kontrolna tabla pacijenta</h2>
          <p className="text-muted">Dobrodošli! Ovde možete pratiti svoje termine, usluge i zdravstveni karton.</p>
        </Col>
        <Col className="text-end">
          <Button variant="primary" size="lg" onClick={openModal} style={{ backgroundColor: '#1a7a68', border: 'none' }}>
            + Zakaži novu uslugu
          </Button>
        </Col>
      </Row>

      <Row>
        {/* --- Left column: Scheduled examinations --- */}
        <Col lg={7} className="mb-4">
          <Card className="shadow-sm border-0 h-100">
            <Card.Header className="bg-white border-bottom-0 pt-4 pb-0">
              <h5 className="fw-bold" style={{ color: '#125447' }}>Predstojeći pregledi i nega</h5>
            </Card.Header>
            <Card.Body>
              <div style={{ overflowX: 'auto' }}>
                <Table responsive hover className="mt-2 align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Datum i vreme</th>
                      <th>Vrsta usluge</th>
                      <th>Lokacija</th>
                      <th>Osoblje</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {examinations.map((examination) => (
                      <tr key={examination.id}>
                        <td>
                          <strong>{examination.date}</strong> <br/> 
                          <small className="text-muted">{examination.time}</small>
                        </td>
                        <td>
                          {examination.service} <br/>
                          <Badge bg="info" className="text-dark mt-1">{examination.price}</Badge>
                        </td>
                        <td>
                          <small>📍 {examination.location}</small>
                        </td>
                        <td><small>{examination.doctor}</small></td>
                        <td>
                          <Badge bg={setStatusColor(examination.status)}>
                            {examination.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                    {examinations.length === 0 && (
                      <tr>
                        <td colSpan="5" className="text-center text-muted py-4">Nemate zakazanih usluga.</td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* --- Right column: Medical history --- */}
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

      {/* --- MODAL (POPUP WINDOW) --- */}
      <Modal show={showModal} onHide={closeModal} centered size="lg">
        <Modal.Header closeButton className="bg-light">
          <Modal.Title style={{ color: '#125447' }}>Zakazivanje nove usluge</Modal.Title>
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
                    <option value="Davanje terapije (Infuzija)">Davanje terapije (Infuzija / Injekcija)</option>
                    <option value="Nega rane / Previjanje">Nega rane / Previjanje</option>
                    <option value="Gerontološka nega">Gerontološka nega (Pomoć u kući)</option>
                    <option value="Lekarski pregled">Lekarski pregled</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              
              {/* Location and service */}
              <Col md={6}>
                <Form.Group className="mb-4">
                  <Form.Label>Lokacija pružanja usluge</Form.Label>
                  <Form.Select 
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                  >
                    <option value="Ambulanta BW">Ambulanta (Beograd na vodi)</option>
                    <option value="Kućna poseta">Kućna poseta (Vaša adresa)</option>
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
                    lang="en-GB"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <div className="d-flex justify-content-end gap-2 border-top pt-3 mt-2">
              <Button variant="secondary" onClick={closeModal}>
                Odustani
              </Button>
              <Button variant="primary" type="submit" style={{ backgroundColor: '#1a7a68', border: 'none' }}>
                Potvrdi zakazivanje
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  )
}

export default PatientPanel