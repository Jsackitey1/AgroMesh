# AgroMesh Setup Guide - UPDATED

This guide will help you set up and deploy the AgroMesh system with full AI integration.

## 🚀 **Quick Start (Recommended)**

### **AI-First Setup (5 minutes)**
```bash
# 1. Clone and setup backend
git clone https://github.com/yourusername/AgroMesh.git
cd AgroMesh/backend
npm install
cp env.example .env
# Edit .env with your API keys

# 2. Start backend
npm start

# 3. Setup mobile app
cd ../mobile
npm install
npx expo start
# Scan QR code with Expo Go app
```

---

## System Requirements

### **Minimum Requirements (AI Features)**
- Node.js 18+
- npm or yarn
- MongoDB Atlas account
- Google Gemini AI API key
- Expo Go app (for mobile testing)

### **Full System Requirements**
- Arduino/Raspberry Pi board *(optional)*
- Required sensors *(optional - see hardware/README.md)*
- Solar panel and battery *(optional)*
- LoRa module or ESP8266/ESP32 *(optional)*

### **Software Requirements**
- Node.js 18+
- npm or yarn
- Git
- Expo CLI *(for mobile development)*
- Arduino IDE *(for hardware development)*

---

## 📱 **Mobile App Setup (Primary Interface)**

### **1. Install Dependencies**
```bash
cd mobile
npm install
```

### **2. Start Development Server**
```bash
npx expo start
```

### **3. Test on Device**
- Install **Expo Go** app on your phone
- Scan the QR code from terminal
- Navigate to **AI Assistant** for all features

### **4. Available Features**
- ✅ **Authentication**: Login/Register
- ✅ **Dashboard**: Sensor data visualization
- ✅ **AI Assistant**: Complete AI integration
  - Image Diagnosis
  - AI Chat
  - Smart Recommendations
  - Video Analysis
- ✅ **Real-time Updates**: Live data and alerts

---

## 🔧 **Backend Setup**

### **1. Install Dependencies**
```bash
cd backend
npm install
```

### **2. Environment Configuration**
```bash
# Copy template
cp env.example .env

# Edit .env with your actual API keys
nano .env
```

### **3. Required Environment Variables**
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

### **4. Start Backend Server**
```bash
npm start
# or for development with auto-restart
npm run dev
```

### **5. Verify Backend**
- Visit `http://localhost:5001/api/health`
- Should return: `{"status": "ok", "message": "AgroMesh API is running"}`

---

## 🎯 **AI Features Setup**

### **1. Gemini AI API Key**
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add to `backend/.env`: `GEMINI_API_KEY=your-key-here`

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
```

### **3. Available AI Endpoints**
- `POST /api/ai/diagnose-image` - Plant health analysis
- `POST /api/ai/ask-question` - AI chat
- `POST /api/ai/smart-recommendations` - Farming recommendations
- `POST /api/ai/diagnose-video` - Video analysis

---

## 🌐 **Dashboard Setup (Optional)**

### **1. Install Dependencies**
```bash
cd dashboard
npm install
```

### **2. Start Dashboard**
```bash
npm start
```

### **3. Access Dashboard**
- Visit `http://localhost:3000`
- Currently serves as project information and marketing site

---

## 🔒 **Security Configuration**

### **1. Environment Variables**
✅ **All sensitive data is properly secured**
- API keys in `.env` files
- `.env` files in `.gitignore`
- No hardcoded secrets

### **2. Authentication**
- JWT-based authentication
- Secure token management
- Password hashing with bcrypt

### **3. API Security**
- Input validation
- Rate limiting
- CORS configuration
- Helmet security headers

---

## 🧪 **Testing the System**

### **1. Backend API Tests**
```bash
cd backend
npm test
```

### **2. Mobile App Testing**
1. Open Expo Go app
2. Scan QR code from `npx expo start`
3. Test all AI features:
   - Upload plant image for diagnosis
   - Ask AI farming questions
   - Get smart recommendations
   - Upload and analyze videos

