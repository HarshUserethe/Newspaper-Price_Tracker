const express = require("express");
const Record = require("../models/Records");
const cron = require("node-cron");
const router = express.Router();

// Get all records
router.get("/", async (req, res) => {
  const records = await Record.find();
  res.json(records);
});

// Create new record
router.post("/", async (req, res) => {
  const record = new Record(req.body);
  await record.save();
  res.status(201).json(record);
});

// Update record
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const updated = await Record.findByIdAndUpdate(id, req.body, { new: true });
  res.json(updated);
});



router.get('/update-costs', async (req, res) => {
  try {
    console.log("Running daily cost update job via EasyCron");

    const weekdays = [7, 6, 6, 6, 6, 7, 7]; // Sunday to Saturday prices
    const todayCost = weekdays[new Date().getDay()];

    const activeRecords = await Record.find({ endDate: null });
    for (const record of activeRecords) {
      record.totalCost += todayCost;
      record.daysCount += 1;
      await record.save();
    }

    console.log("Daily cost update completed.");
    res.send({ success: true, message: "Daily cost update completed." });
  } catch (error) {
    console.error("Error updating daily costs:", error);
    res.status(500).send({ success: false, message: "Error updating daily costs." });
  }
});


module.exports = router;
