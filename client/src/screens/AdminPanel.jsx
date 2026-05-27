import React from 'react'
import {Container, Table, Button, Row, Col} from 'react-bootstrap'

const AdminPanel = () => {

  // we create mock data for the administrator panel, 
  // which will be replaced with real data from the server in the future
  const [users, setUsers] = React.useState([
    { id: 1, name: 'Marko Marković', role: 'Patient', email: 'marko@gmail.com'},
    { id: 2, name: 'Jelena Jovanović', role: 'Medical staff', email: 'jelena@gmail.com'}
  ])

    // function for DELETE demonstration
  const deleteUser = (id) => {
    // The filter function creates a new array that contains no users with the passed ID,
    // which simulates the deletion on the frontend and refreshes the screen.
    if (window.confirm('Are you sure you want to delete this user?')) {
      const newArray = users.filter(user => user.id !== id)
      setUsers(newArray)
    }
  }

  return (
    <Container className='mt-4'>
      <Row className='align-items-center mb-3'>
        <Col>
          <h2>Dobrodošli, administrator!</h2>
          <p>Upravljanje korisnicima sistema (CRUD operacije)</p>
        </Col>
        <Col className='text-end'>
          {/* Button for adding a new user.
           In the future, this will open a form to input new user details. */}
          <Button variant='primary'>
            + Dodaj novog korisnika
          </Button>
        </Col>
      </Row>

      {/* Table to display users. 
          striped: adds zebra-striping to rows, 
          bordered: adds borders to all cells, 
          hover: highlights row on hover, 
          responsive: makes the table scroll horizontally on small screens */}
      <Table striped bordered hover responsive className='mt-3'>
            <thead>
              <tr>
                <th>ID</th>
                <th>Ime i prezime</th>
                <th>Email</th>
                <th>Uloga</th>
                <th>Radnje</th>
              </tr>
            </thead>
            <tbody>
              {/* map() loops through our array of 'users' and creates one <tr> (row)
               in the table for each one */}
               {users.map(user => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    {/* Update operation */}
                    <Button variant="outline-dark" size="sm" className='me-2'>
                      Edit
                    </Button>
                    {/* Delete operation */}
                    <Button variant="outline-danger" size="sm" onClick={() => deleteUser(user.id)}>
                      Delete
                    </Button>
                  </td>
                </tr>
               ))}
            </tbody>
      </Table>
    </Container>
  )
}

export default AdminPanel
