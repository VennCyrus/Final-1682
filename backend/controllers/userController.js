import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { OAuth2Client } from "google-auth-library";

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// Google OAuth Client
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

//Register User
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    //Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }
    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters" });
    }

    //  Hashing password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};
//login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(500).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(500).json({ message: "Invalid email or password" });
    }
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

// Google Login
export const googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;
    
    if (!credential) {
      return res.status(400).json({ message: "Google credential is required" });
    }

    // Verify the Google token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture, sub: googleId } = payload;

    // Check if user exists
    let user = await User.findOne({ email });

    // Admin email list (can be moved to env or database)
    const adminEmails = ["dnd28062002@gmail.com"];
    const isAdmin = adminEmails.includes(email);

    if (user) {
      // User exists - update Google ID if not set
      if (!user.googleId) {
        user.googleId = googleId;
        if (picture) user.picture = picture;
      }
      // Set admin role if email matches
      if (isAdmin) {
        user.role = 'admin';
      }
      await user.save();
    } else {
      // Create new user
      user = await User.create({
        name,
        email,
        googleId,
        picture,
        password: "", // No password for Google users
        role: isAdmin ? 'admin' : 'user',
      });
    }

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      picture: user.picture,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error("Google login error:", error);
    res.status(500).json({
      message: "Google authentication failed",
      error: error.message,
    });
  }
};

// Get user profile function
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};
