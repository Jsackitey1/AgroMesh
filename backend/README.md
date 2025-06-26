# 🌾 AgroMesh Backend (Node.js + Express.js)

This backend powers the AgroMesh platform, providing secure APIs for sensor data ingestion, user management, real-time alerts, and AI-driven agricultural insights. Built with Node.js and Express.js, it is designed for flexibility, scalability, and ease of integration with both hardware and frontend dashboards.

---

## 📁 Project Structure

```
AgroMesh/backend/
├── src/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── middlewares/
│   ├── utils/
│   ├── config/
│   └── app.js
├── tests/
├── .env
├── package.json
└── README.md
```

---

## 🚀 Core Features

- **Sensor Data Ingestion:** Secure REST API for environmental sensor data (soil, weather, etc.)
- **User Management:** JWT-based authentication, roles (Farmer, Admin, Researcher), profile management
- **Data Storage:** MongoDB models for users, sensor nodes, sensor data, alerts, and AI results
- **Real-Time Data & Alerts:** WebSocket (Socket.io) for live dashboard updates and alerting
- **AI/ML Integration:** Endpoints for AI predictions (irrigation, pest, anomaly), with optional Python microservice integration
- **Localization:** Multi-language support for alerts and messages
- **Admin & Monitoring:** Admin endpoints, health checks, and system monitoring

---

## 🛠️ Development Phases

### 1. Project Setup
- Initialize Node.js project (`npm init`)
- Set up Express.js server
- Configure ESLint, Prettier, and environment variables
- Set up MongoDB connection (Mongoose)

### 2. User & Auth System
- User model (name, email, password, role, language)
- Auth routes: register, login, JWT middleware
- Profile routes

### 3. Sensor Node API
- SensorNode model (location, type, status, owner)
- SensorData model (timestamp, node, type, value)
- Endpoints for:
  - Registering sensor nodes
  - Posting sensor data
  - Fetching data (by user, node, time range)

### 4. Alerts & AI Integration
- Alert model (type, message, user, status, timestamp)
- Endpoints for:
  - Generating and fetching alerts
  - Integrating with AI microservice (HTTP or gRPC)
- WebSocket setup for real-time alerts

### 5. Dashboard & Analytics API
- Endpoints for:
  - Aggregated stats (e.g., average soil moisture)
  - Historical data queries
  - Exporting data (CSV/JSON)

### 6. Localization
- Middleware to detect user language
- Utility for translating alert messages

### 7. Admin Tools & Monitoring
- Admin routes for managing users/nodes/data
- Health check and metrics endpoints

### 8. Testing & Documentation
- Unit and integration tests (Jest or Mocha)
- API documentation (Swagger/OpenAPI)
- Deployment scripts (Docker, Heroku, etc.)

---

## 📦 Key Packages & Tools

- **Express.js** (web framework)
- **Mongoose** (MongoDB ODM)
- **jsonwebtoken** (JWT auth)
- **bcryptjs** (password hashing)
- **dotenv** (env vars)
- **Socket.io** (real-time)
- **Jest/Mocha** (testing)
- **Swagger-jsdoc** (API docs)
- **cors, helmet, morgan** (security/logging)
- **i18n** (localization)

---

## 📑 Sample API Endpoints

| Method | Endpoint                | Description                 |
|--------|-------------------------|-----------------------------|
| POST   | /api/auth/register      | Register user               |
| POST   | /api/auth/login         | Login user                  |
| POST   | /api/sensors/register   | Register sensor node        |
| POST   | /api/sensors/data       | Ingest sensor data          |
| GET    | /api/sensors/data       | Get sensor data (filters)   |
| GET    | /api/alerts             | Get user alerts             |
| POST   | /api/alerts             | Create alert (AI/manual)    |
| GET    | /api/dashboard/summary  | Get dashboard stats         |
| GET    | /api/admin/users        | Admin: list users           |
| GET    | /api/health             | Health check                |

---

## 🤖 AI/ML Integration: Implementation & Progress

The AgroMesh backend integrates with the Gemini API to provide advanced AI-powered features for farmers. Below is the current status and progress of the AI/ML integration plan.

### **Implemented Features**
- **/api/ai/suggest**: Accepts sensor data, sends to Gemini API, returns actionable suggestions (e.g., irrigation, pest, anomaly).
- **/api/ai/diagnose-image**: Accepts image upload, sends to Gemini API, returns plant health advice.
- **/api/ai/diagnose-video**: Accepts video upload, sends to Gemini API, returns plant health advice (if supported).
- **/api/ai/ask**: Accepts a text question, sends to Gemini API, returns an AI-powered answer.
- **JWT authentication**: All AI endpoints require a valid JWT token.
- **Rate limiting**: 10 requests per minute per IP enforced on all AI endpoints.
- **Input validation & error handling**: All endpoints validate input and handle errors gracefully.
- **Request/response logging**: All AI requests and responses are logged for traceability.
- **Swagger/OpenAPI documentation**: Auto-generated and available at `/api/docs`.

### **Not Yet Implemented / Optional**
- **Python microservice integration**: (Optional) For custom models or fallback, not yet implemented.
- **Live video streaming**: (Real-time frame-by-frame analysis) Not yet implemented; only video file upload is supported.
- **Audio Q&A**: (Voice input) Not yet implemented; only text Q&A is supported.
- **Storing AI results in the database**: For traceability/auditing, not yet implemented.

### **Progress Summary Table**

| Feature                                      | Status         |
|-----------------------------------------------|----------------|
| Sensor data → AI suggestion (Gemini)          | ✅ Implemented |
| Image upload → AI diagnosis (Gemini)          | ✅ Implemented |
| Video upload → AI diagnosis (Gemini)          | ✅ Implemented |
| Text Q&A → AI answer (Gemini)                 | ✅ Implemented |
| JWT authentication                            | ✅ Implemented |
| Rate limiting                                 | ✅ Implemented |
| Logging                                       | ✅ Implemented |
| Swagger docs                                  | ✅ Implemented |
| Python microservice integration (optional)     | ❌ Not yet     |
| Live video streaming (real-time)               | ❌ Not yet     |
| Audio Q&A                                     | ❌ Not yet     |
| Store AI results in DB                        | ❌ Not yet     |

---

**In summary:**
- The core plan for AI/ML integration using the Gemini API is fully implemented for all major endpoints, security, and documentation.
- Optional features (Python microservice, live streaming, audio, DB storage) can be added as needed.

See `/api/docs` for up-to-date API documentation.

---

## 🔒 Security & Best Practices

- Use HTTPS in production
- Validate all inputs (Joi or express-validator)
- Rate limiting and CORS
- Store secrets in `.env`
- Regular backups of DB

---

## 🚀 Deployment

- Dockerize the backend
- Use services like Heroku, Vercel, or DigitalOcean
- Set up CI/CD (GitHub Actions)

---

## 🏁 Next Steps

1. Scaffold the backend project structure
2. Set up MongoDB and connect with Mongoose
3. Implement user authentication
4. Build sensor data ingestion endpoints
5. Add alerting and AI integration
6. Develop dashboard endpoints
7. Write tests and documentation
8. Prepare for deployment

---

## 👩‍💻 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## 📜 License

This project is licensed under the MIT License. 