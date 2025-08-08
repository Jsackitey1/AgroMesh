#!/bin/bash

# AgroMesh Mobile App Environment Setup Script

echo "🌾 AgroMesh Mobile App Environment Setup"
echo "========================================"

# Check if .env file exists
if [ -f ".env" ]; then
    echo "⚠️  .env file already exists. Backing up to .env.backup"
    cp .env .env.backup
fi

# Get user input for API configuration
echo ""
echo "📡 API Configuration"
echo "-------------------"

# Get backend URL
read -p "Enter your backend API URL (e.g., http://192.168.1.92:5001/api): " API_URL

# Remove trailing slash if present
API_URL=$(echo $API_URL | sed 's/\/$//')

# Extract base URL for socket
SOCKET_URL=$(echo $API_URL | sed 's/\/api$//')

echo ""
echo "🔧 Creating .env file..."

# Create .env file
cat > .env << EOF
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
EXPO_PUBLIC_API_BASE_URL=$API_URL
EXPO_PUBLIC_SOCKET_URL=$SOCKET_URL
EOF

echo "✅ .env file created successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Update Firebase configuration in .env file"
echo "2. Update LiveKit configuration if needed"
echo "3. Test the connection: npm start"
echo ""
echo "🔍 To test API connectivity, run:"
echo "curl $API_URL/health"
echo ""
echo "🚀 Happy farming with AI! 🌾📱✨"
