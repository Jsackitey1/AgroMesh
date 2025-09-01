# AgroMesh Mobile App

A comprehensive React Native mobile application for the AgroMesh precision agriculture platform, providing farmers with real-time sensor monitoring, AI-powered insights, and smart farming solutions.

## 🚀 **Latest Updates (v2.1)**

### ✅ **AI Integration - FULLY WORKING**
- **Image Diagnosis**: Upload plant photos for instant health analysis
- **AI Chat**: Interactive Q&A system for farming advice
- **Smart Recommendations**: Personalized farming recommendations
- **Video Analysis**: Upload and analyze agricultural videos
- **Multi-modal AI**: Support for images, videos, and text

### 🔐 **Authentication - COMPLETE**
- **Secure Login/Registration**: JWT-based authentication
- **Profile Management**: User profile and settings
- **Token Management**: Automatic token refresh and storage
- **Role-based Access**: Farmer, Admin, Researcher roles

### 📱 **Mobile Features - COMPLETE**
- **Dashboard**: Real-time sensor data visualization
- **AI Assistant**: Complete AI integration hub
- **Real-time Updates**: WebSocket integration
- **Offline Support**: Data caching and offline functionality

---

## 🚀 Features

### ✅ **Fully Implemented & Working**

- **🔐 Authentication & User Management**
  - ✅ Secure login and registration with JWT tokens
  - ✅ Role-based access (Farmer, Admin, Researcher)
  - ✅ Profile management and settings
  - ✅ Multi-language support ready
  - ✅ Token refresh and storage management

- **📱 Modern UI/UX**
  - ✅ Clean, intuitive interface designed for farmers
  - ✅ Responsive design for various screen sizes
  - ✅ Pull-to-refresh functionality
  - ✅ Loading states and error handling
  - ✅ Navigation with React Navigation v6

- **🏠 Dashboard**
  - ✅ Real-time overview of sensor status
  - ✅ Summary cards with key metrics
  - ✅ Quick action buttons
  - ✅ Latest sensor readings display
  - ✅ Connection status indicators

- **🔌 Real-Time Communication**
  - ✅ Socket.io integration for live updates
  - ✅ Real-time sensor data streaming
  - ✅ Instant alert notifications
  - ✅ Connection status management
  - ✅ Automatic reconnection handling

- **📊 Data Management**
  - ✅ Secure API communication with backend
  - ✅ Offline data caching with AsyncStorage
  - ✅ Error handling and retry logic
  - ✅ Token-based authentication
  - ✅ Request/response interceptors

- **🤖 AI-Powered Features - COMPLETE**
  - ✅ **Image Diagnosis**: Plant health analysis from photos
  - ✅ **AI Chat**: Interactive Q&A for farming advice
  - ✅ **Smart Recommendations**: Personalized farming guidance
  - ✅ **Video Analysis**: Agricultural video processing
  - ✅ **Multi-modal Support**: Images, videos, and text

### 🚧 **In Development**

- **📡 Sensor Management**
  - 🔧 Register and configure sensor nodes
  - 🔧 View detailed sensor data and charts
  - 🔧 Sensor status monitoring
  - 🔧 Location-based sensor mapping

- **🚨 Alerts & Notifications**
  - 🔧 Real-time alert management
  - 🔧 Push notifications
  - 🔧 Alert history and filtering
  - 🔧 Custom notification preferences

- **📈 Analytics & Reports**
  - 🔧 Historical data visualization
  - 🔧 Interactive charts and graphs
  - 🔧 Data export functionality
  - 🔧 Comparative analysis

---

## 🛠️ Technology Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **Navigation**: React Navigation v6
- **State Management**: React Context API
- **HTTP Client**: Axios
- **Real-time**: Socket.io Client
- **Storage**: AsyncStorage
- **UI Icons**: Expo Vector Icons
- **Camera**: Expo Camera
- **Image Picker**: Expo Image Picker
- **Media Library**: Expo Media Library
- **Charts**: React Native Chart Kit *(planned)*
- **Maps**: React Native Maps *(planned)*

---

## 📋 Prerequisites

- Node.js (v18 or higher) - **Updated requirement**
- npm or yarn
- Expo CLI
- Android Studio *(for Android development)* / Xcode with iOS Simulator *(for iOS development)*
- Custom development client or native build (Expo Go is unsupported)

> ⚠️ **Expo Go Unsupported**  
> This project uses native modules like `react-native-webrtc` that aren't included in Expo Go.  
> Build a custom dev client or run a full native build instead.

---

## 🚀 Quick Start

### **1. Install Dependencies**
```bash
cd mobile
npm install
```

