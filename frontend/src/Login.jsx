// frontend/src/Login.jsx
import React, { useState } from 'react';
import './Login.css';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordErrors, setPasswordErrors] = useState([]);

  // Validar contraseña
  const validatePassword = (pwd) => {
    const errors = [];
    
    if (pwd.length < 8) {
      errors.push('Mínimo 8 caracteres');
    }
    if (pwd.length > 16) {
      errors.push('Máximo 16 caracteres');
    }
    if (!/[A-Z]/.test(pwd)) {
      errors.push('Al menos una mayúscula');
    }
    if (!/[a-z]/.test(pwd)) {
      errors.push('Al menos una minúscula');
    }
    if (!/[0-9]/.test(pwd)) {
      errors.push('Al menos un número');
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd)) {
      errors.push('Al menos un carácter especial (!@#$%^&* etc.)');
    }
    
    return errors;
  };

  const handlePasswordChange = (e) => {
    const pwd = e.target.value;
    setPassword(pwd);
    if (pwd) {
      setPasswordErrors(validatePassword(pwd));
    } else {
      setPasswordErrors([]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Verificar que la contraseña sea válida
    if (passwordErrors.length > 0) {
      alert('La contraseña no cumple con los requisitos');
      return;
    }
    
    if (username === 'admin' && password === 'Admin@1234') {
      onLogin(true);
    } else {
      alert('Credenciales incorrectas\nUsuario: admin\nContraseña: Admin@1234');
    }
  };

  const isPasswordValid = password && passwordErrors.length === 0;

  return (
    <div className="login-container">
      <h2 style={{ textAlign: 'center', marginBottom: '25px' }}>🔒 Acceso</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <input
          type="text"
          placeholder="Usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="input-field"
        />
        
        <div>
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={handlePasswordChange}
            required
            className="input-field"
          />
          
          {/* Mostrar requisitos de contraseña */}
          {password && (
            <div className="password-requirements">
              <p className="requirements-title">Requisitos de contraseña:</p>
              <ul className="requirements-list">
                <li className={/^.{8,16}$/.test(password) ? 'valid' : 'invalid'}>
                  ✓ Entre 8 y 16 caracteres
                </li>
                <li className={/[A-Z]/.test(password) ? 'valid' : 'invalid'}>
                  ✓ Al menos una mayúscula
                </li>
                <li className={/[a-z]/.test(password) ? 'valid' : 'invalid'}>
                  ✓ Al menos una minúscula
                </li>
                <li className={/[0-9]/.test(password) ? 'valid' : 'invalid'}>
                  ✓ Al menos un número
                </li>
                <li className={/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) ? 'valid' : 'invalid'}>
                  ✓ Al menos un carácter especial (!@#$%^&* etc.)
                </li>
              </ul>
            </div>
          )}
        </div>
        
        <button 
          type="submit" 
          className="btn-primary"
          disabled={!username || !isPasswordValid}
        >
          Entrar
        </button>
      </form>
    </div>
  );
}

export default Login;