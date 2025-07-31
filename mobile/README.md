# AgroMesh Mobile App

A comprehensive React Native mobile application for the AgroMesh precision agriculture platform, providing farmers with real-time sensor monitoring, AI-powered insights, and smart farming solutions.

## 🚀 Features

### ✅ Implemented

- **🔐 Authentication & User Management**
  - Secure login and registration with JWT tokens
  - Role-based access (Farmer, Admin, Researcher)
  - Profile management and settings
  - Multi-language support ready

- **📱 Modern UI/UX**
  - Clean, intuitive interface designed for farmers
  - Responsive design for various screen sizes
  - Pull-to-refresh functionality
  - Loading states and error handling

- **🏠 Dashboard**
  - Real-time overview of sensor status
  - Summary cards with key metrics
  - Quick action buttons
  - Latest sensor readings display

- **🔌 Real-Time Communication**
  - Socket.io integration for live updates
  - Real-time sensor data streaming
  - Instant alert notifications
  - Connection status management

- **📊 Data Management**
  - Secure API communication with backend
  - Offline data caching
  - Error handling and retry logic
  - Token-based authentication

### 🚧 Coming Soon

- **📡 Sensor Management**
  - Register and configure sensor nodes
  - View detailed sensor data and charts
  - Sensor status monitoring
  - Location-based sensor mapping

- **🚨 Alerts & Notifications**
  - Real-time alert management
  - Push notifications
  - Alert history and filtering
  - Custom notification preferences

- **🤖 AI-Powered Features**
  - Plant health diagnosis from images
  - Video analysis for crop monitoring
  - AI-powered agricultural Q&A
  - Smart recommendations

- **📈 Analytics & Reports**
  - Historical data visualization
  - Interactive charts and graphs
  - Data export functionality
  - Comparative analysis

## 🛠️ Technology Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **Navigation**: React Navigation v6
- **State Management**: React Context API
- **HTTP Client**: Axios
- **Real-time**: Socket.io Client
- **Storage**: AsyncStorage
- **UI Icons**: Expo Vector Icons
- **Charts**: React Native Chart Kit (planned)
- **Maps**: React Native Maps (planned)

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd mobile
npm install
```

### 2. Environment Setup

Create a `.env` file in the mobile directory:

```env
# API Configuration
API_BASE_URL=http://localhost:5000/api
SOCKET_URL=http://localhost:5000

# Optional: Push Notifications
EXPO_PUSH_TOKEN=your-expo-push-token
```

### 3. Start the Development Server

```bash
# Start Expo development server
npm start

# Or run directly on device/simulator
npm run ios
npm run android
```

### 4. Backend Connection

Ensure your AgroMesh backend is running on `http://localhost:5000` before testing the mobile app.

## 📱 App Structure

```
mobile/
├── src/
│   ├── contexts/          # React Context providers
│   │   └── AuthContext.tsx
│   ├── navigation/        # Navigation configuration
│   │   └── AppNavigator.tsx
│   ├── screens/           # App screens
│   │   ├── auth/          # Authentication screens
│   │   │   ├── LoginScreen.tsx
│   │   │   └── RegisterScreen.tsx
│   │   ├── main/          # Main app screens
│   │   │   ├── DashboardScreen.tsx
│   │   │   ├── SensorsScreen.tsx
│   │   │   ├── AlertsScreen.tsx
│   │   │   ├── AIScreen.tsx
│   │   │   └── ProfileScreen.tsx
│   │   └── LoadingScreen.tsx
│   ├── services/          # API and external services
│   │   ├── api.ts         # REST API service
│   │   └── socket.ts      # Socket.io service
│   └── types/             # TypeScript type definitions
│       └── index.ts
├── App.tsx                # Main app component
└── package.json
```

## 🔧 Configuration

### API Configuration

Update the API base URL in `src/services/api.ts`:

```typescript
const API_BASE_URL = 'http://your-backend-url:5000/api';
```

### Socket Configuration

Update the Socket.io URL in `src/services/socket.ts`:

```typescript
const SOCKET_URL = 'http://your-backend-url:5000';
```

### Environment Variables

