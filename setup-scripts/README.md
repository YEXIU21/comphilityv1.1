# COMPHILITY Setup Scripts

Complete setup and initialization scripts for the COMPHILITY e-commerce system.

## 📋 Overview

This folder contains all the necessary scripts to set up the COMPHILITY backend database and initial data:

- **Master Setup Script**: One-command complete setup
- **Individual Scripts**: Granular control over setup steps
- **Sample Data**: Pre-configured products and admin user

## 🚀 Quick Start

### Option 1: Complete Setup (Recommended)
```bash
# Navigate to setup scripts directory
cd setup-scripts

# Install dependencies
npm install

# Run complete setup
npm run setup
```

### Option 2: Manual Step-by-Step Setup
```bash
# 1. Create database and tables
npm run setup:db

# 2. Create admin user
npm run setup:admin

# 3. Add sample products
npm run setup:products
```

## 📁 Script Files

### `master-setup.js`
**Complete automated setup script**
- Creates MySQL database and all tables
- Sets up admin user with default credentials
- Seeds sample products
- Provides detailed progress feedback
- Handles errors gracefully

### `01-create-database.js`
**Database and table creation**
- Creates `comphility` database
- Creates `users` table with authentication fields
- Creates `products` table with e-commerce fields
- Creates `cart` table with shopping cart functionality
- Sets up proper indexes and foreign keys

### `02-create-admin.js`
**Admin user setup**
- Creates default admin user account
- Email: `admin@comphility.com`
- Password: `admin123` ⚠️ (Change after first login!)
- Handles existing user updates

### `03-seed-products.js`
**Sample product data**
- Adds 8 sample products across different categories
- Includes PC Sets, Laptops, and Components
- Sets up featured products and pricing
- Avoids duplicate entries

## ⚙️ Configuration

### Environment Variables
The scripts read configuration from `../backend/.env`:

```env
# MySQL Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_DATABASE=comphility
```

### Default Credentials
- **Admin Email**: `admin@comphility.com`
- **Admin Password**: `admin123`

⚠️ **Security Notice**: Change the admin password immediately after first login!

## 📊 What Gets Created

### Database Structure
```
comphility/
├── users (authentication and user management)
├── products (product catalog)
└── cart (shopping cart functionality)
```

### Sample Data
- **1 Admin User**: System administrator account
- **8 Sample Products**: Across PC Sets, Laptops, Components
- **Product Categories**: Gaming PCs, Office PCs, Gaming Laptops, etc.
- **Brands**: Intel, NVIDIA, ASUS, Corsair, Samsung, Apple

## 🔧 Troubleshooting

### Common Issues

#### MySQL Connection Error
```
❌ Error: connect ECONNREFUSED 127.0.0.1:3306
```
**Solution**: Start MySQL service
- Windows: Start MySQL in Services
- Mac: `brew services start mysql`
- Linux: `sudo systemctl start mysql`

#### Access Denied Error
```
❌ Error: ER_ACCESS_DENIED_ERROR
```
**Solution**: Check MySQL credentials in `backend/.env`

#### Database Already Exists
The scripts are designed to be **idempotent** - safe to run multiple times.

### Manual Database Reset
If you need to start fresh:
```sql
DROP DATABASE IF EXISTS comphility;
```
Then run the setup scripts again.

## 📋 Script Commands

```bash
# Complete setup
npm run setup

# Database only
npm run setup:db

# Admin user only  
npm run setup:admin

# Sample products only
npm run setup:products

# Individual script execution
node master-setup.js
node 01-create-database.js
node 02-create-admin.js
node 03-seed-products.js
```

## 🎯 Success Indicators

After successful setup, you should see:
- ✅ Database "comphility" created
- ✅ Tables: users, products, cart
- ✅ Admin user created
- ✅ Sample products added
- 🚀 Ready to start backend server

## 🔄 Next Steps

1. **Start Backend Server**:
   ```bash
   cd ../backend
   npm run dev
   ```

2. **Start Frontend**:
   ```bash
   cd ../frontend
   npm run serve
   ```

3. **Login as Admin**:
   - URL: `http://localhost:8080`
   - Email: `admin@comphility.com`
   - Password: `admin123`

## 🆘 Support

If you encounter issues:
1. Check MySQL service is running
2. Verify `backend/.env` configuration
3. Check console output for specific error messages
4. Run individual scripts to isolate issues

---

**COMPHILITY Setup Scripts v1.0.0**  
*Complete database initialization for COMPHILITY e-commerce system*
