const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const recordRoutes = require("./routes/records");

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use("/api/records", recordRoutes);

// MongoDB Connection
const uri = 'mongodb+srv://useretheharsh2211:aO27cssN921WUxXt@cluster0.jgod4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
mongoose
  .connect(uri)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("Database Connection Error:", err.message));

// MongoDB Debugging
mongoose.connection.on("connected", () => {
  console.log("Mongoose connected to DB");
});

mongoose.connection.on("error", (err) => {
  console.error("Mongoose connection error:", err.message);
});

mongoose.connection.on("disconnected", () => {
  console.log("Mongoose disconnected from DB");
});

app.get('/ping', (req, res) => {
  res.send("Welcome to server");
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
