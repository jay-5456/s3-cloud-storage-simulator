const express = require("express");
const Bucket = require("../models/Bucket");

const router = express.Router();

// Get all buckets
router.get("/", async (req, res) => {
    try {
        const buckets = await Bucket.find().sort({ createdAt: -1 });
        res.json(buckets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create bucket
router.post("/", async (req, res) => {
    try {
        const { name, region } = req.body;

        const bucket = await Bucket.create({
            name,
            region
        });

        res.status(201).json(bucket);
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});

// Delete bucket
router.delete("/:id", async (req, res) => {
    try {
        await Bucket.findByIdAndDelete(req.params.id);

        res.json({
            message: "Bucket deleted"
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

module.exports = router;