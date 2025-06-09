const express = require("express");
const multer = require("multer");
const Report = require("../models/report.model");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { title, description, category, priority, latitude, longitude, userId } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : "";

    const newReport = new Report({
      title,
      description,
      category,
      priority,
      latitude,
      longitude,
      imageUrl,
      userId,
    });

    await newReport.save();
    res.json({ message: "Report submitted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error submitting report", error });
  }
});

module.exports = router;
