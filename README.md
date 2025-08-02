
https://agro-mesh.vercel.app/

# 🌾 AgroMesh: A Community-Powered Smart Agricultural Monitoring Network

**AgroMesh** is a decentralized, solar-powered network of open-source environmental sensors designed to help **farmers** in underserved regions optimize **crop yield**, **resource usage**, and **resilience to climate variability**. It monitors **soil conditions**, **weather patterns**, and **microclimates** in real time—and uses AI to generate smart irrigation alerts, pest risk warnings, and harvest forecasts.

## 🚀 **Latest Features (v2.0)**

### 📱 **Mobile App Integration**
- **Video Capture**: Record agricultural videos directly from your mobile device
- **Video Upload**: Seamlessly upload videos to the cloud for AI analysis
- **Video Library**: Manage and view all your uploaded videos with analysis history
- **Real-time Chat**: Interactive AI chat interface for video analysis

### 🎥 **Gemini Video Analysis** *(Mobile App Only)*
- **AI-Powered Analysis**: Upload videos and get instant AI insights
- **Multiple Analysis Types**: Plant health, soil condition, pest detection, and general analysis
- **Interactive Q&A**: Ask specific questions about your agricultural videos
- **Analysis History**: View all previous analyses and responses
- **Confidence Scoring**: Get confidence levels for each AI analysis

### 📡 **LiveKit Real-time Streaming** *(Coming Soon)*
- **Live Video Streaming**: Stream agricultural activities in real-time
- **Real-time AI Analysis**: Get instant AI insights during live streams
- **Multi-participant Support**: Collaborate with experts and other farmers
- **Stream Metadata**: Add field information, crop types, and location data
- **Live Chat**: Real-time communication during streaming sessions

*Note: LiveKit integration is currently in development. The mobile app includes a simulation interface for testing the UI and flow.*

---

## 🚀 Project Goals

- Empower smallholder farmers with real-time, actionable environmental data.
- Build a low-cost, replicable precision agriculture platform.
- Use AI to forecast irrigation needs, detect crop stress, and improve yield.
- Encourage open collaboration between engineers, farmers, and educators.

---

## 🛠️ Features

- 🌱 Soil Health Monitoring (moisture, pH, nutrients)
- 🌦️ Weather Tracking (temperature, humidity, rainfall)
- ☀️ Solar-powered, low-maintenance sensor nodes
- 📶 LoRaWAN or WiFi data transmission
- 📊 Live dashboards + SMS alerts in local languages
- 🤖 AI-powered irrigation and pest risk predictions
- 🧑‍🌾 Farmer-centered deployment and co-design
- 📱 Mobile app with video capture and analysis *(Primary)*
- 🎥 Gemini AI video analysis and insights *(Mobile Only)*
- 📡 LiveKit real-time video streaming *(Coming Soon)*
- 💬 Interactive AI chat and consultation *(Mobile Only)*
---
## 🔧 Tech Stack

| Component        | Technology Used                          |
|------------------|-------------------------------------------|
| Hardware         | Arduino / Raspberry Pi, Grove sensors     |
| Networking       | LoRaWAN, ESP8266/ESP32, MQTT              |
| Backend          | Node.js / Express / MongoDB / Gemini AI   |
| Frontend         | React / Material-UI / React Native        |
| Mobile App       | React Native / Expo / LiveKit Client      |
| Database         | MongoDB Atlas / Firestore                 |
| AI & ML          | Google Gemini AI / TensorFlow / Edge Impulse |
| Video Streaming  | LiveKit Server / WebRTC                   |
| Alerts           | Twilio (SMS), email (SMTP)                |
| Deployment       | Heroku / Netlify / Vercel                 |

---

## 📦 Repository Structure

