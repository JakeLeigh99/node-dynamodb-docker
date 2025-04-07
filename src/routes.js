const express = require("express");
const { scanTable, addItem } = require("./db");

const router = express.Router();

router.get('/items', async (req, res) => {
  try {
    const data = await scanTable();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch items' });
  }
});

router.post('/item', async (req, res) => {
  const { id, name } = req.body;

  if (!id || !name) {
    return res.status(400).json({ error: "Both id and name are required" });
  }

  try {
    await addItem(id, name);
    res.status(201).json({ message: 'Item added successfully', item: { id, name } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;