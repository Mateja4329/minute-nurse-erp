import React from 'react'
// Container centers content, Row creates a row, and Col creates a column within a row.
import {Navbar, Container, Nav, Button, NavDropdown} from 'react-bootstrap'
// Import the 'Link' component. It is crucial for Single Page Applications!
import {useNavigate, Link} from 'react-router-dom'

import { useAuth } from '../context/AuthContext'

const Header = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate()

    async function handleLogout(e) {
        e.preventDefault()

        try {
            await logout()
            console.log("Logout successful")
            alert('Odjavili ste se.')

            navigate('/login')
        } catch (e) {
            console.error("Network error: ", e)
            alert("Došlo je do greške prilikom odjavljivanja. Molimo pokušajte ponovo.")
        }
    }

  return (
    <header>
        <Navbar bg='white' variant='light' expand='lg' collapseOnSelect className="shadow-sm py-3 border-bottom">
            <Container>
                {/* In plain HTML we use <a href="/">. 
              WE CAN'T DO THAT in React, because 'href' refreshes the whole page!
              So we use Bootstrap's Navbar.Brand, but tell it 'as={Link}' and 'to="/"'. 
              This means: "Behave like a visual Bootstrap element,
               but use React Router logic to not refresh the page". */}
                <Navbar.Brand as={Link} to='/' className="fw-bold fs-4" style={{ color: '#125447', letterSpacing: '-0.5px' }}>
                    <span style={{ color: '#16a085' }}>Minute</span>Nurse <span className="fw-light fs-6 text-muted ms-1">ERP</span>
                </Navbar.Brand>

                {/* This is the 'hamburger' icon that appears on the phone */}
                <Navbar.Toggle aria-controls='basic-navbar-nav' className="border-0 shadow-none" />
                {/* Everything inside the Collapse tag is hidden on small screens
                 until the hamburger is clicked */}
                <Navbar.Collapse id='basic-navbar-nav'>
                    {/* 'ms-auto' pushes links all the way to the right side of the screen */}
                    <Nav className='ms-auto align-items-center gap-2'>
                        <Nav.Link as={Link} to='/' className="fw-semibold px-3" style={{ color: '#2c3e50' }}>
                            Početna
                        </Nav.Link>
                        
                        { user ? (
                            <NavDropdown title={<span style={{ color: '#1a7a68' }}>Moj nalog</span>} 
                            id="basic-nav-dropdown" className="fw-bold px-2">
                                {/* Link for user profile */}
                                <NavDropdown.Item as={Link} to='/profile' className="fw-semibold text-dark">
                                    👤 Moj Profil
                                </NavDropdown.Item>

                                <NavDropdown.Divider/>

                                {/* Button for logout */}
                                <NavDropdown.Item onClick={handleLogout} className="text-danger fw-bold">
                                    🚪 Odjavi se
                                </NavDropdown.Item>
                            </NavDropdown>
                        ) : (
                            <>
                                <Nav.Link as={Link} to='/login' className="fw-semibold px-3" style={{ color: '#2c3e50' }}>
                                    Prijava
                                </Nav.Link>

                                <Nav.Link as={Link} to='/register' className="pe-0">
                                    <Button
                                      variant="primary"
                                      className="fw-bold px-4 rounded-pill shadow-sm"
                                      style={{ backgroundColor: '#1a7a68', border: 'none' }}
                                    >
                                        Registracija
                                    </Button>
                                </Nav.Link>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    </header>
  )
}

export default Header
