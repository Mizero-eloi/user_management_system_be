import { compare, genSalt, hash } from "bcrypt";
import { User } from "../models/user.model.js";
import {
  createSuccessResponse,
  errorResponse,
  serverErrorResponse,
  successResponse,
} from "../utils/api.response.js";
import _ from "lodash";

export const registerAsAdmin = async (req, res) => {
  try {
    let checkEmail = await User.findOne({ email: req.body.email });
    if (checkEmail) return errorResponse("Email is already registered!", res);

    let user = new User(_.pick(req.body, ["name", "email", "password"]));

    const salt = await genSalt(10);
    user.password = await hash(user.password, salt);

    try {
      await user.save();
      return createSuccessResponse(
        "User registered successfully. You can now login",
        {},
        res
      );
    } catch (ex) {
      return errorResponse(ex.message, res);
    }
  } catch (ex) {
    return serverErrorResponse(ex, res);
  }
};

export const updateUser = async (req, res) => {
  try {
    // Find the user by their ID or any other unique identifier
    const user = await User.findById(req.params.userId);

    // Check if the user exists
    if (!user) {
      return errorResponse("User not found", res);
    }

    console.log("email registered", user.email);
    console.log("email registered", req.body.email);

    // Check if the new email is already registered by another user
    if (req.body.email !== user.email) {
      const checkEmail = await User.findOne({ email: req.body.email });
      if (checkEmail) {
        return errorResponse("Email is already registered!", res);
      }
    }

    // Update the user's email and name
    user.email = req.body.email;
    user.name = req.body.name;

    // Save the updated user object
    try {
      await user.save();
      return createSuccessResponse(
        "User information updated successfully",
        {},
        res
      );
    } catch (ex) {
      return errorResponse(ex.message, res);
    }
  } catch (ex) {
    return serverErrorResponse(ex, res);
  }
};

export const deleteUser = async (req, res) => {
  try {
    // Find the user by their ID or any other unique identifier
    const user = await User.findOneAndDelete({ _id: req.params.userId });

    // Check if the user exists
    if (!user) {
      return errorResponse("User not found", res);
    }

    return createSuccessResponse("User deleted successfully", {}, res);
  } catch (ex) {
    return serverErrorResponse(ex, res);
  }
};

export const login = async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.email }).select(
      "_id role password"
    );
    if (!user) return errorResponse("Invalid email or password!", res);

    const validPassword = await compare(req.body.password, user.password);
    if (!validPassword) return errorResponse("Invalid email or password!", res);

    const token = user.generateAuthToken();

    return successResponse("Login successful!", { access_token: token }, res);
  } catch (ex) {
    console.log(ex);
    return serverErrorResponse(ex, res);
  }
};

export const getProfile = async (req, res) => {
  try {
    let user = await User.findById(req.user._id);
    if (!user) return errorResponse("User not found!", res);

    return successResponse("Profile", user, res);
  } catch (ex) {
    return serverErrorResponse(ex, res);
  }
};

export const getAllUsers = async (req, res) => {
  try {
    let users = await User.find();
    if (!users) return errorResponse("Empty list", res);

    return successResponse("Profile", users, res);
  } catch (ex) {
    return serverErrorResponse(ex, res);
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    let user = await User.findOne({
      _id: req.user._id,
    });
    if (!user) return errorResponse("User not found", res);

    return successResponse("User", user, res);
  } catch (ex) {
    return serverErrorResponse(ex, res);
  }
};
