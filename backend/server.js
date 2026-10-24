const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

const analyticsRoutes = require("./routes/analyticsRoutes");
const fileRoutes = require("./routes/fileRoutes");
const bucketRoutes = require("./routes/bucketRoutes");
const statsRoutes = require("./routes/statsRoutes");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/files", fileRoutes);
app.use("/api/buckets", bucketRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/analytics", analyticsRoutes);

app.get("/", (req, res) => {
    res.json({
        message: "S3 Simulator Backend is running"
    });
});

const PORT = process.env.PORT || 5000;

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected");

        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error("MongoDB connection error:", err);
    });