import { Container, Navbar, Button } from 'react-bootstrap';
import { Outlet, useNavigate } from 'react-router-dom';

export default function Layout() {
  const navigate = useNavigate();
  const token = localStorage.getItem('accessToken');

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    navigate('/');
  };

  return (
    <>
      <Navbar bg="dark" variant="dark" className="mb-4">
        <Container>
          <Navbar.Brand>User Management</Navbar.Brand>
          {token && (
            <Button variant="danger" onClick={handleLogout}>
              Выход
            </Button>
          )}
        </Container>
      </Navbar>
      <Container>
        <Outlet />
      </Container>
    </>
  );
}