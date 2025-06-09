import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
  title: String,
  description: String,
  category: String,
  priority: String,
  latitude: String,
  longitude: String,
  imageUrl: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
});

const Report = mongoose.model("Report", reportSchema);

export default Report;
