const express = require("express");
const { readDb, writeDb } = require("./dbFunctions");

const app = express();
app.use(express.json());

// Get all games
app.get("/games", async (req, res) => {
  const games = await readDb();
  res.json(games);
});

// Add/update a game
app.post("/games", async (req, res) => {
  await writeDb(req.body);
  res.json({ success: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
