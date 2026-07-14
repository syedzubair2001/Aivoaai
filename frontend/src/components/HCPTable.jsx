import React, { useState } from 'react';
import { useGetHCPsQuery, useCreateHCPMutation, useUpdateHCPMutation, useDeleteHCPMutation } from '../store/apiSlice';
import { Pencil, Trash2, Plus, X, Check } from 'lucide-react';

const EMPTY_HCP = { name: '', specialty: '', clinic_name: '', location: '', email: '' };

export default function HCPTable() {
  const { data: hcps = [], isLoading } = useGetHCPsQuery();
  const [createHCP] = useCreateHCPMutation();
  const [updateHCP] = useUpdateHCPMutation();
  const [deleteHCP] = useDeleteHCPMutation();

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [newHCP, setNewHCP] = useState(EMPTY_HCP);

  const handleEdit = (hcp) => { setEditingId(hcp.id); setEditForm({ ...hcp }); };
  const handleCancelEdit = () => setEditingId(null);

  const handleSaveEdit = async () => {
    await updateHCP({ id: editingId, ...editForm });
    setEditingId(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this HCP?')) await deleteHCP(id);
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    await createHCP(newHCP);
    setNewHCP(EMPTY_HCP);
    setShowAddForm(false);
  };

  if (isLoading) return <div style={{ padding: '40px', color: '#64748B' }}>Loading...</div>;

  return (
    <div>
      <div className="header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1>Healthcare Professionals</h1>
          <p>Manage all registered HCPs in the system.</p>
        </div>
        <button
          className="btn"
          onClick={() => setShowAddForm(!showAddForm)}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: '160px' }}
        >
          {showAddForm ? <X size={16} /> : <Plus size={16} />}
          {showAddForm ? 'Cancel' : 'Add New HCP'}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAddSubmit} className="card" style={{ marginBottom: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <h3 style={{ gridColumn: '1/-1', margin: 0, fontSize: '16px', fontWeight: 600 }}>Add New Healthcare Professional</h3>
          {Object.entries(EMPTY_HCP).map(([key]) => (
            <div key={key} className="form-group" style={{ margin: 0 }}>
              <label style={{ textTransform: 'capitalize' }}>{key.replace('_', ' ')}</label>
              <input
                className="form-control"
                value={newHCP[key]}
                onChange={(e) => setNewHCP({ ...newHCP, [key]: e.target.value })}
                placeholder={key.replace('_', ' ')}
                required={key !== 'email'}
              />
            </div>
          ))}
          <div style={{ gridColumn: '1/-1' }}>
            <button type="submit" className="btn">Save HCP</button>
          </div>
        </form>
      )}

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
          <thead>
            <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '2px solid #E2E8F0' }}>
              {['ID', 'Name', 'Specialty', 'Clinic', 'Location', 'Email', 'Actions'].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#475569', fontSize: '12px', textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {hcps.map((hcp, idx) => (
              <tr key={hcp.id} style={{ borderBottom: '1px solid #E2E8F0', backgroundColor: idx % 2 === 0 ? '#fff' : '#F8FAFC' }}>
                {editingId === hcp.id ? (
                  <>
                    <td style={{ padding: '8px 16px' }}>#{hcp.id}</td>
                    {['name', 'specialty', 'clinic_name', 'location', 'email'].map(field => (
                      <td key={field} style={{ padding: '6px 8px' }}>
                        <input
                          className="form-control"
                          style={{ padding: '6px 10px', fontSize: '13px' }}
                          value={editForm[field] || ''}
                          onChange={(e) => setEditForm({ ...editForm, [field]: e.target.value })}
                        />
                      </td>
                    ))}
                    <td style={{ padding: '8px 16px' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={handleSaveEdit} style={{ background: '#10B981', color: '#fff', border: 'none', borderRadius: '6px', padding: '6px 10px', cursor: 'pointer' }}><Check size={14} /></button>
                        <button onClick={handleCancelEdit} style={{ background: '#EF4444', color: '#fff', border: 'none', borderRadius: '6px', padding: '6px 10px', cursor: 'pointer' }}><X size={14} /></button>
                      </div>
                    </td>
                  </>
                ) : (
                  <>
                    <td style={{ padding: '12px 16px', color: '#94A3B8', fontWeight: 500 }}>#{hcp.id}</td>
                    <td style={{ padding: '12px 16px', fontWeight: 600 }}>{hcp.name}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ background: '#EFF6FF', color: '#2563EB', padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 500 }}>{hcp.specialty}</span>
                    </td>
                    <td style={{ padding: '12px 16px', color: '#475569' }}>{hcp.clinic_name}</td>
                    <td style={{ padding: '12px 16px', color: '#475569' }}>{hcp.location}</td>
                    <td style={{ padding: '12px 16px', color: '#64748B' }}>{hcp.email || '—'}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => handleEdit(hcp)} style={{ background: '#EFF6FF', color: '#2563EB', border: 'none', borderRadius: '6px', padding: '6px 10px', cursor: 'pointer' }}><Pencil size={14} /></button>
                        <button onClick={() => handleDelete(hcp.id)} style={{ background: '#FEF2F2', color: '#EF4444', border: 'none', borderRadius: '6px', padding: '6px 10px', cursor: 'pointer' }}><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        {hcps.length === 0 && (
          <div style={{ padding: '40px', textAlign: 'center', color: '#94A3B8' }}>No HCPs found. Add one above!</div>
        )}
      </div>
    </div>
  );
}
