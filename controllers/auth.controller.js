import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { JWT_SECRET, JWT_EXPIRES_IN } from "../config/env.js";

// req body -> it is an object that contains key-value pairs of data submitted in the request body. By default, it is undefined, and is populated when you use body-parsing middleware such as express.json()

export const signUp = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction(); //  atomic operations on the database

  try {
    // create new user
    const { name, email, password } = req.body;

    // check if user already exists
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      const error = new Error("User already exists");
      error.statusCode = 409; // 409 is the status code for conflict
      throw error;
    }
    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create(
      [
        {
          name,
          email,
          password: hashedPassword,
        },
      ],
      { session }
    );
    const token = jwt.sign({ userId: newUser[0]._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });
    await session.commitTransaction();
    session.endSession();
    res.status(201).json({
      success: true,
      message: "User created successfully ",
      data: {
        token,
        user: newUser[0],
      },
    });
  } catch (err) {
    session.abortTransaction();
    session.endSession();
    next(err);
  }
};

export const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      const error = new Error("Invalid password");
      error.statusCode = 401;
      throw error;
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    res.status(200).json({
      success: true,
      message: "User signed in successfully",
      data: {
        token,
        user,
      },
    });
  } catch (err) {}
  // res.send("Sign up route");
};

export const signOut = async (req, res, next) => {
  res.send("Sign up route");
};