The app supports environment variables for configuration:

- `API_BASE_URL`: Backend API endpoint
- `SOCKET_URL`: Socket.io server URL
- `EXPO_PUSH_TOKEN`: Expo push notification token

## 📱 Screens Overview

### Authentication Flow
1. **Login Screen**: Email/password authentication
2. **Register Screen**: User registration with role selection
3. **Loading Screen**: App initialization

### Main App Flow
1. **Dashboard**: Overview, summary cards, quick actions
2. **Sensors**: Sensor management and monitoring
3. **Alerts**: Alert management and notifications
4. **AI Assistant**: AI-powered features
5. **Profile**: User settings and account management

## 🔌 API Integration

The app integrates with the AgroMesh backend through:

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update profile
- `POST /api/auth/change-password` - Change password

### Sensor Endpoints
- `GET /api/sensors` - Get user's sensors
- `POST /api/sensors/register` - Register new sensor
- `GET /api/sensors/:nodeId` - Get sensor details
- `GET /api/sensors/:nodeId/data` - Get sensor data

### Dashboard Endpoints
- `GET /api/dashboard/summary` - Dashboard summary
- `GET /api/dashboard/analytics` - Analytics data
- `GET /api/dashboard/alerts-summary` - Alerts summary

### AI Endpoints
- `POST /api/ai/suggest` - Get AI suggestions
- `POST /api/ai/diagnose-image` - Image diagnosis
- `POST /api/ai/diagnose-video` - Video diagnosis
- `POST /api/ai/ask` - AI Q&A

## 🔌 Real-Time Features

The app uses Socket.io for real-time communication:

### Events Received
- `welcome` - Welcome message
- `sensorNodeRegistered` - New sensor registered
- `sensorDataUpdate` - New sensor data
- `newAlert` - New alert notification
- `alertUpdated` - Alert status update

### Connection Management
- Automatic reconnection
- Connection status monitoring
- Error handling and recovery

## 🧪 Testing

### Run Tests
```bash
npm test
```

### Test Coverage
- Authentication flow
- API service integration
- Navigation functionality
- Error handling

## 📦 Building for Production

### iOS Build
```bash
# Build for iOS
expo build:ios

# Or build locally
expo run:ios --configuration Release
```

### Android Build
```bash
# Build for Android
expo build:android

# Or build locally
expo run:android --variant release
```

## 🚀 Deployment

### Expo Application Services (EAS)

1. **Install EAS CLI**
   ```bash
   npm install -g @expo/eas-cli
   ```

2. **Configure EAS**
   ```bash
   eas build:configure
   ```

3. **Build for Production**
   ```bash
   eas build --platform ios
   eas build --platform android
   ```

4. **Submit to App Stores**
   ```bash
   eas submit --platform ios
   eas submit --platform android
   ```

## 🔒 Security Features

- JWT token authentication
- Secure token storage
- API request/response validation
- Input sanitization
- HTTPS communication
- Error handling without sensitive data exposure

## 📱 Device Requirements

### iOS
- iOS 12.0 or later
- iPhone 6s or newer
- iPad (5th generation) or newer

### Android
- Android 6.0 (API level 23) or later
- 2GB RAM minimum
- 100MB free storage

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run tests: `npm test`
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the API documentation
- Review the backend README
- Open an issue on GitHub

## 🔮 Roadmap

### Phase 1: Core Features ✅
- [x] Authentication system
- [x] Dashboard implementation
- [x] Basic navigation
- [x] API integration

### Phase 2: Sensor Management 🚧
- [ ] Sensor registration
- [ ] Real-time data visualization
- [ ] Sensor configuration
- [ ] Location mapping

### Phase 3: AI Integration 🚧
- [ ] Image diagnosis
- [ ] Video analysis
- [ ] AI Q&A system
- [ ] Smart recommendations

### Phase 4: Advanced Features 📋
- [ ] Offline mode
- [ ] Push notifications
- [ ] Data export
- [ ] Multi-language support

### Phase 5: Optimization 📋
- [ ] Performance optimization
- [ ] Advanced analytics
- [ ] Custom themes
- [ ] Accessibility improvements 