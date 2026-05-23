const express = require("express");
const mongoose = require("mongoose");
const connectDB=require("./config/db");
require("dotenv").config();
const cors = require("cors");
const resumeRoutes = require("./routes/resumeRoutes");

const app = express();

// Connect to MongoDB
connectDB();

app.use(cors());
app.use(express.json());
app.use("/api/resume", resumeRoutes);  
app.get("/", (req, res) => {
  res.send("Resume Analyzer API Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});