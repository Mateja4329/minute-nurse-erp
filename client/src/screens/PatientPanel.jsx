import React, { useState } from 'react'
import { Container, Row, Col, Card, Table, Button, Badge, Modal, Form } from 'react-bootstrap'

const PatientPanel = () => {

  // Mock data: scheduled examinations
  const [examinations, setExaminations] = useState([
      { id: 1, date: '2026-05-30', time: '10:00', doctor: 'Dr. Milan Jovanović', department: 'Kardiologija', status: 'Zakazano' },
      { id: 2, date: '2026-06-05', time: '14:30', doctor: 'Dr. Ana Nikolić', department: 'Opšta praksa', status: 'Na čekanju' }
    ]);

  // Mock data: medical history
  const [history] = useState([
    { id: 1, date: '2026-04-15', diagnosis: 'Akutni bronhitis', therapy: 'Antibiotik 7 dana, mirovanje.' },
    { id: 2, date: '2026-01-10', diagnosis: 'Redovni sistematski pregled', therapy: 'Sve u granicama normale.' }
  ])

  // States for the popup window (Modal)
  const [showModal, setShowModal] = useState(false) // Controls whether the modal is visible
  const [newDate, setNewDate] = useState('')
  const [newTime, setNewTime] = useState('')
  const [newDepartment, setNewDepartment] = useState('Opšta praksa')

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

    // Create a new examination object
    const newExamination = {
      id: examinations.length + 1,
      date: newDate,
      time: newTime,
      department: newDepartment,
      doctor: 'Dodeljuje se...', 
      status: 'Na čekanju'
    }

    // Create a copy of the old array and add the new object
    setExaminations([...examinations, newExamination])

    // Clear the form fields
    setNewDate('')
    setNewTime('')
    setNewDepartment('Opšta praksa')

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
          <p className="text-muted">Dobrodošli! Ovde možete pratiti svoje termine i zdravstveni karton.</p>
        </Col>
        <Col className="text-end">
          {/* Main action button that triggers the openModal function */}
          <Button variant="primary" size="lg" onClick={openModal}>
            + Zakaži novi pregled
          </Button>
        </Col>
      </Row>

      <Row>
        {/* --- Left column: Scheduled examinations --- */}
        <Col lg={7} className="mb-4">
          <Card className="shadow-sm border-0 h-100">
            <Card.Header className="bg-white border-bottom-0 pt-4 pb-0">
              <h5 className="fw-bold text-primary">Predstojeći pregledi</h5>
            </Card.Header>
            <Card.Body>
              <Table responsive hover className="mt-2">
                <thead className="table-light">
                  <tr>
                    <th>Datum i vreme</th>
                    <th>Odeljenje</th>
                    <th>Doktor</th>
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
                      <td>{examination.department}</td>
                      <td>{examination.doctor}</td>
                      <td>
                        <Badge bg={setStatusColor(examination.status)}>
                          {examination.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                  {/* Display a message if the array is empty */}
                  {examinations.length === 0 && (
                    <tr>
                      <td colSpan="4" className="text-center text-muted py-3">Nemate zakazanih pregleda.</td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        {/* --- Right column: Medical history --- */}
        <Col lg={5} className="mb-4">
          <Card className="shadow-sm border-0 h-100 bg-light">
            <Card.Header className="bg-light border-bottom-0 pt-4 pb-0">
              <h5 className="fw-bold" style={{ color: '#125447' }}>Poslednje posete (Karton)</h5>
            </Card.Header>
            <Card.Body>
              {history.map((record) => (
                <div key={record.id} className="mb-3 p-3 bg-white rounded shadow-sm">
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

      {/* --- MODAL (POPUP WINDOW) --- */}
      {/* Corrected show attribute to use the boolean state variable 'showModal' */}
      <Modal show={showModal} onHide={closeModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Zakazivanje novog pregleda</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={scheduleAnAppointment}>
            <Form.Group className="mb-3">
              <Form.Label>Datum pregleda</Form.Label>
              <Form.Control 
                type="date" 
                value={newDate}
                min={today}   // Restricts past dates
                max={maxDate} // Restricts dates beyond 1 year from today
                onChange={(e) => setNewDate(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Željeno vreme</Form.Label>
              <Form.Control 
                type="time" 
                lang="en-GB" // Forces 24-hour format navigation
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Odeljenje</Form.Label>
              <Form.Select 
                value={newDepartment}
                onChange={(e) => setNewDepartment(e.target.value)}
              >
                <option value="Opšta praksa">Opšta praksa</option>
                <option value="Kardiologija">Kardiologija</option>
                <option value="Dermatologija">Dermatologija</option>
                <option value="Neurologija">Neurologija</option>
              </Form.Select>
            </Form.Group>

            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={closeModal}>
                Odustani
              </Button>
              <Button variant="primary" type="submit">
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