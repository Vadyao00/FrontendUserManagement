import { useState } from 'react'
import { Form, Button, Alert, Container, Card } from 'react-bootstrap'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    try {
      const role = 'Administrator'
      const response = await axios.post('https://localhost:7111/api/authentication', {
        name,
        email,
        password,
        role
      },{
        headers: {
          'Content-Type': 'application/json',
        },})
      if (response.status == 201) {
        setSuccess(true)
        setTimeout(() => navigate('/'), 2000)
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    }
  }

  return (
    <Container className="min-vh-100 d-flex align-items-center justify-content-center">
      <Card className="w-100 shadow" style={{ maxWidth: '500px' }}>
        <Card.Body className="p-4">
          <h2 className="text-center mb-4">Register</h2>
          
          {success && (
            <Alert variant="success" className="text-center">
              Registration successful! Redirecting...
            </Alert>
          )}
          
          {error && <Alert variant="danger">{error}</Alert>}
          
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                minLength={2}
                placeholder="John Doe"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="example@mail.com"
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100 mb-3">
              Create Account
            </Button>
            
            <div className="text-center">
              <span className="text-muted">Already have an account? </span>
              <a href="/" className="text-decoration-none">Login now</a>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  )
}