### **2. Environment Setup**
Create a `.env` file in the mobile directory:
```env
# API Configuration
API_BASE_URL=http://localhost:5001
SOCKET_URL=http://localhost:5001

# Optional: LiveKit Configuration (for future streaming)
LIVEKIT_URL=your-livekit-url
LIVEKIT_API_KEY=your-livekit-api-key
LIVEKIT_API_SECRET=your-livekit-api-secret
```

### **3. Start Development Server**
```bash
npx expo start --dev-client
```

### **4. Run on Device**
- Build and install a custom dev client:
```bash
npx expo run:android   # or npx expo run:ios
```
- With the dev server running, open the app from the dev client and test features

---

## 📱 **App Screens & Features**

### **🔐 Authentication Screens**
- **LoginScreen**: Secure login with email/password
- **RegisterScreen**: User registration with validation
- **LoadingScreen**: App initialization and token check

### **🏠 Main Screens**
- **DashboardScreen**: Real-time sensor data overview
- **SensorsScreen**: Sensor management and monitoring
- **AlertsScreen**: Alert management and notifications
- **ProfileScreen**: User profile and settings

### **🤖 AI Assistant Screens**
- **AIScreen**: AI features hub with navigation cards
- **ImageDiagnosisScreen**: Plant health analysis from photos
- **AIChatScreen**: Interactive AI Q&A system
- **SmartRecommendationsScreen**: Personalized farming advice
- **VideoCaptureScreen**: Video recording and upload
- **VideoAnalysisScreen**: Video analysis and results

---

## 🎯 **AI Features Guide**

### **1. Image Diagnosis**
1. Navigate to **AI Assistant** → **Image Diagnosis**
2. Tap **Select Image** or **Take Photo**
3. Upload plant photo
4. Get instant AI analysis including:
   - Plant health assessment
   - Disease identification
   - Treatment recommendations
   - Prevention strategies

### **2. AI Chat**
1. Navigate to **AI Assistant** → **AI Chat**
2. Type your farming question
3. Get AI-powered responses with:
   - Detailed explanations
   - Step-by-step guidance
   - Best practices
   - Local recommendations

### **3. Smart Recommendations**
1. Navigate to **AI Assistant** → **Smart Recommendations**
2. Provide your location, crop, and season
3. Receive personalized advice including:
   - Immediate actions
   - Short-term planning
   - Long-term strategy
   - Risk management

### **4. Video Analysis**
1. Navigate to **AI Assistant** → **Video Analysis**
2. Upload agricultural video
3. Get comprehensive analysis:
   - Field assessment
   - Problem identification
   - Solution recommendations
   - Maintenance schedules

---

## 🔧 **Development Setup**

### **1. Backend Integration**
Ensure the backend server is running:
```bash
cd backend
npm start
```

### **2. API Configuration**
Update API endpoints in `src/services/api.ts`:
```typescript
const API_BASE_URL = 'http://localhost:5001';
const SOCKET_URL = 'http://localhost:5001';
```

### **3. Authentication Testing**
Test authentication flow:
1. Register new user
2. Login with credentials
3. Verify token storage
4. Test protected routes

### **4. AI Features Testing**
Test all AI features:
1. Upload test images for diagnosis
2. Ask AI questions
3. Get smart recommendations
4. Upload and analyze videos

---

## 🧪 **Testing**

### **Manual Testing**
```bash
# Start development server
npx expo start --dev-client

# Test on device
# 1. Build dev client: npx expo run:android (or npx expo run:ios)
# 2. Launch the app from the dev client
# 3. Test all features:
#    - Authentication
#    - Dashboard
#    - AI features
#    - Real-time updates
```

### **Feature Testing Checklist**
- [ ] User registration and login
- [ ] Dashboard data loading
- [ ] Image diagnosis functionality
- [ ] AI chat responses
- [ ] Smart recommendations
- [ ] Video upload and analysis
- [ ] Real-time updates
- [ ] Offline functionality
- [ ] Error handling
- [ ] Loading states

---

## 🚀 **Deployment**

### **Expo Build**
```bash
# Install EAS CLI
npm install -g @expo/eas-cli

# Login to Expo
eas login

# Configure build
eas build:configure

# Build for platforms
eas build --platform all
```

### **App Store Deployment**
```bash
# Submit to app stores
eas submit --platform all
```

### **Environment Configuration**
```bash
# Production environment
eas secret:create --scope project --name API_BASE_URL --value https://your-api.com
eas secret:create --scope project --name SOCKET_URL --value https://your-api.com
```

---

## 🐛 **Troubleshooting**

### **Common Issues**

#### **1. App Won't Start**
```bash
# Clear Expo cache
npx expo start --clear

# Reset Metro bundler
npx expo start --reset-cache

# Check dependencies
npm install
```

