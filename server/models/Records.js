const mongoose = require("mongoose");

const RecordSchema = new mongoose.Schema({
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date },
  totalCost: { type: Number, default: 0 },
  daysCount: { type: Number, default: 0 },
  deductedDays: { type: Array, default: [] }, // Track days where cost was deducted
});

module.exports = mongoose.model("Record", RecordSchema);
