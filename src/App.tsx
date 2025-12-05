// App.tsx

import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './components/LoginPage';
import { Dashboard } from './components/Dashboard';


export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');

  const handleLogin = (name: string) => {
    // Atualiza o nome do usuário e seta a autenticação para true
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
        
        {/* Rota para o Login (Redireciona para o Dashboard se estiver autenticado) */}
        <Route 
          path="/" 
          element={
            isAuthenticated ? 
              <Navigate to="/dashboard" replace /> : 
              // Passa a função handleLogin como prop 'onLogin'
              <LoginPage onLogin={handleLogin} /> 
          } 
        />
        
        {/* Rota Protegida para o Dashboard (Redireciona para o Login se não estiver autenticado) */}
        <Route 
          path="/dashboard" 
          element={
            isAuthenticated ? 
              // Passa o userName e a função de logout para o Dashboard
              <Dashboard userName={userName} onLogout={handleLogout} /> : 
              <Navigate to="/" replace />
          } 
        />
        
        <Route path="*" element={<h1>404 - Página Não Encontrada</h1>} />

      </Routes>
    </BrowserRouter>
  );
}