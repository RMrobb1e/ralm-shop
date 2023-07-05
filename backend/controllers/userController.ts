import { Request, Response } from 'express';
import asyncHandler from '../middleware/asyncHandler';
import User from '../models/userModel';
import jwt from 'jsonwebtoken';
import generateToken from '../utils/generateToken';

// @desc Auth user & get token
// @route POST /api/users/login
// @access Public
const authUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).exec();

  if (user && (await user.matchPassword(password))) {
    const userId = user._id.toString();
    generateToken(res, userId);

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc Register user
// @route POST /api/users
// @access Public
const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email }).exec();

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    generateToken(res, user._id.toString());
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc Logout user / clear cookie
// @route POST /api/users/logout
// @access Private
const logoutUser = asyncHandler(async (req: Request, res: Response) => {
  res.cookie('jwt', '', { httpOnly: true, expires: new Date(0), maxAge: 0 });
  res.status(200).json({ message: 'Logged out successfully' });
});

// @desc Get user profile
// @route GET /api/users/profile
// @access Private
const getUserProfile = asyncHandler(
  async (req: Request & { user: any }, res: Response) => {
    const user = await User.findById(req.user?._id).exec();

    if (user) {
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  }
);

// @desc Update user profile
// @route PUT /api/users/profile
// @access Private
const updateUserProfile = asyncHandler(
  async (req: Request & { user: any }, res: Response) => {
    const user = await User.findById(req.user?._id).exec();

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user?.save();

      res.status(200).json({
        _id: updatedUser?._id,
        name: updatedUser?.name,
        email: updatedUser?.email,
        isAdmin: updatedUser?.isAdmin,
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  }
);

// @desc Get users
// @route GET /api/users
// @access Private/Admin
const getUsers = asyncHandler(async (req: Request, res: Response) => {
  res.send('get users');
});

// @desc Get user by id
// @route GET /api/users/:id
// @access Private/Admin
const getUserById = asyncHandler(async (req: Request, res: Response) => {
  res.send('get user by id');
});

// @desc Delete users
// @route DELETE /api/users/:id
// @access Private/Admin
const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  res.send('delete users');
});

// @desc Update users
// @route PUT /api/users/:id
// @access Private/Admin
const updateUser = asyncHandler(async (req: Request, res: Response) => {
  res.send('update users');
});

export {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  getUserById,
  deleteUser,
  updateUser,
};