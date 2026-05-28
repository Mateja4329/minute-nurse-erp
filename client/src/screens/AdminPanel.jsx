import React, { useState } from 'react'
import { Container, Row, Col, Table, Button, Badge, Modal, Form, Tabs, Tab, Card } from 'react-bootstrap'

const AdminPanel = () => {
  // ==========================================
  // 1. PATIENTS STATE & MOCK DATA
  // ==========================================
  const [patients, setPatients] = useState([
    { 
      id: 1, 
      firstName: 'Marko', 
      lastName: 'Marković', 
      familyName: 'Porodica Marković', 
      address: 'Bulevar Evrope 50, Novi Sad', 
      phone: '+381601234567', 
      email: 'marko@gmail.com', 
      medicalNotes: 'Alergija na penicilin. Redovna terapija za pritisak.',
      status: 'Aktivan' 
    },
    { 
      id: 2, 
      firstName: 'Milica', 
      lastName: 'Nikolić', 
      familyName: 'Porodica Nikolić', 
      address: 'Maksima Gorkog 17, Beograd', 
      phone: '+381649998887', 
      email: 'milica@gmail.com', 
      medicalNotes: 'Dijabetes tip 2.',
      status: 'Deaktiviran' 
    }
  ])

  // ==========================================
  // 2. MEDICAL STAFF STATE & MOCK DATA
  // ==========================================
  const [staff, setStaff] = useState([
    {
      id: 1,
      firstName: 'Sanja',
      lastName: 'Ilić',
      email: 'sanja.ilic@minutenurse.rs',
      phone: '+381651112223',
      role: 'Medicinska sestra',
      shift: 'Jutarnja',
      salary: '90000 rsd', // DODATO: Plata
      status: 'Aktivan'
    },
    {
      id: 2,
      firstName: 'Dragan',
      lastName: 'Simić',
      email: 'dragan.simic@minutenurse.rs',
      phone: '+381634445556',
      role: 'Lekar/Doktor',
      shift: 'Popodnevna',
      salary: '150000 rsd', // DODATO: Plata
      status: 'Aktivan'
    }
  ])

  // ==========================================
  // 3. SCHEDULES STATE & MOCK DATA
  // ==========================================
  const [schedules, setSchedules] = useState([
    {
      id: 1,
      patientName: 'Marko Marković',
      staffName: 'Sanja Ilić',
      date: '2026-06-01',
      time: '09:00',
      service: 'Davanje terapije (Infuzija)',
      location: 'Kućna poseta',
      price: '6000 rsd', // DODATO: Cena
      status: 'Zakazano'
    }
  ])

  // ==========================================
  // 4. VISIT REPORTS STATE & MOCK DATA
  // ==========================================
  const [reports] = useState([
    {
      id: 1,
      patientName: 'Marko Marković',
      staffName: 'Sanja Ilić',
      date: '2026-05-25',
      summary: 'Redovna kućna poseta. Pacijent stabilan, pritisak 120/80. Izmeren šećer u krvi.',
      comment: 'Porodica prisutna tokom posete, pacijent se striktno pridržava prepisane terapije.'
    }
  ])

  // ==========================================
  // 5. MODALS & FORMS CONTROL STATES
  // ==========================================
  const [showPatientModal, setShowPatientModal] = useState(false)
  const [isEditingPatient, setIsEditingPatient] = useState(false)
  const [patientFormData, setPatientFormData] = useState({
    id: null, firstName: '', lastName: '', familyName: '', address: '', phone: '', email: '', medicalNotes: '', status: 'Aktivan'
  })

  const [showStaffModal, setShowStaffModal] = useState(false)
  const [isEditingStaff, setIsEditingStaff] = useState(false)
  const [staffFormData, setStaffFormData] = useState({
    // DODATO: salary polje
    id: null, firstName: '', lastName: '', email: '', phone: '', role: 'Medicinska sestra', shift: 'Jutarnja', salary: '', status: 'Aktivan'
  })

  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const [scheduleFormData, setScheduleFormData] = useState({
    // DODATO: price polje
    patientIndex: '0', 
    staffIndex: '0',   
    date: '',
    time: '',
    service: 'Davanje terapije (Infuzija)', 
    location: 'Ambulanta BW',
    price: '' 
  })

  // ==========================================
  // 6. CRUD & STATUS HANDLERS
  // ==========================================
  // Patient Handlers
  const handlePatientClose = () => setShowPatientModal(false)
  const handlePatientShowAdd = () => {
    setIsEditingPatient(false)
    setPatientFormData({ id: null, firstName: '', lastName: '', familyName: '', address: '', phone: '', email: '', medicalNotes: '', status: 'Aktivan' })
    setShowPatientModal(true)
  }
  const handlePatientShowEdit = (patient) => {
    setIsEditingPatient(true)
    setPatientFormData(patient)
    setShowPatientModal(true)
  }
  const handlePatientChange = (e) => {
    const { name, value } = e.target
    setPatientFormData({ ...patientFormData, [name]: value })
  }
  const handleSavePatient = (e) => {
    e.preventDefault()
    if (isEditingPatient) {
      setPatients(patients.map(p => p.id === patientFormData.id ? patientFormData : p))
    } else {
      const newId = patients.length > 0 ? Math.max(...patients.map(p => p.id)) + 1 : 1
      setPatients([...patients, { ...patientFormData, id: newId }])
    }
    handlePatientClose()
  }
  const togglePatientStatus = (id, currentStatus) => {
    const newStatus = currentStatus === 'Aktivan' ? 'Deaktiviran' : 'Aktivan'
    if (window.confirm(`Da li ste sigurni da želite da promenite status kartona u: ${newStatus}?`)) {
      setPatients(patients.map(p => p.id === id ? { ...p, status: newStatus } : p))
    }
  }

  // Staff Handlers
  const handleStaffClose = () => setShowStaffModal(false)
  const handleStaffShowAdd = () => {
    setIsEditingStaff(false)
    setStaffFormData({ id: null, firstName: '', lastName: '', email: '', phone: '', role: 'Medicinska sestra', shift: 'Jutarnja', salary: '', status: 'Aktivan' })
    setShowStaffModal(true)
  }
  const handleStaffShowEdit = (member) => {
    setIsEditingStaff(true)
    setStaffFormData(member)
    setShowStaffModal(true)
  }
  const handleStaffChange = (e) => {
    const { name, value } = e.target
    setStaffFormData({ ...staffFormData, [name]: value })
  }
  const handleSaveStaff = (e) => {
    e.preventDefault()
    if (isEditingStaff) {
      setStaff(staff.map(s => s.id === staffFormData.id ? staffFormData : s))
    } else {
      const newId = staff.length > 0 ? Math.max(...staff.map(s => s.id)) + 1 : 1
      setStaff([...staff, { ...staffFormData, id: newId }])
    }
    handleStaffClose()
  }
  const toggleStaffStatus = (id, currentStatus) => {
    const newStatus = currentStatus === 'Aktivan' ? 'Deaktiviran' : 'Aktivan'
    if (window.confirm(`Da li ste sigurni da želite da promenite status profila zaposlenog u: ${newStatus}?`)) {
      setStaff(staff.map(s => s.id === id ? { ...s, status: newStatus } : s))
    }
  }

  // Schedule Handlers
  const handleScheduleClose = () => setShowScheduleModal(false)
  const handleScheduleShowAdd = () => {
    setScheduleFormData({ patientIndex: '0', staffIndex: '0', date: '', time: '', service: 'Davanje terapije (Infuzija)', location: 'Ambulanta BW', price: '' })
    setShowScheduleModal(true)
  }
  const handleScheduleChange = (e) => {
    const { name, value } = e.target
    setScheduleFormData({ ...scheduleFormData, [name]: value })
  }
  const handleSaveSchedule = (e) => {
    e.preventDefault()
    
    const selectedPatient = patients[parseInt(scheduleFormData.patientIndex)]
    const selectedStaff = staff[parseInt(scheduleFormData.staffIndex)]

    const newSchedule = {
      id: schedules.length + 1,
      patientName: `${selectedPatient.firstName} ${selectedPatient.lastName}`,
      staffName: `${selectedStaff.firstName} ${selectedStaff.lastName}`,
      date: scheduleFormData.date,
      time: scheduleFormData.time,
      service: scheduleFormData.service,
      location: scheduleFormData.location,
      price: scheduleFormData.price || 'Na upit', // Fallback ako nije uneta cena
      status: 'Zakazano'
    }

    setSchedules([...schedules, newSchedule])
    handleScheduleClose()
    alert('Novi termin uspešno kreiran i dodeljen medicinskom radniku!')
  }

  const deleteSchedule = (id) => {
    if (window.confirm('Da li ste sigurni da želite da otkažete ovaj termin iz rasporeda?')) {
      setSchedules(schedules.filter(s => s.id !== id))
    }
  }

  return (
    <Container className='mt-5'>
      <Row className='align-items-center mb-4'>
        <Col>
          <h2>Administratorski Kontrolni Centar</h2>
          <p className="text-muted">Glavni interfejs za upravljanje ERP sistemom MinuteNurse.</p>
        </Col>
      </Row>

      <Tabs defaultActiveKey="patients" id="admin-tabs" className="mb-4">
        
        {/* TAB 1: PATIENTS & FAMILIES */}
        <Tab eventKey="patients" title="Pacijenti i Porodice">
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white d-flex justify-content-between align-items-center pt-4 pb-3">
              <h5 className="mb-0 fw-bold" style={{ color: '#125447' }}>Baza pacijenata</h5>
              <Button variant="primary" onClick={handlePatientShowAdd} style={{ backgroundColor: '#1a7a68', border: 'none' }}>
                + Registruj pacijenta
              </Button>
            </Card.Header>
            <Card.Body className="p-0">
              <div style={{ overflowX: 'auto', width: '100%' }}>
                <Table hover responsive className="mb-0 align-middle" style={{ minWidth: '1000px' }}>
                  <thead className="table-light">
                    <tr>
                      <th>Ime i prezime (Porodica)</th>
                      <th>Kontakt i Adresa</th>
                      <th>Medicinske beleške</th>
                      <th>Status kartona</th>
                      <th className="text-end pe-4">Akcije</th>
                    </tr>
                  </thead>
                  <tbody>
                    {patients.map(patient => (
                      <tr key={patient.id} className={patient.status === 'Deaktiviran' ? 'table-secondary' : ''}>
                        <td>
                          <strong>{patient.firstName} {patient.lastName}</strong><br/>
                          <small className="text-muted">{patient.familyName}</small>
                        </td>
                        <td>
                          <small>📞 {patient.phone}</small><br/>
                          <small>📧 {patient.email}</small><br/>
                          <small>📍 {patient.address}</small>
                        </td>
                        <td>
                          <small className="text-muted d-inline-block text-truncate" style={{ maxWidth: '200px' }}>
                            {patient.medicalNotes || 'Nema posebnih beleški'}
                          </small>
                        </td>
                        <td><Badge bg={patient.status === 'Aktivan' ? 'success' : 'danger'}>{patient.status}</Badge></td>
                        <td className="text-end pe-4">
                          <Button variant="outline-primary" size="sm" className="me-2 mb-1" onClick={() => handlePatientShowEdit(patient)}>✎ Izmeni</Button>
                          <Button variant={patient.status === 'Aktivan' ? 'outline-danger' : 'outline-success'} size="sm" className="mb-1" onClick={() => togglePatientStatus(patient.id, patient.status)}>
                            {patient.status === 'Aktivan' ? '🚫 Deaktiviraj' : '⟲ Aktiviraj'}
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Tab>

        {/* TAB 2: MEDICAL STAFF */}
        <Tab eventKey="staff" title="Medicinsko Osoblje">
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white d-flex justify-content-between align-items-center pt-4 pb-3">
              <h5 className="mb-0 fw-bold" style={{ color: '#125447' }}>Registar zaposlenih radnika</h5>
              <Button variant="primary" onClick={handleStaffShowAdd} style={{ backgroundColor: '#1a7a68', border: 'none' }}>
                + Registruj osoblje
              </Button>
            </Card.Header>
            <Card.Body className="p-0">
              <div style={{ overflowX: 'auto', width: '100%' }}>
                <Table hover responsive className="mb-0 align-middle" style={{ minWidth: '1000px' }}>
                  <thead className="table-light">
                    <tr>
                      <th>Medicinski radnik</th>
                      <th>Zvanje / Uloga</th>
                      <th>Kontakt podaci</th>
                      <th>Plata i Smena</th> {/* PROMENJENO */}
                      <th>Status profila</th>
                      <th className="text-end pe-4">Akcije</th>
                    </tr>
                  </thead>
                  <tbody>
                    {staff.map(member => (
                      <tr key={member.id} className={member.status === 'Deaktiviran' ? 'table-secondary' : ''}>
                        <td><strong>{member.firstName} {member.lastName}</strong><br/><small className="text-muted">ID Radnika: #00{member.id}</small></td>
                        <td><Badge bg="info" className="text-dark">{member.role}</Badge></td>
                        <td><small>📞 {member.phone}</small><br/><small>📧 {member.email}</small></td>
                        <td>
                          <strong>{member.salary}</strong><br/>
                          <Badge bg={member.shift === 'Jutarnja' ? 'warning text-dark' : member.shift === 'Popodnevna' ? 'primary' : 'dark'}>{member.shift}</Badge>
                        </td>
                        <td><Badge bg={member.status === 'Aktivan' ? 'success' : 'danger'}>{member.status}</Badge></td>
                        <td className="text-end pe-4">
                          <Button variant="outline-primary" size="sm" className="me-2 mb-1" onClick={() => handleStaffShowEdit(member)}>✎ Izmeni</Button>
                          <Button variant={member.status === 'Aktivan' ? 'outline-danger' : 'outline-success'} size="sm" className="mb-1" onClick={() => toggleStaffStatus(member.id, member.status)}>
                            {member.status === 'Aktivan' ? '🚫 Deaktiviraj' : '⟲ Aktiviraj'}
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Tab>

        {/* TAB 3: SCHEDULE MANAGEMENT */}
        <Tab eventKey="schedules" title="Kreiranje Rasporeda">
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white d-flex justify-content-between align-items-center pt-4 pb-3">
              <h5 className="mb-0 fw-bold" style={{ color: '#125447' }}>Planiranje poseta i alokacija timova</h5>
              <Button variant="primary" onClick={handleScheduleShowAdd} style={{ backgroundColor: '#16a085', border: 'none' }}>
                + Kreiraj novi termin
              </Button>
            </Card.Header>
            <Card.Body className="p-0">
              <div style={{ overflowX: 'auto', width: '100%' }}>
                <Table hover responsive className="mb-0 align-middle" style={{ minWidth: '950px' }}>
                  <thead className="table-light">
                    <tr>
                      <th>Pacijent</th>
                      <th>Zaduženo osoblje</th>
                      <th>Datum i vreme</th>
                      <th>Usluga i Cena</th> {/* PROMENJENO */}
                      <th>Lokacija</th>
                      <th>Status</th>
                      <th className="text-end pe-4">Akcije</th>
                    </tr>
                  </thead>
                  <tbody>
                    {schedules.map(session => (
                      <tr key={session.id}>
                        <td className="fw-bold">{session.patientName}</td>
                        <td>👤 {session.staffName}</td>
                        <td>📅 {session.date} u {session.time} h</td>
                        <td>
                          {session.service}<br/>
                          <Badge bg="info" className="text-dark mt-1">{session.price}</Badge>
                        </td>
                        <td><small>📍 {session.location}</small></td>
                        <td><Badge bg="success">{session.status}</Badge></td>
                        <td className="text-end pe-4">
                          <Button variant="outline-danger" size="sm" onClick={() => deleteSchedule(session.id)}>
                            ✕ Otkaži termin
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Tab>

        {/* TAB 4: VISIT REPORTS */}
        <Tab eventKey="reports" title="Izveštaji o Posetama">
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

      {/* --- MODAL 1: PATIENT FORM --- */}
      <Modal show={showPatientModal} onHide={handlePatientClose} size="lg" centered>
        <Modal.Header closeButton className="bg-light"><Modal.Title style={{ color: '#125447' }}>{isEditingPatient ? 'Izmena kartona' : 'Registracija pacijenta'}</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSavePatient}>
            <Row><Col md={6}><Form.Group className="mb-3"><Form.Label>Ime</Form.Label><Form.Control name="firstName" value={patientFormData.firstName} onChange={handlePatientChange} required /></Form.Group></Col><Col md={6}><Form.Group className="mb-3"><Form.Label>Prezime</Form.Label><Form.Control name="lastName" value={patientFormData.lastName} onChange={handlePatientChange} required /></Form.Group></Col></Row>
            <Row><Col md={6}><Form.Group className="mb-3"><Form.Label>Porodica</Form.Label><Form.Control name="familyName" value={patientFormData.familyName} onChange={handlePatientChange} /></Form.Group></Col><Col md={6}><Form.Group className="mb-3"><Form.Label>Adresa</Form.Label><Form.Control name="address" value={patientFormData.address} onChange={handlePatientChange} required /></Form.Group></Col></Row>
            <Row><Col md={6}><Form.Group className="mb-3"><Form.Label>Telefon</Form.Label><Form.Control name="phone" value={patientFormData.phone} onChange={handlePatientChange} required /></Form.Group></Col><Col md={6}><Form.Group className="mb-3"><Form.Label>Email</Form.Label><Form.Control name="email" type="email" value={patientFormData.email} onChange={handlePatientChange} required /></Form.Group></Col></Row>
            <Form.Group className="mb-4"><Form.Label>Medicinske beleške</Form.Label><Form.Control as="textarea" rows={3} name="medicalNotes" value={patientFormData.medicalNotes} onChange={handlePatientChange} style={{ resize: 'none' }} /></Form.Group>
            <div className="d-flex justify-content-end gap-2 border-top pt-3"><Button variant="secondary" onClick={handlePatientClose}>Odustani</Button><Button variant="primary" type="submit" style={{ backgroundColor: '#1a7a68', border: 'none' }}>Potvrdi</Button></div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* --- MODAL 2: STAFF FORM --- */}
      <Modal show={showStaffModal} onHide={handleStaffClose} size="lg" centered>
        <Modal.Header closeButton className="bg-light"><Modal.Title style={{ color: '#125447' }}>{isEditingStaff ? 'Izmena osoblja' : 'Registracija osoblja'}</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSaveStaff}>
            <Row><Col md={6}><Form.Group className="mb-3"><Form.Label>Ime</Form.Label><Form.Control name="firstName" value={staffFormData.firstName} onChange={handleStaffChange} required /></Form.Group></Col><Col md={6}><Form.Group className="mb-3"><Form.Label>Prezime</Form.Label><Form.Control name="lastName" value={staffFormData.lastName} onChange={handleStaffChange} required /></Form.Group></Col></Row>
            <Row><Col md={6}><Form.Group className="mb-3"><Form.Label>Email</Form.Label><Form.Control name="email" type="email" value={staffFormData.email} onChange={handleStaffChange} required /></Form.Group></Col><Col md={6}><Form.Group className="mb-3"><Form.Label>Telefon</Form.Label><Form.Control name="phone" value={staffFormData.phone} onChange={handleStaffChange} required /></Form.Group></Col></Row>
            <Row>
              <Col md={4}>
                <Form.Group className="mb-4">
                  <Form.Label>Zvanje / Uloga</Form.Label>
                  <Form.Select name="role" value={staffFormData.role} onChange={handleStaffChange}>
                    <option value="Negovateljica">Negovateljica</option>
                    <option value="Medicinska sestra">Medicinska sestra</option>
                    <option value="Geronto domaćica">Geronto domaćica</option>
                    <option value="Lekar/Doktor">Lekar/Doktor</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-4">
                  <Form.Label>Smena</Form.Label>
                  <Form.Select name="shift" value={staffFormData.shift} onChange={handleStaffChange}>
                    <option value="Jutarnja">Jutarnja</option>
                    <option value="Popodnevna">Popodnevna</option>
                    <option value="Noćna">Noćna</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              {/* DODATO: Unos plate u formu za osoblje */}
              <Col md={4}>
                <Form.Group className="mb-4">
                  <Form.Label>Plata</Form.Label>
                  <Form.Control name="salary" placeholder="npr. 90000 rsd" value={staffFormData.salary} onChange={handleStaffChange} required />
                </Form.Group>
              </Col>
            </Row>
            <div className="d-flex justify-content-end gap-2 border-top pt-3"><Button variant="secondary" onClick={handleStaffClose}>Odustani</Button><Button variant="primary" type="submit" style={{ backgroundColor: '#1a7a68', border: 'none' }}>Potvrdi</Button></div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* --- MODAL 3: SCHEDULE FORM --- */}
      <Modal show={showScheduleModal} onHide={handleScheduleClose} centered size="lg">
        <Modal.Header closeButton className="bg-light">
          <Modal.Title style={{ color: '#125447' }}>Planiranje i dodela termina</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSaveSchedule}>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Izaberite pacijenta</Form.Label>
                  <Form.Select name="patientIndex" value={scheduleFormData.patientIndex} onChange={handleScheduleChange}>
                    {patients.filter(p => p.status === 'Aktivan').map((p, index) => (
                      <option key={p.id} value={index}>
                        {p.firstName} {p.lastName} ({p.familyName})
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Izaberite slobodno osoblje</Form.Label>
                  <Form.Select name="staffIndex" value={scheduleFormData.staffIndex} onChange={handleScheduleChange}>
                    {staff.filter(s => s.status === 'Aktivan').map((s, index) => (
                      <option key={s.id} value={index}>
                        {s.firstName} {s.lastName} - {s.role} ({s.shift} smena)
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Datum posete</Form.Label>
                  <Form.Control type="date" name="date" value={scheduleFormData.date} onChange={handleScheduleChange} required />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Vreme posete</Form.Label>
                  <Form.Control type="time" name="time" value={scheduleFormData.time} onChange={handleScheduleChange} required />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={5}>
                <Form.Group className="mb-4">
                  <Form.Label>Vrsta medicinske usluge</Form.Label>
                  <Form.Select name="service" value={scheduleFormData.service} onChange={handleScheduleChange}>
                    <option value="Davanje terapije (Infuzija)">Davanje terapije (Infuzija / Injekcija)</option>
                    <option value="Nega rane / Previjanje">Nega rane / Previjanje</option>
                    <option value="Gerontološka nega">Gerontološka nega (Pomoć u kući)</option>
                    <option value="Lekarski pregled">Lekarski pregled na terenu</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group className="mb-4">
                  <Form.Label>Lokacija pružanja usluge</Form.Label>
                  <Form.Select name="location" value={scheduleFormData.location} onChange={handleScheduleChange}>
                    <option value="Ambulanta BW">Ambulanta (Beograd na vodi)</option>
                    <option value="Kućna poseta">Kućna poseta (Adresa pacijenta)</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              
              {/* DODATO: Unos cene u formu za zakazivanje */}
              <Col md={3}>
                <Form.Group className="mb-4">
                  <Form.Label>Cena (Opciono)</Form.Label>
                  <Form.Control name="price" placeholder="npr. 6000 rsd" value={scheduleFormData.price} onChange={handleScheduleChange} />
                </Form.Group>
              </Col>
            </Row>

            <div className="d-flex justify-content-end gap-2 border-top pt-3">
              <Button variant="secondary" onClick={handleScheduleClose}>Odustani</Button>
              <Button variant="success" type="submit" style={{ backgroundColor: '#16a085', border: 'none' }}>
                Generiši raspored
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

    </Container>
  )
}

export default AdminPanel