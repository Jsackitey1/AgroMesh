# 🚀 Quick Start: Deploy AgroMesh Backend to AWS

This is the fastest way to get your AgroMesh backend running on AWS.

## ⚡ 5-Minute Deployment (Elastic Beanstalk)

### Step 1: Install Prerequisites
```bash
# Install AWS CLI
curl "https://awscli.amazonaws.com/AWSCLIV2.pkg" -o "AWSCLIV2.pkg"
sudo installer -pkg AWSCLIV2.pkg -target /

# Install EB CLI
pip install awsebcli

# Configure AWS credentials
aws configure
```

### Step 2: Set Up MongoDB Atlas (Free)
```bash
cd backend
./scripts/setup-mongodb-atlas.sh
```

Follow the instructions to create a free MongoDB Atlas database.

### Step 3: Configure Environment
```bash
# Copy environment file
cp env.example .env

# Edit with your values
nano .env
```

Required values:
```bash
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/agromesh
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
GEMINI_API_KEY=your-gemini-api-key-here
```

### Step 4: Deploy to AWS
```bash
# Run deployment script
./scripts/deploy-aws.sh
```

The script will:
- ✅ Install dependencies
- ✅ Create AWS Elastic Beanstalk application
- ✅ Deploy your backend
- ✅ Provide you with the public URL

### Step 5: Update Mobile App
After deployment, update your mobile app `.env` file:
```bash
EXPO_PUBLIC_API_BASE_URL=https://your-app.elasticbeanstalk.com/api
EXPO_PUBLIC_SOCKET_URL=https://your-app.elasticbeanstalk.com
```

## 🎯 What You Get

- ✅ **Public API**: `https://your-app.elasticbeanstalk.com/api`
- ✅ **Health Check**: `https://your-app.elasticbeanstalk.com/api/health`
- ✅ **API Docs**: `https://your-app.elasticbeanstalk.com/api/docs`
- ✅ **HTTPS**: Automatic SSL certificate
- ✅ **Scalable**: Can handle traffic spikes
- ✅ **Cost**: ~$10-15/month (free tier eligible)

## 🔍 Test Your Deployment

```bash
# Health check
curl https://your-app.elasticbeanstalk.com/api/health

# Test registration
curl -X POST https://your-app.elasticbeanstalk.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## 💰 Cost Breakdown

- **Elastic Beanstalk**: $0 (free tier) - $15/month
- **MongoDB Atlas**: $0 (free tier)
- **Data Transfer**: $0.09/GB
- **Total**: ~$10-15/month

## 🚨 Troubleshooting

### Common Issues

1. **"Authentication token not found"**
   - Check if your mobile app is using the correct API URL
   - Verify the backend is running: `eb status`

2. **CORS errors**
   - Backend CORS is already configured for mobile apps
   - Check if you're using HTTPS

3. **Database connection failed**
   - Verify MongoDB Atlas connection string
   - Check if IP is whitelisted in Atlas

### Useful Commands

```bash
# Check deployment status
eb status

# View logs
eb logs

# Open in browser
eb open

# Terminate (if needed)
eb terminate
```

## 🎉 Success!

Your AgroMesh backend is now:
- 🌐 **Publicly accessible**
- 🔒 **Secure with HTTPS**
- 📱 **Ready for mobile app**
- 🚀 **Scalable and reliable**

Start farming with AI! 🌾📱✨
