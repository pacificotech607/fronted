
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
    <div className="vh-100 d-flex justify-content-center align-items-center" style={{ background: 'linear-gradient(to bottom, #007bff, #e3f2fd)' }}>
      <div className="card p-4 shadow text-center">
        <img src="/synex.png" alt="Logo" className="mb-4" style={{ width: '150px', marginLeft: '25px' }} />
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {validationErrors.length > 0 && (
            <div className="alert alert-danger">
              <ul className="mb-0">
                {validationErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}
          {errorMessage && (
            <div className="alert alert-danger">{errorMessage}</div>
          )}
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
