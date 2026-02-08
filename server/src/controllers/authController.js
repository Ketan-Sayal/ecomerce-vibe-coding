import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || "your-secret-key", {
    expiresIn: "7d"
  });
};

// Signup
export const signup = AsyncHandler(async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;

  if (!username || !email || !password || !confirmPassword) {
    throw new ApiError(400, "All fields are required");
  }

  if (password !== confirmPassword) {
    throw new ApiError(400, "Passwords do not match");
  }

  const existingUser = await User.findOne({
    $or: [{ email }, { username }]
  });

  if (existingUser) {
    throw new ApiError(400, "Email or username already exists");
  }

  const user = await User.create({
    username,
    email,
    password
  });

  const token = generateToken(user._id);
  const responseUser = user.toObject();
  delete responseUser.password;

  // Set token in cookie
  res.cookie('authToken', token, {
    httpOnly: false,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production'
  });

  res.status(201).json(
    new ApiResponse(201, { user: responseUser, token }, "User registered successfully")
  );
});

// Signin
export const signin = AsyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid email or password");
  }

  const token = generateToken(user._id);
  const responseUser = user.toObject();
  delete responseUser.password;

  // Set token in cookie
  res.cookie('authToken', token, {
    httpOnly: false,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production'
  });

  res.status(200).json(
    new ApiResponse(200, { user: responseUser, token }, "Login successful")
  );
});

// Get current user (from token)
export const getCurrentUser = AsyncHandler(async (req, res) => {
  const user = await User.findById(req.user.userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  res.status(200).json(new ApiResponse(200, user, "Current user fetched successfully"));
});

// Update user profile
export const updateProfile = AsyncHandler(async (req, res) => {
  const { firstName, lastName, phone, address, city, state, zipCode } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user.userId,
    {
      firstName,
      lastName,
      phone,
      address,
      city,
      state,
      zipCode
    },
    { new: true, runValidators: true }
  );

  res.status(200).json(new ApiResponse(200, user, "Profile updated successfully"));
});

// Logout (frontend will handle token deletion)
export const logout = AsyncHandler(async (req, res) => {
  res.status(200).json(new ApiResponse(200, {}, "Logged out successfully"));
});
