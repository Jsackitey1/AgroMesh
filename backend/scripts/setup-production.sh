#!/bin/bash

# AgroMesh Production Setup Script
# This script helps you configure your production environment

echo "🌾 AgroMesh Production Setup"
echo "============================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}📋 Required Information:${NC}"
echo "You'll need the following information:"
echo "1. MongoDB Atlas connection string"
echo "2. Google Gemini API key"
echo "3. AWS credentials (Access Key ID and Secret Access Key)"
echo ""

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚠️  .env file not found. Creating from example...${NC}"
    cp env.example .env
fi

echo -e "${YELLOW}🔧 Let's configure your production environment:${NC}"
echo ""

# MongoDB URI
echo -e "${BLUE}🗄️  MongoDB Atlas Connection String:${NC}"
echo "Format: mongodb+srv://username:password@cluster.mongodb.net/agromesh"
read -p "Enter your MongoDB URI: " MONGODB_URI

# JWT Secret
echo ""
echo -e "${BLUE}🔐 JWT Secret:${NC}"
echo "This should be a long, random string for security"
read -p "Enter JWT secret (or press Enter to generate): " JWT_SECRET

if [ -z "$JWT_SECRET" ]; then
    JWT_SECRET=$(openssl rand -base64 64)
    echo -e "${GREEN}Generated JWT secret: $JWT_SECRET${NC}"
fi

# Gemini API Key
echo ""
echo -e "${BLUE}🤖 Google Gemini API Key:${NC}"
echo "Get this from: https://makersuite.google.com/app/apikey"
read -p "Enter your Gemini API key: " GEMINI_API_KEY

# Update .env file
echo ""
echo -e "${YELLOW}📝 Updating .env file...${NC}"

# Create a backup
cp .env .env.backup

# Update the .env file
sed -i '' "s|MONGODB_URI=.*|MONGODB_URI=$MONGODB_URI|" .env
sed -i '' "s|JWT_SECRET=.*|JWT_SECRET=$JWT_SECRET|" .env
sed -i '' "s|GEMINI_API_KEY=.*|GEMINI_API_KEY=$GEMINI_API_KEY|" .env
sed -i '' "s|NODE_ENV=.*|NODE_ENV=production|" .env

echo -e "${GREEN}✅ .env file updated successfully!${NC}"
echo ""

# Test configuration
echo -e "${YELLOW}🧪 Testing configuration...${NC}"

# Check if required variables are set
if grep -q "MONGODB_URI=$MONGODB_URI" .env && grep -q "JWT_SECRET=$JWT_SECRET" .env && grep -q "GEMINI_API_KEY=$GEMINI_API_KEY" .env; then
    echo -e "${GREEN}✅ All required variables are configured!${NC}"
else
    echo -e "${RED}❌ Some variables may not be set correctly. Please check your .env file.${NC}"
fi

echo ""
echo -e "${GREEN}🎉 Production setup complete!${NC}"
echo ""
echo "📋 Next steps:"
echo "1. Test your configuration locally:"
echo "   npm start"
echo ""
echo "2. Deploy to AWS:"
echo "   ./scripts/deploy-aws.sh"
echo ""
echo "3. Update your mobile app .env file with the deployed URL"
echo ""
echo "🔍 To test locally:"
echo "curl -X POST http://localhost:5000/api/auth/register \\"
echo "  -H \"Content-Type: application/json\" \\"
echo "  -d '{\"email\":\"test@example.com\",\"password\":\"password123\"}'"
echo ""
echo "🚀 Happy farming with AI! 🌾📱✨"
