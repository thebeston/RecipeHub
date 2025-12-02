const express = require('express');
const cors = require('cors');
require('dotenv').config({ path: './config.env' });

const {
  createRecipe,
  getAllRecipes,
  getRecipeById,
  searchRecipesByTitle,
  getRecipesByDietaryRestrictions,
  updateRecipe,
  deleteRecipe,
} = require('./recipeOperations.cjs');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors()); 
app.use(express.json({ limit: '50mb' })); 
app.use(express.urlencoded({ extended: true, limit: '50mb' })); 

app.get('/', (req, res) => {
  res.json({ message: 'Recipe Hub API is running!' });
});

app.get('/api/recipes', async (req, res) => {
  try {
    const result = await getAllRecipes();
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/recipes/:id', async (req, res) => {
  try {
    const result = await getRecipeById(req.params.id);
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(404).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/recipes/search/:searchTerm', async (req, res) => {
  try {
    const result = await searchRecipesByTitle(req.params.searchTerm);
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/recipes/filter', async (req, res) => {
  try {
    const { restrictions } = req.body;
    
    if (!restrictions || !Array.isArray(restrictions)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Please provide an array of dietary restrictions' 
      });
    }
    
    const result = await getRecipesByDietaryRestrictions(restrictions);
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/recipes', async (req, res) => {
  try {
    const { title, ingredients, dietaryRestrictions, duration, instructions, imageUrl } = req.body;

    if (!title || !ingredients || !instructions) {
      return res.status(400).json({ 
        success: false, 
        error: 'Title, ingredients, and instructions are required' 
      });
    }
    
    const recipeData = {
      title,
      ingredients,
      dietaryRestrictions: dietaryRestrictions || {},
      duration: duration || '30',
      instructions,
      imageUrl: imageUrl || '',
    };
    
    const result = await createRecipe(recipeData);
    
    if (result.success) {
      res.status(201).json(result);
    } else {
      console.error('Error creating recipe:', result.error);
      res.status(500).json(result);
    }
  } catch (error) {
    console.error('Error in POST /api/recipes:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.put('/api/recipes/:id', async (req, res) => {
  try {
    const { title, ingredients, dietaryRestrictions, duration, instructions, imageUrl } = req.body;
    
    const updateData = {};
    if (title) updateData.title = title;
    if (ingredients) updateData.ingredients = ingredients;
    if (dietaryRestrictions) updateData.dietaryRestrictions = dietaryRestrictions;
    if (duration) updateData.duration = duration;
    if (instructions) updateData.instructions = instructions;
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl; 
    
    const result = await updateRecipe(req.params.id, updateData);
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(404).json(result);
    }
  } catch (error) {
    console.error('Error in PUT /api/recipes:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.delete('/api/recipes/:id', async (req, res) => {
  try {
    const result = await deleteRecipe(req.params.id);
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(404).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/spoonacular/recipes/random', async (req, res) => {
  try {
    const apiKey = process.env.SPOONACULAR_API_KEY;
    
    if (!apiKey || apiKey === 'YOUR_API_KEY_HERE') {
      return res.status(500).json({ 
        success: false, 
        error: 'Spoonacular API key not configured. Please add it to config.env file.' 
      });
    }

    const number = req.query.number || 30;
    const url = `https://api.spoonacular.com/recipes/random?apiKey=${apiKey}&number=${number}`;
    
    const fetch = (await import('node-fetch')).default;
    const response = await fetch(url);
    const data = await response.json();
    
    if (response.ok) {
      res.json(data);
    } else {
      res.status(response.status).json({ 
        success: false, 
        error: data.message || 'Failed to fetch recipes from Spoonacular' 
      });
    }
  } catch (error) {
    console.error('Spoonacular API error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`API endpoint: http://localhost:${PORT}/api/recipes`);
});
