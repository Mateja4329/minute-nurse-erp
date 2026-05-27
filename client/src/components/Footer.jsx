import React from 'react'
import {Container, Row, Col} from 'react-bootstrap'

const Footer = () => {
    // We write plain JavaScript code before the 'return' statement.
    const currentYear = new Date().getFullYear()
    
    return (
      <footer>
          <Container>
              <Row>
                {/* className='text-center py-3' are Bootstrap classes. 
              'text-center' centers the text, and 'py-3' adds vertical spacing (padding)
               above and below */}
                  <Col className='text-center py-3'>
                      <p>MinuteNurse &copy; {currentYear}</p>
                  </Col>
              </Row>
          </Container>
      </footer>
  )
}

export default Footer
