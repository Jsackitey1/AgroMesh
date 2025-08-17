# 🔧 AgroMesh Troubleshooting Guide

## 🚨 Common Issues & Solutions

### **1. "Cannot connect to backend" Error**

**Symptoms:**
- App shows "Connection failed" or "Cannot connect to server"
- API calls return network errors
- Socket connection fails

**Causes:**
- Backend server is down
- Network connectivity issues
- Firewall blocking connections
- Incorrect backend URL in `.env`

**Solutions:**
1. **Check backend status:**
   ```bash
   curl http://agromesh-backend-prod.eba-kjq5gjc4.us-west-2.elasticbeanstalk.com/api/health
   ```

2. **Verify your `.env` file:**
   ```bash
   cd mobile
   cat .env
   # Should contain:
   # EXPO_PUBLIC_API_BASE_URL=http://agromesh-backend-prod.eba-kjq5gjc4.us-west-2.elasticbeanstalk.com/api
   # EXPO_PUBLIC_SOCKET_URL=http://agromesh-backend-prod.eba-kjq5gjc4.us-west-2.elasticbeanstalk.com
   ```

3. **Check BUILD_STATUS.md** for current backend status

4. **Try local backend setup** if deployed backend is down:
   ```bash
   cd backend
   npm install
   cp env.example .env
   # Add your API keys to .env
   npm start
   ```

---

### **2. "Node.js version incompatible" Error**

**Symptoms:**
- Setup script fails with version error
- `npm install` fails
- Expo CLI errors

**Causes:**
- Node.js version too old (need v18+)
- Multiple Node.js versions installed

**Solutions:**
1. **Check Node.js version:**
   ```bash
   node --version
   # Should be v18.0.0 or higher
   ```

2. **Install/Update Node.js:**
   ```bash
   # Using nvm (recommended)
   nvm install 18.19.0
   nvm use 18.19.0
   
   # Or download from https://nodejs.org/
   ```

3. **Use project-specific Node.js version:**
   ```bash
   cd mobile
   nvm use  # Uses .nvmrc file
   ```

---

### **3. "Dependencies installation failed"**

**Symptoms:**
- `npm install` fails
- Missing modules errors
- Permission errors

**Causes:**
- Network connectivity issues
- Insufficient disk space
- Permission problems
- Corrupted node_modules

**Solutions:**
1. **Clear npm cache:**
   ```bash
   npm cache clean --force
   ```

2. **Delete node_modules and reinstall:**
   ```bash
   cd mobile
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Check disk space:**
   ```bash
   df -h
   # Ensure you have at least 1GB free
   ```

4. **Use different npm registry:**
   ```bash
   npm config set registry https://registry.npmjs.org/
   ```

---

### **4. "Expo CLI not found" Error**

**Symptoms:**
- `expo` command not found
- Setup script fails on global dependencies

**Causes:**
- Expo CLI not installed globally
- PATH issues
- Permission problems

**Solutions:**
1. **Install Expo CLI:**
   ```bash
   npm install -g @expo/cli
   ```

2. **Check installation:**
   ```bash
   expo --version
   ```

3. **Use npx instead:**
   ```bash
   npx expo start
   ```

---

### **5. "QR Code doesn't work"**

**Symptoms:**
- Can't scan QR code
- Expo Go app can't connect
- "Unable to connect to development server"

**Causes:**
- Firewall blocking connections
- Wrong network (phone and computer on different networks)
- Development server not accessible from phone

**Solutions:**
1. **Check network connectivity:**
   - Ensure phone and computer are on same WiFi network
   - Try mobile hotspot from computer

2. **Check firewall settings:**
   - Allow Expo on Windows Firewall
   - Check macOS firewall settings

3. **Use tunnel mode:**
   ```bash
   cd mobile
   npx expo start --tunnel
   ```

4. **Try different connection types:**
   ```bash
   npx expo start --lan  # Local network
   npx expo start --localhost  # Localhost only
   ```

---

### **6. "Authentication failed" Error**

**Symptoms:**
- Login/Register fails
- "Invalid credentials" errors
- JWT token errors

**Causes:**
- Backend authentication service down
- Incorrect JWT configuration
- Database connection issues

**Solutions:**
1. **Check backend health:**
   ```bash
   curl http://agromesh-backend-prod.eba-kjq5gjc4.us-west-2.elasticbeanstalk.com/api/health
   ```

2. **Clear app data:**
   - Delete and reinstall Expo Go app
   - Clear AsyncStorage in development

3. **Check backend logs** (contact maintainer)

---

### **7. "AI features not working"**

**Symptoms:**
- Image analysis fails
- AI chat doesn't respond
- Video analysis errors

**Causes:**
- Google Gemini API key issues
- API rate limits exceeded
- Backend AI service down

**Solutions:**
1. **Check if backend is running** (see issue #1)

2. **For local development, add API keys:**
   ```bash
   cd backend
   # Add GEMINI_API_KEY to .env file
   ```

3. **Check API quotas** (contact maintainer)

---

### **8. "Build fails" (Production builds)**

**Symptoms:**
- `eas build` fails
- Android/iOS build errors
- App store submission issues

**Causes:**
- Missing EAS configuration
- Platform-specific issues
- Code signing problems

**Solutions:**
1. **Check EAS configuration:**
   ```bash
   cd mobile
   cat eas.json
   ```

2. **Update EAS CLI:**
   ```bash
   npm install -g eas-cli
   ```

3. **Check platform requirements:**
   - iOS: Requires macOS and Xcode
   - Android: Requires Android Studio

---

## 🔍 Diagnostic Commands

### **System Information**
```bash
# Check Node.js and npm versions
node --version
npm --version

