#!/bin/bash

# AgroMesh Backend AWS Deployment Script
# This script deploys the backend to AWS Elastic Beanstalk

set -e

echo "🌾 AgroMesh Backend AWS Deployment"
echo "=================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo -e "${RED}❌ AWS CLI is not installed. Please install it first.${NC}"
    echo "Visit: https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html"
    exit 1
fi

# Check if EB CLI is installed
if ! command -v eb &> /dev/null; then
    echo -e "${RED}❌ EB CLI is not installed. Please install it first.${NC}"
    echo "Run: pip install awsebcli"
    exit 1
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚠️  .env file not found. Creating from example...${NC}"
    cp env.example .env
    echo -e "${YELLOW}⚠️  Please update .env file with your production values before deploying${NC}"
    echo "Required variables:"
    echo "  - MONGODB_URI (use MongoDB Atlas for production)"
    echo "  - JWT_SECRET (use a strong, random secret)"
    echo "  - GEMINI_API_KEY"
    echo "  - NODE_ENV=production"
    read -p "Press Enter after updating .env file..."
fi

# Check if we're in the backend directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Please run this script from the backend directory${NC}"
    exit 1
fi

# Install dependencies
echo -e "${YELLOW}📦 Installing dependencies...${NC}"
npm install --production

# Create uploads directory if it doesn't exist
mkdir -p uploads/videos

# Initialize EB application (if not already done)
if [ ! -f ".elasticbeanstalk/config.yml" ]; then
    echo -e "${YELLOW}🚀 Initializing Elastic Beanstalk application...${NC}"
    eb init
    
    echo -e "${YELLOW}📝 Please configure your EB application:${NC}"
    echo "1. Choose your region"
    echo "2. Create new application: agromesh-backend"
    echo "3. Choose Node.js platform"
    echo "4. Choose 'Create new environment'"
    echo "5. Environment name: agromesh-backend-prod"
    echo "6. Domain name: agromesh-backend-[your-unique-id]"
    echo "7. Choose 'Single instance' for cost optimization"
    
    read -p "Press Enter after configuring EB application..."
fi

# Create environment if it doesn't exist
if ! eb status &> /dev/null; then
    echo -e "${YELLOW}🌍 Creating Elastic Beanstalk environment...${NC}"
    eb create agromesh-backend-prod --single-instance --instance-type t3.micro
fi

# Deploy the application
echo -e "${YELLOW}🚀 Deploying to AWS Elastic Beanstalk...${NC}"
eb deploy

# Get the application URL
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
    
else
    echo -e "${RED}❌ Failed to get application URL${NC}"
    echo "Check the deployment status with: eb status"
fi

echo ""
echo -e "${GREEN}🎉 Deployment completed!${NC}"
echo ""
echo "📋 Next steps:"
echo "1. Test your API endpoints"
echo "2. Update your mobile app configuration"
echo "3. Set up MongoDB Atlas for production database"
echo "4. Configure environment variables in EB console"
echo ""
echo "🔧 Useful commands:"
echo "  eb status          - Check deployment status"
echo "  eb logs            - View application logs"
echo "  eb open            - Open application in browser"
echo "  eb terminate       - Terminate environment (costs money)"
echo ""
echo "💰 Cost optimization:"
echo "  - Use t3.micro instance (free tier eligible)"
echo "  - Single instance deployment (not load balanced)"
echo "  - Consider using AWS Lambda for serverless (even cheaper)"
echo ""
echo "🚀 Happy farming with AI! 🌾📱✨"
