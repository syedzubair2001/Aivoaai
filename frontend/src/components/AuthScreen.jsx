import React, { useState } from 'react';
import { useSignupMutation, useLoginMutation } from '../store/apiSlice';
import { Activity } from 'lucide-react';

const AuthScreen = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [errorMSG, setErrorMSG] = useState('');
  
  const [login] = useLoginMutation();
  const [signup] = useSignupMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMSG('');
    try {
      let result;
      if (isLogin) {
        result = await login({ email, password }).unwrap();
      } else {
        result = await signup({ email, password, role }).unwrap();
      }
      if (result.access_token) {
        onAuthSuccess(result.access_token, result.role || 'user');
      }
    } catch (err) {
      setErrorMSG(err?.data?.detail || "An error occurred");
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8F9FA' }}>
      <div style={{ width: '400px', backgroundColor: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px', color: '#0F52BA' }}>
          <Activity size={48} />
        </div>
        <h2 style={{ textAlign: 'center', marginBottom: '8px', fontSize: '24px', fontWeight: 600 }}>
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>
        <p style={{ textAlign: 'center', color: '#64748B', marginBottom: '32px', fontSize: '14px' }}>
          LifeCRM AI for Healthcare Professionals
        </p>

        {errorMSG && (
          <div style={{ backgroundColor: '#FEE2E2', color: '#B91C1C', padding: '12px', borderRadius: '6px', marginBottom: '20px', fontSize: '14px', textAlign: 'center' }}>
            {errorMSG}
          </div>
        )}

        {isLogin && (
          <div style={{ backgroundColor: '#EFF6FF', border: '1px solid #BFDBFE', color: '#1E40AF', padding: '10px 14px', borderRadius: '6px', marginBottom: '20px', fontSize: '13px' }}>
            <strong>Admin Login:</strong> admin@lifecrm.com / admin123<br/>
            <strong>User Login:</strong> Create any new account via Sign Up
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500, color: '#334155' }}>Email Address</label>
            <input 
              type="email" 
              required 
              style={{ width: '100%', padding: '12px', border: '1px solid #E2E8F0', borderRadius: '6px', outline: 'none' }} 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="doctor@example.com"
            />
          </div>
          <div style={{ marginBottom: isLogin ? '32px' : '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500, color: '#334155' }}>Password</label>
            <input 
              type="password" 
              required 
              style={{ width: '100%', padding: '12px', border: '1px solid #E2E8F0', borderRadius: '6px', outline: 'none' }} 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          {!isLogin && (
            <div style={{ marginBottom: '32px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500, color: '#334155' }}>Role</label>
              <select 
                style={{ width: '100%', padding: '12px', border: '1px solid #E2E8F0', borderRadius: '6px', outline: 'none', backgroundColor: 'white' }}
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          )}

          <button 
            type="submit" 
            style={{ width: '100%', padding: '14px', backgroundColor: '#0F52BA', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer', fontSize: '15px' }}
          >
            {isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: '#64748B' }}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span 
            onClick={() => setIsLogin(!isLogin)} 
            style={{ color: '#0F52BA', fontWeight: 500, cursor: 'pointer' }}
          >
            {isLogin ? 'Sign up' : 'Sign in'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;
