#!/bin/bash

# MongoDB Atlas Setup Script for AgroMesh Backend
# This script helps you set up MongoDB Atlas for production deployment

echo "🗄️  MongoDB Atlas Setup for AgroMesh"
echo "===================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}📋 Prerequisites:${NC}"
echo "1. MongoDB Atlas account (free at mongodb.com/atlas)"
echo "2. Your current IP address"
echo ""

# Get current IP address
CURRENT_IP=$(curl -s ifconfig.me)
echo -e "${GREEN}🌐 Your current IP address: $CURRENT_IP${NC}"
echo ""

echo -e "${YELLOW}📝 Step-by-step MongoDB Atlas setup:${NC}"
echo ""
echo "1. ${BLUE}Create MongoDB Atlas Account${NC}"
echo "   - Go to https://mongodb.com/atlas"
echo "   - Sign up for free account"
echo "   - Choose 'Free' tier (M0)"
echo ""

echo "2. ${BLUE}Create Database Cluster${NC}"
echo "   - Click 'Build a Database'"
echo "   - Choose 'FREE' tier"
echo "   - Select cloud provider (AWS recommended)"
echo "   - Choose region (closest to your users)"
echo "   - Click 'Create'"
echo ""

echo "3. ${BLUE}Configure Database Access${NC}"
echo "   - Go to 'Database Access' in left sidebar"
echo "   - Click 'Add New Database User'"
echo "   - Username: agromesh_user"
echo "   - Password: [generate strong password]"
echo "   - Role: 'Read and write to any database'"
echo "   - Click 'Add User'"
echo ""

echo "4. ${BLUE}Configure Network Access${NC}"
echo "   - Go to 'Network Access' in left sidebar"
echo "   - Click 'Add IP Address'"
echo "   - Add your current IP: $CURRENT_IP"
echo "   - For production, add: 0.0.0.0/0 (allows all IPs)"
echo "   - Click 'Confirm'"
echo ""

echo "5. ${BLUE}Get Connection String${NC}"
echo "   - Go to 'Database' in left sidebar"
echo "   - Click 'Connect' on your cluster"
echo "   - Choose 'Connect your application'"
echo "   - Copy the connection string"
echo ""

echo -e "${YELLOW}🔧 Update your .env file:${NC}"
echo ""
echo "Replace the MONGODB_URI in your .env file:"
echo ""
echo "MONGODB_URI=mongodb+srv://agromesh_user:YOUR_PASSWORD@cluster.mongodb.net/agromesh?retryWrites=true&w=majority"
echo ""
echo -e "${RED}⚠️  Important:${NC}"
echo "- Replace YOUR_PASSWORD with the actual password"
echo "- Replace cluster.mongodb.net with your actual cluster URL"
echo "- The database name 'agromesh' will be created automatically"
echo ""

echo -e "${GREEN}✅ MongoDB Atlas setup complete!${NC}"
echo ""
echo "📋 Next steps:"
echo "1. Test the connection locally"
echo "2. Deploy your backend to AWS"
echo "3. Update your mobile app configuration"
echo ""
echo "🔍 Test connection:"
echo "curl -X POST http://localhost:5000/api/auth/register \\"
echo "  -H \"Content-Type: application/json\" \\"
echo "  -d '{\"email\":\"test@example.com\",\"password\":\"password123\"}'"
echo ""
echo "🚀 Happy farming with AI! 🌾📱✨"
