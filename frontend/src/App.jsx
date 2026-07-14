import React, { useState } from 'react';
import StructuredForm from './components/StructuredForm';
import ChatInterface from './components/ChatInterface';
import AuthScreen from './components/AuthScreen';
import HCPTable from './components/HCPTable';
import InteractionsTable from './components/InteractionsTable';
import InteractionTypesManager from './components/InteractionTypesManager';
import { useGetInteractionsQuery } from './store/apiSlice';
import { Activity, MessageSquare, ListPlus, Home, LogOut, Users, GitBranch, Tag } from 'lucide-react';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [role, setRole] = useState(localStorage.getItem('role') || 'user');
  const [activeView, setActiveView] = useState('log');
  const [activeTab, setActiveTab] = useState('chat');
  const { data: logs = [] } = useGetInteractionsQuery(undefined, { pollingInterval: 5000, skip: !token });

  if (!token) {
    return <AuthScreen onAuthSuccess={(t, r) => {
      setToken(t); localStorage.setItem('token', t);
      setRole(r); localStorage.setItem('role', r);
      setActiveView(r === 'admin' ? 'dashboard' : 'log');
    }} />;
  }

  const handleLogout = () => {
    setToken(null); localStorage.removeItem('token');
    setRole('user'); localStorage.removeItem('role');
  };

  const isAdmin = role === 'admin';

  const allNavItems = [
    { id: 'dashboard',         label: 'Dashboard',        icon: <Home size={20} />,     adminOnly: true },
    { id: 'hcps',              label: 'HCP Profiles',     icon: <Users size={20} />,    adminOnly: true },
    { id: 'interaction-types', label: 'Interaction Types',icon: <Tag size={20} />,      adminOnly: true },
    { id: 'interactions',      label: 'Interactions Log', icon: <GitBranch size={20} />,adminOnly: true },
    { id: 'log',               label: 'Log Interaction',  icon: <ListPlus size={20} />, adminOnly: false },
  ];

  const navItems = allNavItems.filter(item => isAdmin || !item.adminOnly);

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="logo">
          <Activity size={28} />
          LifeCRM AI
        </div>
        <div style={{ margin: '-8px 0 16px 0', textAlign: 'center' }}>
          <span style={{
            display: 'inline-block',
            padding: '3px 12px',
            borderRadius: '20px',
            fontSize: '11px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            background: isAdmin ? '#FEF3C7' : '#EFF6FF',
            color: isAdmin ? '#B45309' : '#2563EB',
            border: `1px solid ${isAdmin ? '#FCD34D' : '#BFDBFE'}`
          }}>
            {isAdmin ? '👑 Admin' : '👤 User'}
          </span>
        </div>
        
        {navItems.map(item => (
          <div
            key={item.id}
            className={`nav-item ${activeView === item.id ? 'active' : ''}`}
            onClick={() => setActiveView(item.id)}
          >
            {item.icon}
            {item.label}
          </div>
        ))}

        <div className="nav-item" onClick={handleLogout} style={{ color: '#EF4444' }}>
          <LogOut size={20} />
          Logout
        </div>
        
        <div style={{ marginTop: 'auto', borderTop: '1px solid #E2E8F0', paddingTop: '20px' }}>
          <h3 style={{ fontSize: '12px', color: '#64748B', textTransform: 'uppercase', marginBottom: '12px' }}>Recent Activity</h3>
          {logs.slice(0, 5).map(log => (
            <div key={log.id} style={{ marginBottom: '12px', fontSize: '13px' }}>
              <div style={{ fontWeight: 600 }}>Interaction #{log.id}</div>
              <div style={{ color: '#64748B' }}>{new Date(log.date).toLocaleDateString()} - {log.product_discussed || log.interaction_type}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {activeView === 'dashboard' && (
          <div>
            <div className="header">
              <h1>Dashboard Overview</h1>
              <p>Welcome to LifeCRM AI. Here is a quick summary of your activities.</p>
            </div>
            <div className="card">
              <h2 style={{ fontSize: '24px', fontWeight: 600, color: '#0F52BA' }}>Total Interactions: {logs.length}</h2>
              <p style={{ marginTop: '12px', color: '#64748B' }}>Select a section from the sidebar to get started.</p>
            </div>
          </div>
        )}

        {activeView === 'hcps' && <HCPTable />}
        {activeView === 'interaction-types' && <InteractionTypesManager />}
        {activeView === 'interactions' && <InteractionsTable />}

        {activeView === 'log' && (
          <>
            <div className="header">
              <h1>HCP Interactions</h1>
              <p>Quickly log and manage interactions with healthcare professionals.</p>
            </div>

            <div className="tabs">
              <div
                className={`tab ${activeTab === 'chat' ? 'active' : ''}`}
                onClick={() => setActiveTab('chat')}
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <MessageSquare size={18} />
                AI Assistant
              </div>
              <div
                className={`tab ${activeTab === 'form' ? 'active' : ''}`}
                onClick={() => setActiveTab('form')}
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <ListPlus size={18} />
                Structured Form
              </div>
            </div>

            {activeTab === 'chat' ? <ChatInterface /> : <StructuredForm />}
          </>
        )}
      </div>
    </div>
  );
}

export default App;

