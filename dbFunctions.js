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

async function writeDb(gameObj) {
  const collection = await connectDb();
  // upsert = update if exists, insert if not
  await collection.updateOne(
    { name: gameObj.name },
    { checked: gameObj.checked},
    { $set: gameObj },
    { upsert: true }
  );
}
  
module.exports = { readDb, writeDb };