### **3. AI Feature Testing**
- **Image Diagnosis**: Upload a plant photo
- **AI Chat**: Ask "How to improve soil fertility?"
- **Smart Recommendations**: Get personalized farming advice
- **Video Analysis**: Upload an agricultural video

---

## 🚀 **Deployment**

### **Backend Deployment (Heroku)**
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

### **Mobile App Deployment**
```bash
# 1. Build for production
cd mobile
eas build --platform all

# 2. Submit to app stores
eas submit --platform all
```

### **Dashboard Deployment (Vercel)**
```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Deploy
cd dashboard
vercel
```

---

## 🔧 **Hardware Setup (Optional)**

### **1. Sensor Node Assembly**
1. Follow wiring diagram in `hardware/sensor_node_v1.pdf`
2. Connect sensors to Arduino/Raspberry Pi
3. Upload firmware from `firmware/soil_monitor.ino`

### **2. Field Deployment**
1. Test sensors in controlled environment
2. Install weather protection
3. Deploy in field
4. Monitor initial readings

---

## 🐛 **Troubleshooting**

### **Common Issues**

#### **1. Backend Won't Start**
```bash
# Check if port is in use
lsof -i :5001
# Kill process if needed
kill -9 <PID>

# Check environment variables
cat backend/.env
```

#### **2. AI Features Not Working**
```bash
# Verify Gemini API key
curl -H "Authorization: Bearer YOUR_API_KEY" \
  https://generativelanguage.googleapis.com/v1beta/models

# Check backend logs
cd backend
npm start
```

#### **3. Mobile App Issues**
```bash
# Clear Expo cache
npx expo start --clear

# Reset Metro bundler
npx expo start --reset-cache
```

#### **4. Database Connection Issues**
```bash
# Test MongoDB connection
mongosh "your-connection-string"

# Check network connectivity
ping cluster.mongodb.net
```

### **Error Solutions**

#### **"Authentication token not found"**
- Ensure you're logged in to the mobile app
- Check JWT token in AsyncStorage
- Verify backend authentication middleware

#### **"Gemini API error"**
- Verify API key in `.env` file
- Check API key permissions
- Ensure backend server is restarted after .env changes

#### **"Video upload failed"**
- Check file size limits
- Verify video format (MP4, AVI, MOV, WEBM)
- Ensure backend storage directory exists

---

## 📋 **Verification Checklist**

### **✅ Backend Setup**
- [ ] Node.js 18+ installed
- [ ] Dependencies installed (`npm install`)
- [ ] Environment variables configured
- [ ] MongoDB connection working
- [ ] Gemini API key valid
- [ ] Server starts without errors
- [ ] API endpoints responding

### **✅ Mobile App Setup**
- [ ] Expo CLI installed
- [ ] Dependencies installed
- [ ] App starts in Expo Go
- [ ] Authentication working
- [ ] AI features accessible
- [ ] Video upload working

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

## 📞 **Support**

### **Getting Help**
- 📧 **Email**: sackiteyjoseph@gmail.com
- 🌐 **Website**: https://agro-mesh.vercel.app/
- 📱 **Mobile App**: Available via Expo Go

### **Useful Commands**
```bash
# Check backend status
curl http://localhost:5001/api/health

# View backend logs
cd backend && npm start

# Test AI endpoint
curl -X POST http://localhost:5001/api/ai/ask-question \
  -H "Content-Type: application/json" \
  -d '{"question": "test"}'

# Clear mobile cache
cd mobile && npx expo start --clear
```

---

## 🎉 **Success!**

Once you've completed the setup, you should have:
- ✅ Working backend API with AI integration
- ✅ Functional mobile app with all AI features
- ✅ Secure environment configuration
- ✅ Ready for development and testing

**Happy farming with AI!** 🌾🤖 