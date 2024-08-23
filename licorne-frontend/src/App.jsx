import './App.css'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import LoginPage from './components/loginPage';
import GamePage from './components/gamePage'
import RegisterPage from './components/registerPage';
import GameplayPage from './components/gameplayPage';
import AdminPage from './components/adminPage';

const ProtectedRoute = ({ children }) => {
  
  const token = localStorage.getItem('jwtToken');
  if (!token) {
    return <Navigate to="/login" />;
  }

  return children;
};


function App() {

  return (
    <Router>
      <Routes>
        <Route path='/' element={<GamePage/>}/>
        <Route path='/login' element={<LoginPage/>}/>
        <Route path='/register' element={<RegisterPage/>}/>
        <Route
          path='/gameplay'
          element={
            <ProtectedRoute>
              <GameplayPage />
            </ProtectedRoute>
          }
        />
        <Route
          path='/admin'
          element={
            <ProtectedRoute>
              <AdminPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  )
}

export default App
