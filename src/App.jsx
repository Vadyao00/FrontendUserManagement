import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Login from './components/Login'
import Register from './components/Register'
import UsersTable from './components/UserTable'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="users" element={<UsersTable />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App