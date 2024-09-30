import { User } from "../models/userModel.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/generateToken.js";

//create account
export const userCreate = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: true, message: "All fields required" });
    }

    //check user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    // password hashing
    const saltRounds = 10;
    const hashedPassword = bcrypt.hashSync(password, saltRounds);

    // create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });
    // save user
    await newUser.save();
    //authentication using jwt token
    const token = generateToken(email);

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    res.status(200).json({
      success: true,
      message: "User created successfully",
      data: newUser,
    });
  } catch (error) {
    res.status(error.status || 500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

// login user
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields required" });
    }

    // find user
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User does not exists" });
    }
    // password check
    const passwordMatch = bcrypt.compareSync(password, user.password);
    if (!passwordMatch) {
      return res.status(400).json({
        success: false,
        message: "Unauthorized user or invalid password",
      });
    }

    const token = generateToken(email);

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    res
      .status(200)
      .json({ success: true, message: "User login successfull", data: user });
  } catch (error) {
    res.status(error.status || 500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

// logout user
export const logoutUser = async (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ success: true, message: "User logout successfull" });
  } catch (error) {
    res.status(error.status || 500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

// check user
export const checkUser = async (req, res, next) => {
  try {
    // get user data from auth middleware
    const user = req.user;
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "unauthoraized user" });
    }
    res.status(200).json({ success: true, message: "authoraized user" });
  } catch (error) {
    res
      .status(error.status || 500)
      .json({ message: error.message || "Internal server error" });
  }
};

// get all users
export const getallUsers = async (req, res) => {
  try {
    // find user
    const users = await User.find({});
    if (!users.length) {
      return res
        .status(400)
        .json({ success: false, message: "Users does not exists" });
    }

    res
      .status(200)
      .json({
        success: true,
        message: "Users data fetched successfull",
        data: users,
      });
  } catch (error) {
    res.status(error.status || 500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};
