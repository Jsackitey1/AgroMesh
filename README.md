
https://agro-mesh.vercel.app/

# 🌾 AgroMesh - Smart Agricultural Monitoring System

A comprehensive IoT-based agricultural monitoring system with mobile app, backend API, and hardware components.

## 🚀 Quick Start

### 👥 **For Contributors (Most People)**
Want to improve UI/UX, add features, or fix bugs? Start here:
```bash
git clone <repository-url>
cd AgroMesh
./setup-frontend.sh
```
**Setup time**: 2-3 minutes | **No API keys needed**

### 🔧 **For Backend Developers**
Working on API changes, new endpoints, or backend features?
```bash
git clone <repository-url>
cd AgroMesh
./setup.sh
# Choose option 2 for full-stack setup
```
**Setup time**: 5-10 minutes | **Requires API keys**

---

## 📚 Documentation

| Document | Purpose | For |
|----------|---------|-----|
| **[QUICK_START.md](QUICK_START.md)** | **Quick setup guide with common fixes** | **All contributors** |
| **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** | **Common issues and solutions** | **All contributors** |
| **[CONTRIBUTOR_GUIDE.md](CONTRIBUTOR_GUIDE.md)** | Complete setup and development guide | All contributors |
| **[BUILD_STATUS.md](BUILD_STATUS.md)** | Current project status and what's working | Everyone |
| **[SECURITY.md](SECURITY.md)** | Security best practices and checklist | Backend developers |
| **[FEATURE_PLANS.md](FEATURE_PLANS.md)** | Future feature implementation plans | Developers |

---

## 🎯 What You Can Do

### Frontend Contributors
- ✅ **UI/UX improvements** - Better designs, animations, layouts
- ✅ **New features** - Additional screens, navigation, user interactions
- ✅ **Bug fixes** - Frontend-related issues
- ✅ **Performance optimization** - React Native optimizations
- ✅ **Accessibility** - Better accessibility features
- ✅ **Localization** - Multi-language support

### Backend Contributors
- ✅ **API development** - New endpoints and features
- ✅ **Database changes** - Schema updates and optimizations
- ✅ **AI integration** - Enhanced Gemini AI features
- ✅ **Deployment** - AWS Elastic Beanstalk management
- ✅ **Security** - Authentication and authorization improvements

---

## 🏗️ Project Structure

```
AgroMesh/
├── mobile/                 # React Native mobile app
│   ├── src/screens/       # App screens
│   ├── src/services/      # API and WebSocket services
│   └── .env              # Environment variables
├── backend/               # Node.js backend API
│   ├── src/routes/        # API routes
│   ├── src/models/        # MongoDB models
│   └── .env              # Environment variables
├── hardware/              # Arduino sensor code
├── firmware/              # IoT device firmware
└── docs/                  # Additional documentation
```

---

## 🔑 Required Services

### For Frontend Contributors
**Nothing needed!** Use the deployed backend on AWS.

### For Backend Contributors
- **MongoDB Atlas** - Database (free tier available)
- **Google Gemini API** - AI features (generous free tier)
- **AWS Account** - Backend hosting (free tier for 12 months)

---

## 🧪 Testing

### Frontend Testing
```bash
cd mobile && npm start
# Scan QR code with Expo Go app
# Test all features against deployed backend
```

### Backend Testing
```bash
cd backend && npm start
curl http://localhost:5001/api/health
```

---

## 🚨 Common Issues

- **"Cannot connect to backend"** → Check if AWS backend is running
- **"Authentication failed"** → Backend issue, contact maintainer
- **"MongoDB connection failed"** → Check MONGODB_URI format (backend only)
- **"Node.js version incompatible"** → Install Node.js v18+ (see TROUBLESHOOTING.md)
- **"QR code doesn't work"** → Try tunnel mode: `npx expo start --tunnel`

---

## 📞 Support

1. **First**: Check **[QUICK_START.md](QUICK_START.md)** for quick fixes
2. **Second**: Check **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** for detailed solutions
3. **Third**: Review **[CONTRIBUTOR_GUIDE.md](CONTRIBUTOR_GUIDE.md)** for complete instructions
4. **Fourth**: Check **[BUILD_STATUS.md](BUILD_STATUS.md)** for current status
5. **Finally**: Create an issue in the repository

---

## 🎉 Current Status

- ✅ **Mobile App**: Production build completed
- ✅ **Backend**: Deployed and running on AWS
- ✅ **Database**: MongoDB Atlas connected
- ✅ **AI Features**: All working (image analysis, video analysis, chat)
- ✅ **Authentication**: Fixed and working
- ✅ **WebSocket**: Real-time updates working

---

**Happy coding! 🌾✨**

