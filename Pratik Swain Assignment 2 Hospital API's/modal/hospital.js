const mongoose = require("mongoose");

const hospitalSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },

        city: {
            type: String,
            required: true
        },

        totalBeds: {
            type: Number,
            required: true
        },

        availableBeds: {
            type: Number,
            required: true
        }
    },
);

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true
        },

        email: {
            type: String,
            required: true,
            unique: true
        },

        password: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

const Hospital = mongoose.model("Hospital", hospitalSchema);
const User = mongoose.model("User", userSchema);

module.exports = {
    Hospital,
    User
};