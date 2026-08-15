const express = require("express");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

const connectDB = require("./config/db");
const { User } = require("./modal/hospital");
const hospitalRouter = require("./router/hospitalrouter");
const cors = require("cors");

const app = express();

app.use(cors());


app.use(express.json());

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

app.use("/", hospitalRouter);
app.use((req, res) => {
    res.status(404).json({
        message: "Route not found"
    });
});

app.listen(4000, () => {
    console.log("Server running on http://localhost:4000");
});