import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;
  console.log("Received signup request:", { fullName, email, password });
  try {
    if (!fullName || !email || !password) {
      return res.status(400).send("all fields are required");
    }
    if (password.length < 6) {
      return res
        .status(400)
        .send("Password must be at least 6 characters long");
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).send("User already exists with this email");
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      generateToken(newUser._id, res);
      await newUser.save();
      res.status(201).send({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePicture: newUser.profilePicture,
      });
    } else {
      console.log("error registering user");
      res.status(400).send("Error registering user");
    }
  } catch (error) {
    console.error("Error in signup:", error);
    res.status(500).send("Error registering user");
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Received login request:", { email, password });
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send({ message: "Invalid Credentials" });
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).send({ message: "Invalid Credentials" });
    }
    if (req.cookies.jwt) {
      return res.status(400).send("User already logged in");
    }
    generateToken(user._id, res);
    res.status(200).send({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePicture: user.profilePicture,
    });
  } catch (error) {
    console.error("Error in login:", error);
    res.status(500).send({ message: "Error logging in" });
  }
};

export const logout = (req, res) => {
  try {
    console.log("Received logout request");
    if (!req.cookies.jwt) {
      return res.status(400).send("No user is logged in");
    }

    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).send("logged out successfully");
  } catch (error) {
    console.error("Error in logout:", error);
    res.status(500).send("Error logging out");
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;

    if (!profilePic) {
      return res.status(400).json({ message: "Profile pic is required" });
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("error in update profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const checkAuth = (req, res) => {
    try{
        res.status(200).send(req.user);
    }catch(error) {
        console.error("Error in checkAuth:", error);
        res.status(500).send("Error checking authentication");
    }
}