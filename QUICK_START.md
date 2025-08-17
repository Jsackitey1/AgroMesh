# 🚀 AgroMesh Quick Start Guide

## 🎯 Choose Your Path

### **👥 Frontend Contributors (UI/UX, Features, Bug Fixes)**
**Setup Time**: 2-3 minutes | **No API keys needed**

### **🔧 Backend Contributors (API, Database, AI Features)**
**Setup Time**: 5-10 minutes | **Requires API keys**

---

## 🚀 **Frontend Contributors - Super Quick Setup**

### **Step 1: Clone & Setup**
```bash
git clone <repository-url>
cd AgroMesh
./setup-frontend.sh
```

### **Step 2: Start Development**
```bash
cd mobile
npm start
```

### **Step 3: Test on Your Phone**
1. Install **Expo Go** app from App Store/Google Play
2. Scan the QR code with Expo Go
3. Test all features against deployed backend

**That's it!** 🎉 You can now work on UI/UX improvements, add features, and fix bugs.

---

## 🔧 **Backend Contributors - Full Setup**

### **Step 1: Clone & Setup**
```bash
git clone <repository-url>
cd AgroMesh
./setup.sh
# Choose option 2 for full-stack setup
```

### **Step 2: Configure Services**

#### **Required Services:**
1. **MongoDB Atlas** (Free tier available)
   - Sign up: https://www.mongodb.com/atlas
   - Create cluster and get connection string

2. **Google Gemini API** (Generous free tier)
   - Get key: https://makersuite.google.com/app/apikey

3. **AWS Account** (Optional, for deployment)
   - Sign up: https://aws.amazon.com

#### **Environment Setup:**
```bash
cd backend
cp env.example .env
# Edit .env with your API keys
```

### **Step 3: Start Development**
```bash
# Backend
cd backend && npm start

# Mobile (in new terminal)
cd mobile && npm start
```

---

## 🚨 **Common Issues & Quick Fixes**

### **Issue 1: "Node.js version incompatible"**
```bash
# Check version
node --version  # Should be v18+

# Fix: Install/update Node.js
nvm install 18.19.0
nvm use 18.19.0
```

### **Issue 2: "Cannot connect to backend"**
```bash
# Test backend health
curl http://agromesh-backend-prod.eba-kjq5gjc4.us-west-2.elasticbeanstalk.com/api/health

# If down, check BUILD_STATUS.md for updates
```

### **Issue 3: "Dependencies installation failed"**
```bash
# Clear cache and reinstall
cd mobile
rm -rf node_modules package-lock.json
npm install
```

### **Issue 4: "QR code doesn't work"**
```bash
# Try tunnel mode
cd mobile
npx expo start --tunnel
```

---

## 📱 **Testing Your Setup**

### **Frontend Testing Checklist:**
- ✅ App launches without errors
- ✅ Can register/login user
- ✅ Dashboard loads with sensor data
- ✅ AI features work (image analysis, chat)
- ✅ Real-time updates work

### **Backend Testing Checklist:**
- ✅ Server starts without errors
- ✅ Database connection successful
- ✅ API endpoints respond
- ✅ AI services working

---

## 🔍 **Diagnostic Commands**

### **System Health Check:**
```bash
# Check versions
node --version
npm --version
npx expo --version

# Check project setup
ls -la mobile/.env
ls -la backend/.env

# Test backend
curl http://agromesh-backend-prod.eba-kjq5gjc4.us-west-2.elasticbeanstalk.com/api/health
```

### **Mobile App Debug:**
```bash
cd mobile
npx expo start --verbose
```

---

## 📚 **What You Can Work On**

### **Frontend Contributors:**
- 🎨 UI/UX improvements
- 📱 New screens and features
- 🐛 Bug fixes
- ⚡ Performance optimization
- 🌐 Localization
- ♿ Accessibility improvements

### **Backend Contributors:**
- 🔌 New API endpoints
- 🗄️ Database optimizations
- 🤖 AI feature enhancements
- 🔐 Security improvements
- 📊 Analytics and monitoring
- 🚀 Deployment automation

---

## 🆘 **Getting Help**

### **Before asking for help:**
1. ✅ Read this guide
2. ✅ Check TROUBLESHOOTING.md
3. ✅ Try diagnostic commands
4. ✅ Check BUILD_STATUS.md

### **When creating an issue:**
- Include your OS and Node.js version
- Share the exact error message
- Include diagnostic command output
- Describe what you were trying to do

---

## 🎉 **Success Indicators**

### **Frontend Success:**
- ✅ Mobile app launches in Expo Go
- ✅ Can connect to deployed backend
- ✅ All features work as expected
- ✅ Can make UI/UX changes and see them

### **Backend Success:**
- ✅ Local server starts without errors
- ✅ Database connection established
- ✅ API endpoints respond correctly
- ✅ AI features work with your API keys

---

## 🚀 **Next Steps**

### **For Frontend Contributors:**
1. Explore the codebase in `mobile/src/`
2. Pick an issue from GitHub
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### **For Backend Contributors:**
1. Explore API routes in `backend/src/routes/`
2. Check database models in `backend/src/models/`
3. Test your changes locally
4. Deploy to AWS when ready
5. Update mobile app to use new features

---

**Happy coding! 🌾✨**

For detailed documentation, see:
- 📖 [CONTRIBUTOR_GUIDE.md](CONTRIBUTOR_GUIDE.md) - Complete development guide
- 🔧 [TROUBLESHOOTING.md](TROUBLESHOOTING.md) - Common issues and solutions
- 📊 [BUILD_STATUS.md](BUILD_STATUS.md) - Current project status
