# Login/Signup Fixes and Admin Redirection

## Issues Fixed

### 1. API Port Mismatch ✅
**Problem:** Frontend was trying to connect to `http://localhost:3000/api` but backend runs on port `3001`

**Solution:** Updated `frontend/src/services/api.js` to use the correct port:
```javascript
baseURL: process.env.VUE_APP_API_BASE_URL || 'http://localhost:3001/api'
```

### 2. Router Authentication Check ✅
**Problem:** Router was checking for `adminToken` and `adminUser` in localStorage, but the auth service stores `auth_token` and `user`

**Solution:** Updated `frontend/src/router/index.js` to use the correct localStorage keys:
```javascript
const token = localStorage.getItem('auth_token')
const userStr = localStorage.getItem('user')
```

### 3. Admin Role-Based Redirection ✅
**Problem:** After login, admin users were not being redirected to the admin dashboard

**Solution:** Added redirection logic in both `LoginModal.vue` and `SignupModal.vue`:
- After successful login/signup, check if user has `role === 'admin'`
- If admin, redirect to `/admin/dashboard`
- Regular users stay on the current page

### 4. Logout Not Clearing Session ✅
**Problem:** Clicking logout was not removing the authentication tokens from localStorage. Components were calling the Vuex mutation directly instead of the action.

**Solution:** Updated logout calls in `AppHeader.vue` and `AdminLayout.vue`:
- Changed from `this.$store.commit('logout')` to `await this.$store.dispatch('logout')`
- The action properly calls `authService.logout()` which removes `auth_token` and `user` from localStorage
- The mutation only clears Vuex state, not localStorage

### 5. Placeholder Image Loading Errors ✅
**Problem:** Application was trying to load placeholder images from `via.placeholder.com` causing `ERR_NAME_NOT_RESOLVED` errors (15+ errors on page load).

**Solution:** Implemented local placeholder image generation system:
- Created `utils/placeholder.js` - Generates placeholder images using HTML5 Canvas as data URIs
- Created `mixins/imageFallback.js` - Reusable mixin for handling image errors
- Updated all product views, cart, wishlist, checkout, and profile components
- Replaced all `via.placeholder.com` URLs with local generated placeholders
- No external dependencies, works offline, instant loading

### 6. Improved Error Messages for Login/Signup ✅
**Problem:** When backend server wasn't running, login/signup showed generic "Login failed" message without explaining the actual issue.

**Solution:** Enhanced error handling in `authService.js`:
- Added detailed error logging (error code, message, response)
- Detects network errors and shows "Cannot connect to server" message
- Detects connection refused and shows "Please start the backend server" message
- Provides specific guidance to users about what went wrong
- Applied to both login and register methods

## Testing Instructions

### Quick Start (Windows)

**Option 1: Using Batch Scripts**
1. Double-click `start-backend.bat` (starts backend on port 3001)
2. Double-click `start-frontend.bat` (starts frontend on port 8080)
3. Open browser to http://localhost:8080

**Option 2: Manual Start**

### Step 1: Start the Backend Server
```bash
cd backend
npm install
node src/server.js
```

The backend should start on `http://localhost:3001`

**Verify backend is running:**
Open http://localhost:3001/api/health in browser - should show `{"status":"ok"}`

### Step 2: Create an Admin User
Run this command to create a test admin user:
```bash
cd backend
node create-admin.js
```

This will create an admin user with:
- **Email:** admin@comphility.com
- **Password:** admin123

### Step 3: Start the Frontend
```bash
cd frontend
npm install
npm run serve
```

The frontend should start on `http://localhost:8080`

### Step 4: Test Login Functionality

#### Test Regular User Login:
1. Click "Sign Up" and create a new account
2. After signup, you should remain on the home page (regular users)

#### Test Admin User Login:
1. Click "Login"
2. Enter credentials:
   - Email: `admin@comphility.com`
   - Password: `admin123`
