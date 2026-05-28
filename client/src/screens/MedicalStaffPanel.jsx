import React, { useState } from 'react'
import { Container, Row, Col, Card, Table, Button, Badge, Modal, Form } from 'react-bootstrap'

const MedicalStaffPanel = () => {

  // Mock data: Pending requests from patients (waiting for approval)
  // PROMENA: 'department' je zamenjen sa 'service' i ubačene su realne usluge sa kucnanega.co
  const [pendingRequests, setPendingRequests] = useState([
    { id: 1, patientName: 'Jovan Jovanović', date: '2026-06-01', time: '09:00', service: 'Davanje terapije (Infuzija)', location: 'Novi Sad, Bulevar Evrope 50, 6', price: '5000 rsd' },
    { id: 2, patientName: 'Milica Nikolić', date: '2026-06-02', time: '11:30', service: 'Nega rane / Previjanje', location: 'Beograd, Maksima Gorkog 17 | Voždovac, 23', price: '12000 rsd' },
    { id: 3, patientName: 'Petar Petrović', date: '2026-06-05', time: '15:00', service: 'Gerontološka nega', location: 'Novi Beograd, Vasilja Djurovića Vaka | Blok 49, 2', price: '13500 rsd'}
  ])

  // Mock data: Today's schedule / shift tasks
  // PROMENA: Uklonjeno "Odeljenje B", stavljeno fokusiranje na terenske usluge
  const [todaySchedule, setTodaySchedule] = useState([
    { id: 101, time: '08:00', task: 'Jutarnja gerontološka nega', patient: 'Više pacijenata', status: 'Završeno' },
    { id: 102, time: '10:00', task: 'Lekarski pregled na terenu', patient: 'Marko Marković', status: 'U toku' },
    { id: 103, time: '13:00', task: 'Davanje terapije', patient: 'Ana Ilić', status: 'Zakazano' }
  ])

  // --- REPORT MODAL STATES ---
  const [showReportModal, setShowReportModal] = useState(false)
  const [activeTask, setActiveTask] = useState(null)
  const [reportSummary, setReportSummary] = useState('')
  const [reportComment, setReportComment] = useState('')

  // UPDATE operation: Approve a patient's request and move it to the schedule
  const approveRequest = (id) => {
    const requestToApprove = pendingRequests.find(req => req.id === id)
    
    const newTask = {
      id: Date.now(),
      time: requestToApprove.time,
      // PROMENA: Sada se u zadatku ispisuje vrsta usluge umesto odeljenja
      task: `Usluga: ${requestToApprove.service} (${requestToApprove.location})`,
      patient: requestToApprove.patientName,
      status: 'Zakazano'
    }

    setTodaySchedule([...todaySchedule, newTask])
    setPendingRequests(pendingRequests.filter(req => req.id !== id))
    alert(`Zahtev za uslugu pacijentu ${requestToApprove.patientName} je odobren i prebačen u raspored.`)
  }

  // DELETE operation: Reject/Cancel a patient's request entirely
  const rejectRequest = (id) => {
    if (window.confirm('Da li ste sigurni da želite da odbijete i obrišete ovaj zahtev?')) {
      setPendingRequests(pendingRequests.filter(req => req.id !== id))
    }
  }

  // --- REPORT GENERATION LOGIC ---
  const openReportModal = (task) => {
    setActiveTask(task)
    setReportSummary('')
    setReportComment('')
    setShowReportModal(true)
  }

  const handleSaveReport = (e) => {
    e.preventDefault()

    // Mark the specific task as "Završeno" in the current schedule
    const updatedSchedule = todaySchedule.map(task => 
      task.id === activeTask.id ? { ...task, status: 'Završeno' } : task
    )
    
    setTodaySchedule(updatedSchedule)
    setShowReportModal(false)
    alert('Izveštaj o pruženoj usluzi je uspešno zaveden u sistem.')
  }

  // --- SHIFT COMPLETION LOGIC ---
  const handleEndShift = () => {
    const unfinishedTasks = todaySchedule.filter(task => task.status !== 'Završeno')
    
    if (unfinishedTasks.length > 0) {
      alert(`Ne možete završiti smenu. Imate još ${unfinishedTasks.length} nezavršenih terenskih obaveza u rasporedu.`)
    } else {
      if(window.confirm('Da li ste sigurni da želite da završite smenu i odjavite se sa sistema?')) {
        alert('Smena uspešno završena. Hvala na radu!')
      }
    }
  }

  // Helper function to color code the schedule tasks
  const getTaskBadgeColor = (status) => {
    if (status === 'Završeno') return 'success'
    if (status === 'U toku') return 'primary'
    return 'secondary'
  }

  return (
    <Container className="mt-4">
      {/* --- Panel Header --- */}
      <Row className="align-items-center mb-4">
        <Col>
          <h2>Panel Terenskog Osoblja</h2>
          <p className="text-muted">Pregled smene, prijem zahteva za negu i odobravanje termina pacijenata.</p>
        </Col>
        <Col className="text-end">
          <Button variant="danger" size="lg" onClick={handleEndShift}>
            Odjava i Završetak Smene
          </Button>
        </Col>
      </Row>

      <Row>
        {/* --- Left column: Pending Patient Requests --- */}
        <Col lg={7} className="mb-4">
          <Card className="shadow-sm border-0 h-100">
            <Card.Header className="bg-white border-bottom-0 pt-4 pb-0">
              <h5 className="fw-bold text-danger">Pristigli zahtevi za usluge (Trijaža)</h5>
            </Card.Header>
            <Card.Body style={{ maxHeight: '600px', overflowY: 'auto', padding: '1rem' }}>
              <div style={{ overflowX: 'auto', width: '100%' }}>
                <Table hover className="mt-2 align-middle" style={{ minWidth: '800px' }}>
                  <thead className="table-light">
                    <tr>
                      <th>Pacijent</th>
                      <th>Datum i vreme</th>
                      {/* PROMENA: Odeljenje -> Vrsta usluge */}
                      <th>Vrsta usluge</th>
                      <th>Lokacija</th>
                      <th className="text-end">Akcije</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingRequests.map((request) => (
                      <tr key={request.id}>
                        <td className="fw-bold">{request.patientName}</td>
                        <td>{request.date} <br/> <small className="text-muted">{request.time}</small></td>
                        <td>{request.service}</td>
                        <td style={{ whiteSpace: 'normal', minWidth: '200px' }}>
                          <small>{request.location}</small> <br/>
                          <Badge bg="info">{request.price}</Badge>
                        </td>
                        <td className="text-end" style={{ minWidth: '180px' }}>
                          <Button variant="success" size="sm" className="me-2 mb-1" onClick={() => approveRequest(request.id)}>✓ Odobri</Button>
                          <Button variant="outline-danger" size="sm" className="mb-1" onClick={() => rejectRequest(request.id)}>✕ Odbij</Button>
                        </td>
                      </tr>
                    ))}
                    {pendingRequests.length === 0 && (
                      <tr><td colSpan="5" className="text-center text-muted py-4">Trenutno nema novih zahteva na čekanju.</td></tr>
                    )}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* --- Right column: Today's Shift Schedule --- */}
        <Col lg={5} className="mb-4">
          <Card className="shadow-sm border-0 h-100 bg-light">
            <Card.Header className="bg-light border-bottom-0 pt-4 pb-0">
              <h5 className="fw-bold" style={{ color: '#125447' }}>Terenski raspored za današnju smenu</h5>
            </Card.Header>
            <Card.Body style={{ maxHeight: '600px', overflowY: 'auto' }}>
              {todaySchedule.map((task) => (
                <div key={task.id} className={`mb-3 p-3 bg-white rounded shadow-sm border-start border-4 ${task.status === 'Završeno' ? 'border-success' : 'border-primary'}`}>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="fw-bold text-dark">{task.time}</span>
                    <Badge bg={getTaskBadgeColor(task.status)}>{task.status}</Badge>
                  </div>
                  <p className="mb-1 text-muted"><strong>Usluga:</strong> {task.task}</p>
                  <p className="mb-2 text-dark small"><strong>Pacijent:</strong> {task.patient}</p>
                  
                  {task.status !== 'Završeno' && (
                    <div className="text-end mt-3 border-top pt-2">
                      <Button variant="outline-primary" size="sm" onClick={() => openReportModal(task)}>
                        + Unesi izveštaj i završi
                      </Button>
                    </div>
                  )}
                </div>
              ))}
              {todaySchedule.length === 0 && <p className="text-center text-muted mt-3">Nemate zakazanih terenskih obaveza.</p>}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* --- REPORT ENTRY MODAL --- */}
      <Modal show={showReportModal} onHide={() => setShowReportModal(false)} size="lg" centered>
        <Modal.Header closeButton className="bg-light">
          <Modal.Title style={{ color: '#125447' }}>Unos izveštaja o pruženoj nezi / usluzi</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {activeTask && (
            <div className="mb-4 p-3 bg-light rounded border">
              <strong>Detalji zadatka:</strong> <br/>
              Pacijent: {activeTask.patient} <br/>
              Usluga: {activeTask.task} u {activeTask.time}h
            </div>
          )}
          
          <Form onSubmit={handleSaveReport}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Glavni izveštaj</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={4} 
                placeholder="Unesite zdravstveno stanje pacijenta, detalje o primenjenoj nezi ili terapiji..."
                value={reportSummary}
                onChange={(e) => setReportSummary(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="fw-bold">Dodatni komentar (Opciono)</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={2} 
                placeholder="Unesite zapažanja, potrebe za narednu posetu ili napomene za administratora..."
                value={reportComment}
                onChange={(e) => setReportComment(e.target.value)}
              />
            </Form.Group>

            <div className="d-flex justify-content-end gap-2 border-top pt-3">
              <Button variant="secondary" onClick={() => setShowReportModal(false)}>Odustani</Button>
              <Button variant="success" type="submit">Zavedi izveštaj i završi obavezu</Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

    </Container>
  )
}

export default MedicalStaffPanel