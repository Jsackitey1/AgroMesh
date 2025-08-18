# AgroMesh Documentation Hub

## Overview
AgroMesh is a comprehensive IoT-based agricultural monitoring platform that combines sensor data, AI analysis, and real-time alerts to optimize farming operations.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- MongoDB (local or Atlas)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/agromesh.git
   cd agromesh
   ```

2. **Run the setup script**
   ```bash
   chmod +x setup.sh
   ./setup.sh
   ```

3. **Configure environment variables**
   ```bash
   # Backend
   cp backend/env.example backend/.env
   # Edit backend/.env with your configuration

   # Mobile app
   cp mobile/env.example mobile/.env
   # Edit mobile/.env with your configuration
   ```

4. **Start the services**
   ```bash
   # Backend
   cd backend && npm run dev

   # Dashboard (new terminal)
   cd dashboard && npm start

   # Mobile app (new terminal)
   cd mobile && npm start
   ```

### Environment Configuration

#### Required Variables
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens (min 32 characters)
- `GEMINI_API_KEY` - Google Gemini API key for AI features
- `CORS_ORIGINS` - Comma-separated list of allowed origins
- `SOCKET_CORS_ORIGIN` - Comma-separated list of Socket.IO origins

#### Security Notes
- Never commit `.env` files to version control
- Use strong, unique secrets in production
- Restrict CORS origins to your domains only
- Enable HTTPS in production

## 📁 Project Structure

```
AgroMesh/
├── backend/                 # Node.js/Express API server
│   ├── src/
│   │   ├── config/         # Configuration and validation
│   │   ├── controllers/    # Business logic
│   │   ├── middlewares/    # Express middlewares
│   │   ├── models/         # Mongoose schemas
│   │   ├── routes/         # API routes
│   │   ├── services/       # External service integrations
│   │   ├── utils/          # Utility functions
│   │   └── validators/     # Input validation
│   └── tests/              # Backend tests
├── dashboard/              # React dashboard
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── routes/         # Route configuration
│   │   ├── services/       # API service layer
│   │   └── theme/          # Material-UI theme
│   └── public/             # Static assets
├── mobile/                 # React Native mobile app
│   ├── src/
│   │   ├── components/     # React Native components
│   │   ├── contexts/       # React contexts
│   │   ├── navigation/     # Navigation configuration
│   │   ├── screens/        # App screens
│   │   ├── services/       # API and external services
│   │   └── utils/          # Utility functions
│   └── assets/             # App assets
├── firmware/               # Arduino sensor firmware
├── hardware/               # Hardware schematics and guides
├── ml_models/              # Machine learning models
└── docs/                   # Documentation
```

## 🔧 Development

### Backend Development

#### Code Quality
```bash
cd backend
npm run lint          # Run ESLint
npm run lint:fix      # Fix linting issues
npm test              # Run tests
```

#### API Documentation
- Swagger UI: `http://localhost:5001/api/docs`
- API Base URL: `http://localhost:5001/api`

#### Key Features
- **Authentication**: JWT-based with bcrypt password hashing
- **Real-time**: Socket.IO with authentication
- **Validation**: Joi schema validation for environment variables
- **Logging**: Winston structured logging with request tracing
- **Security**: Helmet, CORS, rate limiting

### Frontend Development

#### Dashboard
```bash
cd dashboard
npm start             # Start development server
npm run build         # Build for production
```

#### Mobile App
```bash
cd mobile
npm start             # Start Expo development server
npm run android       # Run on Android
npm run ios           # Run on iOS
```

## 🔒 Security

### Authentication
- JWT tokens with configurable expiration
- Secure password hashing with bcrypt
- Token refresh mechanism

### API Security
- Input validation with express-validator
- CORS configuration with origin validation
- Rate limiting on sensitive endpoints
- Helmet for security headers

### Real-time Security
- Socket.IO authentication with JWT
- User-specific room management
- Secure event handling

### Environment Security
- Schema-based environment validation
- No default secrets in production
- Secure configuration management

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test              # Run all tests
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Run tests with coverage
```

### Frontend Tests
```bash
cd dashboard
npm test              # Run React tests

cd mobile
npm test              # Run React Native tests
```

## 🚀 Deployment

### Backend Deployment
1. Set production environment variables
2. Configure MongoDB Atlas or production database
3. Set up reverse proxy (nginx/Apache)
4. Configure SSL certificates
5. Set up monitoring and logging

### Frontend Deployment
1. Build production bundles
2. Deploy to CDN or hosting service
3. Configure environment variables
4. Set up domain and SSL

### Mobile App Deployment
1. Configure app signing
2. Build production APK/IPA
3. Submit to app stores
4. Configure production API endpoints

## 📊 Monitoring

### Logging
- Structured JSON logs in production
- Request/response logging with unique IDs
- Error tracking with stack traces
- User context in all log entries

### Health Checks
- API health endpoint: `/api/health`
- Database connectivity monitoring
- External service status checks

### Performance
- Database query optimization
- API response caching
- Frontend code splitting
- Image optimization

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

### Code Standards
- Follow ESLint configuration
- Use consistent formatting
- Write meaningful commit messages
- Add documentation for new features

### Testing Requirements
- Unit tests for new functions
- Integration tests for API endpoints
- Frontend component tests
- End-to-end tests for critical flows

## 📞 Support

### Documentation
- [API Reference](api-reference.md)
- [Architecture Guide](architecture.md)
- [Troubleshooting](troubleshooting.md)

### Community
- GitHub Issues: Bug reports and feature requests
- Discussions: General questions and ideas
- Wiki: Community-contributed guides

### Contact
- Email: support@agromesh.com
- Discord: [AgroMesh Community](https://discord.gg/agromesh)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.

## 🙏 Acknowledgments

- Google Gemini for AI capabilities
- MongoDB for database technology
- React and React Native communities
- Open source contributors
