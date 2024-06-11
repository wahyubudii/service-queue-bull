import bcrypt from "bcrypt";
import User from "../models/User.js";
import Document from "../models/Document.js";
import {
  validateRequestBody,
  validateMongodbId,
} from "../middleware/errorHandler.js";
import { generateToken } from "../config/jwtToken.js";

export const getAllUser = async (req, res, next) => {
  try {
    const data = await User.find();

    const responseData = {
      status: 1,
      message: "",
      objResponse: data,
    };

    res.json(responseData);
  } catch (err) {
    next(err);
  }
};

export const getUserById = async (req, res, next) => {
  const { id } = req.params;
  validateMongodbId(id);

  try {
    const user = await User.findById(id).populate();
    if (!user)
      throw {
        message: "User not found",
      };

    const responseData = {
      status: 1,
      message: "",
      objResponse: user,
    };

    res.json(responseData);
  } catch (err) {
    next(err);
  }
};

export const getProfile = async (req, res, next) => {
  const { id } = req.user;

  try {
    const user = await User.findById(id);
    if (!user)
      throw {
        message: "User not found",
      };

    const document = await Document.find({
      createdBy: id,
    });

    const responseData = {
      status: 1,
      message: "",
      objResponse: {
        ...user._doc,
        document,
      },
    };

    res.json(responseData);
  } catch (err) {
    next(err);
  }
};

export const createUser = async (req, res, next) => {
  const { username, password, email, noHp } = req.body;
  const requiredFields = [
    "username",
    "password",
    "email",
    "firstname",
    "lastname",
    "noHp",
    "address",
  ];

  try {
    validateRequestBody(req.body, requiredFields);

    const existingUser = await User.findOne({
      $or: [{ email }, { username }, { noHp }],
    });

    if (existingUser)
      throw {
        message: "User exists, login instead",
      };

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      ...req.body,
      password: hashedPassword,
    });

    const responseData = {
      status: 1,
      message: "successfully created data!",
      objResponse: newUser,
    };

    res.json(responseData);
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  const { username, password } = req.body;
  const requiredFields = ["username", "password"];

  try {
    validateRequestBody(req.body, requiredFields);

    const user = await User.findOne({ username });
    if (!user)
      throw {
        message: "User not found",
      };

    const isValidPassword = bcrypt.compareSync(password, user.password);
    if (!isValidPassword)
      throw {
        message: "Invalid credentials",
      };

    const responseData = {
      status: 1,
      message: "successfully created data!",
      objResponse: {
        ...user._doc,
        token: generateToken(user._id),
      },
    };

    res.json(responseData);
  } catch (err) {
    next(err);
  }
};
