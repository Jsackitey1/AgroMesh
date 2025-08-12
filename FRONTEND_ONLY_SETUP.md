# 🎨 Frontend-Only Development Guide

## For Frontend/Mobile App Contributors

Since the AgroMesh backend is already deployed and running on AWS, you can contribute to the frontend without setting up the backend locally!

### 🚀 Quick Setup (No Backend Required)

```bash
# Clone the repository
git clone <repository-url>
cd AgroMesh

# Setup mobile app only
cd mobile
npm install
cp env.example .env
```

### 📱 Configure Mobile App

Update `mobile/.env` to use the deployed backend:

```bash
# Use the deployed backend (no local setup needed!)
EXPO_PUBLIC_API_BASE_URL=http://agromesh-backend-prod.eba-kjq5gjc4.us-west-2.elasticbeanstalk.com/api
EXPO_PUBLIC_SOCKET_URL=http://agromesh-backend-prod.eba-kjq5gjc4.us-west-2.elasticbeanstalk.com

### 🎯 Start Development

```bash
# Start mobile app development
npm start

# Scan QR code with Expo Go app
# You can now test all features against the deployed backend!
```

### ✅ What You Can Do

- **Test all features** - Authentication, AI chat, video upload, etc.
- **Modify UI/UX** - Update screens, components, styling
- **Add new features** - New screens, navigation, user interactions
- **Fix bugs** - Frontend-related issues
- **Improve performance** - Optimize React Native code

### 🔧 What You DON'T Need

- ❌ MongoDB Atlas account
- ❌ Google Gemini API key
- ❌ AWS account
- ❌ Backend environment setup
- ❌ Local backend server

### 🧪 Testing Your Changes

1. **Start the app**: `npm start`
2. **Test on device**: Scan QR code with Expo Go
3. **Test features**:
   - Register/login
   - AI chat
   - Image upload
   - Video analysis
   - All other features

### 📝 Development Workflow

```bash
# 1. Make your changes to mobile app code
# 2. Test locally with deployed backend
# 3. Commit your changes
git add .
git commit -m "Add new feature: [description]"
git push origin your-branch

# 4. Create pull request
```

### 🚨 Important Notes

- **Backend is shared** - All developers use the same deployed backend
- **Test data** - Be mindful of test data you create
- **API limits** - Respect rate limits on the shared backend
- **Breaking changes** - Don't make changes that break the API contract

### 🔍 Debugging

If you encounter issues:

1. **Check network requests** in Expo DevTools
2. **Verify environment variables** are set correctly
3. **Test backend health**: 
   ```bash
   curl http://agromesh-backend-prod.eba-kjq5gjc4.us-west-2.elasticbeanstalk.com/api/health
   ```
4. **Check backend logs** (ask project maintainer)

### 🎉 Benefits of This Approach

- ✅ **Faster setup** - No backend configuration needed
- ✅ **Real environment** - Testing against production-like backend
- ✅ **No API keys** - No need to manage sensitive credentials
- ✅ **Consistent testing** - All developers test against same backend
- ✅ **Focus on frontend** - Concentrate on UI/UX improvements

### 📚 Next Steps

1. **Start with mobile app**: `cd mobile && npm start`
2. **Pick an area to improve**: UI, features, performance
3. **Test thoroughly** with the deployed backend
4. **Submit your contribution** via pull request

---

**Happy frontend development! 🎨✨**
