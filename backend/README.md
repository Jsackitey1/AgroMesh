# AgroMesh Backend - UPDATED

A comprehensive Node.js/Express backend for the AgroMesh precision agriculture platform, providing secure APIs for sensor data ingestion, user management, real-time alerts, and AI-driven agricultural insights.

## 🚀 **Latest Updates (v2.1)**

### ✅ **AI Integration - FULLY WORKING**
- **Gemini AI API**: Updated to latest `@google/genai` v1.7.0
- **Image Diagnosis**: Enhanced plant health analysis with structured responses
- **Video Analysis**: Working video upload and AI analysis
- **AI Chat**: Interactive Q&A system for farming advice
- **Smart Recommendations**: Personalized farming recommendations
- **Multi-modal Analysis**: Support for images, videos, and text

### 🔒 **Security - ENHANCED**
- **API Key Protection**: All sensitive data properly secured
- **Environment Variables**: Comprehensive .env management
- **Git Security**: Complete .gitignore protection
- **Authentication**: JWT-based secure system

### 📱 **Mobile Integration - COMPLETE**
- **Authentication**: Secure login/registration
- **AI Features**: Complete mobile app integration
- **Real-time Updates**: WebSocket integration
- **Video Management**: Upload and analysis workflow

---

## 🚀 Features

### ✅ **Fully Implemented & Working**

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

- **🤖 AI Integration (Google Gemini) - UPDATED**
  - ✅ **Image Diagnosis**: Plant health analysis from photos
  - ✅ **Video Analysis**: Agricultural video processing
  - ✅ **AI Chat**: Interactive Q&A for farming advice
  - ✅ **Smart Recommendations**: Personalized farming guidance
  - ✅ **Sensor Data Analysis**: Real-time environmental insights
  - ✅ **Rate Limiting**: 10 requests/minute per IP

- **📊 Dashboard & Analytics**
  - Real-time dashboard data
  - Historical analytics with chart data
  - Alert summaries and statistics
  - Sensor node overview

- **🔒 Security & Validation - ENHANCED**
  - ✅ **Environment Variables**: All sensitive data secured
  - ✅ **Git Protection**: Comprehensive .gitignore
  - ✅ **Input Validation**: express-validator implementation
  - ✅ **Rate Limiting**: API endpoint protection
  - ✅ **CORS & Helmet**: Security headers
  - ✅ **JWT Authentication**: Secure token management

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

---

## 🏗️ Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Mobile App    │    │   Web Dashboard  │    │  Sensor Nodes   │
│   (React Native)│    │     (React)      │    │   (Arduino/Pi)  │
│   ✅ Complete   │    │   ✅ Marketing   │    │   🔧 Optional   │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌──────────────────┐
                    │   AgroMesh API   │
                    │  (Node.js/Express)│
                    │   ✅ Working     │
                    └──────────────────┘
                                 │
         ┌───────────────────────┼───────────────────────┐
         │                       │                       │
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   MongoDB       │    │   Socket.io      │    │   Google Gemini │
│   (Database)    │    │   (Real-time)    │    │   (AI Service)  │
│   ✅ Connected  │    │   ✅ Working     │    │   ✅ Integrated  │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

---

## 📋 Prerequisites

- Node.js (v18 or higher) - **Updated requirement**
- MongoDB (v4.4 or higher)
- npm or yarn
- Google Gemini AI API key

---

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

3. **Environment Configuration**
   ```bash
   # Copy environment template
   cp env.example .env
   
   # Edit with your actual API keys
   nano .env
   ```

4. **Required Environment Variables**
   ```bash
   # Database
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/agromesh
   
   # Authentication
   JWT_SECRET=your-super-secret-jwt-key-change-in-production
   
   # AI Integration
   GEMINI_API_KEY=your-gemini-api-key-here
   
   # Server
   PORT=5001
   NODE_ENV=development
   ```

5. **Start the server**
   ```bash
   # Production
   npm start
   
   # Development with auto-restart
   npm run dev
   ```

---

## 🎯 **AI Features Setup**

### **1. Gemini AI Configuration**
```bash
# Get API key from Google AI Studio
# https://makersuite.google.com/app/apikey

# Add to .env file
GEMINI_API_KEY=your-actual-api-key-here
```

### **2. Test AI Integration**
```bash
# Test image diagnosis
curl -X POST http://localhost:5001/api/ai/diagnose-image \
  -H "Content-Type: multipart/form-data" \
  -F "image=@test-image.jpg"

# Test AI chat
curl -X POST http://localhost:5001/api/ai/ask-question \
  -H "Content-Type: application/json" \
  -d '{"question": "How to treat tomato blight?"}'

# Test smart recommendations
curl -X POST http://localhost:5001/api/ai/smart-recommendations \
  -H "Content-Type: application/json" \
  -d '{"location": "Ghana", "crop": "tomato", "season": "rainy"}'
```

### **3. Available AI Endpoints**
- `POST /api/ai/diagnose-image` - Plant health analysis
- `POST /api/ai/ask-question` - AI chat
- `POST /api/ai/smart-recommendations` - Farming recommendations
- `POST /api/ai/diagnose-video` - Video analysis

---

## 📚 API Endpoints

### **Authentication**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `POST /api/auth/change-password` - Change password

