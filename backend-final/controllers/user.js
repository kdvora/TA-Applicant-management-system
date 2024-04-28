
const User = require('../models/user');
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const ObjectId = require('mongodb').ObjectId;
exports.postSignup = async (req, res) => {
    const { username, password, role } = req.body;
    console.log(req.body)
    // Check if the user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
        return res.status(400).send("User already exists.");
    }

    // Create a new user
    const newUser = new User({ username, password, role });
    await newUser.save();
    console.log("-----------done--------")

    // Generate token
    const token = jwt.sign({ uid: newUser._id }, process.env.JWT_SECRET, {
        expiresIn: "24h",
    });
    console.log("token", token)
    // Update user with token
    newUser.token = token;
    await newUser.save();

    console.log("User created successfully.");

    // Set cookie and send response
    // res.cookie('cookieName', 'cookieValue', { httpOnly: false });
    // res.cookie("token", token, { httpOnly: true });
    res.status(201).send({ username, role, message: "User created successfully.", token: token });
};
exports.postLogin = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Find user by username
        const user = await User.findOne({ username });

        // Check if user exists
        if (!user) {
            return res.status(400).send("User not found.");
        }

        // Compare passwords
        if (user.password !== password) {
            return res.status(400).send("Invalid password.");
        }

        // Generate token
        const token = jwt.sign({ uid: user._id }, process.env.JWT_SECRET, {
            expiresIn: "24h",
        });
        console.log("token", token)
        const objectId = new ObjectId(user._id);
        console.log(objectId)
        const id = objectId.toString()
        console.log(id)
        // Update user's token
        console.log(user._id)

        user.token = token;
        await user.save();
        console.log(user)

        // Set cookie and send response
        // res.cookie("token", token, { httpOnly: true });
        // res.cookie("token", token, {
        //     path: "/",
        //     httpOnly: true,
        //     expires: new Date(Date.now() + 900000),
        //     sameSite: "none",
        //     secure: true,
        // });
        res.status(200).send({ username: user.username, role: user.role, message: "Login successful.", token: token });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).send("Internal server error");
    }
};
exports.postLogout = async (req, res) => {
    try {
        console.log('------------logout-----------------------')
        console.log(req.body)
        // const { token } = req.cookies;
        const { token } = req.body;
        console.log("token", token)
        // Decode token to get user ID
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const uid = decoded.uid;

        // Find user by ID and update token to empty string
        const user = await User.findByIdAndUpdate(uid, { token: '' });

        if (!user) {
            return res.status(404).send("User not found.");
        }

        // Clear cookie and send response
        // res.clearCookie("token");
        res.status(200).send("Logout successful.");
    } catch (error) {
        console.error("Logout error:", error);
        res.status(500).send("Internal server error");
    }
}
exports.getUser = async (req, res) => {
    try {


        // Send user data
        res.status(200).send({
            username: req.user.username,
            role: req.user.role
        });
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).send("Error fetching user");
    }
}
