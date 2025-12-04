import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './components/LoginPage';
import { Dashboard } from './components/Dashboard';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');

  const handleLogin = (name: string) => {
    setUserName(name);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserName('');
  };

  return (
    <BrowserRouter>
      <Routes>
        
        {/* 2. Rota para o Login */}
        <Route 
          path="/" 
          element={
            isAuthenticated ? 
              <Navigate to="/dashboard" replace /> : 
              <LoginPage onLogin={handleLogin} />
          } 
        />
        
        {/* 3. Rota Protegida para o Dashboard */}
        <Route 
          path="/dashboard" 
          element={
            isAuthenticated ? 
              <Dashboard userName={userName} onLogout={handleLogout} /> : 
              <Navigate to="/" replace />
          } 
        />
        
        <Route path="*" element={<h1>404 - Página Não Encontrada</h1>} />

      </Routes>
    </BrowserRouter>
  );
}