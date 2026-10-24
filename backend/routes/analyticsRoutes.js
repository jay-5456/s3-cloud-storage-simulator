const express = require("express");
const File = require("../models/File");

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const files = await File.find();

        // -----------------------------
        // File type statistics
        // -----------------------------

        const typeStats = {};

        files.forEach((file) => {
            const type = file.type || "Unknown";

            if (!typeStats[type]) {
                typeStats[type] = {
                    objects: 0,
                    storage: 0
                };
            }

            typeStats[type].objects += 1;
            typeStats[type].storage += file.size || 0;
        });

        const fileTypes = Object.entries(typeStats).map(
            ([type, data]) => ({
                type,
                objects: data.objects,
                storage: data.storage
            })
        );

        // -----------------------------
        // Version statistics
        // -----------------------------

        const versionStats = {};

        files.forEach((file) => {
            const name = file.originalName;

            if (!versionStats[name]) {
                versionStats[name] = 0;
            }

            versionStats[name] += 1;
        });

        const versions = Object.entries(versionStats).map(
            ([name, count]) => ({
                name,
                versions: count
            })
        );

        res.json({
            fileTypes,
            versions
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: error.message
        });
    }
});

module.exports = router;