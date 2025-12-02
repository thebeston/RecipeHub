# Spoonacular API Setup Instructions

## Getting Your API Key

1. Go to [https://spoonacular.com/food-api](https://spoonacular.com/food-api)
2. Click "Get Access" or "Start Now"
3. Sign up for a free account
4. Once logged in, go to your profile/dashboard
5. Copy your API key

## Adding the API Key to Your Project

1. Open `src/components/DiscoverPage.jsx`
2. Find this line (around line 23):
   ```javascript
   const SPOONACULAR_API_KEY = 'YOUR_API_KEY_HERE';
   ```
3. Replace `'YOUR_API_KEY_HERE'` with your actual API key:
   ```javascript
   const SPOONACULAR_API_KEY = 'your-actual-api-key-123456';
   ```

## Free Tier Limits

- **150 requests per day**
- Perfect for development and testing
- Resets daily

## Important Notes

- Keep your API key private
- Don't commit it to public repositories
- Consider using environment variables for production

## Alternative: Using Environment Variables (Recommended)

1. Create a `.env` file in the `recipe-app` folder
2. Add your API key:
   ```
   REACT_APP_SPOONACULAR_API_KEY=your-actual-api-key-123456
   ```
3. In `DiscoverPage.jsx`, change the line to:
   ```javascript
   const SPOONACULAR_API_KEY = process.env.REACT_APP_SPOONACULAR_API_KEY;
   ```
4. Restart your development server

**Note:** The `.env` file is already in your `.gitignore`, so it won't be committed to version control.
