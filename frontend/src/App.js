import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Users, Plus, Activity } from 'lucide-react';
import PatientList from './components/PatientList';
import DiagnosisForm from './components/DiagnosisForm';
import './App.css';

function Navigation() {
  const location = useLocation();
  
  return (
    <nav className="navigation">
      <Link 
        to="/" 
        className={`btn ${location.pathname === '/' ? 'btn-primary' : 'btn-secondary'}`}
      >
        <Users size={20} />
        View Patients
      </Link>
      <Link 
        to="/diagnosis" 
        className={`btn ${location.pathname === '/diagnosis' ? 'btn-primary' : 'btn-secondary'}`}
      >
        <Plus size={20} />
        New Diagnosis
      </Link>
    </nav>
  );
}

function App() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPatients = async () => {
    try {
      const response = await fetch('/api/patients');
      const data = await response.json();
      
      if (data.success) {
        setPatients(data.patients);
      } else {
        setError(data.error || 'Failed to fetch patients');
      }
    } catch (err) {
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handlePatientAdded = (newPatient) => {
    setPatients(prev => [...prev, newPatient]);
  };

  const handlePatientDeleted = (patientId) => {
    setPatients(prev => prev.filter(p => p.id !== patientId));
  };

  return (
    <Router>
      <div className="App">
        <div className="container">
          <header className="header">
            <Activity size={48} style={{ margin: '0 auto 16px' }} />
            <h1>Medical Diagnosis Bot</h1>
            <p>Dehydration Assessment Tool</p>
          </header>

          <Navigation />

          {error && (
            <div className="alert alert-error">
              <strong>Error:</strong> {error}
            </div>
          )}

          <Routes>
            <Route 
              path="/" 
              element={
                <PatientList 
                  patients={patients} 
                  loading={loading}
                  onPatientDeleted={handlePatientDeleted}
                  onRefresh={fetchPatients}
                />
              } 
            />
            <Route 
              path="/diagnosis" 
              element={
                <DiagnosisForm 
                  onPatientAdded={handlePatientAdded}
                />
              } 
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;