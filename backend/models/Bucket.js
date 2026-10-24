const mongoose = require("mongoose");

const bucketSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },

    region: {
        type: String,
        default: "ap-south-1"
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Bucket", bucketSchema);