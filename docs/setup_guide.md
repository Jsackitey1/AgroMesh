# AgroMesh Setup Guide

This guide will help you set up and deploy the AgroMesh system.

## System Requirements

### Hardware Requirements
- Arduino/Raspberry Pi board
- Required sensors (see hardware/README.md)
- Solar panel and battery
- LoRa module or ESP8266/ESP32

### Software Requirements
- Python 3.10+
- Node.js 14+
- Arduino IDE
- Git

## Installation Steps

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/AgroMesh.git
cd AgroMesh
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 3. Frontend Setup
```bash
cd dashboard
npm install
```

### 4. Hardware Setup
1. Follow the wiring diagram in `hardware/sensor_node_v1.pdf`
2. Upload the firmware from `firmware/soil_monitor.ino`
3. Test the sensors using the Arduino Serial Monitor

### 5. Configuration

#### Backend Configuration
1. Create a `.env` file in the backend directory:
```
FIREBASE_CREDENTIALS=path/to/credentials.json
TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
```

#### Frontend Configuration
1. Create a `.env` file in the dashboard directory:
```
REACT_APP_API_URL=http://localhost:8000
REACT_APP_FIREBASE_CONFIG=your_firebase_config
```

### 6. Running the System

#### Start the Backend
```bash
cd backend
source venv/bin/activate
uvicorn api.main:app --reload
```

#### Start the Frontend
```bash
cd dashboard
npm start
```

## Deployment

### Backend Deployment
1. Set up a production server (e.g., Heroku, DigitalOcean)
2. Configure environment variables
3. Deploy using your preferred method

### Frontend Deployment
1. Build the React app: `npm run build`
2. Deploy to Netlify, Vercel, or GitHub Pages

### Hardware Deployment
1. Test all sensors in a controlled environment
2. Install weather protection
3. Deploy in the field
4. Monitor initial readings

## Troubleshooting

### Common Issues
1. Sensor readings are incorrect
   - Check wiring
   - Verify sensor calibration
   - Check power supply

2. Data transmission issues
   - Verify LoRa/WiFi configuration
   - Check signal strength
   - Verify backend connectivity

3. Power issues
   - Check solar panel output
   - Verify battery charging
   - Monitor power consumption

## Support

For additional support:
- Check the [GitHub Issues](https://github.com/yourusername/AgroMesh/issues)
- Contact: sackiteyjoseph@gmail.com
- Join our community forum 