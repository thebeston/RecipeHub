const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config({ path: './config.env' });

const url = process.env.URL;
const dbName = 'RecipeApp';
const collectionName = 'recipes';

async function getDatabase() {
  const client = new MongoClient(url);
  await client.connect();
  return { client, db: client.db(dbName), collection: client.db(dbName).collection(collectionName) };
}

async function createRecipe(recipeData) {
  const { client, collection } = await getDatabase();
  
  try {
    const recipe = {
      title: recipeData.title,
      ingredients: recipeData.ingredients,
      dietaryRestrictions: recipeData.dietaryRestrictions,
      duration: recipeData.duration,
      instructions: recipeData.instructions,
      imageUrl: recipeData.imageUrl || '',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await collection.insertOne(recipe);
    console.log(`Recipe created with ID: ${result.insertedId}`);
    return { success: true, id: result.insertedId, data: recipe };
  } catch (error) {
    console.error('Error creating recipe:', error);
    return { success: false, error: error.message };
  } finally {
    await client.close();
  }
}

async function getAllRecipes() {
  const { client, collection } = await getDatabase();
  
  try {
    const recipes = await collection.find({}).toArray();
    console.log(`Found ${recipes.length} recipes`);
    return { success: true, data: recipes };
  } catch (error) {
    console.error('Error fetching recipes:', error);
    return { success: false, error: error.message };
  } finally {
    await client.close();
  }
}

async function getRecipeById(id) {
  const { client, collection } = await getDatabase();
  
  try {
    const recipe = await collection.findOne({ _id: new ObjectId(id) });
    
    if (recipe) {
      console.log(`Recipe found: ${recipe.title}`);
      return { success: true, data: recipe };
    } else {
      console.log('Recipe not found');
      return { success: false, error: 'Recipe not found' };
    }
  } catch (error) {
    console.error('Error fetching recipe:', error);
    return { success: false, error: error.message };
  } finally {
    await client.close();
  }
}

async function searchRecipesByTitle(searchTerm) {
  const { client, collection } = await getDatabase();
  
  try {
    const recipes = await collection.find({
      title: { $regex: searchTerm, $options: 'i' } 
    }).toArray();
    
    console.log(`Found ${recipes.length} recipes matching "${searchTerm}"`);
    return { success: true, data: recipes };
  } catch (error) {
    console.error('Error searching recipes:', error);
    return { success: false, error: error.message };
  } finally {
    await client.close();
  }
}

async function getRecipesByDietaryRestrictions(restrictions) {
  const { client, collection } = await getDatabase();
  
  try {
    const query = {};

    restrictions.forEach(restriction => {
      query[`dietaryRestrictions.${restriction}`] = true;
    });
    
    const recipes = await collection.find(query).toArray();
    console.log(`Found ${recipes.length} recipes with specified dietary restrictions`);
    return { success: true, data: recipes };
  } catch (error) {
    console.error('Error filtering recipes:', error);
    return { success: false, error: error.message };
  } finally {
    await client.close();
  }
}

async function updateRecipe(id, updateData) {
  const { client, collection } = await getDatabase();
  
  try {
    const updatedRecipe = {
      ...updateData,
      updatedAt: new Date()
    };

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedRecipe }
    );

    if (result.matchedCount === 0) {
      console.log('Recipe not found');
      return { success: false, error: 'Recipe not found' };
    }

    console.log(`Recipe updated: ${result.modifiedCount} document(s) modified`);
    return { success: true, modifiedCount: result.modifiedCount };
  } catch (error) {
    console.error('Error updating recipe:', error);
    return { success: false, error: error.message };
  } finally {
    await client.close();
  }
}

async function deleteRecipe(id) {
  const { client, collection } = await getDatabase();
  
  try {
    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      console.log('Recipe not found');
      return { success: false, error: 'Recipe not found' };
    }

    console.log(`Recipe deleted: ${result.deletedCount} document(s) deleted`);
    return { success: true, deletedCount: result.deletedCount };
  } catch (error) {
    console.error('Error deleting recipe:', error);
    return { success: false, error: error.message };
  } finally {
    await client.close();
  }
}

async function deleteAllRecipes() {
  const { client, collection } = await getDatabase();
  
  try {
    const result = await collection.deleteMany({});
    console.log(`Deleted ${result.deletedCount} recipes`);
    return { success: true, deletedCount: result.deletedCount };
  } catch (error) {
    console.error('Error deleting recipes:', error);
    return { success: false, error: error.message };
  } finally {
    await client.close();
  }
}

module.exports = {
  createRecipe,
  getAllRecipes,
  getRecipeById,
  searchRecipesByTitle,
  getRecipesByDietaryRestrictions,
  updateRecipe,
  deleteRecipe,
  deleteAllRecipes
};