AgroMesh/
│
├── hardware/ # Wiring diagrams, BOM, and PCB designs
│ └── sensor_node_v1.pdf
│
├── firmware/ # Arduino/C++ scripts for soil, weather, and climate sensors
│ └── soil_monitor.ino
│
├── backend/ # APIs and database code (Node.js/Express/MongoDB)
│ ├── api/ # REST API endpoints
│ ├── src/ # Source code with video analysis and LiveKit integration
│ └── tests/ # API tests
│
├── dashboard/ # Web dashboard (React/Material-UI)
│ ├── src/components/ # React components
│ └── public/ # Static assets
│
├── mobile/ # React Native mobile app
│ ├── src/screens/ # Mobile app screens
│ ├── src/services/ # API and LiveKit services
│ └── src/navigation/ # App navigation
│
├── ml_models/ # Jupyter notebooks and trained models
│ └── irrigation_forecast.ipynb
│
├── docs/ # Documentation and guides
│ ├── setup_guide.md
│ └── gemini_video_feature_plan.md
│
└── README.md


---

## 🧠 AI Functionality

- **Irrigation Forecasting**: Suggests optimal watering schedules using weather + soil data.
- **Anomaly Detection**: Identifies abnormal moisture drops or potential sensor faults.
- **Pest & Disease Risk Prediction**: Detects conditions that typically precede fungal outbreaks or pest invasions.
- **Video Analysis**: AI-powered analysis of agricultural videos for plant health, soil conditions, and pest detection.
- **Real-time Streaming Analysis**: Live AI analysis during video streams for instant insights.
- **Interactive Q&A**: Ask specific questions about agricultural content and get AI-powered responses.
- **Yield Estimation** *(coming soon)*: Forecasts crop output based on seasonal data patterns.

---

## 📈 Getting Started

### Prerequisites
- Arduino IDE / Python 3.10+
- MongoDB Atlas account (for database)
- Google Gemini AI API key (for video analysis)
- LiveKit account (for real-time streaming)
- ESP8266 / Arduino board + soil/weather sensors

### Quick Start - Mobile-First Video Analysis

1. **Backend Setup**:
```bash
cd backend
npm install
# Copy environment template and add your API keys
cp env.example .env
# Edit .env with your actual API keys (DO NOT commit .env files)
npm start
```

⚠️ **SECURITY WARNING**: Never commit API keys or secrets to version control. Always use environment variables.

2. **Mobile App Setup** *(Primary Interface)*:
```bash
cd mobile
npm install
npx expo start
# Scan QR code with Expo Go app
# Navigate to AI Assistant → Video Analysis
```

3. **Dashboard Setup** *(Optional - Marketing/Info Only)*:
```bash
cd dashboard
npm install
npm start
# Visit http://localhost:3000 for project information
```

### Mobile Video Analysis Features

- **Video Capture**: Record videos directly from your mobile device
- **Video Upload**: Upload videos from gallery or record new ones
- **AI Analysis**: Get instant insights on plant health, soil conditions, and pest detection
- **Interactive Chat**: Ask specific questions about your agricultural content
- **Video Library**: Manage and view all your uploaded videos with analysis history
- **Live Streaming**: Stream agricultural activities for real-time AI analysis *(Coming Soon)*

### Setup Instructions

```bash
# Clone repo
git clone https://github.com/yourusername/AgroMesh.git

# Navigate to backend and install dependencies
cd AgroMesh/backend
npm install

# Run local API server
npm start   # see backend/python for FastAPI example

🧪 Sample Use Case

A cassava farmer in Northern Ghana installs a solar-powered sensor node in their field. AgroMesh sends an SMS advising early morning irrigation due to falling soil moisture and rising heat. A week later, the system flags a potential fungal risk window based on humidity levels. The farmer avoids crop stress, uses less water, and boosts yield by 20%.

🤝 Community & Contribution
We welcome collaborators from engineering, agriculture, and education!

You can contribute by:

Improving sensor firmware or power efficiency

Enhancing the farmer dashboard UX

Developing AI models for different crops or climates

Translating tools or SMS alerts into local languages

Partnering with farmer cooperatives or agri-extension programs

How to Contribute
Fork the repo

Create your feature branch (git checkout -b feature/YourFeature)

Commit your changes (git commit -m 'Add new feature')

Push to the branch (git push origin feature/YourFeature)

Open a pull request

📜 License
This project is licensed under the MIT License.

👋 Contact
📧 Email: sackiteyjoseph@gmail.com
🌍 Let’s grow a smarter, greener future—one farm at a time.