# Check OS and architecture
uname -a

# Check available disk space
df -h

# Check network connectivity
ping google.com
```

### **Project Health Check**
```bash
# Check if all dependencies are installed
cd mobile && npm list --depth=0
cd ../backend && npm list --depth=0

# Check environment files
ls -la mobile/.env
ls -la backend/.env

# Test backend connectivity
curl -v http://agromesh-backend-prod.eba-kjq5gjc4.us-west-2.elasticbeanstalk.com/api/health
```

### **Mobile App Debug**
```bash
# Start with verbose logging
cd mobile
npx expo start --verbose

# Check Expo CLI version
npx expo --version

# List available devices
npx expo devices
```

---

## 📞 Getting Help

### **Before asking for help:**
1. ✅ Read this troubleshooting guide
2. ✅ Check BUILD_STATUS.md for current status
3. ✅ Try the diagnostic commands above
4. ✅ Search existing GitHub issues

### **When creating an issue:**
1. **Include system information:**
   - OS version
   - Node.js version
   - npm version
   - Expo CLI version

2. **Include error details:**
   - Full error message
   - Steps to reproduce
   - Screenshots if applicable

3. **Include diagnostic output:**
   - Results of health check commands
   - Backend connectivity test results

### **Contact channels:**
- 📧 **GitHub Issues**: Create detailed issue with all information
- 📚 **Documentation**: Check README.md and CONTRIBUTOR_GUIDE.md
- 🔍 **Build Status**: Check BUILD_STATUS.md for current project status

---

## 🎯 Quick Fix Checklist

If you're having trouble, try these steps in order:

1. **✅ Run setup script:**
   ```bash
   ./setup-frontend.sh
   ```

2. **✅ Check Node.js version:**
   ```bash
   node --version  # Should be v18+
   ```

3. **✅ Verify environment files:**
   ```bash
   ls -la mobile/.env
   ls -la backend/.env
   ```

4. **✅ Test backend connectivity:**
   ```bash
   curl http://agromesh-backend-prod.eba-kjq5gjc4.us-west-2.elasticbeanstalk.com/api/health
   ```

5. **✅ Clear and reinstall dependencies:**
   ```bash
   cd mobile && rm -rf node_modules package-lock.json && npm install
   ```

6. **✅ Try tunnel mode:**
   ```bash
   cd mobile && npx expo start --tunnel
   ```

7. **✅ Check BUILD_STATUS.md** for current project status

---

**Still having issues?** Create a detailed GitHub issue with all the information above! 🚀
