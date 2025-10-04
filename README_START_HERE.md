# 🚀 Comphility - Quick Start Guide

## ⚡ Fastest Way to Start

### Windows Users:
1. **Double-click** `start-backend.bat` 
2. **Double-click** `start-frontend.bat`
3. **Open browser** to http://localhost:8080

That's it! 🎉

## 📋 What Was Fixed

This application had several issues that have been resolved:

### ✅ Fixed Issues:
1. **Login/Signup not working** - API port mismatch fixed
2. **Logout not clearing session** - Now properly removes tokens
3. **Admin redirection** - Admins now redirect to dashboard after login
4. **Placeholder image errors** - 15+ network errors eliminated
5. **Better error messages** - Clear guidance when backend is not running

## 🔑 Test Credentials

### Admin Account:
Run this first to create an admin:
```bash
cd backend
node create-admin.js
```

Then login with:
- **Email:** admin@comphility.com
- **Password:** admin123

### Regular User:
Use the signup form to create a new account.

## 📚 Documentation

- **START_SERVERS.md** - Complete server startup guide
- **FIXES_APPLIED.md** - Detailed list of all fixes
- **LOGOUT_FIX_SUMMARY.md** - Logout functionality fix
- **PLACEHOLDER_IMAGE_FIX.md** - Image loading fix
- **TEST_PLACEHOLDER_FIX.md** - Testing guide

## ⚠️ Common Issues

### "Cannot connect to server"
**Problem:** Backend is not running

**Solution:**
1. Open `start-backend.bat` or run `node src/server.js` in backend folder
2. Wait for "COMPHILITY API listening on http://localhost:3001"
3. Verify at http://localhost:3001/api/health

### "Login failed"
**Problem:** Backend server is not running or MySQL is not connected

**Solution:**
1. Check backend terminal for errors
2. Ensure MySQL is running
3. Check `backend/.env` has correct MySQL credentials

### Port Already in Use
**Solution:**
```powershell
# Kill process on port 3001 (backend)
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Kill process on port 8080 (frontend)
netstat -ano | findstr :8080
taskkill /PID <PID> /F
```

## 🛠️ Prerequisites

Before starting, ensure you have:
- ✅ Node.js (v14+) - https://nodejs.org/
- ✅ MySQL Server running
- ✅ MySQL credentials in `backend/.env`

## 📦 Project Structure

```
comphilityv1-master/
├── backend/              # Backend API (Node.js + Express)
│   ├── src/
│   │   ├── server.js    # Main server file
│   │   ├── routes/      # API routes
│   │   └── db.js        # Database connection
│   ├── .env             # Environment variables
│   └── create-admin.js  # Admin user creation script
│
├── frontend/            # Frontend (Vue.js)
│   ├── src/
│   │   ├── views/       # Page components
│   │   ├── components/  # Reusable components
│   │   ├── services/    # API services
│   │   ├── store/       # Vuex store
│   │   ├── router/      # Vue Router
│   │   ├── utils/       # Utility functions
│   │   └── mixins/      # Vue mixins
│   └── public/          # Static assets
│
├── start-backend.bat    # Start backend (Windows)
├── start-frontend.bat   # Start frontend (Windows)
└── START_SERVERS.md     # Detailed startup guide
```

## 🎯 Features

- 🛒 E-commerce platform for PC components
- 👤 User authentication (login/signup)
- 👑 Admin dashboard
- 🛍️ Shopping cart
- ❤️ Wishlist
- 🔍 Product search
- 📦 Product categories
- 💳 Checkout process

## 🔧 Development

### Backend (Port 3001)
```bash
cd backend
npm install
node src/server.js
```

### Frontend (Port 8080)
```bash
cd frontend
npm install
npm run serve
```

### Hot Reload
- Frontend: Auto-reloads on file changes
- Backend: Restart required (Ctrl+C, then restart)

## 🧪 Testing

### Test Backend Health:
```
http://localhost:3001/api/health
```
Should return: `{"status":"ok"}`

### Test Frontend:
```
http://localhost:8080
```
Should show the Comphility homepage

### Test Login:
1. Create admin user: `node backend/create-admin.js`
2. Go to http://localhost:8080
3. Click user icon → Login
4. Use admin credentials
5. Should redirect to admin dashboard

## 💡 Tips

- Keep both backend and frontend terminals open
- Check console logs for errors
- Use browser DevTools (F12) for debugging
- Backend logs show API requests
- Frontend logs show Vue component activity

## 🆘 Need Help?

1. Check the error message - they now provide specific guidance
2. Read START_SERVERS.md for detailed troubleshooting
3. Verify backend is running at http://localhost:3001/api/health
4. Check browser console (F12) for frontend errors
5. Check backend terminal for API errors

## 📝 Recent Updates

### Latest Fixes (2025-10-04):
- ✅ Fixed API port mismatch (3000 → 3001)
- ✅ Fixed logout not clearing session
- ✅ Added admin role-based redirection
- ✅ Fixed placeholder image loading errors
- ✅ Improved error messages for better UX
- ✅ Created easy-start batch scripts

See **FIXES_APPLIED.md** for complete details.

---

**Happy Coding! 🚀**

For detailed documentation, see the individual MD files in the root directory.
