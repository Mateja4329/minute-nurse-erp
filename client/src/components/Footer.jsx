import React from 'react'
import {Container, Row, Col} from 'react-bootstrap'

const Footer = () => {
    // We write plain JavaScript code before the 'return' statement.
    const currentYear = new Date().getFullYear()

    const footerStyle = {
        backgroundColor: 'rgba(32, 160, 138, 0.12)', 
        borderTop: '2px solid rgba(32, 160, 138, 0.3)', 
        color: '#2c3e50',
        padding: '40px 0 20px 0',
        marginTop: 'auto'
    }

    const linkStyle = {
        color: '#1a7a68',
        textDecoration: 'none',
        fontWeight: '600'
    }
    
    return (
      <footer style={footerStyle}>
          <Container>
              <Row className='justify-content-between text-md-start text-center'>
                {/* Column 1: Log & Copyright */}
                <Col md={4} sm={12} className="mb-4">
                  <h5 className="fw-bold" style={{ color: '#125447' }}>MinuteNurse ERP</h5>
                  <p className="text-muted small">
                    Integrisani sistem za koordinaciju medicinskih sestara i negu pacijenata u realnom vremenu.
                  </p>
                  <p className="small mb-0">
                    &copy; {currentYear} MinuteNurse. Sva prava zadržana.
                  </p>
                </Col>

                {/* Column 2: Official website */}
                <Col md={4} sm={12} className="mb-4 d-flex flex-column align-items-md-center">
                  <div>
                    <h5 className="fw-bold" style={{ color: '#125447' }}>Korisni Linkovi</h5>
                    <ul className="list-unstyled">
                      <li className="my-2">
                        {/* rel="noopener noreferrer" is a mandatory engineering standard
                         when a link is opened in a new window (target="_blank")
                          because it prevents security breaches (phishing attacks) */}
                        <a 
                          href="https://minutenurse.rs/" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          style={linkStyle}
                          className="footer-link"
                        >
                          🌐 Zvanični website
                        </a>
                      </li>
                      <li className="my-2">
                        {/* rel="noopener noreferrer" is a mandatory engineering standard
                         when a link is opened in a new window (target="_blank")
                          because it prevents security breaches (phishing attacks) */}
                        <a 
                          href="https://kucnanega.co/" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          style={linkStyle}
                          className="footer-link"
                        >
                          🏡 Kućna nega
                        </a>
                      </li>
                    </ul>
                  </div>
                </Col>

                {/* Comun 3: Contact info */}
                <Col md={4} sm={12} className="mb-4">
                  <h5 className="fw-bold" style={{ color: '#125447' }}>Hitni Kontakt</h5>
                  <p className="mb-1 small">
                    <strong>Dežurna Služba (Med. osoblje):</strong> <br />
                    <a href="tel:+381649949994" style={{ color: '#2c3e50', textDecoration: 'none' }}>
                      📞 +381 64 994 9994
                    </a>
                  </p>
                  <p className="small mb-0">
                    <strong>Tehnička Podrška (Admin):</strong> <br />
                    <a href="tel:+381638551101" style={{ color: '#2c3e50', textDecoration: 'none' }}>
                      ⚙️ +381 63 855 1101
                    </a>
                  </p>
                </Col>
              </Row>
          </Container>
      </footer>
  )
}

export default Footer
