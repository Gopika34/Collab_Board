import { useState } from 'react'
import reactLogo from './assets/react.svg'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate 
} from "react-router-dom";
import './App.css'
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Dashboard from './pages/Dashboard';
import {ProtectedRoutes} from './routes/ProtectedRoutes'
import BoardPage from './pages/BoardPage';
import {BoardProvider } from "./context/BoardContext";

function App() {
  
  return (
    <Router>
      <Routes>
        <Route path='/login' element={<LoginPage/>}/>
        <Route path='/signup' element={<SignupPage/>}/>
        <Route path='/' element={<Navigate to="/dashboard" />}/>
        <Route path='/dashboard' element={
          <ProtectedRoutes>
            <Dashboard/>
          </ProtectedRoutes>
        }/>
        <Route path='/board/:id' element={  
          <ProtectedRoutes>
            <BoardProvider>
              <BoardPage/>
            </BoardProvider>
          </ProtectedRoutes>}/>
      </Routes>
    </Router>
  )
}

export default App
