import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import Login from './pages/Login/Login.jsx'
import Registration from './pages/Signup/Registration.jsx'
import RegisterDetailsPage from './pages/Signup/RegisterDetailsPage.jsx'

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
