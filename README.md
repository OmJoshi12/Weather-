# Weather App

A production-ready full-stack weather application built with modern web technologies that provides real-time weather data, 5-day forecasts, and comprehensive weather record management.

## Video Demonstration
https://drive.google.com/file/d/1s3SZizMTzoDrJmvgDqe3vftlzVPD-uHR/view?usp=sharing


## Features


### Data Management
- **CRUD Operations**: Create, read, update, and delete weather records
- **Database Storage**: MongoDB integration for persistent data storage
- **Data Export**: Export weather records in JSON, CSV, or Markdown formats
- **Search History**: View and manage saved weather queries

### Technical Features
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Error Handling**: Comprehensive error management with user-friendly messages
- **API Rate Limiting**: Protection against excessive API requests
- **Input Validation**: Robust validation for all user inputs and API responses

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **HTML5 + CSS3** with modern layout (Flexbox/Grid)
- **Axios** for HTTP requests
- **Responsive Design** with media queries

### Backend
- **Node.js + Express.js**
- **MongoDB** with Mongoose ODM
- **RESTful APIs** with comprehensive error handling
- **Security**: Helmet, CORS, rate limiting

### External APIs
- **OpenWeatherMap API**: Weather data and forecasts
- **Google Maps API**: Location visualization and geocoding
- **Browser Geolocation API**: User location detection

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager


### 6. Start the Application

#### Development Mode
```bash
# Start both frontend and backend concurrently
npm run dev

# Or start separately:
npm run server  # Backend on port 5000
npm run client  # Frontend on port 3000
```

#### Production Mode
```bash
# Build frontend
npm run build

# Start production server
npm start
```
