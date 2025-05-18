import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import Login from './components/user-auth/Login.jsx'
import Registration from './components/user-auth/Registration.jsx'
import RegisterDetailsPage from './components/user-auth/RegisterDetailsPage.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/register/details" element={<RegisterDetailsPage />} />
        <Route path="/home/*" element={<App />} />
        <Route path="*" element={<Login />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
