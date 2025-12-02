# Spoonacular API Usage Information

## Free Tier Limits

With the **free tier** of Spoonacular API, you get:
- **150 requests per day**
- Resets every 24 hours at UTC midnight

## Current App Configuration

Your app is now configured to fetch **50 recipes at a time** from the Discover page.

## Usage Calculation

### How many times can you load recipes per day?

With 150 requests/day and 50 recipes per load:
- **150 ÷ 50 = 3 full loads per day** (150 recipes total)

### What counts as a request?

Each time you:
1. **Load the Discover page** = 1 request (fetches 50 recipes)
2. **Click "Refresh"** or reload = 1 request
3. Any API call to Spoonacular = 1 request

### Important Notes:

- ✅ **Viewing recipes** does NOT count (already fetched)
- ✅ **Adding to collection** does NOT count (saved to your MongoDB)
- ✅ **Searching/filtering** does NOT count (done client-side)
- ❌ **Each page refresh** on Discover DOES count

## Tips to Conserve API Calls

1. **Don't refresh unnecessarily** - The 50 recipes are cached while on the page
2. **Use filters and search** - Filter the already-fetched recipes instead of fetching new ones
3. **Add recipes to your collection** - Once added, you can view them unlimited times from your Home page
4. **Plan your browsing** - Browse through all 50 recipes before refreshing for new ones

## Monitoring Your Usage

You can monitor your API usage at:
- **Spoonacular Dashboard**: https://spoonacular.com/food-api/console#Dashboard
- Log in with your Spoonacular account to see:
  - Requests used today
  - Requests remaining
  - Usage history

## What Happens When You Run Out?

If you exceed 150 requests in a day:
- ❌ The Discover page will show an error
- ✅ Your existing recipes in Home/Favorites will still work
- ⏰ Wait until UTC midnight for your quota to reset

## Upgrading (Optional)

If you need more requests, Spoonacular offers paid plans:
- **Basic**: $49/month - 5,000 requests/day
- **Mega**: $149/month - 50,000 requests/day
- **Ultra**: $399/month - 500,000 requests/day

Visit: https://spoonacular.com/food-api/pricing

## Current Status

With 50 recipes per load:
- 🎯 **Optimal balance** between variety and API conservation
- 📊 You can discover 150 new recipes per day
- 💡 Each load gives you plenty of options to browse and add

---

**Pro Tip**: Since you're storing recipes in MongoDB, focus on adding interesting recipes to your collection. This way, you build your personal recipe library without using additional API calls!
