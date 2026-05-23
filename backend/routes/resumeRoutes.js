const express = require("express");
const multer = require("multer");
const fs = require("fs");
const pdfParse = require("pdf-parse");
const analyzeResume = require("../services/nvidiaService");
const Analysis=require("../models/Analysis");
const router = express.Router();

const upload = multer({
  dest: "uploads/",
});

router.post("/upload", upload.single("resume"), async (req, res) => {
  try {
    
    // Read uploaded PDF
    const dataBuffer = fs.readFileSync(req.file.path);

    // Extract text from PDF
    const pdfData = await pdfParse(dataBuffer);

    // Send extracted text to Gemini
    const analysis = await analyzeResume(pdfData.text);
    console.log("AI ANALYSIS:", analysis);
    await Analysis.create({
      fileName: req.file.originalname,
      score: analysis.score,
      strengths: analysis.strengths,
      weaknesses: analysis.weaknesses,
      missingSkills: analysis.missingSkills,
      suggestions: analysis.suggestions,
    });
    console.log("Analysis saved to DB");
    // Final response
    res.json({
      success: true,
      analysis,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});
router.get("/history", async (req, res) => {

  try {

    const analyses = await Analysis.find()
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      analyses,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;