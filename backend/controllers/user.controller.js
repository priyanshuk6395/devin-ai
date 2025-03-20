import { getAllUser, createUser } from "../services/user.service.js";
import userModel from "../models/user.model.js";
import { validationResult } from "express-validator";
import redisClient from "../services/redis.service.js";

export const createUserController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(401).send("Email and Password both required");
    }
    const hashedPassword = await userModel.hashPassword(password);
    // Create user
    const user = await createUser({
      email,
      password: hashedPassword,
    });

    // Generate token (Ensure that userService handles token generation)
    const token = await user.generateToken(user);
    delete user._doc.password;
    res.status(201).send({ token, user });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

export const loginController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(401).send("Email and Password both required");
    }
    const user = await userModel.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).send("User not found");
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).send("Invalid password");
    }
    const token = await user.generateToken(user);
    delete user._doc.password;
    res.status(200).send({ token, user });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

export const profileController = async (req, res) => {
  res.status(200).send(req.user);
};

export const logoutController = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1] || req.cookies.token;
    const expiresInString = process.env.JWT_EXPIRES_IN;
    const expiresInSeconds = expiresInString.includes("h")
      ? parseInt(expiresInString) * 60 * 60
      : parseInt(expiresInString);

    await redisClient.set(token, "logout", "EX", expiresInSeconds);

    res.status(200).send("Logged out successfully");
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
};

export const getAllUserController = async (req, res) => {
  try {
    const loggedInUser = req.user;
    const allUsers = await getAllUser({ userId: loggedInUser._id });
    res.status(200).json({ users: allUsers });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
};