### **AI Features**
- `POST /api/ai/diagnose-image` - Image-based plant diagnosis
- `POST /api/ai/ask-question` - AI-powered Q&A
- `POST /api/ai/smart-recommendations` - Personalized recommendations
- `POST /api/ai/diagnose-video` - Video analysis

### **Sensors**
- `GET /api/sensors` - Get all sensors
- `POST /api/sensors` - Register new sensor
- `GET /api/sensors/:id` - Get sensor details
- `PUT /api/sensors/:id` - Update sensor
- `DELETE /api/sensors/:id` - Delete sensor

### **Sensor Data**
- `GET /api/sensors/:id/data` - Get sensor data
- `POST /api/sensors/:id/data` - Add sensor data
- `GET /api/sensors/:id/data/history` - Get historical data

### **Alerts**
- `GET /api/alerts` - Get all alerts
- `POST /api/alerts` - Create alert
- `PUT /api/alerts/:id` - Update alert
- `DELETE /api/alerts/:id` - Delete alert

### **Dashboard**
- `GET /api/dashboard/overview` - Dashboard overview
- `GET /api/dashboard/analytics` - Analytics data
- `GET /api/dashboard/alerts` - Alert summaries

---

## 🔒 Security Features

### **✅ Implemented Security Measures**
- **Environment Variables**: All sensitive data in .env files
- **Git Protection**: .env files in .gitignore
- **JWT Authentication**: Secure token-based auth
- **Input Validation**: Server-side validation
- **Rate Limiting**: API protection
- **CORS Configuration**: Cross-origin security
- **Helmet Headers**: Security headers

### **✅ Security Checklist**
- ✅ API keys in environment variables
- ✅ .env files in .gitignore
- ✅ No hardcoded secrets
- ✅ JWT authentication working
- ✅ Input validation active
- ✅ Rate limiting configured

---

## 🧪 Testing

### **Run Tests**
```bash
# Run all tests
npm test

# Run specific test file
npm test -- auth.test.js

# Run with coverage
npm run test:coverage
```

### **Test AI Features**
```bash
# Test image diagnosis
curl -X POST http://localhost:5001/api/ai/diagnose-image \
  -H "Content-Type: multipart/form-data" \
  -F "image=@test-image.jpg"

# Test AI chat
curl -X POST http://localhost:5001/api/ai/ask-question \
  -H "Content-Type: application/json" \
  -d '{"question": "test question"}'
```

---

## 🚀 Deployment

### **Heroku Deployment**
```bash
# 1. Create Heroku app
heroku create your-agromesh-app

# 2. Set environment variables
heroku config:set MONGODB_URI=your-mongodb-uri
heroku config:set JWT_SECRET=your-jwt-secret
heroku config:set GEMINI_API_KEY=your-gemini-key

# 3. Deploy
git push heroku main
```

### **Docker Deployment**
```bash
# Build image
docker build -t agromesh-backend .

# Run container
docker run -p 5001:5001 --env-file .env agromesh-backend
```

---

## 🐛 Troubleshooting

### **Common Issues**

#### **1. Backend Won't Start**
```bash
# Check if port is in use
lsof -i :5001
# Kill process if needed
kill -9 <PID>

# Check environment variables
cat .env
```

#### **2. AI Features Not Working**
```bash
# Verify Gemini API key
curl -H "Authorization: Bearer YOUR_API_KEY" \
  https://generativelanguage.googleapis.com/v1beta/models

# Check backend logs
npm start
```

#### **3. Database Connection Issues**
```bash
# Test MongoDB connection
mongosh "your-connection-string"

# Check network connectivity
ping cluster.mongodb.net
```

### **Error Solutions**

#### **"Authentication token not found"**
- Ensure proper JWT token in request headers
- Check token expiration
- Verify authentication middleware

#### **"Gemini API error"**
- Verify API key in .env file
- Check API key permissions
- Restart server after .env changes

#### **"Video upload failed"**
- Check file size limits
- Verify video format (MP4, AVI, MOV, WEBM)
- Ensure upload directory exists

---

## 📋 Verification Checklist

### **✅ Backend Setup**
- [ ] Node.js 18+ installed
- [ ] Dependencies installed (`npm install`)
- [ ] Environment variables configured
- [ ] MongoDB connection working
- [ ] Gemini API key valid
- [ ] Server starts without errors
- [ ] API endpoints responding

### **✅ AI Features**
- [ ] Image diagnosis working
- [ ] AI chat responding
- [ ] Smart recommendations generating
- [ ] Video analysis processing
- [ ] All endpoints accessible

### **✅ Security**
- [ ] .env files in .gitignore
- [ ] No API keys in source code
- [ ] JWT authentication working
- [ ] Input validation active

---

## 📞 Support

### **Getting Help**
- 📧 **Email**: sackiteyjoseph@gmail.com
- 🌐 **Website**: https://agro-mesh.vercel.app/
- 📱 **Mobile App**: Available via Expo Go

### **Useful Commands**
```bash
# Check server status
curl http://localhost:5001/api/health

# View logs
npm start

# Test AI endpoint
curl -X POST http://localhost:5001/api/ai/ask-question \
  -H "Content-Type: application/json" \
  -d '{"question": "test"}'

# Check environment
cat .env
```

---

## 🎉 Success!

Once setup is complete, you should have:
- ✅ Working backend API with AI integration
- ✅ Secure environment configuration
- ✅ All AI features functional
- ✅ Ready for mobile app integration

**Happy coding!** 🚀✨ 