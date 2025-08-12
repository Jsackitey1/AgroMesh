
https://agro-mesh.vercel.app/

# AgroMesh - Smart Agricultural Monitoring System

A comprehensive IoT-based agricultural monitoring system with mobile app, backend API, and hardware components.

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- EAS CLI (`npm install -g eas-cli`)

### 🎯 Choose Your Setup Path

#### Option A: Frontend-Only Development (Recommended for UI/UX contributors)
- **No API keys needed**
- **No backend setup required**
- **Use deployed backend on AWS**
- **Perfect for UI/UX improvements, new features, bug fixes**

#### Option B: Full-Stack Development (For backend contributors)
- **Requires API keys and services**
- **Local backend setup needed**
- **For backend changes, API modifications, new endpoints**

### 📱 Mobile App Setup (Frontend-Only)

### 📱 Mobile App Setup (Frontend-Only)

1. **Navigate to mobile directory:**
   ```bash
   cd mobile
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp env.example .env
   ```
   
   Update `.env` to use the deployed backend:
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

4. **Start development server:**
   ```bash
   npm start
   ```

5. **Test your changes:**
   - Scan QR code with Expo Go app
   - Test all features against deployed backend
   - No local backend needed!

6. **Build for production:**
   ```bash
   # Android only
   eas build --platform android --profile production
   
   # Both platforms (requires Apple Developer account for iOS)
   eas build --platform all
   ```

### 🔧 Backend Setup (Optional - For Backend Contributors)

> **Note**: If you're only contributing to the frontend/mobile app, you can skip this section and use the deployed backend on AWS.

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp env.example .env
   ```
   
   Update `.env` with your configuration:
   ```bash
   # Server Configuration
   PORT=5001
   NODE_ENV=development
   
   # Database
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/agromesh?retryWrites=true&w=majority
   
   # Authentication
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRES_IN=7d
   
   # AI Services
   GEMINI_API_KEY=your_gemini_api_key_here
   
   # CORS (for development)
   CORS_ORIGIN=http://localhost:3000,http://localhost:19006
   ```

4. **Start development server:**
   ```bash
   npm start
   ```

### ☁️ Backend Deployment (AWS Elastic Beanstalk)

1. **Install AWS CLI and EB CLI:**
   ```bash
   # Install AWS CLI
   curl "https://awscli.amazonaws.com/AWSCLIV2.pkg" -o "AWSCLIV2.pkg"
   sudo installer -pkg AWSCLIV2.pkg -target /
   
   # Install EB CLI
   pip3 install awsebcli
   ```

2. **Configure AWS credentials:**
   ```bash
   aws configure
   # Enter your AWS Access Key ID, Secret Access Key, region, and output format
   ```

3. **Deploy to Elastic Beanstalk:**
   ```bash
   cd backend
   chmod +x scripts/quick-deploy.sh
   ./scripts/quick-deploy.sh
   ```

4. **Set environment variables in AWS:**
   ```bash
   eb setenv NODE_ENV=production PORT=8080
   eb setenv MONGODB_URI="your_mongodb_atlas_connection_string"
   eb setenv JWT_SECRET="your_jwt_secret"
   eb setenv GEMINI_API_KEY="your_gemini_api_key"
   ```

### 🗄️ Database Setup (MongoDB Atlas)

1. **Create MongoDB Atlas account:**
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Create a free cluster

2. **Configure database access:**
   - Create a database user with read/write permissions
   - Note down username and password

3. **Configure network access:**
   - Add your IP address or `0.0.0.0/0` for all IPs

4. **Get connection string:**
   - Format: `mongodb+srv://username:password@cluster.mongodb.net/agromesh?retryWrites=true&w=majority`
   - Replace `username`, `password`, and `cluster` with your actual values

### 🤖 AI Services Setup (Google Gemini)

1. **Get Gemini API key:**
   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key

2. **Add to environment variables:**
   - Backend: Add to `.env` file
   - AWS: Set using `eb setenv GEMINI_API_KEY="your_key"`

### 📋 Required Services Setup

#### MongoDB Atlas
- **Purpose**: Database for user data, sensor readings, videos, alerts
- **Setup**: Follow the database setup section above
- **Cost**: Free tier available

#### Google Gemini API
- **Purpose**: AI-powered video analysis and recommendations
- **Setup**: Follow the AI services setup section above
- **Cost**: Pay-per-use, generous free tier

#### AWS Elastic Beanstalk (Optional)
- **Purpose**: Host backend API in production
- **Setup**: Follow the backend deployment section above
- **Cost**: Free tier available for 12 months

#### Firebase (Optional)
- **Purpose**: Push notifications, analytics
- **Setup**: Create Firebase project and add config to mobile `.env`
- **Cost**: Generous free tier

#### LiveKit (Optional)
- **Purpose**: Real-time video streaming
- **Setup**: Create LiveKit account and add config to mobile `.env`
- **Cost**: Pay-per-use

### 🔍 Testing the Setup

1. **Test Backend:**
   ```bash
   cd backend
   npm start
   curl http://localhost:5001/api/health
   ```

2. **Test Mobile App:**
   ```bash
   cd mobile
   npm start
   # Scan QR code with Expo Go app
   ```

3. **Test Authentication:**
   - Register a new user in the mobile app
   - Try logging in
   - Test video upload functionality

### 🚨 Common Issues & Solutions

#### Authentication Issues
- **Problem**: "Authentication token not found"
- **Solution**: Ensure JWT_SECRET is set in backend environment variables

#### Database Connection Issues
- **Problem**: "MongoDB connection failed"
- **Solution**: Check MONGODB_URI format and network access settings

#### Mobile App Connection Issues
- **Problem**: "Cannot connect to backend"
- **Solution**: Verify EXPO_PUBLIC_API_BASE_URL points to correct backend URL

#### WebSocket Issues
- **Problem**: "Socket connection error"
- **Solution**: Ensure EXPO_PUBLIC_SOCKET_URL is set correctly

### 📁 Project Structure

```
AgroMesh/
├── mobile/                 # React Native mobile app
│   ├── src/
│   │   ├── screens/       # App screens
│   │   ├── services/      # API and WebSocket services
│   │   ├── contexts/      # React contexts
│   │   └── components/    # Reusable components
│   ├── .env              # Environment variables
│   └── package.json
├── backend/               # Node.js backend API
│   ├── src/
│   │   ├── routes/        # API routes
│   │   ├── models/        # MongoDB models
│   │   ├── controllers/   # Route controllers
│   │   └── services/      # Business logic
│   ├── .env              # Environment variables
│   └── package.json
├── hardware/              # Arduino sensor code
├── firmware/              # IoT device firmware
└── docs/                  # Documentation
```

### 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### 📄 License

This project is licensed under the MIT License.

### 🆘 Support

For issues and questions:
1. Check the Common Issues section above
2. Review the logs in your terminal
3. Check AWS Elastic Beanstalk logs if deployed
4. Create an issue in the repository

---

**Note**: This is a production-ready application. Make sure to:
- Use strong JWT secrets in production
- Configure proper CORS settings
- Set up monitoring and logging
- Follow security best practices
- Keep dependencies updated

