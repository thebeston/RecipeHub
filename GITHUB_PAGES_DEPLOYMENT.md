# GitHub Pages Deployment Guide

## Important Note ⚠️

**Your Recipe Hub app has a backend server that connects to MongoDB. GitHub Pages only hosts static files (frontend), so the backend features won't work on GitHub Pages deployment.**

## What Will Work:
- ✅ Frontend UI and navigation
- ✅ All pages will load properly

## What Won't Work:
- ❌ Adding recipes (needs backend)
- ❌ Viewing recipes from MongoDB (needs backend)
- ❌ Discover page (needs backend + Spoonacular API)
- ❌ Favorites (stored in localStorage will work, but won't sync with MongoDB)

---

## Deployment Steps

### 1. Install gh-pages package:
```bash
cd recipe-app
npm install --save-dev gh-pages
```

### 2. Build and Deploy:
```bash
npm run deploy
```

This will:
- Build your app
- Create a `gh-pages` branch
- Push the built files to GitHub

### 3. Configure GitHub Repository:

1. Go to your GitHub repository: `https://github.com/thebeston/RecipeHub`
2. Click on **Settings**
3. Scroll down to **Pages** (in the left sidebar)
4. Under **Source**, make sure it's set to:
   - Branch: `gh-pages`
   - Folder: `/ (root)`
5. Click **Save**

### 4. Access Your App:

After a few minutes, your app will be live at:
```
https://thebeston.github.io/RecipeHub
```

---

## Recommended Deployment Option: Vercel + Render

For a **full-stack deployment** where everything works:

### Frontend (Vercel - FREE):
1. Go to https://vercel.com
2. Import your GitHub repository
3. Set Root Directory to: `recipe-app`
4. Environment Variables:
   - `REACT_APP_API_URL` = `https://your-backend-url.onrender.com`
5. Deploy

### Backend (Render - FREE):
1. Go to https://render.com
2. Create a new **Web Service**
3. Connect your GitHub repository
4. Settings:
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `node server.js`
5. Environment Variables:
   - `URL` (MongoDB connection string)
   - `PORT` (leave default)
   - `SPOONACULAR_API_KEY`
6. Deploy

### Update Backend to Accept Vercel Origin:

In `backend/server.js`, update CORS:

```javascript
const cors = require('cors');

app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://your-app-name.vercel.app'  // Add your Vercel URL
  ],
  credentials: true
}));
```

---

## Current Setup

✅ Added `homepage` field to package.json
✅ Added deployment scripts
✅ Created 404.html for routing
✅ Updated index.html with routing script

---

## Testing Locally

Before deploying, test your build:

```bash
cd recipe-app
npm run build
npx serve -s build
```

Then open http://localhost:3000

---

## Troubleshooting

### 404 Error on Refresh
- GitHub Pages doesn't support client-side routing natively
- The 404.html and index.html scripts handle this
- It's a workaround, but it works!

### Backend Not Working
- GitHub Pages only hosts static files
- You need a separate backend hosting (Render, Railway, etc.)

### Images Not Loading
- Make sure all image URLs use `%PUBLIC_URL%` in index.html
- Or use absolute paths in your code

---

## Quick Deploy Commands

```bash
# Navigate to recipe-app
cd recipe-app

# Install dependencies (if needed)
npm install

# Deploy to GitHub Pages
npm run deploy
```

That's it! Your frontend will be live at `https://thebeston.github.io/RecipeHub`

For full functionality, follow the Vercel + Render deployment guide above! 🚀
