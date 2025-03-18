import { useState } from 'react';
import { Form, Button, Alert, Container, Card } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'https://localhost:7111/api/authentication/login',
        {
          email: email,
          password: password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      localStorage.setItem('accessToken', response.data.accessToken);
      navigate('/users');
    } catch (err) {
      if (err.response) {
        console.log(err.response)
        if (err.response.status === 403) {
          setError('Your account is blocked');
        } else {
          setError('Invalid credentials');
        }
      } else {
        setError('An error occurred. Please try again later.');
      }
    }
  };

  return (
    <Container className="min-vh-100 d-flex align-items-center justify-content-center">
      <Card className="w-100 shadow" style={{ maxWidth: '500px' }}>
        <Card.Body className="p-4">
          <h2 className="text-center mb-4">Login</h2>
          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
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
              Sign In
            </Button>

            <div className="text-center">
              <span className="text-muted">Don't have an account? </span>
              <a href="/register" className="text-decoration-none">
                Register now
              </a>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}