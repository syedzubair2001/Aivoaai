import React, { useState } from 'react';
import { useGetHCPsQuery, useLogInteractionMutation, useGetInteractionTypesQuery } from '../store/apiSlice';

export default function StructuredForm() {
    const { data: hcps = [], isLoading } = useGetHCPsQuery();
    const { data: interactionTypes = [] } = useGetInteractionTypesQuery();
    const [logInteraction, { isLoading: isSubmitting }] = useLogInteractionMutation();

    const [formData, setFormData] = useState({
        hcp_id: '',
        interaction_type: '',
        duration_minutes: 15,
        product_discussed: '',
        notes: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await logInteraction({
                ...formData,
                hcp_id: parseInt(formData.hcp_id),
                duration_minutes: parseInt(formData.duration_minutes)
            }).unwrap();
            alert("Interaction logged successfully!");
            setFormData({ ...formData, notes: '', product_discussed: '' }); // Reset partial
        } catch (err) {
            alert("Failed to log interaction");
            console.error(err);
        }
    };

    if (isLoading) return <div>Loading HCPs...</div>;

    return (
        <form onSubmit={handleSubmit} className="card">
            <h2 style={{ marginBottom: '20px' }}>Log New Interaction</h2>
            <div className="form-group">
                <label>Healthcare Professional</label>
                <select name="hcp_id" value={formData.hcp_id} onChange={handleChange} className="form-control" required>
                    <option value="">Select HCP...</option>
                    {hcps.map(hcp => (
                        <option key={hcp.id} value={hcp.id}>{hcp.name} - {hcp.specialty}</option>
                    ))}
                </select>
            </div>

            <div style={{ display: 'flex', gap: '16px' }}>
                <div className="form-group" style={{ flex: 1 }}>
                    <label>Interaction Type</label>
                    <select name="interaction_type" value={formData.interaction_type} onChange={handleChange} className="form-control">
                        <option value="">Select Type...</option>
                        {interactionTypes.map(t => (
                            <option key={t.id} value={t.name}>{t.name}</option>
                        ))}
                    </select>
                </div>
                
                <div className="form-group" style={{ flex: 1 }}>
                    <label>Duration (Minutes)</label>
                    <input type="number" name="duration_minutes" value={formData.duration_minutes} onChange={handleChange} className="form-control" required min="1" />
                </div>
            </div>

            <div className="form-group">
                <label>Product Discussed</label>
                <input type="text" name="product_discussed" value={formData.product_discussed} onChange={handleChange} className="form-control" required placeholder="e.g. WonderDrug 200mg" />
            </div>

            <div className="form-group">
                <label>Interaction Notes</label>
                <textarea name="notes" value={formData.notes} onChange={handleChange} className="form-control" rows="4" placeholder="Discussed efficacy and patient outcomes..."></textarea>
            </div>

            <button type="submit" className="btn" disabled={isSubmitting}>
                {isSubmitting ? 'Logging...' : 'Save Interaction'}
            </button>
        </form>
    );
}
