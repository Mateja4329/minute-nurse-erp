import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Table, Button, Badge, Modal, Form, Spinner } from 'react-bootstrap'
import { useAuth } from '../../context/AuthContext'

const MedicalStaffPanel = () => {
    const { api } = useAuth()

    // fetch from my_calender endpoint to get the medical staff's schedule
    const [schedule, setSchedule] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    // --- REPORT MODAL STATES ---
    const [showReportModal, setShowReportModal] = useState(false)
    const [activeTask, setActiveTask] = useState(null)
    const [reportSummary, setReportSummary] = useState('')
    const [reportComment, setReportComment] = useState('')
    // will use the report comment once the backend is ready to accept it

    // READ: Fetch the medical staff's schedule from the backend when the component mounts
    useEffect(() => {
        const fetchMySchedule = async () => {
            try {
                const response = await api.get('/api/appointment/my_calendar')
                setSchedule(response.data)
            } catch (error) {
                console.error("Greška pri povlačenju rasporeda:", error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchMySchedule()
    }, [api])

    // --- REPORT GENERATION LOGIC ---
    const openReportModal = (task) => {
        setActiveTask(task)
        setReportSummary('')
        setReportComment('')
        setShowReportModal(true)
    }

    const handleSaveReport = (e) => {
        e.preventDefault()

        // This is only for the mock presentation.
        // In a real application, you would send the report data to the backend here.
        const updatedSchedule = schedule.map(task => 
            task.id === activeTask.id ? { ...task, schedule: 'Završeno' } : task
        )
        
        setSchedule(updatedSchedule)
        setShowReportModal(false)
        alert('Izveštaj o pruženoj usluzi je uspešno zaveden u sistem (Mock).')
    }

    // --- SHIFT COMPLETION LOGIC (Mock) ---
    const handleEndShift = () => {
        // Check if there are any unfinished tasks in the schedule
        const unfinishedTasks = schedule.filter(task => task.schedule !== 'Završeno' && task.schedule !== 'CANCELED')
        
        if (unfinishedTasks.length > 0) {
            alert(`Ne možete završiti smenu. Imate još nezavršenih obaveza (${unfinishedTasks.length}) u rasporedu.`)
        } else {
            if(window.confirm('Da li ste sigurni da želite da završite smenu i odjavite se sa sistema?')) {
                alert('Smena uspešno završena. Hvala na radu!')
                // In the future, you would finish the shift and logout
            }
        }
    }

    const getTaskBadgeColor = (status) => {
        if (status === 'Završeno') return 'success'
        if (status === 'SCHEDULED' || status === 'Zakazano') return 'primary'
        if (status === 'WAITING' || status === 'Na čekanju') return 'warning'
        return 'secondary'
    }

    return (
        <Container className="mt-4">
            <Row className="align-items-center mb-4">
                <Col>
                    <h2>Panel Terenskog Osoblja</h2>
                    <p className="text-muted">Pregled Vašeg rasporeda, unos izveštaja i rad sa pacijentima.</p>
                </Col>
                <Col className="text-end">
                    <Button variant="danger" size="lg" onClick={handleEndShift}>
                        Odjava i Završetak Smene
                    </Button>
                </Col>
            </Row>

            <Row>
                {/* --- Left column: Today's Shift Schedule --- */}
                <Col lg={8} className="mb-4">
                    <Card className="shadow-sm border-0 h-100">
                        <Card.Header className="bg-white border-bottom-0 pt-4 pb-0">
                            <h5 className="fw-bold text-primary">Vaš raspored terenskih poseta</h5>
                        </Card.Header>
                        <Card.Body>
                            {isLoading ? (
                                <div className="text-center py-4"><Spinner animation="border" variant="primary" /></div>
                            ) : (
                                <div style={{ overflowX: 'auto' }}>
                                    <Table hover className="mt-2 align-middle">
                                        <thead className="table-light">
                                            <tr>
                                                <th>Datum i vreme</th>
                                                <th>ID Zahteva (Ref)</th>
                                                <th>Status</th>
                                                <th className="text-end">Akcije</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {schedule.map((task) => (
                                                <tr key={task.id}>
                                                    <td>
                                                        <strong>{task.scheduled_date}</strong> <br/> 
                                                        <small className="text-muted">{task.scheduled_time}</small>
                                                    </td>
                                                    <td><small className="text-muted">{task.request_id}</small></td>
                                                    <td>
                                                        <Badge bg={getTaskBadgeColor(task.schedule)}>{task.schedule}</Badge>
                                                    </td>
                                                    <td className="text-end">
                                                        {task.schedule !== 'Završeno' ? (
                                                            <Button variant="outline-primary" size="sm" onClick={() => openReportModal(task)}>
                                                                + Unesi izveštaj
                                                            </Button>
                                                        ) : (
                                                            <Button variant="outline-success" size="sm" disabled>
                                                                ✓ Završeno
                                                            </Button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                            {schedule.length === 0 && (
                                                <tr>
                                                    <td colSpan="4" className="text-center text-muted py-4">Nemate zakazanih obaveza u bazi.</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </Table>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>

                {/* --- Right column: Information / Notifications --- */}
                <Col lg={4} className="mb-4">
                    <Card className="shadow-sm border-0 h-100 bg-light">
                        <Card.Header className="bg-light border-bottom-0 pt-4 pb-0">
                            <h5 className="fw-bold" style={{ color: '#125447' }}>Obaveštenja</h5>
                        </Card.Header>
                        <Card.Body>
                            <div className="mb-3 p-3 bg-white rounded shadow-sm border-start border-4 border-warning">
                                <span className="fw-bold text-dark">Nedostaje lokacija?</span>
                                <p className="mb-0 small text-muted mt-1">U trenutnoj verziji sistema (MVP), tačna lokacija posete se nalazi u originalnom zahtevu pacijenta. Kontaktirajte administratora za tačnu adresu.</p>
                            </div>
                            <div className="mb-3 p-3 bg-white rounded shadow-sm border-start border-4 border-info">
                                <span className="fw-bold text-dark">Procedura izveštavanja</span>
                                <p className="mb-0 small text-muted mt-1">Nakon svake intervencije obavezno popunite polje izveštaja kako biste zatvorili radni nalog i omogućili završetak smene.</p>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* --- REPORT ENTRY MODAL --- */}
            <Modal show={showReportModal} onHide={() => setShowReportModal(false)} size="lg" centered>
                <Modal.Header closeButton className="bg-light">
                    <Modal.Title style={{ color: '#125447' }}>Unos izveštaja o pruženoj nezi</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {activeTask && (
                        <div className="mb-4 p-3 bg-light rounded border">
                            <strong>Detalji termina:</strong> <br/>
                            ID Termina: {activeTask.id} <br/>
                            Vreme: {activeTask.scheduled_date} u {activeTask.scheduled_time}h
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
                                style={{ resize: 'none' }}
                                onChange={(e) => setReportSummary(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <div className="d-flex justify-content-end gap-2 border-top pt-3">
                            <Button variant="secondary" onClick={() => setShowReportModal(false)}>Odustani</Button>
                            <Button variant="success" type="submit">Zavedi izveštaj i zatvori termin</Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </Container>
    )
}

export default MedicalStaffPanel