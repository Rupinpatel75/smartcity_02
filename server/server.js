const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const reportRoutes = require("./routes/report.routes");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use("/api/reports", reportRoutes);

mongoose
  .connect("mongodb://localhost:27017/reportDB", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection failed:", err));

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
