import bcrypt from "bcrypt";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import { cookieOptions } from "../utils/cookieOptions.js";

// Helper to format user response
const formatUserResponse = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  role: user.role,
});

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required.",
      });
    }

    // Check existing user
    const existingUser = await User.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already exists.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters.",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      phone,
    });

    // Generate JWT
    const token = generateToken(user._id);

    // Cookie
    res.cookie("token", token, cookieOptions);

    // Response
    res.status(201).json({
      success: true,
      message: "User registered successfully.",
      data: formatUserResponse(user),
    });
  } catch (error) {
    console.error("Register Error:", error);

    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

//Login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    // Find user
    const user = await User.findOne({
      email: email.toLowerCase(),
    }).select("+password");

    const authError = "Invalid email or password.";
    if (!user) {
      return res.status(401).json({
        success: false,
        message: authError,
      });
    }

    // Check account status
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Your account has been deactivated.",
      });
    }

    // Compare password
    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
      return res.status(401).json({
        success: false,
        message: authError,
      });
    }

    user.lastLogin = new Date();

    await user.save();

    // Generate JWT
    const token = generateToken(user._id);

    // Cookie
    res.cookie("token", token, cookieOptions);

    // Response
    res.status(200).json({
      success: true,
      message: "User Login successfully.",
      data: formatUserResponse(user),
    });
  } catch (error) {
    console.error("Login Error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

// Logout
export const logoutUser = async (req, res) => {
  try {
    // Clear the cookie by name and provide the same options
    // (important: secure and sameSite must match the original)
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully.",
    });
  } catch (error) {
    console.error("Logout Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};
