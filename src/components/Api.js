import axios from 'axios';

const API_BASE_URL = 'http://usermanagementtask4.runasp.net/api';

export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/authentication/login`, {
      email,
      password,
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (err) {
    throw err;
  }
};

export const register = async (name, email, password, role = 'Administrator') => {
  try {
    const response = await axios.post(`${API_BASE_URL}/authentication`, {
      name,
      email,
      password,
      role,
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (err) {
    throw err;
  }
};

export const fetchUsers = async (token, orderBy) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users`, {
      params: { OrderBy: orderBy },
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (err) {
    throw err;
  }
};

export const deleteUser = async (token, email) => {
  try {
    await axios.delete(`${API_BASE_URL}/users/${email}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (err) {
    throw err;
  }
};

export const blockUser = async (token, email) => {
  try {
    await axios.post(`${API_BASE_URL}/users/block/${email}`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (err) {
    throw err;
  }
};

export const unblockUser = async (token, email) => {
  try {
    await axios.post(`${API_BASE_URL}/users/unblock/${email}`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (err) {
    throw err;
  }
};