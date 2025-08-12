#!/bin/bash

# AgroMesh Setup Script
# This script helps new developers set up the AgroMesh project

echo "🌾 Welcome to AgroMesh Setup!"
echo "=============================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v16 or higher first."
    echo "Visit: https://nodejs.org/"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Ask user what they want to set up
echo ""
echo "🎯 Choose your development path:"
echo "1. Frontend-Only (UI/UX improvements, new features) - 2 min setup"
echo "2. Full-Stack (Backend + Frontend) - 5-10 min setup"
echo ""
read -p "Enter your choice (1 or 2): " choice

if [ "$choice" = "1" ]; then
    echo ""
    echo "📱 Setting up Frontend-Only Development..."
    echo "=========================================="
    
    # Install global dependencies
    echo "📦 Installing global dependencies..."
    npm install -g @expo/cli eas-cli

# Setup Mobile App
echo "📱 Setting up Mobile App..."
cd mobile

if [ ! -f .env ]; then
    echo "📝 Creating mobile .env file..."
    cp env.example .env
    echo "⚠️  Please update mobile/.env with your configuration:"
    echo "   - EXPO_PUBLIC_API_BASE_URL"
    echo "   - EXPO_PUBLIC_SOCKET_URL"
    echo "   - Firebase configuration (optional)"
    echo "   - LiveKit configuration (optional)"
else
    echo "✅ Mobile .env file already exists"
fi

echo "📦 Installing mobile dependencies..."
npm install

cd ..

# Setup Backend
echo "🔧 Setting up Backend..."
cd backend

if [ ! -f .env ]; then
    echo "📝 Creating backend .env file..."
    cp env.example .env
    echo "⚠️  Please update backend/.env with your configuration:"
    echo "   - MONGODB_URI (MongoDB Atlas connection string)"
    echo "   - JWT_SECRET (for authentication)"
    echo "   - GEMINI_API_KEY (Google Gemini API key)"
else
    echo "✅ Backend .env file already exists"
fi

echo "📦 Installing backend dependencies..."
npm install

# Make deployment scripts executable
chmod +x scripts/*.sh

cd ..

    # Setup Dashboard (optional)
    echo "🌐 Setting up Dashboard..."
    cd dashboard
    echo "📦 Installing dashboard dependencies..."
    npm install
    cd ..

    echo ""
    echo "🎉 Frontend-Only Setup Complete!"
    echo "================================"
    echo ""
    echo "✅ What's ready:"
    echo "   - Mobile app configured to use deployed AWS backend"
    echo "   - No API keys needed"
    echo "   - Ready to start developing!"
    echo ""
    echo "🚀 Next Steps:"
    echo "1. Start mobile app: cd mobile && npm start"
    echo "2. Scan QR code with Expo Go app"
    echo "3. Test all features against deployed backend"
    echo "4. Start making UI/UX improvements!"
    echo ""
    echo "📚 For detailed instructions, see QUICK_START.md"
    echo ""
    echo "Happy frontend development! 🎨✨"

elif [ "$choice" = "2" ]; then
    echo ""
    echo "🔧 Setting up Full-Stack Development..."
    echo "======================================"
    
    # Install global dependencies
    echo "📦 Installing global dependencies..."
    npm install -g @expo/cli eas-cli

    # Setup Mobile App
    echo "📱 Setting up Mobile App..."
    cd mobile

    if [ ! -f .env ]; then
        echo "📝 Creating mobile .env file..."
        cp env.example .env
        echo "⚠️  Please update mobile/.env with your configuration:"
        echo "   - EXPO_PUBLIC_API_BASE_URL"
        echo "   - EXPO_PUBLIC_SOCKET_URL"
        echo "   - Firebase configuration (optional)"
        echo "   - LiveKit configuration (optional)"
    else
        echo "✅ Mobile .env file already exists"
    fi

    echo "📦 Installing mobile dependencies..."
    npm install

    cd ..

    # Setup Backend
    echo "🔧 Setting up Backend..."
    cd backend

    if [ ! -f .env ]; then
        echo "📝 Creating backend .env file..."
        cp env.example .env
        echo "⚠️  Please update backend/.env with your configuration:"
        echo "   - MONGODB_URI (MongoDB Atlas connection string)"
        echo "   - JWT_SECRET (for authentication)"
        echo "   - GEMINI_API_KEY (Google Gemini API key)"
    else
        echo "✅ Backend .env file already exists"
    fi

    echo "📦 Installing backend dependencies..."
    npm install

    # Make deployment scripts executable
    chmod +x scripts/*.sh

    cd ..

    # Setup Dashboard (optional)
    echo "🌐 Setting up Dashboard..."
    cd dashboard
    echo "📦 Installing dashboard dependencies..."
    npm install
    cd ..

    echo ""
    echo "🎉 Full-Stack Setup Complete!"
    echo "============================="
    echo ""
    echo "Next Steps:"
    echo "1. 📝 Configure environment variables:"
    echo "   - Update mobile/.env with your backend URLs"
    echo "   - Update backend/.env with your API keys"
    echo ""
    echo "2. 🗄️  Set up MongoDB Atlas:"
    echo "   - Create account at https://www.mongodb.com/atlas"
    echo "   - Get connection string and add to backend/.env"
    echo ""
    echo "3. 🤖 Get Google Gemini API key:"
    echo "   - Visit https://makersuite.google.com/app/apikey"
    echo "   - Add to backend/.env"
    echo ""
    echo "4. 🚀 Start development:"
    echo "   - Backend: cd backend && npm start"
    echo "   - Mobile: cd mobile && npm start"
    echo ""
    echo "5. ☁️  Deploy to AWS (optional):"
    echo "   - cd backend && ./scripts/quick-deploy.sh"
    echo ""
    echo "📚 For detailed instructions, see README.md"
    echo ""
    echo "Happy coding! 🌾✨"

else
    echo "❌ Invalid choice. Please run the script again and choose 1 or 2."
    exit 1
fi
