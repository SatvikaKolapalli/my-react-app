const User = require('../models/user');
const bcrypt = require('bcryptjs');

exports.signup = async (req, res) => {
    const { username, password, email, phoneNumber, name } = req.body;

    try {
        console.log("Signing up the user");
        // console.log("Fields: ", req.body);

        // Check if the user already exists to avoid duplicates
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(409).json({
                message: "A user with the provided username or email already exists",
                status: false
            });
        }

        // Create a new user with the provided details
        const newUser = new User({
            username,
            password,
            email,
            phoneNumber,
            name
        });

        // Save the user in the database
        await newUser.save();

        console.log("User signed up successfully!");

        // Success response
        res.status(201).json({
            message: "User successfully signed up",
            status: true,
            userId: newUser._id,
            user: newUser
        });
    } catch (error) {
        console.error("Error while user sign up: ", error);

        if (error.name === 'ValidationError') {
            return res.status(400).json({
                message: "Validation Error: " + error.message,
                status: false
            });
        }

        res.status(500).json({
            message: "Failed to signup the user",
            status: false
        });
    }
}

exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        console.log(`Loggin in the user with username ${username}`);
        // Check if the user exists with the given username
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                status: false
            });
        }

        // Check if the password is correct
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid credentials",
                status: false
            });
        }

        console.log("User logged in successfully!");

        // Success response
        res.status(200).json({
            message: "User successfully logged in",
            status: true,
            userId: user._id,
            user: user
        });
    } catch (error) {
        console.error("Error while logging in the user: ", error);

        res.status(500).json({
            message: "Failed to login the user",
            status: false
        });
    }
}

exports.getUserInfo = async (req, res) => {
    const { _id } = req.query;

    try {
        console.log(`Fetching user info with id ${_id}`);
        // Find the user by _id provided in the request body
        const user = await User.findById(_id).select('-password'); // Exclude the password from the result

        if (!user) {
            return res.status(404).json({
                message: "User not found",
                status: false
            });
        }

        console.log(`Fetched user info with id ${_id} successfully`);

        // Success response with the user info
        res.status(200).json({
            message: "User info fetched successfully",
            status: true,
            user: user
        });
    } catch (error) {
        console.error("Error while fetching the user info: ", error);
        console.log(`Failed to fetch user info with id ${_id}`);

        res.status(500).json({
            message: "Failed to fetch the user info",
            status: false
        });
    }
}

exports.update = async (req, res) => {
    const { data } = req.body;

    try {
        // user signup logic here
    } catch (error) {
        console.error("Error while updating user info: ", error);

        res.status(500).json({
            message: "Failed to update the user info",
            status: false
        });
    }
}

exports.delete = async (req, res) => {
    const { data } = req.body;

    try {
        // user signup logic here
    } catch (error) {
        console.error("Error while deleting the user: ", error);

        res.status(500).json({
            message: "Failed to delete the user",
            status: false
        });
    }
}