#### **2. API Connection Issues**
```bash
# Verify backend is running
curl http://localhost:5001/api/health

# Check API configuration
cat .env

# Test API endpoints
curl http://localhost:5001/api/auth/login
```

#### **3. AI Features Not Working**
```bash
# Check authentication
# Ensure user is logged in

# Verify backend AI endpoints
curl -X POST http://localhost:5001/api/ai/ask-question \
  -H "Content-Type: application/json" \
  -d '{"question": "test"}'
```

#### **4. Camera/Image Picker Issues**
```bash
# Check permissions
# Ensure camera and photo library access

# Test on physical device
# Some features require real device testing
```

### **Error Solutions**

#### **"Authentication token not found"**
- Ensure user is logged in
- Check AsyncStorage for tokens
- Verify backend authentication

#### **"Network request failed"**
- Check backend server status
- Verify API URLs in configuration
- Test network connectivity

#### **"Permission denied"**
- Grant camera and photo library permissions
- Check device settings
- Restart app after permission changes

---

## 📋 **Verification Checklist**

### **✅ App Setup**
- [ ] Dependencies installed
- [ ] Environment configured
- [ ] Expo CLI installed
- [ ] Custom dev client built

### **✅ Authentication**
- [ ] Registration working
- [ ] Login functional
- [ ] Token storage working
- [ ] Protected routes accessible

### **✅ AI Features**
- [ ] Image diagnosis working
- [ ] AI chat responding
- [ ] Smart recommendations generating
- [ ] Video analysis processing

### **✅ Real-time Features**
- [ ] WebSocket connection working
- [ ] Real-time updates receiving
- [ ] Connection status showing
- [ ] Reconnection handling

---

## 📞 **Support**

### **Getting Help**
- 📧 **Email**: sackiteyjoseph@gmail.com
- 🌐 **Website**: https://agro-mesh.vercel.app/
- 📱 **Mobile App**: Run via custom dev client or native build

### **Useful Commands**
```bash
# Start development
npx expo start --dev-client

# Clear cache
npx expo start --clear

# Build for production
eas build --platform all

# Check Expo status
expo doctor
```

---

## 🎉 **Success!**

Once setup is complete, you should have:
- ✅ Working mobile app with AI integration
- ✅ Complete authentication system
- ✅ All AI features functional
- ✅ Real-time updates working
- ✅ Ready for production deployment

**Happy farming with AI!** 🌾📱✨ 

## Authentication Issues & Solutions

### Common Authentication Problems

If you're experiencing authentication failures, especially after publishing the app, here are the most common issues and solutions:

#### 1. API Base URL Configuration

**Problem**: The app uses a hardcoded IP address that may not be accessible from published apps.

**Solution**: 
- Create a `.env` file in the mobile directory with your backend URL:
```bash
EXPO_PUBLIC_API_BASE_URL=https://your-backend-domain.com/api
EXPO_PUBLIC_SOCKET_URL=https://your-backend-domain.com
```

- For local development, use your computer's IP address:
```bash
EXPO_PUBLIC_API_BASE_URL=http://192.168.1.92:5001/api
EXPO_PUBLIC_SOCKET_URL=http://192.168.1.92:5001
```

#### 2. Backend CORS Configuration

**Problem**: Published apps may be blocked by CORS policies.

**Solution**: Update your backend CORS configuration in `backend/src/app.js`:

```javascript
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:19006',
    'exp://localhost:19000',
    'https://your-frontend-domain.com',
    // Add your Expo development URLs
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
```

#### 3. Environment Variables

**Problem**: Missing or incorrect environment variables.

**Solution**: Ensure your `.env` file is properly configured and not gitignored:

```bash
# Copy the example file
cp env.example .env

# Edit with your actual values
nano .env
```

#### 4. Token Storage Issues

**Problem**: Authentication tokens not being properly stored or retrieved.

**Solution**: The app now properly uses `apiService.getAuthToken()` instead of broken local functions.

### Testing Authentication

1. **Check API Connectivity**:
```bash
curl http://your-backend-url/api/health
```

2. **Test Authentication Endpoint**:
```bash
curl -X POST http://your-backend-url/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'
```

3. **Verify Token Storage**: Check if tokens are properly stored in AsyncStorage.

### Debugging Steps

1. **Check Network Requests**: Use React Native Debugger or Flipper to monitor API calls
2. **Verify Environment Variables**: Log `process.env.EXPO_PUBLIC_API_BASE_URL` to ensure it's set correctly
3. **Test Backend Connectivity**: Ensure your backend is accessible from the device/emulator
4. **Check CORS Headers**: Verify that your backend is sending proper CORS headers 