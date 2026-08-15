const express = require("express");
const bcrypt = require("bcrypt");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { Hospital, User } = require("../modal/hospital");

const router = express.Router();

router.use(passport.initialize());

passport.use(new LocalStrategy(
    {
        usernameField: "username",
        passwordField: "password"
    },
    async (username, password, done) => {
        try {
            const user = await User.findOne({ username });

            if (!user)
                return done(null, false, {
                    message: "User not found"
                });

            if (!await bcrypt.compare(password, user.password))
                return done(null, false, {
                    message: "Incorrect password"
                });

            return done(null, user);

        } catch (error) {
            return done(error);
        }
    }
));
router.get("/", (request, response) => {
    response.json({ message: "Welcome to Hospital Management API" });
});

router.post("/register", async (request, response) => {
    try {
        const { username, email, password } = request.body;

        if (!username || !email || !password)
            return response.status(400).json({ message: "All fields are required" });

        if (await User.findOne({ $or: [{ username }, { email }] }))
            return response.status(400).json({ message: "Username or email already exists" });

        await User.create({
            username,
            email,
            password: await bcrypt.hash(password, 10)
        });

        response.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
});

router.post("/login", (request, response, next) => {
    passport.authenticate("local", (error, user, info) => {
        if (error)
            return response.status(500).json({ message: error.message });

        if (!user)
            return response.status(401).json({ message: info.message });

        response.json({
            message: "Login successful",
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    })(request, response, next);
});

router.get("/hospitals", async (request, response) => {
    try {
        response.json(await Hospital.find());
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
});

router.get("/hospitals/available", async (request, response) => {
    try {
        response.json(await Hospital.find({ availableBeds: { $gt: 0 } }));
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
});

router.get("/hospitals/:id", async (request, response) => {
    try {
        const hospital = await Hospital.findById(request.params.id);

        if (!hospital)
            return response.status(404).json({ message: "Hospital not found" });

        response.json(hospital);
    } catch (error) {
        response.status(400).json({ message: "Invalid hospital ID" });
    }
});

router.post("/hospitals", async (request, response) => {
    try {
        const { name, city, totalBeds, availableBeds } = request.body;

        if (!name || !city || totalBeds === undefined || availableBeds === undefined)
            return response.status(400).json({ message: "All fields are required" });

        if (totalBeds < 0 || availableBeds < 0 || availableBeds > totalBeds)
            return response.status(400).json({ message: "Invalid bed numbers" });

        const hospital = await Hospital.create({
            name, city, totalBeds, availableBeds
        });

        response.status(201).json({
            message: "Hospital added successfully",
            hospital
        });
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
});

router.put("/hospitals/:id", async (request, response) => {
    try {
        const hospital = await Hospital.findById(request.params.id);

        if (!hospital)
            return response.status(404).json({ message: "Hospital not found" });

        const { name, city, totalBeds, availableBeds } = request.body;

        if (name !== undefined) hospital.name = name;
        if (city !== undefined) hospital.city = city;
        if (totalBeds !== undefined) hospital.totalBeds = totalBeds;
        if (availableBeds !== undefined) hospital.availableBeds = availableBeds;

        if (
            hospital.totalBeds < 0 ||
            hospital.availableBeds < 0 ||
            hospital.availableBeds > hospital.totalBeds
        )
            return response.status(400).json({ message: "Invalid bed numbers" });

        await hospital.save();

        response.json({
            message: "Hospital updated successfully",
            hospital
        });
    } catch (error) {
        response.status(400).json({ message: "Invalid hospital ID" });
    }
});

router.delete("/hospitals/:id", async (request, response) => {
    try {
        const hospital = await Hospital.findByIdAndDelete(request.params.id);

        if (!hospital)
            return response.status(404).json({ message: "Hospital not found" });

        response.json({ message: "Hospital deleted successfully" });
    } catch (error) {
        response.status(400).json({ message: "Invalid hospital ID" });
    }
});

module.exports = router;