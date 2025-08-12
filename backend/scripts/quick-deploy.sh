#!/bin/bash

# Quick Deploy Script for AgroMesh Backend
# This script helps you deploy using existing project configuration

echo "🚀 AgroMesh Quick Deploy"
echo "======================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if we're in the backend directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Please run this script from the backend directory${NC}"
    exit 1
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}📝 Creating .env file from example...${NC}"
    cp env.example .env
    echo -e "${GREEN}✅ .env file created!${NC}"
    echo ""
    echo -e "${YELLOW}⚠️  IMPORTANT: You need to update the .env file with your actual values:${NC}"
    echo "1. MONGODB_URI - Your MongoDB Atlas connection string"
    echo "2. GEMINI_API_KEY - Your Google Gemini API key"
    echo "3. JWT_SECRET - A strong random secret"
    echo ""
    echo -e "${BLUE}💡 Quick setup:${NC}"
    echo "1. Get Gemini API key: https://makersuite.google.com/app/apikey"
    echo "2. Set up MongoDB Atlas: https://mongodb.com/atlas"
    echo "3. Edit .env file with your values"
    echo ""
    read -p "Press Enter after updating .env file..."
fi

# Check if AWS CLI is configured
if ! aws sts get-caller-identity &> /dev/null; then
    echo -e "${RED}❌ AWS CLI not configured. Please run: aws configure${NC}"
    echo ""
    echo -e "${BLUE}🔑 To get AWS credentials:${NC}"
    echo "1. Go to AWS Console → IAM → Users"
    echo "2. Create access key"
    echo "3. Run: aws configure"
    echo ""
    read -p "Press Enter after configuring AWS..."
fi

# Check if EB CLI is available
if ! command -v eb &> /dev/null; then
    echo -e "${RED}❌ EB CLI not found. Please install: pip3 install awsebcli${NC}"
    exit 1
fi

# Install dependencies
echo -e "${YELLOW}📦 Installing dependencies...${NC}"
npm install --production

# Create uploads directory
mkdir -p uploads/videos

# Check if EB application exists
if [ ! -f ".elasticbeanstalk/config.yml" ]; then
    echo -e "${YELLOW}🚀 Initializing Elastic Beanstalk application...${NC}"
    eb init
    
    echo -e "${YELLOW}📝 EB Configuration Guide:${NC}"
    echo "1. Choose your region (e.g., us-east-1)"
    echo "2. Create new application: agromesh-backend"
    echo "3. Choose Node.js platform"
    echo "4. Choose 'Create new environment'"
    echo "5. Environment name: agromesh-backend-prod"
    echo "6. Domain: agromesh-backend-[your-unique-id]"
    echo "7. Choose 'Single instance' for cost optimization"
    echo ""
    read -p "Press Enter after configuring EB application..."
fi

# Deploy
echo -e "${YELLOW}🚀 Deploying to AWS Elastic Beanstalk...${NC}"
eb deploy

# Get application URL
echo -e "${YELLOW}🔍 Getting application URL...${NC}"
APP_URL=$(eb status | grep CNAME | awk '{print $2}')

if [ -n "$APP_URL" ]; then
    echo -e "${GREEN}✅ Deployment successful!${NC}"
    echo -e "${GREEN}🌐 Your application is available at: https://$APP_URL${NC}"
    echo -e "${GREEN}🔌 API endpoint: https://$APP_URL/api${NC}"
    echo -e "${GREEN}📊 Health check: https://$APP_URL/api/health${NC}"
    
    # Update mobile app configuration
    echo ""
    echo -e "${YELLOW}📱 Update your mobile app .env file with:${NC}"
    echo "EXPO_PUBLIC_API_BASE_URL=https://$APP_URL/api"
    echo "EXPO_PUBLIC_SOCKET_URL=https://$APP_URL"
    
    # Test the deployment
    echo ""
    echo -e "${YELLOW}🧪 Testing deployment...${NC}"
    if curl -s "https://$APP_URL/api/health" > /dev/null; then
        echo -e "${GREEN}✅ Health check passed!${NC}"
    else
        echo -e "${RED}❌ Health check failed. Check logs with: eb logs${NC}"
    fi
    
else
    echo -e "${RED}❌ Failed to get application URL${NC}"
    echo "Check deployment status with: eb status"
fi

echo ""
echo -e "${GREEN}🎉 Quick deploy completed!${NC}"
echo ""
echo "📋 Next steps:"
echo "1. Test your API endpoints"
echo "2. Update your mobile app configuration"
echo "3. Monitor your application: eb logs"
echo ""
echo "🔧 Useful commands:"
echo "  eb status          - Check deployment status"
echo "  eb logs            - View application logs"
echo "  eb open            - Open application in browser"
echo ""
echo "🚀 Happy farming with AI! 🌾📱✨"
