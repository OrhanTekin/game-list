const express = require("express");
const cors = require('cors');
const { readDb, writeDb } = require("./dbFunctions");

const app = express()
app.use(express.json())

app.use(cors({
  origin: "https://orhantekin.github.io"  // allow your frontend
}));


// Example routes
app.get('/', (req, res) => {
  res.json({ message: 'Server is alive' })
})

// Get all games
app.get("/games", async (req, res) => {
  const games = await readDb();
  res.json(games);
});


// Save all games (replace collection with new array)
app.post("/games", async (req, res) => {
  const { games } = req.body;
  if (!Array.isArray(games)) {
    return res.status(400).json({ error: "games must be an array" });
  }
  await writeDb(games);
  res.json({ success: true });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
