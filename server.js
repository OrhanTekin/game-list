const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");

const app = express();
app.use(express.json());

// --- CORS ---
// Allow GitHub Pages frontend
app.use(cors({
  origin: "https://orhantekin.github.io"
}));

// --- MongoDB Connection ---
const uri = process.env.MONGO_URI;
if (!uri) {
  console.error("❌ MONGO_URI is not set! Add it in Render Environment Variables.");
  process.exit(1);
}

const client = new MongoClient(uri);
let collection;

// Connect once at startup
async function connectDb() {
  try {
    await client.connect();
    const db = client.db("gameDB"); // database name
    collection = db.collection("games"); // collection name
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err);
    process.exit(1);
  }
}

// --- Routes ---

// Health check
app.get("/", (req, res) => {
  res.json({ message: "Server is alive" });
});

// Get all games
app.get("/games", async (req, res) => {
  try {
    const games = await collection.find({}).toArray();
    res.json(games);
  } catch (err) {
    console.error("Error fetching games:", err);
    res.status(500).json({ error: "Failed to fetch games" });
  }
});

// Add/update game
app.post("/games", async (req, res) => {
  try {
    const gameObj = req.body;
    if (!gameObj.name) {
      return res.status(400).json({ error: "Game must have a name" });
    }

    await collection.updateOne(
      { name: gameObj.name },          // filter
      { $set: gameObj },               // update fields
      { upsert: true }                 // insert if not exists
    );

    res.json({ success: true });
  } catch (err) {
    console.error("Error saving game:", err);
    res.status(500).json({ error: "Failed to save game" });
  }
});

// --- Start Server ---
const PORT = process.env.PORT || 3000;
connectDb().then(() => {
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
});
