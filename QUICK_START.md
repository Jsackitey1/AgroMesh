# 🚀 AgroMesh Quick Start Guide

## For New Developers

### 🎯 Choose Your Path

#### Option A: Frontend-Only Development (Recommended for UI/UX contributors)
- **No API keys needed**
- **Use deployed backend on AWS**
- **Perfect for UI improvements, new features, bug fixes**

#### Option B: Full-Stack Development (For backend contributors)
- **Requires API keys and services**
- **Local backend setup needed**

### Option 1: Automated Setup (Recommended)
```bash
# Clone the repository
git clone <repository-url>
cd AgroMesh

# Run the automated setup script
./setup.sh
```

### Option 2: Manual Setup

#### 1. Prerequisites
- Node.js (v16+)
- npm or yarn
- Expo CLI: `npm install -g @expo/cli`
- EAS CLI: `npm install -g eas-cli`

#### 2. Mobile App Setup (Frontend-Only)
```bash
cd mobile
npm install
cp env.example .env
# Edit .env to use deployed backend URLs
npm start
```

#### 3. Backend Setup (Optional - Only if contributing to backend)
```bash
cd backend
npm install
cp env.example .env
# Edit .env with your API keys
npm start
```

## 🔑 Required API Keys & Services

### Essential (Required)
1. **MongoDB Atlas** - Database
   - Sign up: https://www.mongodb.com/atlas
   - Get connection string
   - Add to `backend/.env`

2. **Google Gemini API** - AI Features
   - Get key: https://makersuite.google.com/app/apikey
   - Add to `backend/.env`

### Optional
3. **AWS Account** - Backend hosting
4. **Firebase** - Push notifications
5. **LiveKit** - Real-time video

## 📱 Environment Variables

### Mobile App (`mobile/.env`) - Frontend-Only Setup
```bash
# Use deployed backend (no local setup needed!)
EXPO_PUBLIC_API_BASE_URL=http://agromesh-backend-prod.eba-kjq5gjc4.us-west-2.elasticbeanstalk.com/api
EXPO_PUBLIC_SOCKET_URL=http://agromesh-backend-prod.eba-kjq5gjc4.us-west-2.elasticbeanstalk.com
```

### Backend (`backend/.env`)
```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/agromesh
JWT_SECRET=your_jwt_secret_key
GEMINI_API_KEY=your_gemini_api_key
PORT=5001
NODE_ENV=development
```

## 🚀 Quick Commands

```bash
# Start mobile app
cd mobile && npm start

# Start backend
cd backend && npm start

# Build for production
cd mobile && eas build --platform android

# Deploy backend to AWS
cd backend && ./scripts/quick-deploy.sh
```

## 🧪 Test Your Setup

1. **Backend Health Check:**
   ```bash
   curl http://localhost:5001/api/health
   ```

2. **Mobile App:**
   - Scan QR code with Expo Go app
   - Register a new user
   - Test AI features

## 🆘 Common Issues

- **"Authentication token not found"** → Check JWT_SECRET in backend
- **"Cannot connect to backend"** → Verify API_BASE_URL in mobile .env
- **"MongoDB connection failed"** → Check MONGODB_URI format
- **"Socket connection error"** → Verify SOCKET_URL in mobile .env

## 📚 Full Documentation

See `README.md` for complete setup instructions and troubleshooting.
