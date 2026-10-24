const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
    bucketId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Bucket",
        required: true
    },

    name: {
        type: String,
        required: true
    },

    originalName: String,

    size: Number,

    type: String,

    path: String,

    version: {
        type: Number,
        default: 1
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("File", fileSchema);