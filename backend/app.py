from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os
from datetime import datetime

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

# Data file path
DATA_FILE = 'patients_data.json'

# Diagnosis constants
SEVERE_DEHYDRATION = "Severe dehydration"
SOME_DEHYDRATION = "Some dehydration"
NO_DEHYDRATION = "No dehydration"

def load_patients_data():
    """Load patients data from JSON file"""
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, 'r') as f:
            return json.load(f)
    return []

def save_patients_data(data):
    """Save patients data to JSON file"""
    with open(DATA_FILE, 'w') as f:
        json.dump(data, f, indent=2)

def assess_skin(skin_condition):
    """Assess dehydration based on skin condition"""
    if skin_condition == "1":  # Normal skin pinch
        return SOME_DEHYDRATION
    elif skin_condition == "2":  # Slow skin pinch
        return SEVERE_DEHYDRATION
    else:
        return ""

def assess_eyes(eye_condition):
    """Assess dehydration based on eye condition"""
    if eye_condition == "1":  # Eyes normal or slightly sunken
        return NO_DEHYDRATION
    elif eye_condition == "2":  # Eyes very sunken
        return SEVERE_DEHYDRATION
    else:
        return ""

def assess_appearance(appearance, eyes=None, skin=None):
    """Assess dehydration based on general appearance and follow-up questions"""
    if appearance == "1":  # Normal appearance
        if eyes:
            return assess_eyes(eyes)
    elif appearance == "2":  # Irritable or lethargic
        if skin:
            return assess_skin(skin)
    return ""

@app.route('/api/patients', methods=['GET'])
def get_patients():
    """Get all patients and their diagnoses"""
    try:
        patients = load_patients_data()
        return jsonify({
            'success': True,
            'patients': patients
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/diagnosis', methods=['POST'])
def create_diagnosis():
    """Create a new diagnosis for a patient"""
    try:
        data = request.get_json()
        
        # Validate required fields
        if not data.get('name') or not data.get('name').strip():
            return jsonify({
                'success': False,
                'error': 'Patient name is required'
            }), 400
        
        if not data.get('appearance'):
            return jsonify({
                'success': False,
                'error': 'General appearance assessment is required'
            }), 400
        
        name = data['name'].strip()
        appearance = data['appearance']
        eyes = data.get('eyes')
        skin = data.get('skin')
        
        # Assess diagnosis
        diagnosis = assess_appearance(appearance, eyes, skin)
        
        if not diagnosis:
            return jsonify({
                'success': False,
                'error': 'Invalid assessment data provided'
            }), 400
        
        # Create patient record
        patient_record = {
            'id': datetime.now().isoformat(),
            'name': name,
            'diagnosis': diagnosis,
            'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            'assessment_data': {
                'appearance': appearance,
                'eyes': eyes,
                'skin': skin
            }
        }
        
        # Load existing data and add new record
        patients = load_patients_data()
        patients.append(patient_record)
        save_patients_data(patients)
        
        return jsonify({
            'success': True,
            'patient': patient_record,
            'message': f'Diagnosis completed for {name}: {diagnosis}'
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/patient/<patient_id>', methods=['DELETE'])
def delete_patient(patient_id):
    """Delete a patient record"""
    try:
        patients = load_patients_data()
        patients = [p for p in patients if p['id'] != patient_id]
        save_patients_data(patients)
        
        return jsonify({
            'success': True,
            'message': 'Patient record deleted successfully'
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'success': True,
        'message': 'Medical Diagnosis API is running',
        'timestamp': datetime.now().isoformat()
    })

if __name__ == '__main__':
    # Initialize with sample data if file doesn't exist
    if not os.path.exists(DATA_FILE):
        # Try to load from sample file first
        sample_file = 'patients_data.sample.json'
        if os.path.exists(sample_file):
            with open(sample_file, 'r') as f:
                sample_data = json.load(f)
        else:
            # Fallback to hardcoded sample data
            sample_data = [
                {
                    'id': '2024-01-01T10:00:00',
                    'name': 'Mike',
                    'diagnosis': SEVERE_DEHYDRATION,
                    'timestamp': '2024-01-01 10:00:00',
                    'assessment_data': {
                        'appearance': '2',
                        'eyes': None,
                        'skin': '2'
                    }
                },
                {
                    'id': '2024-01-01T11:00:00',
                    'name': 'Sally',
                    'diagnosis': NO_DEHYDRATION,
                    'timestamp': '2024-01-01 11:00:00',
                    'assessment_data': {
                        'appearance': '1',
                        'eyes': '1',
                        'skin': None
                    }
                },
                {
                    'id': '2024-01-01T12:00:00',
                    'name': 'Kate',
                    'diagnosis': SOME_DEHYDRATION,
                    'timestamp': '2024-01-01 12:00:00',
                    'assessment_data': {
                        'appearance': '2',
                        'eyes': None,
                        'skin': '1'
                    }
                }
            ]
        save_patients_data(sample_data)
    
    app.run(debug=True, host='0.0.0.0', port=5000)