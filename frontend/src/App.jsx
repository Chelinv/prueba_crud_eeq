// frontend/src/App.jsx
import React, { useState } from 'react';
import Login from './Login';
import ClientesTable from './ClientesTable';
import './App.css' 

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9f9f9', display: 'flex', flexDirection: 'column', marginLeft: '350px' }}> 
      <h1 style={{ textAlign: 'center', color: '#333', padding: '20px 0', margin: 0 }}>
        Aplicativo CRUD - FastAPI & React
      </h1>
      
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
        {!isAuthenticated ? (
          <Login onLogin={setIsAuthenticated} /> 
        ) : (
          <ClientesTable /> 
        )}
      </div>
    </div>
  );
}

export default App;