const jwt = require('jsonwebtoken');
const User = require('../models/user');


const auth = async (req, res, next) => {
    try {

        let token = req.header('Authorization')
        console.log('dcchdjsdchj', token)
        // const { token } = req.cookies;
        if (!token) {
            return res.status(401).send("Unauthorized");
        }

        // Decode token to get user ID
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const uid = decoded.uid;

        // Find user by ID
        const user = await User.findById(uid);

        if (!user) {
            return res.status(404).send("User not found.");
        }
        if (user) {
            req.user = user;
            next()
        }


    }
    catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).send("Error fetching user");
    }

}
module.exports = auth;