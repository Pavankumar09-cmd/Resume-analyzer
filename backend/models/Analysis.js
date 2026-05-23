const mongoose = require("mongoose");

const analysisSchema = new mongoose.Schema({

  fileName: {
    type: String,
  },

  score: {
    type: Number,
  },

  strengths: [
    String
  ],

  weaknesses: [
    String
  ],

  missingSkills: [
    String
  ],

  suggestions: [
    String
  ],

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model(
  "Analysis",
  analysisSchema
);