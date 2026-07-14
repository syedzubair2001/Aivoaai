import React, { useState } from 'react';
import {
  useGetInteractionTypesQuery,
  useCreateInteractionTypeMutation,
  useUpdateInteractionTypeMutation,
  useDeleteInteractionTypeMutation
} from '../store/apiSlice';
import { Pencil, Trash2, Plus, X, Check } from 'lucide-react';

const TYPE_COLORS = ['#2563EB', '#059669', '#D97706', '#9333EA', '#EF4444', '#0891B2'];

export default function InteractionTypesManager() {
  const { data: types = [], isLoading } = useGetInteractionTypesQuery();
  const [createType] = useCreateInteractionTypeMutation();
  const [updateType] = useUpdateInteractionTypeMutation();
  const [deleteType] = useDeleteInteractionTypeMutation();

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [showAdd, setShowAdd] = useState(false);
  const [newForm, setNewForm] = useState({ name: '', description: '' });
  const [errorMsg, setErrorMsg] = useState('');

  const handleEdit = (t) => { setEditingId(t.id); setEditForm({ name: t.name, description: t.description || '' }); };
  const handleCancel = () => setEditingId(null);

  const handleSave = async () => {
    try {
      await updateType({ id: editingId, ...editForm }).unwrap();
      setEditingId(null);
    } catch (e) {
      alert(e?.data?.detail || 'Update failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this interaction type?')) await deleteType(id);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      await createType(newForm).unwrap();
      setNewForm({ name: '', description: '' });
      setShowAdd(false);
    } catch (e) {
      setErrorMsg(e?.data?.detail || 'Already exists or error occurred');
    }
  };

  if (isLoading) return <div style={{ padding: '40px', color: '#64748B' }}>Loading...</div>;

  return (
    <div>
      <div className="header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1>Interaction Types</h1>
          <p>Manage the types of interactions used across the CRM. The Structured Form dropdown loads from this table.</p>
        </div>
        <button
          className="btn"
          onClick={() => { setShowAdd(!showAdd); setErrorMsg(''); }}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: '160px' }}
        >
          {showAdd ? <X size={16} /> : <Plus size={16} />}
          {showAdd ? 'Cancel' : 'Add New Type'}
        </button>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '24px' }}>
        {types.map((t, i) => (
          <div key={t.id} className="card" style={{ flex: '1 0 160px', borderTop: `3px solid ${TYPE_COLORS[i % TYPE_COLORS.length]}`, padding: '16px', textAlign: 'center', minWidth: '140px' }}>
            <div style={{ fontWeight: 700, fontSize: '16px', color: TYPE_COLORS[i % TYPE_COLORS.length] }}>{t.name}</div>
            <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '4px' }}>{t.description || 'No description'}</div>
          </div>
        ))}
      </div>

      {/* Add Form */}
      {showAdd && (
        <form onSubmit={handleAdd} className="card" style={{ marginBottom: '24px' }}>
          <h3 style={{ marginBottom: '16px', fontSize: '16px', fontWeight: 600 }}>Add New Interaction Type</h3>
          {errorMsg && (
            <div style={{ background: '#FEE2E2', color: '#B91C1C', padding: '10px 14px', borderRadius: '6px', marginBottom: '14px', fontSize: '14px' }}>
              {errorMsg}
            </div>
          )}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr auto', gap: '12px', alignItems: 'flex-end' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label>Type Name *</label>
              <input
                className="form-control"
                required
                placeholder="e.g. Conference"
                value={newForm.name}
                onChange={(e) => setNewForm({ ...newForm, name: e.target.value })}
              />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label>Description</label>
              <input
                className="form-control"
                placeholder="Short description of this type"
                value={newForm.description}
                onChange={(e) => setNewForm({ ...newForm, description: e.target.value })}
              />
            </div>
            <button type="submit" className="btn" style={{ height: '42px' }}>Add Type</button>
          </div>
        </form>
      )}

      {/* Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
          <thead>
            <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '2px solid #E2E8F0' }}>
              {['ID', 'Type Name', 'Description', 'Actions'].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#475569', fontSize: '12px', textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {types.map((t, idx) => {
              const color = TYPE_COLORS[idx % TYPE_COLORS.length];
              return (
                <tr key={t.id} style={{ borderBottom: '1px solid #E2E8F0', backgroundColor: idx % 2 === 0 ? '#fff' : '#F8FAFC' }}>
                  {editingId === t.id ? (
                    <>
                      <td style={{ padding: '8px 16px', color: '#94A3B8' }}>#{t.id}</td>
                      <td style={{ padding: '6px 12px' }}>
                        <input
                          className="form-control"
                          style={{ padding: '6px 10px', fontSize: '13px' }}
                          value={editForm.name}
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        />
                      </td>
                      <td style={{ padding: '6px 12px' }}>
                        <input
                          className="form-control"
                          style={{ padding: '6px 10px', fontSize: '13px' }}
                          value={editForm.description}
                          onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                        />
                      </td>
                      <td style={{ padding: '8px 16px' }}>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button onClick={handleSave} style={{ background: '#10B981', color: '#fff', border: 'none', borderRadius: '6px', padding: '6px 10px', cursor: 'pointer' }}><Check size={14} /></button>
                          <button onClick={handleCancel} style={{ background: '#6B7280', color: '#fff', border: 'none', borderRadius: '6px', padding: '6px 10px', cursor: 'pointer' }}><X size={14} /></button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td style={{ padding: '14px 16px', color: '#94A3B8', fontWeight: 500 }}>#{t.id}</td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{ background: color + '1A', color, padding: '4px 12px', borderRadius: '20px', fontWeight: 600, fontSize: '13px' }}>{t.name}</span>
                      </td>
                      <td style={{ padding: '14px 16px', color: '#64748B' }}>{t.description || <em style={{ color: '#CBD5E1' }}>No description</em>}</td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button onClick={() => handleEdit(t)} style={{ background: '#EFF6FF', color: '#2563EB', border: 'none', borderRadius: '6px', padding: '6px 10px', cursor: 'pointer' }}><Pencil size={14} /></button>
                          <button onClick={() => handleDelete(t.id)} style={{ background: '#FEF2F2', color: '#EF4444', border: 'none', borderRadius: '6px', padding: '6px 10px', cursor: 'pointer' }}><Trash2 size={14} /></button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
        {types.length === 0 && (
          <div style={{ padding: '40px', textAlign: 'center', color: '#94A3B8' }}>No interaction types yet. Add one above!</div>
        )}
      </div>
    </div>
  );
}