3. Click "LOGIN"
4. You should be automatically redirected to `/admin/dashboard`

### Step 5: Test Admin Route Protection
1. Logout (if logged in)
2. Try to access `http://localhost:8080/admin/dashboard` directly
3. You should see an alert and be redirected to home page
4. Login as admin
5. Now you can access the admin dashboard

### Step 6: Test Logout Functionality
1. Login with any user (regular or admin)
2. Open browser DevTools (F12) > Application > Local Storage
3. Verify that `auth_token` and `user` are present
4. Click the logout button (user icon dropdown > Logout)
5. Check Local Storage again - both `auth_token` and `user` should be removed
6. Verify you're redirected to the home page
7. Try accessing protected routes - you should be blocked

## Database Requirements

The backend uses MySQL. Make sure you have:
- MySQL server running
- Credentials configured in `backend/.env`:
  ```
  DB_HOST=localhost
  DB_PORT=3306
  DB_USER=root
  DB_PASSWORD=
  DB_DATABASE=comphility
  ```

The database and tables will be created automatically when the backend starts.

## Troubleshooting

### Login/Signup Still Not Working?

1. **Check Backend is Running:**
   - Open `http://localhost:3001/api/health` in browser
   - Should return `{"status":"ok"}`

2. **Check MySQL Connection:**
   - Verify MySQL is running
   - Check credentials in `backend/.env`
   - Look at backend console for database errors

3. **Check Browser Console:**
   - Open browser DevTools (F12)
   - Look for network errors or API call failures
   - Check if API calls are going to port 3001

4. **Clear Browser Storage:**
   - Open DevTools > Application > Local Storage
   - Clear all items
   - Try login again

### Admin Redirection Not Working?

1. **Verify User Role:**
   - After login, check localStorage in DevTools
   - Look for the `user` item
   - Verify it contains `"role": "admin"`

2. **Check Console Logs:**
   - Look for log message: `👑 [LoginModal] Admin user detected, redirecting to admin dashboard`
   - If missing, the role check might be failing

## Files Modified

1. `frontend/src/services/api.js` - Fixed API base URL port
2. `frontend/src/router/index.js` - Fixed localStorage key names for auth
3. `frontend/src/components/modals/LoginModal.vue` - Added admin redirection
4. `frontend/src/components/modals/SignupModal.vue` - Added admin redirection
5. `frontend/src/components/layout/AppHeader.vue` - Fixed logout to use action instead of mutation
6. `frontend/src/components/admin/AdminLayout.vue` - Fixed logout to use action instead of mutation
7. `frontend/src/views/Processors.vue` - Added image fallback mixin
8. `frontend/src/views/Motherboards.vue` - Added image fallback mixin
9. `frontend/src/views/GraphicsCards.vue` - Added image fallback mixin
10. `frontend/src/views/Cart.vue` - Added image fallback mixin
11. `frontend/src/views/Wishlist.vue` - Added image fallback mixin
12. `frontend/src/views/Checkout.vue` - Added image fallback mixin
13. `frontend/src/views/Profile.vue` - Added image fallback mixin
14. `frontend/src/views/Home.vue` - Replaced via.placeholder URLs with local placeholders

## Files Created

1. `backend/create-admin.js` - Script to create admin user for testing
2. `frontend/src/utils/placeholder.js` - Local placeholder image generator
3. `frontend/src/mixins/imageFallback.js` - Image fallback mixin for components
4. `start-backend.bat` - Windows batch script to start backend server
5. `start-frontend.bat` - Windows batch script to start frontend server
6. `START_SERVERS.md` - Complete guide for starting the application
7. `FIXES_APPLIED.md` - This documentation file
8. `LOGOUT_FIX_SUMMARY.md` - Detailed logout fix documentation
9. `PLACEHOLDER_IMAGE_FIX.md` - Detailed placeholder image fix documentation
10. `TEST_PLACEHOLDER_FIX.md` - Testing guide for placeholder fix
