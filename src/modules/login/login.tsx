
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { login } from '../../entities/user/user.reducer';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, errorMessage } = useSelector((state: any) => state.user);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Monitor user state for navigation
  useEffect(() => {
    if (user && user._id && !loading && !errorMessage) {
      navigate('/');
    }
  }, [user, loading, errorMessage, navigate]);

  const validateForm = () => {
    const errors: string[] = [];
    if (!email.trim()) {
      errors.push('Email is required');
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.push('Email must be a valid email');
    }
    if (!password) {
      errors.push('Password is required');
    } else if (password.length < 6) {
      errors.push('Password must be at least 6 characters');
    }
    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        // Dispatch Redux action (for state management)
        dispatch(login({ email, password }));
        
        // Also do manual login for immediate navigation
        const response = await axios.post('/api/users/login', { email, password });
        
        if (response.data.data && response.data.data._id) {
          navigate('/');
        }
      } catch (error) {
        console.error('Login error:', error);
      }
    }
  };

  return (
    <div className="min-vh-100 d-flex justify-content-center align-items-center px-3 py-4" style={{ background: 'linear-gradient(to bottom, #007bff, #e3f2fd)' }}>
      <div className="card shadow-lg border-0" style={{ width: '100%', maxWidth: '400px' }}>
        <div className="card-body p-4 p-md-5">
          <div className="text-center mb-4">
            {/* Logo centrado */}
            <div className="d-flex justify-content-center mb-3">
              <img 
                src="/synex.png" 
                alt="Logo" 
                className="img-fluid" 
                style={{ maxWidth: '120px', height: 'auto' }} 
              />
            </div>
            
            {/* Texto Bienvenido centrado */}
            <div className="d-flex justify-content-center mb-2">
              <h4 className="card-title text-primary mb-0" style={{ textAlign: 'center' }}>Bienvenido</h4>
            </div>
            
            {/* Texto Inicia sesión centrado */}
            <div className="d-flex justify-content-center">
              <p className="text-muted small mb-0" style={{ textAlign: 'center' }}>Inicia sesión en tu cuenta</p>
            </div>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label fw-medium">
                <i className="bi bi-envelope-fill me-2 text-primary"></i>
                Email
              </label>
              <input
                type="email"
                className="form-control form-control-lg"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ingresa tu email"
                required
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="password" className="form-label fw-medium">
                <i className="bi bi-lock-fill me-2 text-primary"></i>
                Contraseña
              </label>
              <input
                type="password"
                className="form-control form-control-lg"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresa tu contraseña"
                required
              />
            </div>
            
            {validationErrors.length > 0 && (
              <div className="alert alert-danger alert-dismissible fade show" role="alert">
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                <ul className="mb-0 ps-3">
                  {validationErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {errorMessage && (
              <div className="alert alert-danger alert-dismissible fade show" role="alert">
                <i className="bi bi-x-circle-fill me-2"></i>
                {errorMessage}
              </div>
            )}
            
            <div className="d-grid">
              <button 
                type="submit" 
                className="btn btn-primary btn-lg" 
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Iniciando sesión...
                  </>
                ) : (
                  <>
                    <i className="bi bi-box-arrow-in-right me-2"></i>
                    Iniciar Sesión
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
