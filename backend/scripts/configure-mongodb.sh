echo "🗄️  MongoDB Atlas Configuration for AWS"
echo "======================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}📋 Prerequisites:${NC}"
echo "1. MongoDB Atlas account created"
echo "2. Database cluster created"
echo "3. Database user created (agromesh_user)"
echo "4. Network access configured (0.0.0.0/0)"
echo "5. Connection string copied"
echo ""

echo -e "${YELLOW}🔧 Let's configure MongoDB in AWS:${NC}"
echo ""

# Get MongoDB URI
echo -e "${BLUE}🗄️  MongoDB Connection String:${NC}"
echo "Format: mongodb+srv://agromesh_user:YOUR_PASSWORD@cluster.mongodb.net/agromesh"
read -p "Enter your MongoDB URI: " MONGODB_URI

if [ -z "$MONGODB_URI" ]; then
    echo -e "${RED}❌ MongoDB URI is required${NC}"
    exit 1
fi

# Get Gemini API Key (optional)
echo ""
echo -e "${BLUE}🤖 Google Gemini API Key (optional):${NC}"
echo "Get this from: https://makersuite.google.com/app/apikey"
read -p "Enter your Gemini API key (or press Enter to skip): " GEMINI_API_KEY

echo ""
echo -e "${YELLOW}🚀 Configuring AWS environment...${NC}"

# Set MongoDB URI
echo "Setting MONGODB_URI..."
eb setenv MONGODB_URI="$MONGODB_URI"

# Set Gemini API Key if provided
if [ -n "$GEMINI_API_KEY" ]; then
    echo "Setting GEMINI_API_KEY..."
    eb setenv GEMINI_API_KEY="$GEMINI_API_KEY"
fi

echo ""
echo -e "${GREEN}✅ MongoDB configuration complete!${NC}"
echo ""

# Test the configuration
echo -e "${YELLOW}🧪 Testing configuration...${NC}"
echo "Waiting for environment to update..."

# Wait a moment for the environment to update
sleep 30

# Test the health endpoint
HEALTH_URL="http://agromesh-backend-prod.eba-kjq5gjc4.us-west-2.elasticbeanstalk.com/api/health"
echo "Testing health endpoint: $HEALTH_URL"

if curl -s "$HEALTH_URL" > /dev/null; then
    echo -e "${GREEN}✅ Health check passed!${NC}"
else
    echo -e "${RED}❌ Health check failed${NC}"
fi

# Test registration endpoint
echo ""
echo -e "${YELLOW}🧪 Testing registration endpoint...${NC}"
REGISTER_URL="http://agromesh-backend-prod.eba-kjq5gjc4.us-west-2.elasticbeanstalk.com/api/auth/register"
TEST_DATA='{"email":"test@example.com","password":"password123","firstName":"Test","lastName":"User"}'

RESPONSE=$(curl -s -X POST "$REGISTER_URL" -H "Content-Type: application/json" -d "$TEST_DATA")

if echo "$RESPONSE" | grep -q "token"; then
    echo -e "${GREEN}✅ Registration test passed! MongoDB is working.${NC}"
elif echo "$RESPONSE" | grep -q "already exists"; then
    echo -e "${GREEN}✅ Registration test passed! User already exists.${NC}"
else
    echo -e "${RED}❌ Registration test failed${NC}"
    echo "Response: $RESPONSE"
fi

echo ""
echo -e "${GREEN}🎉 MongoDB Atlas configuration complete!${NC}"
echo ""
echo "📋 Your deployment is now ready:"
echo "🌐 URL: http://agromesh-backend-prod.eba-kjq5gjc4.us-west-2.elasticbeanstalk.com"
echo "🔌 API: http://agromesh-backend-prod.eba-kjq5gjc4.us-west-2.elasticbeanstalk.com/api"
echo "📊 Health: http://agromesh-backend-prod.eba-kjq5gjc4.us-west-2.elasticbeanstalk.com/api/health"
echo ""
echo "📱 Update your mobile app .env file with:"
echo "EXPO_PUBLIC_API_BASE_URL=http://agromesh-backend-prod.eba-kjq5gjc4.us-west-2.elasticbeanstalk.com/api"
echo "EXPO_PUBLIC_SOCKET_URL=http://agromesh-backend-prod.eba-kjq5gjc4.us-west-2.elasticbeanstalk.com"
echo ""
echo "🚀 Happy farming with AI! 🌾📱✨"
