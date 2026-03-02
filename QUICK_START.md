# 🚀 Quick Start Guide

## ⚡ 5-Minute Setup

### 1. Prerequisites
- Node.js installed
- MongoDB running locally or Atlas account

### 2. Clone & Install
```bash
git clone <repository-url>
cd weather-app
npm run install-all
```

### 3. Get API Keys
- **OpenWeatherMap**: https://openweathermap.org/api (Free)
- **Google Maps** (Optional): https://console.cloud.google.com/

### 4. Configure Environment
```bash
# Copy and edit environment files
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Add your API keys to backend/.env:
OPENWEATHER_API_KEY=your_key_here
GOOGLE_MAPS_API_KEY=your_key_here
```

### 5. Start the App
```bash
# Start both frontend and backend
npm run dev

# Or separately:
npm run server  # Backend :5000
npm run client  # Frontend :3000
```

### 6. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api/health

## 🎯 Quick Test

1. Open http://localhost:3000
2. Search for "London" 
3. Click "Use My Location" 📍
4. Save a weather record 💾
5. Export data as CSV 📊

**That's it! Your weather app is running!** 🌤️

## 🔧 Troubleshooting

### MongoDB Connection Issues
```bash
# Start MongoDB locally
sudo systemctl start mongod

# Or use MongoDB Atlas
# Update MONGODB_URI in .env with Atlas connection string
```

### API Key Problems
- Ensure OpenWeatherMap API key is valid
- Check Google Maps API is enabled (if using)
- Verify no typos in .env file

### Port Conflicts
```bash
# Kill processes on ports 3000 and 5000
npx kill-port 3000
npx kill-port 5000
```

## 📱 Mobile Testing

Add to your phone's home screen:
1. Open http://localhost:3000 on mobile browser
2. Use "Add to Home Screen" option
3. Test geolocation and responsive features

## 🎬 Ready for Demo!

Follow the **DEMO_CHECKLIST.md** for a complete demo walkthrough.

---

**Need help? Check the full README.md for detailed instructions.**
