import React, { useState } from 'react';
import { useGetInteractionsQuery, useUpdateInteractionMutation, useDeleteInteractionMutation } from '../store/apiSlice';
import { Pencil, Trash2, X, Check } from 'lucide-react';

const TYPE_COLORS = {
  'In-Person': { bg: '#ECFDF5', color: '#059669' },
  'Virtual':   { bg: '#EFF6FF', color: '#2563EB' },
  'Email':     { bg: '#FFF7ED', color: '#D97706' },
  'Phone Call':{ bg: '#FDF4FF', color: '#9333EA' },
};

export default function InteractionsTable() {
  const { data: interactions = [], isLoading } = useGetInteractionsQuery(undefined, { pollingInterval: 5000 });
  const [updateInteraction] = useUpdateInteractionMutation();
  const [deleteInteraction] = useDeleteInteractionMutation();

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const handleEdit = (item) => { setEditingId(item.id); setEditForm({ ...item }); };
  const handleCancel = () => setEditingId(null);

  const handleSave = async () => {
    await updateInteraction({ id: editingId, interaction_type: editForm.interaction_type, duration_minutes: editForm.duration_minutes, product_discussed: editForm.product_discussed, notes: editForm.notes });
    setEditingId(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this interaction?')) await deleteInteraction(id);
  };

  const typeStyle = (type) => TYPE_COLORS[type] || { bg: '#F1F5F9', color: '#475569' };

  if (isLoading) return <div style={{ padding: '40px', color: '#64748B' }}>Loading...</div>;

  return (
    <div>
      <div className="header">
        <h1>Interaction Types</h1>
        <p>View and manage all logged HCP interaction records.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {['In-Person', 'Virtual', 'Email', 'Phone Call'].map(type => {
          const count = interactions.filter(i => i.interaction_type === type).length;
          const style = typeStyle(type);
          return (
            <div key={type} className="card" style={{ textAlign: 'center', padding: '20px', borderTop: `3px solid ${style.color}` }}>
              <div style={{ fontSize: '28px', fontWeight: 700, color: style.color }}>{count}</div>
              <div style={{ fontSize: '13px', color: '#64748B', marginTop: '4px' }}>{type}</div>
            </div>
          );
        })}
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
          <thead>
            <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '2px solid #E2E8F0' }}>
              {['ID', 'HCP ID', 'Date', 'Type', 'Duration', 'Product', 'Notes', 'Actions'].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#475569', fontSize: '12px', textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {interactions.map((item, idx) => {
              const ts = typeStyle(item.interaction_type);
              return (
                <tr key={item.id} style={{ borderBottom: '1px solid #E2E8F0', backgroundColor: idx % 2 === 0 ? '#fff' : '#F8FAFC' }}>
                  {editingId === item.id ? (
                    <>
                      <td style={{ padding: '8px 16px', color: '#94A3B8' }}>#{item.id}</td>
                      <td style={{ padding: '8px 16px', color: '#64748B' }}>{item.hcp_id}</td>
                      <td style={{ padding: '8px 16px', color: '#64748B', fontSize: '12px' }}>{new Date(item.date).toLocaleString()}</td>
                      <td style={{ padding: '6px 8px' }}>
                        <select className="form-control" style={{ padding: '6px', fontSize: '13px' }} value={editForm.interaction_type || ''} onChange={(e) => setEditForm({ ...editForm, interaction_type: e.target.value })}>
                          {['In-Person', 'Virtual', 'Email', 'Phone Call'].map(t => <option key={t}>{t}</option>)}
                        </select>
                      </td>
                      <td style={{ padding: '6px 8px' }}>
                        <input type="number" className="form-control" style={{ padding: '6px', fontSize: '13px', width: '70px' }} value={editForm.duration_minutes || ''} onChange={(e) => setEditForm({ ...editForm, duration_minutes: e.target.value })} />
                      </td>
                      <td style={{ padding: '6px 8px' }}>
                        <input className="form-control" style={{ padding: '6px', fontSize: '13px' }} value={editForm.product_discussed || ''} onChange={(e) => setEditForm({ ...editForm, product_discussed: e.target.value })} />
                      </td>
                      <td style={{ padding: '6px 8px' }}>
                        <input className="form-control" style={{ padding: '6px', fontSize: '13px' }} value={editForm.notes || ''} onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })} />
                      </td>
                      <td style={{ padding: '8px 16px' }}>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button onClick={handleSave} style={{ background: '#10B981', color: '#fff', border: 'none', borderRadius: '6px', padding: '6px 10px', cursor: 'pointer' }}><Check size={14} /></button>
                          <button onClick={handleCancel} style={{ background: '#EF4444', color: '#fff', border: 'none', borderRadius: '6px', padding: '6px 10px', cursor: 'pointer' }}><X size={14} /></button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td style={{ padding: '12px 16px', color: '#94A3B8', fontWeight: 500 }}>#{item.id}</td>
                      <td style={{ padding: '12px 16px', fontWeight: 600, color: '#0F52BA' }}>HCP #{item.hcp_id}</td>
                      <td style={{ padding: '12px 16px', color: '#64748B', fontSize: '12px' }}>{new Date(item.date).toLocaleString()}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ background: ts.bg, color: ts.color, padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 500 }}>{item.interaction_type || '—'}</span>
                      </td>
                      <td style={{ padding: '12px 16px', color: '#475569' }}>{item.duration_minutes ? `${item.duration_minutes} min` : '—'}</td>
                      <td style={{ padding: '12px 16px', color: '#475569' }}>{item.product_discussed || '—'}</td>
                      <td style={{ padding: '12px 16px', color: '#64748B', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.notes || '—'}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button onClick={() => handleEdit(item)} style={{ background: '#EFF6FF', color: '#2563EB', border: 'none', borderRadius: '6px', padding: '6px 10px', cursor: 'pointer' }}><Pencil size={14} /></button>
                          <button onClick={() => handleDelete(item.id)} style={{ background: '#FEF2F2', color: '#EF4444', border: 'none', borderRadius: '6px', padding: '6px 10px', cursor: 'pointer' }}><Trash2 size={14} /></button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
        {interactions.length === 0 && (
          <div style={{ padding: '40px', textAlign: 'center', color: '#94A3B8' }}>No interactions found yet. Use the AI Assistant to log one!</div>
        )}
      </div>
    </div>
  );
}
