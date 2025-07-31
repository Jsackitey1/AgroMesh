# AgroMesh Backend

A comprehensive Node.js/Express backend for the AgroMesh precision agriculture platform, providing secure APIs for sensor data ingestion, user management, real-time alerts, and AI-driven agricultural insights.

## 🚀 Features

### ✅ Fully Implemented

- **🔐 Authentication & User Management**
  - JWT-based authentication with role-based access (Farmer, Admin, Researcher)
  - User registration, login, profile management
  - Password change functionality
  - Multi-language support (English, Spanish, French, Portuguese, Swahili)

- **📡 Sensor Data Management**
  - Sensor node registration and configuration
  - Real-time sensor data ingestion
  - Historical data retrieval with filtering
  - Sensor status monitoring (online/offline)

- **🚨 Real-Time Alerts & Notifications**
  - WebSocket (Socket.io) integration for real-time updates
  - Alert generation based on sensor thresholds
  - Alert management (acknowledge, resolve, dismiss)
  - Support for push, SMS, and email notifications

- **🤖 AI Integration (Google Gemini)**
  - Sensor data analysis and recommendations
  - Plant health diagnosis from images
  - Video analysis for plant health
  - Text-based Q&A for agricultural advice
  - Rate limiting (10 requests/minute per IP)

- **📊 Dashboard & Analytics**
  - Real-time dashboard data
  - Historical analytics with chart data
  - Alert summaries and statistics
  - Sensor node overview

- **🔒 Security & Validation**
  - Input validation using express-validator
  - Rate limiting for API endpoints
  - CORS and Helmet security headers
  - JWT token authentication

- **📝 Comprehensive Logging**
  - Winston logger with multiple transports
  - Request/response logging
  - Error tracking and monitoring

- **📚 API Documentation**
  - Swagger/OpenAPI documentation
  - Interactive API explorer at `/api/docs`
  - Complete endpoint documentation

- **🧪 Testing**
  - Jest test framework
  - Comprehensive test coverage for auth routes
  - Supertest for API testing

## 🏗️ Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Mobile App    │    │   Web Dashboard  │    │  Sensor Nodes   │
│   (React Native)│    │     (React)      │    │   (Arduino/Pi)  │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌──────────────────┐
                    │   AgroMesh API   │
                    │  (Node.js/Express)│
                    └──────────────────┘
                                 │
         ┌───────────────────────┼───────────────────────┐
         │                       │                       │
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   MongoDB       │    │   Socket.io      │    │   Google Gemini │
│   (Database)    │    │   (Real-time)    │    │   (AI Service)  │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd AgroMesh/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   # Required
   MONGODB_URI=mongodb://localhost:27017/agromesh
   JWT_SECRET=your-super-secret-jwt-key
   GEMINI_API_KEY=your-gemini-api-key
   
   # Optional
   PORT=5000
   NODE_ENV=development
   ```

4. **Start MongoDB**
   ```bash
   # Local MongoDB
   mongod
   
   # Or use MongoDB Atlas (cloud)
   # Update MONGODB_URI in .env
   ```

5. **Run the application**
   ```bash
   npm start
   ```

## 🚀 Quick Start

### 1. Start the Server
```bash
npm start
```
Server will start on `http://localhost:5000`

### 2. Access API Documentation
Visit `http://localhost:5000/api/docs` for interactive API documentation

### 3. Test the API
```bash
# Register a new user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "farmer@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe",
    "role": "Farmer"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "farmer@example.com",
    "password": "password123"
  }'
```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `POST /api/auth/change-password` - Change password

### Sensors
- `POST /api/sensors/register` - Register sensor node
- `POST /api/sensors/data` - Submit sensor data
- `GET /api/sensors` - Get user's sensor nodes
- `GET /api/sensors/:nodeId` - Get sensor node details
- `GET /api/sensors/:nodeId/data` - Get sensor data
- `PUT /api/sensors/:nodeId` - Update sensor configuration

### Alerts
- `GET /api/alerts` - Get user alerts
- `GET /api/alerts/unread` - Get unread alerts count
- `GET /api/alerts/:alertId` - Get alert details
- `POST /api/alerts/:alertId/acknowledge` - Acknowledge alert
- `POST /api/alerts/:alertId/resolve` - Resolve alert
- `POST /api/alerts/:alertId/dismiss` - Dismiss alert
- `POST /api/alerts/mark-all-read` - Mark all alerts as read

