# 👥 Contributor Guide

## 🎯 Quick Start for Contributors

### 🚀 **Frontend Contributors (Most People)**

**Goal**: UI/UX improvements, new features, bug fixes  
**Setup Time**: 2-3 minutes  
**No API keys needed**

#### Super Quick Setup
```bash
git clone <repository-url>
cd AgroMesh
./setup-frontend.sh
```

#### Manual Setup (Alternative)
```bash
git clone <repository-url>
cd AgroMesh/mobile
npm install
cp env.example .env
npm start
```

#### What You Can Do
- ✅ **UI/UX improvements** - Better designs, animations, layouts
- ✅ **New features** - Additional screens, navigation, user interactions
- ✅ **Bug fixes** - Frontend-related issues
- ✅ **Performance optimization** - React Native optimizations
- ✅ **Accessibility** - Better accessibility features
- ✅ **Localization** - Multi-language support

#### What You DON'T Need
- ❌ MongoDB Atlas account
- ❌ Google Gemini API key
- ❌ AWS account
- ❌ Backend environment setup
- ❌ Local backend server

---

### 🔧 **Backend Contributors (You)**

**Goal**: API changes, new endpoints, backend features  
**Setup Time**: 5-10 minutes  
**Requires API keys and services**

#### Setup Steps
```bash
git clone <repository-url>
cd AgroMesh
./setup.sh
# Choose option 2 for full-stack setup
```

#### Required Services
1. **MongoDB Atlas** - Database
2. **Google Gemini API** - AI features
3. **AWS Account** - Deployment

---

## 📋 Detailed Setup Instructions

### Frontend-Only Setup

#### Environment Variables (`mobile/.env`)
```bash
# Use deployed backend (no local setup needed!)
EXPO_PUBLIC_API_BASE_URL=http://agromesh-backend-prod.eba-kjq5gjc4.us-west-2.elasticbeanstalk.com/api
EXPO_PUBLIC_SOCKET_URL=http://agromesh-backend-prod.eba-kjq5gjc4.us-west-2.elasticbeanstalk.com

# Optional services (can be added later)
EXPO_PUBLIC_FIREBASE_API_KEY=
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=
EXPO_PUBLIC_FIREBASE_PROJECT_ID=
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
EXPO_PUBLIC_FIREBASE_APP_ID=

EXPO_PUBLIC_LIVEKIT_URL=
EXPO_PUBLIC_LIVEKIT_API_KEY=
EXPO_PUBLIC_LIVEKIT_API_SECRET=
```

### Backend Setup

#### Prerequisites
- Node.js (v16+)
- npm or yarn
- MongoDB Atlas account
- Google Gemini API key

#### Environment Variables (`backend/.env`)
```bash
# Server Configuration
PORT=5001
NODE_ENV=development

# Database (Required)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/agromesh?retryWrites=true&w=majority

# Authentication (Required)
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d

# AI Services (Required)
GEMINI_API_KEY=your_gemini_api_key_here

# CORS (for development)
CORS_ORIGIN=http://localhost:3000,http://localhost:19006
```

#### Service Setup

##### MongoDB Atlas
1. **Sign up**: https://www.mongodb.com/atlas
2. **Create cluster** (free tier available)
3. **Get connection string** and add to `backend/.env`

##### Google Gemini API
1. **Get key**: https://makersuite.google.com/app/apikey
2. **Add to** `backend/.env`

##### AWS Account (Deployment)
1. **Sign up**: https://aws.amazon.com
2. **Configure AWS CLI** for deployment

---

## 🚀 Development Workflow

### Frontend Development
```bash
# 1. Make your changes to mobile app code
# 2. Test locally with deployed backend
cd mobile && npm start

# 3. Commit your changes
git add .
git commit -m "Add new feature: [description]"
git push origin your-branch

# 4. Create pull request
```

### Backend Development
```bash
# 1. Set up local environment with API keys
# 2. Make backend changes and test locally
cd backend && npm start

# 3. Deploy to AWS when ready
./scripts/quick-deploy.sh

# 4. Update mobile app to use new features
```

---

## 🧪 Testing

### Frontend Testing
1. **Start app**: `cd mobile && npm start`
2. **Scan QR code** with Expo Go
3. **Test features** against deployed backend
4. **Make changes** and test again

### Backend Testing
```bash
# Health check
curl http://localhost:5001/api/health

# Test with mobile app (update mobile/.env to use localhost:5001)
```

---

## 🚨 Important Notes

### For Frontend Contributors
- **Backend is shared** - All developers use the same deployed backend
- **Test data** - Be mindful of test data you create
- **API limits** - Respect rate limits on the shared backend
- **Breaking changes** - Don't make changes that break the API contract

### For Backend Contributors
- **API compatibility** - Maintain backward compatibility
- **Environment variables** - Keep sensitive data secure
- **Testing** - Test thoroughly before deployment
- **Documentation** - Update API documentation when needed

---

## 🆘 Common Issues & Solutions

### Frontend Issues
- **"Cannot connect to backend"** → Check if AWS backend is running
- **"Authentication failed"** → Backend issue, contact backend maintainer
- **"Socket connection error"** → Verify SOCKET_URL in mobile .env

### Backend Issues
- **"MongoDB connection failed"** → Check MONGODB_URI format and network access settings
- **"JWT_SECRET not found"** → Add JWT_SECRET to .env
- **"Gemini API error"** → Check GEMINI_API_KEY

### General Issues
- **"Authentication token not found"** → Check JWT_SECRET in backend environment variables
- **"Cannot connect to backend"** → Verify EXPO_PUBLIC_API_BASE_URL points to correct backend URL

---

## 📚 Additional Documentation

- **Build Status**: [BUILD_STATUS.md](BUILD_STATUS.md) - Current project status and what's working
- **Security**: [SECURITY.md](SECURITY.md) - Security best practices and checklist

---

## 🎉 Benefits of This Setup

### For Frontend Contributors
- ✅ **Faster setup** - No backend configuration needed
- ✅ **Real environment** - Testing against production-like backend
- ✅ **No API keys** - No need to manage sensitive credentials
- ✅ **Consistent testing** - All developers test against same backend
- ✅ **Focus on frontend** - Concentrate on UI/UX improvements

### For Backend Contributors
- ✅ **Full control** - Complete backend development environment
- ✅ **Local testing** - Test changes before deployment
- ✅ **API development** - Create new endpoints and features
- ✅ **Deployment control** - Manage AWS deployment process

---

## 📞 Support

### Getting Help
1. Check this guide for detailed instructions
2. Review [BUILD_STATUS.md](BUILD_STATUS.md) for current status
3. Check AWS Elastic Beanstalk logs for backend issues
4. Create an issue in the repository

### Quick Commands Reference
```bash
# Frontend Development
cd mobile
npm start          # Start development server
npm run build      # Build for production

# Backend Development
cd backend
npm start          # Start development server
npm test           # Run tests
./scripts/quick-deploy.sh  # Deploy to AWS
```

---

**Happy contributing! 🌾✨**
