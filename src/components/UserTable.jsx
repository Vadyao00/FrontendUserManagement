import { useState, useEffect } from 'react';
import { Table, Button, ButtonGroup, Form } from 'react-bootstrap';
import { FaUnlock, FaTrash } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function UsersTable() {
  const [orderBy, setOrderBy] = useState('Email');
  const [users, setUsers] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const token = localStorage.getItem('accessToken');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('https://localhost:7111/api/users', {
          params: { OrderBy: orderBy },
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(response.data);
      } catch (err) {
        if (err.response && err.response.status === 401) {
          localStorage.removeItem('accessToken');
          navigate('/register');
        } else {
          console.error(err);
        }
      }
    };
    fetchUsers();
  }, [token, navigate, orderBy]);

  const handleSort = (field) => {
    setOrderBy((prevOrderBy) => {
      if (prevOrderBy === `${field} desc`) {
        return `${field} asc`;
      } else {
        return `${field} desc`;
      }
    });
  };

  const parseJwt = (ttoken) => {
    const base64Url = ttoken.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(users.map(user => user.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectSingle = (userId) => {
    setSelectedIds(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId) 
        : [...prev, userId]
    );
  };

  const handleAction = async (action) => {
    try {
      const selectedUsers = users.filter(user => selectedIds.includes(user.id));
      const payload = parseJwt(token);
      const currentUserEmail = payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"] || 'User';
  
      const otherUsers = selectedUsers.filter(user => user.email !== currentUserEmail);
      const currentUser = selectedUsers.find(user => user.email === currentUserEmail);
  
      for (const user of otherUsers) {
        if (action === 'delete') {
          await axios.delete(`https://localhost:7111/api/users/${user.email}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
        } else {
          await axios.post(`https://localhost:7111/api/users/${action}/${user.email}`, {}, {
            headers: { Authorization: `Bearer ${token}` }
          });
        }
      }
  
      if (currentUser) {
        if (action === 'delete') {
          await axios.delete(`https://localhost:7111/api/users/${currentUser.email}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          localStorage.removeItem('accessToken');
          navigate('/register');
          return;
        } else if (action === 'block') {
          await axios.post(`https://localhost:7111/api/users/block/${currentUser.email}`, {}, {
            headers: { Authorization: `Bearer ${token}` }
          });
          localStorage.removeItem('accessToken');
          navigate('/register');
          return;
        }
      }
  
      const response = await axios.get('https://localhost:7111/api/users', {
        params: { OrderBy: orderBy },
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data);
  
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('accessToken');
        navigate('/register');
      } else {
        console.error(err);
      }
    }
  };

  return (
    <div>
      <div className="d-flex gap-2 mb-3">
        <Button variant="danger" onClick={() => handleAction('block')}>
          Block
        </Button>
        <Button variant="success" onClick={() => handleAction('unblock')}>
          <FaUnlock />
        </Button>
        <Button variant="secondary" onClick={() => handleAction('delete')}>
          <FaTrash />
        </Button>
      </div>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>
              <Form.Check 
                type="checkbox" 
                checked={selectedIds.length === users.length}
                onChange={handleSelectAll}
              />
            </th>
            <th>Name</th>
            <th>
              <Button variant="info" onClick={() => handleSort('Email')}>
                Email
              </Button>
            </th>
            <th>Registration Date</th>
            <th>Last Login</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>
                <Form.Check 
                  type="checkbox"
                  checked={selectedIds.includes(user.id)}
                  onChange={() => handleSelectSingle(user.id)}
                />
              </td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{new Date(user.registrationTime).toLocaleDateString()}</td>
              <td>{new Date(user.lastLogin).toLocaleString()}</td>
              <td>{user.status}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}