### Dashboard
- `GET /api/dashboard/summary` - Get dashboard summary
- `GET /api/dashboard/analytics` - Get analytics data
- `GET /api/dashboard/alerts-summary` - Get alerts summary
- `GET /api/dashboard/nodes-overview` - Get nodes overview

### AI Services
- `POST /api/ai/suggest` - Get AI suggestions from sensor data
- `POST /api/ai/diagnose-image` - Diagnose plant health from image
- `POST /api/ai/diagnose-video` - Diagnose plant health from video
- `POST /api/ai/ask` - Ask AI questions

### System
- `GET /api/health` - Health check

## 🔌 Real-Time Features

The backend uses Socket.io for real-time communication:

### Events Emitted by Server
- `welcome` - Welcome message on connection
- `sensorNodeRegistered` - New sensor node registered
- `sensorDataUpdate` - New sensor data received
- `newAlert` - New alert generated
- `alertUpdated` - Alert status updated
- `alertsMarkedRead` - Alerts marked as read

### Client Connection
```javascript
// Connect to Socket.io
const socket = io('http://localhost:5000');

// Listen for real-time updates
socket.on('sensorDataUpdate', (data) => {
  console.log('New sensor data:', data);
});

socket.on('newAlert', (alert) => {
  console.log('New alert:', alert);
});
```

## 🗄️ Database Models

### User
- Authentication (email, password)
- Profile (name, phone, location, language)
- Preferences (notifications, units)
- Role-based access (Farmer, Admin, Researcher)

### SensorNode
- Node identification and configuration
- Location and status tracking
- Sensor configuration and thresholds
- Battery and signal monitoring

### SensorData
- Sensor readings (moisture, temperature, pH, etc.)
- Metadata (battery, signal strength)
- AI analysis results
- Timestamp and location data

### Alert
- Alert types (irrigation, pest risk, anomaly, etc.)
- Severity levels and status tracking
- Notification delivery tracking
- Action history

## 🧪 Testing

### Run Tests
```bash
npm test
```

### Test Coverage
- Authentication routes (registration, login, profile)
- Input validation
- Error handling
- JWT token validation

### Test Database
Tests use a separate test database (`agromesh_test`) to avoid affecting development data.

## 📊 Logging

The application uses Winston for comprehensive logging:

### Log Levels
- `error` - Application errors
- `warn` - Warning messages
- `info` - General information
- `http` - HTTP requests
- `debug` - Debug information (development only)

### Log Files
- `logs/error.log` - Error logs only
- `logs/all.log` - All logs

### Environment-based Logging
- Development: Debug level with console output
- Production: Warn level with file output

## 🔧 Configuration

### Environment Variables

#### Required
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `GEMINI_API_KEY` - Google Gemini API key

#### Optional
- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (development/production)
- `LOG_LEVEL` - Logging level
- `RATE_LIMIT_MAX_REQUESTS` - Rate limiting
- `CORS_ORIGIN` - CORS origin

### Production Deployment

1. **Set Environment Variables**
   ```bash
   NODE_ENV=production
   MONGODB_URI=mongodb://your-production-db
   JWT_SECRET=your-production-secret
   ```

2. **Enable HTTPS**
   ```javascript
   // In production, use HTTPS
   const https = require('https');
   const fs = require('fs');
   
   const options = {
     key: fs.readFileSync('path/to/key.pem'),
     cert: fs.readFileSync('path/to/cert.pem')
   };
   
   https.createServer(options, app).listen(443);
   ```

3. **Use PM2 for Process Management**
   ```bash
   npm install -g pm2
   pm2 start index.js --name agromesh-backend
   ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run tests: `npm test`
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the API documentation at `/api/docs`
- Review the test files for usage examples
- Open an issue on GitHub

## 🔮 Roadmap

### Planned Features
- [ ] Admin panel for user management
- [ ] Advanced analytics and reporting
- [ ] Weather data integration
- [ ] Crop recommendation engine
- [ ] Mobile push notifications
- [ ] Data export functionality
- [ ] Multi-tenant support
- [ ] API rate limiting dashboard
- [ ] Automated testing pipeline
- [ ] Docker containerization 