import React from 'react'
// Container centers content, Row creates a row, and Col creates a column within a row.
import {Navbar, Container, Nav} from 'react-bootstrap'
// Import the 'Link' component. It is crucial for Single Page Applications!
import {Link} from 'react-router-dom'

const Header = () => {
  return (
    <header>
        <Navbar bg='dark' variant='dark' expand='lg' collapseOnSelect>
            <Container>
                {/* In plain HTML we use <a href="/">. 
              WE CAN'T DO THAT in React, because 'href' refreshes the whole page!
              So we use Bootstrap's Navbar.Brand, but tell it 'as={Link}' and 'to="/"'. 
              This means: "Behave like a visual Bootstrap element,
               but use React Router logic to not refresh the page". */}
                <Navbar.Brand as={Link} to='/'>
                    MinuteNurse
                </Navbar.Brand>

                {/* This is the 'hamburger' icon that appears on the phone */}
                <Navbar.Toggle aria-controls='basic-navbar-nav' />
                {/* Everything inside the Collapse tag is hidden on small screens
                 until the hamburger is clicked */}
                <Navbar.Collapse id='basic-navbar-nav'>
                    {/* 'ms-auto' pushes links all the way to the right side of the screen */}
                    <Nav className='ms-auto'>
                        <Nav.Link as={Link} to='/'>
                            Home
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    </header>
  )
}

export default Header
