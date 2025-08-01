import React, { useState } from 'react';
import { Trash2, RefreshCw, User, Calendar, AlertTriangle, Users } from 'lucide-react';

const PatientList = ({ patients, loading, onPatientDeleted, onRefresh }) => {
  const [deleting, setDeleting] = useState(null);

  const handleDelete = async (patientId) => {
    if (!window.confirm('Are you sure you want to delete this patient record?')) {
      return;
    }

    setDeleting(patientId);
    try {
      const response = await fetch(`/api/patient/${patientId}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (data.success) {
        onPatientDeleted(patientId);
      } else {
        alert('Failed to delete patient: ' + data.error);
      }
    } catch (error) {
      alert('Failed to delete patient: ' + error.message);
    } finally {
      setDeleting(null);
    }
  };

  const getDiagnosisClass = (diagnosis) => {
    if (diagnosis.includes('Severe')) return 'diagnosis-severe';
    if (diagnosis.includes('Some')) return 'diagnosis-some';
    return 'diagnosis-none';
  };

  const getDiagnosisIcon = (diagnosis) => {
    if (diagnosis.includes('Severe')) return <AlertTriangle size={16} />;
    if (diagnosis.includes('Some')) return <AlertTriangle size={16} />;
    return null;
  };

  if (loading) {
    return (
      <div className="card">
        <div className="loading">
          <RefreshCw className="animate-spin" size={24} />
          <p>Loading patients...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Users size={24} />
          Patient Records ({patients.length})
        </h2>
        <button 
          onClick={onRefresh}
          className="btn btn-secondary"
          style={{ padding: '8px 16px' }}
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {patients.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#6c757d' }}>
          <User size={48} style={{ opacity: 0.3, marginBottom: '16px' }} />
          <p>No patient records found.</p>
          <p>Start by creating a new diagnosis.</p>
        </div>
      ) : (
        <div className="patient-list">
          {patients.map((patient) => (
            <div key={patient.id} className="patient-card">
              <div className="patient-info">
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <User size={18} />
                  {patient.name}
                </h3>
                <p style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <Calendar size={14} />
                  {patient.timestamp}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className={`diagnosis-badge ${getDiagnosisClass(patient.diagnosis)}`}>
                    {getDiagnosisIcon(patient.diagnosis)}
                    {patient.diagnosis}
                  </span>
                </div>
              </div>
              <button
                onClick={() => handleDelete(patient.id)}
                disabled={deleting === patient.id}
                className="btn btn-danger"
                style={{ padding: '8px 12px' }}
                title="Delete patient record"
              >
                {deleting === patient.id ? (
                  <RefreshCw size={16} className="animate-spin" />
                ) : (
                  <Trash2 size={16} />
                )}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PatientList;