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

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check Node.js version
check_node_version() {
    if command_exists node; then
        NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
        if [ "$NODE_VERSION" -lt 18 ]; then
            echo "❌ Node.js version $(node -v) is too old. Please install Node.js v18 or higher."
            echo "Visit: https://nodejs.org/"
            echo "Or use nvm: nvm install 18 && nvm use 18"
            exit 1
        fi
        echo "✅ Node.js version $(node -v) is compatible"
    else
        echo "❌ Node.js is not installed. Please install Node.js v18 or higher first."
        echo "Visit: https://nodejs.org/"
        exit 1
    fi
}

# Function to check npm
check_npm() {
    if ! command_exists npm; then
        echo "❌ npm is not installed. Please install npm first."
        exit 1
    fi
    echo "✅ npm is installed"
}

# Function to check internet connection
check_internet() {
    echo "🌐 Checking internet connection..."
    if curl -s --max-time 10 https://www.google.com > /dev/null; then
        echo "✅ Internet connection available"
    else
        echo "⚠️  No internet connection detected. Some features may not work."
        echo "   You can still work on UI/UX improvements offline."
    fi
}

# Function to check backend health
check_backend() {
    echo "🔍 Checking backend health..."
    if curl -s --max-time 10 http://agromesh-backend-prod.eba-kjq5gjc4.us-west-2.elasticbeanstalk.com/api/health > /dev/null; then
        echo "✅ Backend is running and accessible"
    else
        echo "⚠️  Backend is not accessible. This might be temporary."
        echo "   You can still work on UI/UX improvements."
        echo "   Contact maintainer if this persists."
    fi
}

# Function to install global dependencies
install_global_deps() {
    echo "📦 Installing global dependencies..."
    
    if ! command_exists expo; then
        echo "Installing Expo CLI..."
        npm install -g @expo/cli
    else
        echo "✅ Expo CLI already installed"
    fi
    
    if ! command_exists eas; then
        echo "Installing EAS CLI..."
        npm install -g eas-cli
    else
        echo "✅ EAS CLI already installed"
    fi
}

# Function to setup mobile app
setup_mobile() {
    echo "📱 Setting up Mobile App..."
    cd mobile

    # Check if .env exists, if not create it
    if [ ! -f .env ]; then
        echo "📝 Creating mobile .env file..."
        cp env.example .env
        echo "✅ Environment file created with AWS backend URLs"
    else
        echo "✅ Mobile .env file already exists"
    fi

    # Check if node_modules exists
    if [ ! -d "node_modules" ]; then
        echo "📦 Installing mobile dependencies..."
        npm install
        if [ $? -ne 0 ]; then
            echo "❌ Failed to install dependencies. Please check your internet connection and try again."
            exit 1
        fi
    else
        echo "✅ Mobile dependencies already installed"
    fi

    cd ..
}

# Function to provide platform-specific instructions
show_platform_instructions() {
    echo ""
    echo "📱 Platform-Specific Instructions"
    echo "================================"
    
    if [[ "$OSTYPE" == "darwin"* ]]; then
        echo "🍎 macOS detected:"
        echo "   • iOS development: Install Xcode from App Store"
        echo "   • Android development: Install Android Studio"
        echo "   • Both platforms supported"
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        echo "🐧 Linux detected:"
        echo "   • Android development: Install Android Studio"
        echo "   • iOS development: Not supported on Linux"
        echo "   • Use Expo Go app for testing"
    elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]]; then
        echo "🪟 Windows detected:"
        echo "   • Android development: Install Android Studio"
        echo "   • iOS development: Not supported on Windows"
        echo "   • Use Expo Go app for testing"
    fi
    
    echo ""
    echo "📱 Expo Go App:"
    echo "   • Install Expo Go from App Store (iOS) or Google Play (Android)"
    echo "   • This allows you to test the app without building"
}

# Main setup process
echo "🔍 Running pre-flight checks..."
check_node_version
check_npm
check_internet
check_backend

echo ""
echo "🚀 Starting setup process..."
install_global_deps
setup_mobile

show_platform_instructions

echo ""
echo "🎉 Frontend Setup Complete!"
echo "==========================="
echo ""
echo "✅ What's ready:"
echo "   • Mobile app configured to use deployed AWS backend"
echo "   • No API keys needed for basic testing"
echo "   • Ready to start developing!"
echo ""
echo "🚀 Next Steps:"
echo "1. Start mobile app: cd mobile && npm start"
echo "2. Install Expo Go app on your phone"
echo "3. Scan QR code with Expo Go app"
echo "4. Test all features against deployed backend"
echo "5. Start making UI/UX improvements!"
echo ""
echo "🔧 Troubleshooting:"
echo "• If 'npm start' fails, try: cd mobile && npm install && npm start"
echo "• If QR code doesn't work, check your firewall settings"
echo "• If backend connection fails, check BUILD_STATUS.md for updates"
echo ""
echo "📚 For detailed instructions, see CONTRIBUTOR_GUIDE.md"
echo ""
echo "Happy frontend development! 🎨✨"
