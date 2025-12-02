const { MongoClient } = require('mongodb');
require('dotenv').config({ path: './config.env' });

async function main() {
  const url = process.env.URL;
  
  if (!url) {
    console.error('URL is not defined in environment variables');
    process.exit(1);
  }

  const client = new MongoClient(url);

  try {
    await client.connect();
    console.log('Connected successfully to MongoDB Atlas');

    const databasesList = await client.db().admin().listDatabases();
    console.log('Databases:');
    databasesList.databases.forEach(db => {
      console.log(` - ${db.name}`);
    });

    const database = client.db('RecipeApp');
    const collection = database.collection('recipes');

  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  } finally {
    await client.close();
    console.log('\nConnection closed');
  }
}

main();
