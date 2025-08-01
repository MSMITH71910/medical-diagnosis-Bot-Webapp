import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Eye, Hand, AlertCircle, CheckCircle, Send } from 'lucide-react';

const DiagnosisForm = ({ onPatientAdded }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    appearance: '',
    eyes: '',
    skin: ''
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear follow-up questions when appearance changes
    if (field === 'appearance') {
      setFormData(prev => ({
        ...prev,
        eyes: '',
        skin: ''
      }));
    }
    
    // Clear any previous results/errors
    setResult(null);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name.trim()) {
      setError('Patient name is required');
      return;
    }
    
    if (!formData.appearance) {
      setError('General appearance assessment is required');
      return;
    }
    
    // Check for required follow-up questions
    if (formData.appearance === '1' && !formData.eyes) {
      setError('Eye assessment is required for normal appearance');
      return;
    }
    
    if (formData.appearance === '2' && !formData.skin) {
      setError('Skin assessment is required for irritable/lethargic appearance');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/diagnosis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setResult(data);
        onPatientAdded(data.patient);
        
        // Reset form
        setFormData({
          name: '',
          appearance: '',
          eyes: '',
          skin: ''
        });
        
        // Auto-redirect after 3 seconds
        setTimeout(() => {
          navigate('/');
        }, 3000);
      } else {
        setError(data.error || 'Failed to create diagnosis');
      }
    } catch (err) {
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  const getDiagnosisIcon = (diagnosis) => {
    if (diagnosis && diagnosis.includes('Severe')) return <AlertCircle className="text-red-500" />;
    if (diagnosis && diagnosis.includes('Some')) return <AlertCircle className="text-yellow-500" />;
    return <CheckCircle className="text-green-500" />;
  };

  const getDiagnosisClass = (diagnosis) => {
    if (diagnosis && diagnosis.includes('Severe')) return 'diagnosis-severe';
    if (diagnosis && diagnosis.includes('Some')) return 'diagnosis-some';
    return 'diagnosis-none';
  };

  return (
    <div className="card">
      <h2 style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <User size={24} />
        New Patient Diagnosis
      </h2>

      {result && (
        <div className="alert alert-success">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            {getDiagnosisIcon(result.patient.diagnosis)}
            <strong>Diagnosis Complete!</strong>
          </div>
          <p>
            <strong>{result.patient.name}</strong> has been diagnosed with{' '}
            <span className={`diagnosis-badge ${getDiagnosisClass(result.patient.diagnosis)}`}>
              {result.patient.diagnosis}
            </span>
          </p>
          <p style={{ marginTop: '8px', fontSize: '14px', opacity: 0.8 }}>
            Redirecting to patient list in 3 seconds...
          </p>
        </div>
      )}

      {error && (
        <div className="alert alert-error">
          <AlertCircle size={16} style={{ marginRight: '8px' }} />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Patient Name */}
        <div className="form-group">
          <label className="form-label">
            <User size={16} style={{ marginRight: '8px' }} />
            Patient Name
          </label>
          <input
            type="text"
            className="form-input"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="Enter patient's full name"
            disabled={loading}
          />
        </div>

        {/* General Appearance */}
        <div className="form-group">
          <label className="form-label">
            <AlertCircle size={16} style={{ marginRight: '8px' }} />
            How is the patient's general appearance?
          </label>
          <div className="radio-group">
            <label className={`radio-option ${formData.appearance === '1' ? 'selected' : ''}`}>
              <input
                type="radio"
                name="appearance"
                value="1"
                checked={formData.appearance === '1'}
                onChange={(e) => handleInputChange('appearance', e.target.value)}
                disabled={loading}
              />
              <span>Normal appearance</span>
            </label>
            <label className={`radio-option ${formData.appearance === '2' ? 'selected' : ''}`}>
              <input
                type="radio"
                name="appearance"
                value="2"
                checked={formData.appearance === '2'}
                onChange={(e) => handleInputChange('appearance', e.target.value)}
                disabled={loading}
              />
              <span>Irritable or lethargic</span>
            </label>
          </div>
        </div>

        {/* Follow-up Questions */}
        {formData.appearance === '1' && (
          <div className="form-group">
            <label className="form-label">
              <Eye size={16} style={{ marginRight: '8px' }} />
              How are the patient's eyes?
            </label>
            <div className="radio-group">
              <label className={`radio-option ${formData.eyes === '1' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="eyes"
                  value="1"
                  checked={formData.eyes === '1'}
                  onChange={(e) => handleInputChange('eyes', e.target.value)}
                  disabled={loading}
                />
                <span>Eyes normal or slightly sunken</span>
              </label>
              <label className={`radio-option ${formData.eyes === '2' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="eyes"
                  value="2"
                  checked={formData.eyes === '2'}
                  onChange={(e) => handleInputChange('eyes', e.target.value)}
                  disabled={loading}
                />
                <span>Eyes very sunken</span>
              </label>
            </div>
          </div>
        )}

        {formData.appearance === '2' && (
          <div className="form-group">
            <label className="form-label">
              <Hand size={16} style={{ marginRight: '8px' }} />
              How is the patient's skin when you pinch it?
            </label>
            <div className="radio-group">
              <label className={`radio-option ${formData.skin === '1' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="skin"
                  value="1"
                  checked={formData.skin === '1'}
                  onChange={(e) => handleInputChange('skin', e.target.value)}
                  disabled={loading}
                />
                <span>Normal skin pinch</span>
              </label>
              <label className={`radio-option ${formData.skin === '2' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="skin"
                  value="2"
                  checked={formData.skin === '2'}
                  onChange={(e) => handleInputChange('skin', e.target.value)}
                  disabled={loading}
                />
                <span>Slow skin pinch</span>
              </label>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading || !formData.name.trim() || !formData.appearance}
          style={{ width: '100%', justifyContent: 'center' }}
        >
          {loading ? (
            <>
              <div className="spinner" style={{ 
                width: '16px', 
                height: '16px', 
                border: '2px solid transparent', 
                borderTop: '2px solid white', 
                borderRadius: '50%', 
                animation: 'spin 1s linear infinite' 
              }} />
              Processing...
            </>
          ) : (
            <>
              <Send size={16} />
              Complete Diagnosis
            </>
          )}
        </button>
      </form>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default DiagnosisForm;