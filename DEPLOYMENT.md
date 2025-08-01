# Deployment Guide - Medical Diagnosis Chatbot

## Quick Start

### Option 1: Using the convenience scripts

1. **Start Backend** (Terminal 1):
   ```bash
   ./start-backend.sh
   ```

2. **Start Frontend** (Terminal 2):
   ```bash
   ./start-frontend.sh
   ```

3. **Access the Application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

### Option 2: Manual setup

#### Backend Setup
```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

#### Frontend Setup
```bash
cd frontend
npm install
npm start
```

## Application Features

### 🏥 Medical Assessment
- **Systematic Dehydration Diagnosis**: Based on clinical decision trees
- **Interactive Form**: Step-by-step patient assessment
- **Real-time Validation**: Ensures complete and accurate data entry

### 📊 Patient Management
- **Patient Records**: View all diagnoses with timestamps
- **Search & Filter**: Easy patient lookup
- **Data Persistence**: JSON-based storage (upgradeable to SQL)

### 🎨 User Interface
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Professional Medical Theme**: Clean, clinical interface
- **Accessibility**: Keyboard navigation and screen reader support
- **Real-time Feedback**: Loading states and error handling

## API Endpoints

### GET /api/health
Health check endpoint
```json
{
  "success": true,
  "message": "Medical Diagnosis API is running",
  "timestamp": "2025-07-31T22:00:00.000000"
}
```

### GET /api/patients
Get all patient records
```json
{
  "success": true,
  "patients": [
    {
      "id": "2024-01-01T10:00:00",
      "name": "John Doe",
      "diagnosis": "No dehydration",
      "timestamp": "2024-01-01 10:00:00",
      "assessment_data": {
        "appearance": "1",
        "eyes": "1",
        "skin": null
      }
    }
  ]
}
```

### POST /api/diagnosis
Create new diagnosis
```json
// Request
{
  "name": "Patient Name",
  "appearance": "1",  // "1" = Normal, "2" = Irritable/lethargic
  "eyes": "1",        // Required if appearance = "1"
  "skin": "2"         // Required if appearance = "2"
}

// Response
{
  "success": true,
  "patient": { /* patient object */ },
  "message": "Diagnosis completed for Patient Name: No dehydration"
}
```

### DELETE /api/patient/:id
Delete patient record
```json
{
  "success": true,
  "message": "Patient record deleted successfully"
}
```

## Testing

### Run API Tests
```bash
python test_api.py
```

### Run Frontend Tests
```bash
cd frontend
npm test
```

## Production Deployment

### Backend (Flask)
For production, use a WSGI server like Gunicorn:

```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

### Frontend (React)
Build for production:

```bash
cd frontend
npm run build
```

Serve with nginx or any static file server.

### Environment Variables
Create `.env` file in backend directory:
```
FLASK_ENV=production
DATABASE_URL=sqlite:///patients.db  # For future SQL upgrade
SECRET_KEY=your-secret-key-here
```

### Database Upgrade
To upgrade from JSON to SQLite/PostgreSQL:

1. Install SQLAlchemy: `pip install flask-sqlalchemy`
2. Replace JSON file operations with database models
3. Add migration scripts for existing data

## Security Considerations

### For Production Use:
- [ ] Add authentication and authorization
- [ ] Implement HTTPS/SSL certificates
- [ ] Add input sanitization and validation
- [ ] Implement rate limiting
- [ ] Add audit logging
- [ ] Encrypt sensitive patient data
- [ ] Comply with HIPAA/medical data regulations

### Current Security Features:
- ✅ CORS protection
- ✅ Input validation
- ✅ Error handling
- ✅ SQL injection prevention (no SQL used)

## Monitoring & Logging

### Health Checks
- Backend: `GET /api/health`
- Frontend: Check if React app loads

### Logs
- Backend: Flask development server logs
- Frontend: Browser console for client-side issues

## Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Kill process on port 5000
   lsof -ti:5000 | xargs kill -9
   
   # Kill process on port 3000
   lsof -ti:3000 | xargs kill -9
   ```

2. **CORS Issues**
   - Ensure Flask-CORS is installed
   - Check proxy setting in frontend/package.json

3. **API Connection Failed**
   - Verify backend is running on port 5000
   - Check firewall settings
   - Ensure proxy configuration is correct

4. **Frontend Build Issues**
   ```bash
   cd frontend
   rm -rf node_modules package-lock.json
   npm install
   ```

### Debug Mode
Enable debug logging in Flask:
```python
app.run(debug=True, host='0.0.0.0', port=5000)
```

## Performance Optimization

### Backend
- Use Redis for session storage
- Implement database connection pooling
- Add caching for frequent queries
- Use async/await for I/O operations

### Frontend
- Implement lazy loading for components
- Add service worker for offline functionality
- Optimize bundle size with code splitting
- Add image optimization

## Backup & Recovery

### Data Backup
```bash
# Backup patient data
cp backend/patients_data.json backup/patients_$(date +%Y%m%d).json
```

### Automated Backups
Add to crontab:
```bash
0 2 * * * cp /path/to/backend/patients_data.json /path/to/backup/patients_$(date +\%Y\%m\%d).json
```

## Support

For issues and questions:
1. Check this deployment guide
2. Review the main README.md
3. Check application logs
4. Test API endpoints manually
5. Verify all dependencies are installed