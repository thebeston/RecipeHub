# 🚀 Deployment Guide - Recipe Hub App

## Overview
- **Backend**: Deploy to Render
- **Frontend**: Deploy to Vercel
- **Database**: MongoDB Atlas (already set up)

---

## 📋 Pre-Deployment Checklist

### ✅ Git Repository Setup
Your `.gitignore` already protects sensitive files:
- ✅ `config.env` (backend secrets)
- ✅ `.env` files (any environment variables)
- ✅ `node_modules/` (dependencies)

### ✅ Files to Push to Git
```
RecipeHub/
├── backend/
│   ├── config.env.example  ← Template (push this)
│   ├── config.env          ← Real secrets (DON'T push)
│   ├── server.js
│   ├── package.json
│   └── ... other files
└── recipe-app/
    ├── src/
    ├── public/
    ├── package.json
    └── ... other files
```

---

## 🔧 Backend Deployment (Render)

### Step 1: Push to GitHub
```bash
cd RecipeHub
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### Step 2: Deploy on Render

1. Go to [render.com](https://render.com) and sign in
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `recipe-hub-backend`
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Instance Type**: Free

### Step 3: Add Environment Variables
In Render dashboard → **Environment** tab, add:

```
URL=mongodb+srv://aaravswami:Aabo912006db@cluster0.9fppsyv.mongodb.net/?appName=Cluster0
PORT=5000
SPOONACULAR_API_KEY=your_actual_api_key_here
```

⚠️ **Important**: Use your actual Spoonacular API key!

### Step 4: Deploy
- Click **"Create Web Service"**
- Render will automatically deploy
- Copy your backend URL (e.g., `https://recipe-hub-backend.onrender.com`)

---

## 🌐 Frontend Deployment (Vercel)

### Step 1: Update API URL in Frontend

Before deploying, update the API endpoints in your React app to use the Render backend URL.

**Option A: Environment Variable (Recommended)**
1. Create `.env.production` in `recipe-app/`:
```bash
REACT_APP_API_URL=https://your-render-backend-url.onrender.com
```

2. Update all `fetch` calls in your components to use:
```javascript
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
fetch(`${API_URL}/api/recipes`)
```

**Option B: Update Backend URL Manually**
Change all instances of:
```javascript
'http://localhost:5000/api/...'
```
to:
```javascript
'https://your-render-backend-url.onrender.com/api/...'
```

### Step 2: Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New"** → **"Project"**
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: Create React App
   - **Root Directory**: `recipe-app`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`

### Step 3: Add Environment Variables (if using Option A)
In Vercel → **Settings** → **Environment Variables**, add:
```
REACT_APP_API_URL=https://your-render-backend-url.onrender.com
```

### Step 4: Deploy
- Click **"Deploy"**
- Vercel will build and deploy automatically
- Your app will be live at `https://your-app-name.vercel.app`

---

## 🔒 Security Best Practices

### ✅ What's Already Protected:
- ✅ `config.env` is in `.gitignore`
- ✅ MongoDB credentials stay in environment variables
- ✅ Spoonacular API key is on backend only
- ✅ CORS is configured in backend

### ⚠️ Additional Security Steps:

1. **Update CORS in server.js** to allow only your Vercel domain:
```javascript
const cors = require('cors');
app.use(cors({
  origin: ['https://your-app-name.vercel.app', 'http://localhost:3000']
}));
```

2. **Change MongoDB Password** (optional but recommended):
   - Go to MongoDB Atlas
   - Create a new database user with a stronger password
   - Update the URL in Render environment variables

3. **Rotate API Keys** after deployment (good practice)

---

## 📝 Quick Deployment Commands

```bash
# 1. Make sure everything is committed
git status

# 2. Add all changes
git add .

# 3. Commit
git commit -m "Ready for deployment"

# 4. Push to GitHub
git push origin main

# 5. Deploy backend on Render (manual via dashboard)
# 6. Deploy frontend on Vercel (manual via dashboard)
```

---

## 🐛 Common Issues & Solutions

### Backend Not Starting on Render
- Check environment variables are set correctly
- Check build logs for errors
- Ensure `node_modules` is in `.gitignore`

### Frontend Can't Connect to Backend
- Verify CORS settings in backend
- Check API URL in frontend code
- Ensure Render backend is awake (free tier sleeps after inactivity)

### MongoDB Connection Fails
- Whitelist `0.0.0.0/0` in MongoDB Atlas Network Access (for Render)
- Verify connection string is correct

### Render Free Tier Limitations
- App sleeps after 15 minutes of inactivity
- First request after sleep takes ~30 seconds
- Consider upgrading for production use

---

## 🎉 Post-Deployment

After successful deployment:
1. ✅ Test all CRUD operations
2. ✅ Test recipe search and filters
3. ✅ Test Spoonacular API integration
4. ✅ Test favorites functionality
5. ✅ Test image uploads

---

## 📞 Support Resources

- **Render Docs**: https://render.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **MongoDB Atlas**: https://www.mongodb.com/docs/atlas/
- **Spoonacular API**: https://spoonacular.com/food-api/docs

---

## 🔄 Updating After Deployment

To push updates:
```bash
git add .
git commit -m "Your update message"
git push origin main
```

- Render: Auto-deploys on push
- Vercel: Auto-deploys on push
