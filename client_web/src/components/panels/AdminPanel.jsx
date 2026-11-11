import React, { useState, useEffect, useCallback } from 'react'
import { Container, Row, Col, Table, Button, Badge, Modal, Form, Tabs, Tab, Card, Spinner } from 'react-bootstrap'
import { useAuth } from '../../context/AuthContext'

const AdminPanel = () => {
    const { api } = useAuth()
    const [isLoading, setIsLoading] = useState(true)

    // ==========================================
    // 1. STATES FROM DATABASE
    // ==========================================
    const [patients, setPatients] = useState([])
    const [staff, setStaff] = useState([])
    const [pendingRequests, setPendingRequests] = useState([])
    const [appointments, setAppointments] = useState([])
    
    // mock data for terrain reports
    const [reports] = useState([
        { id: 1, patientName: 'Marko Marković', staffName: 'Sanja Ilić', date: '2026-05-25', summary: 'Pacijent stabilan, pritisak 120/80.', comment: 'Striktno se pridržava terapije.' }
    ])

    // ==========================================
    // 2. FETCH DATA FROM BACKEND
    // ==========================================
    const fetchAllData = useCallback(async () => {
        setIsLoading(true)
        try {
            const [patientsRes, staffRes, pendingRes, apptRes] = await Promise.all([
                api.get('/api/profile/patient_profiles'),
                api.get('/api/profile/staff_profiles'),
                api.get('/api/service_request/pending'),
                api.get('/api/appointment/all').catch(() => ({ data: [] }))
            ])
            setPatients(patientsRes.data)
            setStaff(staffRes.data)
            setPendingRequests(pendingRes.data)
            setAppointments(apptRes.data)
        } catch (error) {
            console.error("Greška pri učitavanju Admin podataka:", error)
        } finally {
            setIsLoading(false)
        }
    }, [api])

    useEffect(() => {
        fetchAllData()
    }, [fetchAllData])

    // ==========================================
    // 3. MODAL AND FORM CONTROLS
    // ==========================================
    const [showPatientModal, setShowPatientModal] = useState(false)
    const [patientFormData, setPatientFormData] = useState({ user_id: '', family_name: '', date_of_birth: '', contact_email: '', care_notes: '' })

    const [showStaffModal, setShowStaffModal] = useState(false)
    const [staffFormData, setStaffFormData] = useState({ user_id: '', job_title: 'Medicinska sestra', shift: 'Jutarnja', salary: '', license_number: '' })

    const [showTriageModal, setShowTriageModal] = useState(false)
    const [selectedRequest, setSelectedRequest] = useState(null)
    const [selectedStaffId, setSelectedStaffId] = useState('')
    const [scheduleStatus, setScheduleStatus] = useState('SCHEDULED')

    // ==========================================
    // 4. API ACTIONS
    // ==========================================
    const handleSavePatient = async (e) => {
        e.preventDefault()
        try {
            await api.post('/api/profile/patient_profile', patientFormData)
            alert("Pacijent uspešno registrovan!")
            setShowPatientModal(false)
            setPatientFormData({ user_id: '', family_name: '', date_of_birth: '', contact_email: '', care_notes: '' })
            fetchAllData()
        } catch (error) {
            alert("Greška pri kreiranju pacijenta. Proverite da li User UUID postoji.")
        }
    }

    const handleSaveStaff = async (e) => {
        e.preventDefault()
        try {
            await api.post('/api/profile/staff_profile', staffFormData)
            alert("Medicinsko osoblje uspešno registrovano!")
            setShowStaffModal(false)
            setStaffFormData({ user_id: '', job_title: 'Medicinska sestra', shift: 'Jutarnja', salary: '', license_number: '' })
            fetchAllData()
        } catch (error) {
            alert("Greška pri kreiranju osoblja.")
        }
    }

    const handleApproveRequest = async (e) => {
        e.preventDefault()
        if (!selectedStaffId) {
            alert("Morate izabrati osoblje!"); 
            return;
        }

        const appointmentData = {
            request_id: selectedRequest.id,
            staff_id: selectedStaffId,
            service_type: selectedRequest.service_type,
            schedule_date: selectedRequest.preferred_date,
            schedule_time: selectedRequest.preferred_time,
            location_preference: selectedRequest.location_preference,
        }

        try {
            await api.post('/api/appointment/create_appointment', appointmentData)
            alert('Termin je uspešno obrađen!')
            setShowTriageModal(false)
            setSelectedStaffId('')
            fetchAllData()
        } catch (error) {
            alert("Greška pri kreiranju termina. Proverite DTO formate na backendu.")
        }
    }

    if (isLoading) return <div className="text-center mt-5"><Spinner animation="border" variant="success" /></div>

    return (
        <Container className='mt-5'>
            <Row className='align-items-center mb-4'>
                <Col>
                    <h2>Administratorski Kontrolni Centar</h2>
                    <p className="text-muted">Glavni interfejs za upravljanje ERP sistemom MinuteNurse.</p>
                </Col>
            </Row>

            <Tabs defaultActiveKey="requests" id="admin-tabs" className="mb-4">
                
                {/* TAB 1: SERVICE REQUESTS */}
                <Tab eventKey="requests" title="Trijaža Zahteva (Novi)">
                    <Card className="border-0 shadow-sm">
                        <Card.Header className="bg-white pt-4 pb-3">
                            <h5 className="mb-0 fw-bold text-danger">Pristigli zahtevi pacijenata na čekanju</h5>
                        </Card.Header>
                        <Card.Body className="p-0">
                            <Table hover responsive className="mb-0 align-middle">
                                <thead className="table-light">
                                    <tr>
                                        <th>ID Zahteva</th>
                                        <th>Usluga</th>
                                        <th>Željeni Datum i Vreme</th>
                                        <th>Lokacija</th>
                                        <th className="text-end pe-4">Akcija</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pendingRequests.map(req => (
                                        <tr key={req.id}>
                                            <td><small className="text-muted">{req.id}</small></td>
                                            <td className="fw-bold">{req.service_type}</td>
                                            <td>{req.preferred_date}, {req.preferred_time}</td>
                                            <td>{req.location_preference}</td>
                                            <td className="text-end pe-4">
                                                <Button variant="success" size="sm" onClick={() => { setSelectedRequest(req); setShowTriageModal(true); }}>
                                                    ✓ Dodeliti osoblje
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                    {pendingRequests.length === 0 && <tr><td colSpan="5" className="text-center py-4">Nema novih zahteva.</td></tr>}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Tab>

                {/* TAB 2: APPOINTMENTS */}
                <Tab eventKey="appointments" title="Svi Termini">
                    <Card className="border-0 shadow-sm">
                        <Card.Header className="bg-white pt-4 pb-3">
                            <h5 className="mb-0 fw-bold" style={{ color: '#125447' }}>Globalni kalendar svih termina</h5>
                        </Card.Header>
                        <Card.Body className="p-0">
                            <Table hover responsive className="mb-0 align-middle">
                                <thead className="table-light">
                                    <tr>
                                        <th>ID Termina</th>
                                        <th>Tip usluge</th>
                                        <th>Lokacija</th>
                                        <th>Datum i Vreme</th>
                                        <th>ID Osoblja (Radnik)</th>
                                        <th>ID Zahteva (Ref)</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {appointments.map(appt => (
                                        <tr key={appt.id}>
                                            <td><small>{appt.id}</small></td>
                                            <td><small>{appt.service_type}</small></td>
                                            <td><small>{appt.location_preference || appt.location}</small></td>
                                            <td><strong>{appt.scheduled_date}</strong> u {appt.scheduled_time}</td>
                                            <td><small className="text-muted">{appt.staff_id}</small></td>
                                            <td><small className="text-muted">{appt.request_id}</small></td>
                                            <td>
                                                <Badge bg={appt.schedule === 'SCHEDULED' || appt.schedule === 'Zakazano' ? 'success' : 'danger'}>
                                                    {appt.schedule}
                                                </Badge>
                                            </td>
                                        </tr>
                                    ))}
                                    {appointments.length === 0 && <tr><td colSpan="7" className="text-center py-4">Nema zakazanih termina.</td></tr>}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Tab>

                {/* TAB 3: PATIENTS */}
                <Tab eventKey="patients" title="Pacijenti">
                    <Card className="border-0 shadow-sm">
                        <Card.Header className="bg-white d-flex justify-content-between align-items-center pt-4 pb-3">
                            <h5 className="mb-0 fw-bold" style={{ color: '#125447' }}>Baza pacijenata</h5>
                            <Button variant="primary" onClick={() => setShowPatientModal(true)} style={{ backgroundColor: '#1a7a68', border: 'none' }}>+ Registruj</Button>
                        </Card.Header>
                        <Card.Body className="p-0">
                            <Table hover responsive className="mb-0 align-middle">
                                <thead className="table-light">
                                    <tr><th>ID Profila</th><th>Porodica</th><th>Datum rođenja</th><th>Status</th></tr>
                                </thead>
                                <tbody>
                                    {patients.map(p => (
                                        <tr key={p.id}>
                                            <td><small>{p.id}</small></td>
                                            <td><strong>{p.family_name}</strong><br/><small>{p.contact_email}</small></td>
                                            <td>{p.date_of_birth}</td>
                                            <td><Badge bg={p.is_active ? 'success' : 'danger'}>{p.is_active ? 'Aktivan' : 'Neaktivan'}</Badge></td>
                                        </tr>
                                    ))}
                                    {patients.length === 0 && <tr><td colSpan="4" className="text-center py-4">Nema registrovanih pacijenata.</td></tr>}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Tab>

                {/* TAB 4: STAFF */}
                <Tab eventKey="staff" title="Osoblje">
                    <Card className="border-0 shadow-sm">
                        <Card.Header className="bg-white d-flex justify-content-between align-items-center pt-4 pb-3">
                            <h5 className="mb-0 fw-bold" style={{ color: '#125447' }}>Registar zaposlenih</h5>
                            <Button variant="primary" onClick={() => setShowStaffModal(true)} style={{ backgroundColor: '#1a7a68', border: 'none' }}>+ Registruj</Button>
                        </Card.Header>
                        <Card.Body className="p-0">
                            <Table hover responsive className="mb-0 align-middle">
                                <thead className="table-light">
                                    <tr><th>ID Profila</th><th>Zvanje</th><th>Smena</th><th>Status</th></tr>
                                </thead>
                                <tbody>
                                    {staff.map(s => (
                                        <tr key={s.id}>
                                            <td><small>{s.id}</small></td>
                                            <td><strong>{s.job_title}</strong></td>
                                            <td><Badge bg="info">{s.shift}</Badge></td>
                                            <td><Badge bg={s.is_active ? 'success' : 'danger'}>{s.is_active ? 'Aktivan' : 'Neaktivan'}</Badge></td>
                                        </tr>
                                    ))}
                                    {staff.length === 0 && <tr><td colSpan="4" className="text-center py-4">Nema osoblja.</td></tr>}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Tab>

                {/* TAB 5: REPORTS */}
                <Tab eventKey="reports" title="Izveštaji o posetama (Mock)">
                  <Card className="border-0 shadow-sm">
                    <Card.Header className="bg-white pt-4 pb-3">
                      <h5 className="mb-0 fw-bold" style={{ color: '#125447' }}>Pregled medicinskih izveštaja sa terena</h5>
                    </Card.Header>
                    <Card.Body className="p-3">
                      {reports.map(rep => (
                        <Card key={rep.id} className="mb-3 border-start border-4 border-success shadow-sm">
                          <Card.Body>
                            <Row className="mb-2">
                              <Col md={4}><strong>Pacijent:</strong> {rep.patientName}</Col>
                              <Col md={4}><strong>Osoblje:</strong> {rep.staffName}</Col>
                              <Col md={4} className="text-md-end text-muted"><small>Datum posete: {rep.date}</small></Col>
                            </Row>
                            <div className="bg-light p-3 rounded mb-2">
                              <strong>Zdravstveni izveštaj:</strong> <br />
                              <p className="mb-0 text-dark small">{rep.summary}</p>
                            </div>
                            <div className="p-1">
                              <small className="text-muted"><strong>Komentar administratora/osoblja:</strong> {rep.comment}</small>
                            </div>
                          </Card.Body>
                        </Card>
                      ))}
                    </Card.Body>
                  </Card> 
                </Tab>
            </Tabs>

            {/* --- MODAL: TRIJAŽA / CREATING APPOINTMENT --- */}
            <Modal show={showTriageModal} onHide={() => setShowTriageModal(false)} centered size="lg">
                <Modal.Header closeButton className="bg-light">
                    <Modal.Title style={{ color: '#125447' }}>Dodela termina osoblju</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedRequest && (
                        <div className="mb-4 p-3 bg-light rounded border">
                            <strong>Usluga:</strong> {selectedRequest.service_type} <br/>
                            <strong>Datum:</strong> {selectedRequest.preferred_date} u {selectedRequest.preferred_time} <br/>
                            <strong>Lokacija:</strong> {selectedRequest.location_preference}
                        </div>
                    )}
                    <Form onSubmit={handleApproveRequest}>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-bold">Izaberite slobodno osoblje</Form.Label>
                            <Form.Select value={selectedStaffId} onChange={(e) => setSelectedStaffId(e.target.value)} required>
                                <option value="">-- Odaberite medicinskog radnika --</option>
                                {staff.filter(s => s.is_active).map(s => (
                                    <option key={s.id} value={s.id}>
                                        {s.job_title} (Smena: {s.shift}) - ID: {s.id.substring(0,8)}...
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-4">
                            <Form.Label className="fw-bold">Odluka administratora (Status)</Form.Label>
                            <Form.Select value={scheduleStatus} onChange={(e) => setScheduleStatus(e.target.value)}>
                                <option value="SCHEDULED">Odobri i Zakaži (SCHEDULED)</option>
                                <option value="CANCELED">Odbij / Otkaži (CANCELED)</option>
                            </Form.Select>
                        </Form.Group>

                        <div className="d-flex justify-content-end gap-2 border-top pt-3">
                            <Button variant="secondary" onClick={() => setShowTriageModal(false)}>Odustani</Button>
                            <Button variant="success" type="submit">Generiši Termin</Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* --- MODAL: CREATING STAFF --- */}
            <Modal show={showStaffModal} onHide={() => setShowStaffModal(false)} centered size="lg">
                <Modal.Header closeButton className="bg-light">
                    <Modal.Title style={{ color: '#125447' }}>Registracija profila osoblja</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSaveStaff}>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-bold">User UUID (ID korisnika iz baze)</Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder="Unesite UUID korisnika"
                                value={staffFormData.user_id}
                                onChange={(e) => setStaffFormData({...staffFormData, user_id: e.target.value})}
                                required
                            />
                        </Form.Group>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Zvanje (Job Title)</Form.Label>
                                    <Form.Control 
                                        type="text" 
                                        value={staffFormData.job_title}
                                        onChange={(e) => setStaffFormData({...staffFormData, job_title: e.target.value})}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Smena (Shift)</Form.Label>
                                    <Form.Select 
                                        value={staffFormData.shift}
                                        onChange={(e) => setStaffFormData({...staffFormData, shift: e.target.value})}
                                    >
                                        <option value="Jutarnja">Jutarnja</option>
                                        <option value="Popodnevna">Popodnevna</option>
                                        <option value="Noćna">Noćna</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Plata (Salary)</Form.Label>
                                    <Form.Control 
                                        type="number" 
                                        placeholder="npr. 120000"
                                        value={staffFormData.salary}
                                        onChange={(e) => setStaffFormData({...staffFormData, salary: e.target.value})}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-4">
                                    <Form.Label>Broj licence (License Number)</Form.Label>
                                    <Form.Control 
                                        type="text" 
                                        placeholder="npr. LIC-12345"
                                        value={staffFormData.license_number}
                                        onChange={(e) => setStaffFormData({...staffFormData, license_number: e.target.value})}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <div className="d-flex justify-content-end gap-2 border-top pt-3">
                            <Button variant="secondary" onClick={() => setShowStaffModal(false)}>Odustani</Button>
                            <Button variant="primary" type="submit" style={{ backgroundColor: '#1a7a68', border: 'none' }}>
                                Sačuvaj profil osoblja
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* --- MODAL: CREATING PATIENT --- */}
            <Modal show={showPatientModal} onHide={() => setShowPatientModal(false)} centered size="lg">
                <Modal.Header closeButton className="bg-light">
                    <Modal.Title style={{ color: '#125447' }}>Registracija profila pacijenta</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSavePatient}>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-bold">User UUID (ID korisnika iz baze)</Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder="Unesite UUID korisnika"
                                value={patientFormData.user_id}
                                onChange={(e) => setPatientFormData({...patientFormData, user_id: e.target.value})}
                                required
                            />
                        </Form.Group>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Prezime porodice</Form.Label>
                                    <Form.Control 
                                        type="text" 
                                        placeholder="npr. Petrović"
                                        value={patientFormData.family_name}
                                        onChange={(e) => setPatientFormData({...patientFormData, family_name: e.target.value})}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Datum rođenja</Form.Label>
                                    <Form.Control 
                                        type="date" 
                                        value={patientFormData.date_of_birth}
                                        onChange={(e) => setPatientFormData({...patientFormData, date_of_birth: e.target.value})}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group className="mb-3">
                            <Form.Label>Kontakt email</Form.Label>
                            <Form.Control 
                                type="email" 
                                placeholder="kontakt@example.com"
                                value={patientFormData.contact_email}
                                onChange={(e) => setPatientFormData({...patientFormData, contact_email: e.target.value})}
                            />
                        </Form.Group>

                        <Form.Group className="mb-4">
                            <Form.Label>Napomene o nezi (Care Notes)</Form.Label>
                            <Form.Control 
                                as="textarea" 
                                rows={3}
                                placeholder="Unesite specifične zdravstvene napomene..."
                                value={patientFormData.care_notes}
                                onChange={(e) => setPatientFormData({...patientFormData, care_notes: e.target.value})}
                            />
                        </Form.Group>

                        <div className="d-flex justify-content-end gap-2 border-top pt-3">
                            <Button variant="secondary" onClick={() => setShowPatientModal(false)}>Odustani</Button>
                            <Button variant="primary" type="submit" style={{ backgroundColor: '#1a7a68', border: 'none' }}>
                                Sačuvaj profil pacijenta
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </Container>
    )
}

export default AdminPanel