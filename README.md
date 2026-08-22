# urlShort - Modern URL Shortener

A full-stack URL shortener built with React, Node.js, Express, and MongoDB. It features a beautiful glassmorphism user interface, user authentication, and comprehensive click analytics.

## ✨ Features

- **Instant URL Shortening**: Convert long, unwieldy URLs into sleek, shareable links.
- **User Authentication**: Secure email and password registration/login using JWT and bcrypt.
- **Dashboard Management**: View, search, update, and delete your shortened URLs from a centralized dashboard.
- **Click Analytics**: Track total clicks, creation dates, last clicked timestamps, and a detailed chronological click history.
- **Modern UI/UX**: Stunning dark-mode glassmorphism design with toast notifications, modals, and smooth animations.
- **Smart Auto-Refresh**: Analytics and URL lists automatically refresh when you switch back to the application tab.

## 🚀 Tech Stack

**Frontend:**
- React 18
- Vite
- React Router DOM
- Custom CSS (Glassmorphism, Animations, Responsive Design)

**Backend:**
- Node.js
- Express.js
- MongoDB (Mongoose)
- JSON Web Tokens (JWT) for authentication
- bcryptjs for password hashing
- nanoid for generating unique short IDs

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v16+)
- MongoDB (Local instance or MongoDB Atlas cluster)

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/url-shortener.git
cd urlShort
```

### 2. Setup the Backend
```bash
cd server
npm install
```
Create a `.env` file in the `server` directory and add the following variables:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/url-shortener
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d
```

### 3. Setup the Frontend
```bash
cd ../client
npm install
```

### 4. Run the Application
You will need two terminal windows to run the frontend and backend concurrently.

**Terminal 1 (Backend):**
```bash
cd server
npm run dev
```
*The server will start on http://localhost:5000*

**Terminal 2 (Frontend):**
```bash
cd client
npm run dev
```
*The React app will start on http://localhost:5173*

## 📡 API Endpoints

### Authentication (`/auth`)
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Authenticate user and get token
- `GET /auth/me` - Get current authenticated user

### URLs (`/url`)
- `POST /` - Create a new short URL (Protected)
- `GET /all` - Get all URLs for the logged-in user (Protected)
- `PUT /:shortId` - Update original URL destination (Protected)
- `DELETE /:shortId` - Delete a short URL (Protected)
- `GET /analytics/:shortId` - Get click analytics for a specific URL (Public)

### Redirection (`/`)
- `GET /:shortId` - Redirects to the original URL and tracks the click

## 📄 License

This project is licensed under the MIT License. Feel free to use and modify it for your own projects.
