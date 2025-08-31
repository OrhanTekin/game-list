const { MongoClient } = require("mongodb");

const uri = process.env.MONGO_URI; // your connection string from MongoDB Atlas
const client = new MongoClient(uri);

async function connectDb() {
  if (!client.topology?.isConnected()) {
    await client.connect();
  }
  return client.db("gameDB").collection("games"); // db name: gameDB, collection: games
}

async function readDb() {
  const collection = await connectDb();
  return collection.find({}).toArray(); // returns all games
}

async function writeDb(gamesArray) {
  const collection = await connectDb();
  await collection.deleteMany({}); // clear old
  if (gamesArray.length > 0) {
    await collection.insertMany(gamesArray); // insert all
  }
}
  
module.exports = { readDb, writeDb };
