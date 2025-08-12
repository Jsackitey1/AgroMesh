#!/bin/bash

# AgroMesh Frontend-Only Setup Script
# For UI/UX contributors who want to work on the mobile app

echo "🎨 AgroMesh Frontend-Only Setup"
echo "==============================="
echo ""
echo "This setup is for contributors who want to:"
echo "• Improve UI/UX design"
echo "• Add new features"
echo "• Fix frontend bugs"
echo "• Work on mobile app only"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v16 or higher first."
    echo "Visit: https://nodejs.org/"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Install global dependencies
echo "📦 Installing global dependencies..."
npm install -g @expo/cli eas-cli

# Setup Mobile App
echo "📱 Setting up Mobile App..."
cd mobile

if [ ! -f .env ]; then
    echo "📝 Creating mobile .env file..."
    cp env.example .env
    echo "✅ Environment file created with AWS backend URLs"
else
    echo "✅ Mobile .env file already exists"
fi

echo "📦 Installing mobile dependencies..."
npm install

cd ..

echo ""
echo "🎉 Frontend Setup Complete!"
echo "==========================="
echo ""
echo "✅ What's ready:"
echo "   • Mobile app configured to use deployed AWS backend"
echo "   • No API keys needed"
echo "   • Ready to start developing!"
echo ""
echo "🚀 Next Steps:"
echo "1. Start mobile app: cd mobile && npm start"
echo "2. Scan QR code with Expo Go app"
echo "3. Test all features against deployed backend"
echo "4. Start making UI/UX improvements!"
echo ""
echo "📚 For detailed instructions, see FRONTEND_ONLY_SETUP.md"
echo ""
echo "Happy frontend development! 🎨✨"
