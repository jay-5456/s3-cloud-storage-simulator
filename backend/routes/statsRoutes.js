const express = require("express");
const Bucket = require("../models/Bucket");
const File = require("../models/File");

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const buckets = await Bucket.find().sort({ createdAt: -1 });
        const files = await File.find();

        // Unique object names
        const uniqueObjects = new Set(
            files.map((file) => `${file.bucketId}-${file.originalName}`)
        );

        // Total storage used
        const totalStorage = files.reduce(
            (sum, file) => sum + (file.size || 0),
            0
        );

        res.json({
            totalBuckets: buckets.length,
            totalObjects: uniqueObjects.size,
            totalStorage: totalStorage,
            totalVersions: files.length,
            recentBuckets: buckets.slice(0, 5)
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: error.message
        });
    }
});

module.exports = router;