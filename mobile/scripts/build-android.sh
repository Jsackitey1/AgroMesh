#!/bin/bash

echo "🏗️  Building AgroMesh Android APK for Firebase App Distribution..."

# Check if EAS CLI is installed
if ! command -v eas &> /dev/null; then
    echo "📦 Installing EAS CLI..."
    npm install -g eas-cli
fi

# Build the APK using EAS Build
echo "🔨 Building APK with EAS Build..."
eas build --platform android --profile preview

echo "✅ Build completed!"
echo "📱 APK should be available in the EAS build output"
echo "🚀 Next step: Upload to Firebase App Distribution" 