#!/bin/bash

# Configuration
FIREBASE_APP_ID="1:498338987011:android:73752f4a535bb451356236"
RELEASE_NOTES="Test build for AgroMesh mobile app"

echo "🚀 Distributing AgroMesh APK to Firebase App Distribution..."

# For EAS builds, we need to download the APK first
echo "📥 Downloading APK from EAS Build..."

# Get the latest build URL
BUILD_URL=$(eas build:list --platform android --limit 1 --json | jq -r '.[0].artifacts.buildUrl')

if [ -z "$BUILD_URL" ] || [ "$BUILD_URL" = "null" ]; then
    echo "❌ No build found. Please run 'npm run build:android' first."
    exit 1
fi

echo "📱 Found build: $BUILD_URL"

# Download the APK
APK_PATH="./agromesh-app.apk"
curl -L "$BUILD_URL" -o "$APK_PATH"

if [ ! -f "$APK_PATH" ]; then
    echo "❌ Failed to download APK"
    exit 1
fi

# Upload to Firebase App Distribution
echo "📤 Uploading to Firebase App Distribution..."
firebase appdistribution:distribute "$APK_PATH" \
  --app "$FIREBASE_APP_ID" \
  --release-notes "$RELEASE_NOTES" \
  --groups "testers"

echo "✅ Distribution completed!"
echo "📱 Testers will receive an email with download link"

# Clean up
rm -f "$APK_PATH" 