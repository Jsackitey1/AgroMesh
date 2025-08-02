# 🔒 Security Guide - AgroMesh

## 🚨 **CRITICAL SECURITY REQUIREMENTS**

### **Environment Variables**
All sensitive data MUST be stored in environment variables. Never hardcode API keys, secrets, or credentials in your code.

### **Required Environment Variables**

#### **Backend (.env)**
```bash
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/agromesh

# JWT Authentication
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-make-it-long-and-random

# Google Gemini AI
GEMINI_API_KEY=your-gemini-api-key-here

# Server Configuration
PORT=5001
NODE_ENV=development
```

#### **Mobile App (.env)**
```bash
# Firebase Configuration
EXPO_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key-here
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
EXPO_PUBLIC_FIREBASE_APP_ID=your-app-id

# LiveKit Configuration
EXPO_PUBLIC_LIVEKIT_URL=wss://your-livekit-server.com
EXPO_PUBLIC_LIVEKIT_API_KEY=your-livekit-api-key
EXPO_PUBLIC_LIVEKIT_API_SECRET=your-livekit-api-secret

# API Configuration
EXPO_PUBLIC_API_BASE_URL=http://192.168.1.92:5001/api
EXPO_PUBLIC_SOCKET_URL=http://192.168.1.92:5001
```

## 🔐 **Security Best Practices**

### **1. API Key Management**
- ✅ Store all API keys in environment variables
- ✅ Use different keys for development and production
- ✅ Rotate keys regularly
- ✅ Never commit `.env` files to version control

### **2. JWT Security**
- ✅ Use strong, random JWT secrets (minimum 32 characters)
- ✅ Set appropriate token expiration times
- ✅ Validate tokens on every request
- ✅ Implement token refresh mechanisms

### **3. Database Security**
- ✅ Use connection strings with authentication
- ✅ Enable MongoDB Atlas security features
- ✅ Use read-only database users where possible
- ✅ Regularly backup and encrypt data

### **4. File Upload Security**
- ✅ Validate file types and sizes
- ✅ Scan uploaded files for malware
- ✅ Store files in secure cloud storage
- ✅ Use signed URLs for file access

### **5. API Security**
- ✅ Implement rate limiting
- ✅ Use HTTPS in production
- ✅ Validate all input data
- ✅ Implement proper error handling

## 🛡️ **Security Checklist**

### **Before Deployment**
- [ ] All API keys moved to environment variables
- [ ] JWT secret is strong and random
- [ ] Database connection is secure
- [ ] File upload validation is implemented
- [ ] Rate limiting is configured
- [ ] HTTPS is enabled
- [ ] Error messages don't expose sensitive data

### **Regular Maintenance**
- [ ] Rotate API keys quarterly
- [ ] Update dependencies monthly
- [ ] Review access logs weekly
- [ ] Backup data daily
- [ ] Monitor for security alerts

## 🚫 **What NOT to Do**

### **Never:**
- ❌ Hardcode API keys in source code
- ❌ Use weak JWT secrets like "changeme"
- ❌ Commit `.env` files to Git
- ❌ Share API keys in public repositories
- ❌ Use default passwords
- ❌ Expose sensitive data in error messages
- ❌ Store secrets in client-side code

### **Examples of Bad Practices:**
```javascript
// ❌ DON'T DO THIS
const API_KEY = "AIzaSyCzzSujRIERxd41oN2gAnXvzKxM60I-ITY";
const JWT_SECRET = "changeme";

// ✅ DO THIS INSTEAD
const API_KEY = process.env.GEMINI_API_KEY;
const JWT_SECRET = process.env.JWT_SECRET;
```

## 🔍 **Security Monitoring**

### **Log Monitoring**
- Monitor authentication attempts
- Track API usage patterns
- Watch for unusual file uploads
- Monitor database access

### **Alert Setup**
- Failed authentication attempts
- Unusual API usage spikes
- Large file uploads
- Database connection errors

## 📞 **Security Contacts**

If you discover a security vulnerability:
1. **DO NOT** create a public issue
2. Email: sackiteyjoseph@gmail.com
3. Include detailed description and steps to reproduce
4. Allow 48 hours for initial response

## 🔄 **Security Updates**

This document is updated regularly. Check back monthly for:
- New security requirements
- Updated best practices
- Security tool recommendations
- Incident response procedures

---

**Remember**: Security is everyone's responsibility. When in doubt, ask for help rather than taking shortcuts. 