const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const File = require("../models/File");
const Bucket = require("../models/Bucket");

const router = express.Router();


// ==========================================
// MULTER STORAGE
// ==========================================

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../uploads"));
    },

    filename: (req, file, cb) => {
        const uniqueName =
            Date.now() + "-" + file.originalname;

        cb(null, uniqueName);
    }
});

const upload = multer({ storage });


// ==========================================
// GET FILES OF A BUCKET
// ==========================================

router.get("/bucket/:bucketId", async (req, res) => {
    try {

        const files = await File.find({
            bucketId: req.params.bucketId
        }).sort({ createdAt: -1 });

        res.json(files);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
});


// ==========================================
// UPLOAD FILE
// ==========================================

router.post(
    "/upload/:bucketId",
    upload.single("file"),
    async (req, res) => {

        try {

            if (!req.file) {
                return res.status(400).json({
                    message: "No file uploaded"
                });
            }

            const bucket = await Bucket.findById(
                req.params.bucketId
            );

            if (!bucket) {
                return res.status(404).json({
                    message: "Bucket not found"
                });
            }

            const existingFile = await File.findOne({
                bucketId: req.params.bucketId,
                originalName: req.file.originalname
            }).sort({ version: -1 });

            const version = existingFile
                ? existingFile.version + 1
                : 1;

            const newFile = await File.create({

                bucketId: req.params.bucketId,

                name: req.file.filename,

                originalName: req.file.originalname,

                size: req.file.size,

                type: req.file.mimetype,

                path: req.file.path,

                version: version

            });

            res.status(201).json(newFile);

        } catch (error) {

            res.status(500).json({
                message: error.message
            });

        }
    }
);


// ==========================================
// DELETE FILE
// ==========================================

router.delete("/:id", async (req, res) => {

    try {

        const file = await File.findById(
            req.params.id
        );

        if (!file) {

            return res.status(404).json({
                message: "File not found"
            });

        }

        if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
        }

        await File.findByIdAndDelete(
            req.params.id
        );

        res.json({
            message: "File deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

});
// ==========================================
// DOWNLOAD FILE
// ==========================================

router.get("/download/:id", async (req, res) => {

    try {

        const file = await File.findById(req.params.id);

        if (!file) {

            return res.status(404).json({
                message: "File not found"
            });

        }

        if (!fs.existsSync(file.path)) {

            return res.status(404).json({
                message: "Physical file not found"
            });

        }

        res.download(
            file.path,
            file.originalName
        );

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

});
// ==========================================
// RESTORE VERSION
// ==========================================

router.post("/restore/:id", async (req, res) => {

    try {

        const oldFile = await File.findById(
            req.params.id
        );

        if (!oldFile) {

            return res.status(404).json({
                message: "Version not found"
            });

        }


        // Find latest version of this file
        const latestFile = await File.findOne({
            bucketId: oldFile.bucketId,
            originalName: oldFile.originalName
        }).sort({ version: -1 });


        const newVersion = latestFile
            ? latestFile.version + 1
            : 1;


        // Create a new database record
        // pointing to the same physical file

        const restoredFile = await File.create({

            bucketId: oldFile.bucketId,

            name: oldFile.name,

            originalName: oldFile.originalName,

            size: oldFile.size,

            type: oldFile.type,

            path: oldFile.path,

            version: newVersion

        });


        res.status(201).json({

            message: `Version ${oldFile.version} restored as version ${newVersion}`,

            file: restoredFile

        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

});
module.exports = router;