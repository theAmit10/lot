import { asyncError } from "../middlewares/error.js";
import { LotAppAbout } from "../models/lotappabout.js";
import { Promotion } from "../models/promotion.js";
// import { Promotion } from "../models/promotion.js";
import { User } from "../models/user.js";
import {  WalletOne } from "../models/walletone.js";
import ErrorHandler from "../utils/error.js";
import { getDataUri, sendToken } from "../utils/features.js";
import mongoose from "mongoose";
import fs from 'fs';
import pathModule from 'path';
import { WalletTwo } from "../models/wallettwo.js";

export const login = asyncError(async (req, res, next) => {
  const { email, password } = req.body;

  if (!password) return next(new ErrorHandler("Please enter password", 400));

  const user = await User.findOne({ email }).select("+password");
  // console.log(password)
  // console.log(user)

  const isMatched = await user.comparePassword(password);

  if (!isMatched) {
    return next(new ErrorHandler("Incorrect Email or Password", 400));
  }

  sendToken(user, res, `Welcome Back, ${user.name}`, 200);

  // const token = user.generateToken()

  // // Below showing the response without cookie
  // res.status(200).json({
  //     success: true,
  //     message: `Welcome back ${user.name}`,
  //     token
  // })

  // Below showing the response with cookie
  // res.status(200)
  // .cookie("token",token{
  //     expires: new Date(Date.now() + 15 * 24 * 60 * 60 *1000),
  // })
  // .json({
  //     success: true,
  //     message: `Welcome back ${user.name}`,
  //     token
  // })
});

export const register = asyncError(async (req, res, next) => {
  const { name, email, password } = req.body;

  // Count existing users whose role is not admin
  let userCount = await User.countDocuments({ role: { $ne: "admin" } });

  // Generate userId starting from 1000
  const userId = 1000 + userCount;

  let user = await User.findOne({ email });

  if (user) return next(new ErrorHandler("User Already exist", 400));

  // add cloudinary here

  user = await User.create({
    name,
    email,
    password,
    userId, // Add userId to the user object
  });

  sendToken(user, res, `Registered Successfully`, 201);

  // let user = await User.findOne({ email });

  // if (user) return next(new ErrorHandler("User Already exist", 400));

  // // add cloudinary here

  // user = await User.create({
  //   name,
  //   email,
  //   password,
  // });

  // sendToken(user, res, `Registered Successfully`, 201);

  //   res.status(201).json({
  //     success: true,
  //     message: "Registered Successfully",
  //   });
});

export const getMyProfile = asyncError(async (req, res, next) => {
  const user = await User.findById(req.user._id)
    .populate("walletOne")
    .populate("walletTwo");

  res.status(200).json({
    success: true,
    user,
  });
});

export const getUserDetails = asyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id)
    .populate("walletOne")
    .populate("walletTwo");

  if (!user) return next(new ErrorHandler("User not found", 404));

  res.status(200).json({
    success: true,
    user,
  });
});

export const updateWallet = asyncError(async (req, res, next) => {
  try {
    const { walletId } = req.params;
    const { balance, walletName, visibility } = req.body;

    // Validate input
    if (!balance || isNaN(balance)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid balance value" });
    }

    // Update wallet
    const updatedWallet = await Wallet.findByIdAndUpdate(
      walletId,
      { balance, walletName, visibility },
      { new: true }
    );

    if (!updatedWallet) {
      return res
        .status(404)
        .json({ success: false, message: "Wallet not found" });
    }

    // Optionally, you may want to update the user document as well
    // For example, if you want to update the user's wallet details in the user document
    // You can find the user associated with the wallet and update its details accordingly
    // const user = await User.findOneAndUpdate({ $or: [{ walletOne: walletId }, { walletTwo: walletId }] }, { $set: { 'walletOne': updatedWallet } }, { new: true });

    res.status(200).json({ success: true, updatedWallet });
  } catch (error) {
    console.error("Error updating wallet:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

export const logout = asyncError(async (req, res, next) => {
  res.status(200).json({
    success: true,
    message: "Logout successfully",
  });
});

export const updateProfile = asyncError(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  const { name, email } = req.body;

  if (name) user.name = name;
  if (email) user.email = email;

  await user.save();

  res.status(200).json({
    success: true,
    message: "Profile Updated Successfully",
  });
});

export const changePassword = asyncError(async (req, res, next) => {
  const user = await User.findById(req.user._id).select("+password");

  const { oldPassword, newPassword } = req.body;

  // Checking the user have enter old and new password
  if (!oldPassword && !newPassword)
    return next(new ErrorHandler("Please enter old and new password", 400));

  const isMatched = await user.comparePassword(oldPassword);

  if (!isMatched) {
    return next(new ErrorHandler("Incorrect Old Password", 400));
  }

  user.password = newPassword;

  await user.save();

  res.status(200).json({
    success: true,
    message: "Password Changed Successfully",
  });
});

// Upload Profile pic work is not completed i have to research something because i dont want to use cloundinay
export const updatePic = asyncError(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  // req.file
  const file = getDataUri();

  // add cloundinary

  res.status(200).json({
    success: true,
    user,
  });
});

export const forgetPassword = asyncError(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) return next(new ErrorHandler("Incorrect email", 404));

  // Generating 6 digit otp
  // max,min 2000,10000
  // math.random()*(max-min)+min

  const randomSixDitgitNumber = Math.random() * (999999 - 100000) + 100000;
  const otp = Math.floor(randomSixDitgitNumber);
  const otp_expire = 15 * 60 * 1000;

  // Adding to the user otp
  user.otp = otp;
  user.otp_expire = new Date(Date.now() + otp_expire);

  console.log("OTP CODE :: " + otp);

  await user.save();

  // After Saving the otp we have to send a email
  // sendEmail()

  res.status(200).json({
    success: true,
    message: `Verification code has been sent to ${user.email}`,
  });
});

export const resetPassword = asyncError(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  res.status(200).json({
    success: true,
    user,
  });
});

// For uploading profile pic
export const updateProfilePic = asyncError(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  // const { name, email } = req.body;

  // Using this We can access the file
  // req.file

 
  if (user.avatar) {
    // Construct the path to the previous image
    // const previousImagePath = pathModule.join(__dirname, '..', 'public', 'uploads', user.avatar.url);
    // console.log("previous image path :: "+previousImagePath)
    // Delete the previous image from the server
    fs.unlinkSync(`./public/uploads/${user.avatar.url}`);
  }

  console.log(req.file);

  const { filename, path, mimetype } = req.file;

  const file = getDataUri(req.file);


  user.avatar = {
    public_id: req.user._id,
    url: filename,
  };

  await user.save();

  res.status(200).json({
    success: true,
    message: "Profile Pic Updated Successfully",
  });
});

// For uploading profile pic
export const getProfilePic = asyncError(async (req, res, next) => {
  // await User.findById(req.user._id);
  const users = await User.find();

  res.status(200).json({
    success: true,
    message: users,
  });
});

// For Promtions

// export const addPromotion = asyncError(async (req, res, next) => {
//   console.log(req.file);

//   const { filename, path, mimetype } = req.file;

//   const uniqueFilename = `${Date.now()}${filename}`;

//   // // Assuming you want to save public_id and url of the image in the database
//   // const promotionData = {
//   //   url: uniqueFilename,
//   //   // visibility: req.body.visibility, // Assuming you're passing visibility in the request body
//   // };

//   // // Create a new promotion record in the database
//   // await Promotion.create(promotionData);

//   const promotion = new Promotion({
//     promotionimage: {
//       public_id: Date.now(),
//       url: uniqueFilename,
//     },
//     visibility: req.body.visibility || true,
//   });

//   try {
//     const newPromotion = await promotion.save();
//     // res.status(201).json(newPromotion);
//     res.status(201).json({
//       success: true,
//       message: "Promotions Added Successfully",
//       newPromotion
//     });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }

// });

export const addPromotion = asyncError(async (req, res, next) => {
  console.log(req.file);

  const { filename, path, mimetype } = req.file;

  // const uniqueFilename = `${Date.now()}${filename}`;

  // Assuming you want to save public_id and url of the image in the database
  const promotionData = {
    url: filename,
    // visibility: req.body.visibility, // Assuming you're passing visibility in the request body
  };

  // Create a new promotion record in the database
  await Promotion.create(promotionData);

  res.status(200).json({
    success: true,
    message: "Promotions Added Successfully",
  });
});

// export const addPromotion = asyncError(async (req, res, next) => {
//   console.log(req.file);

//   const { filename, path, mimetype } = req.file;

//   const uniqueFilename = `${Date.now()}${filename}`; // Append timestamp to the filename

//   const file = getDataUri(req.file);

//   // Assuming you want to save public_id and url of the image in the database
//   const promotionData = {
//     url: uniqueFilename,
//     // visibility: req.body.visibility, // Assuming you're passing visibility in the request body
//   };

//   // Create a new promotion record in the database
//   await Promotion.create(promotionData);

//   res.status(200).json({
//     success: true,
//     message: "Promotions Added Successfully",
//   });
// });

export const getAllPromotions = asyncError(async (req, res, next) => {
  const promotions = await Promotion.find({});
  res.status(200).json({
    success: true,
    promotions,
  });
});

export const deletePromotion = asyncError(async (req, res, next) => {
  const { id } = req.params;

  // Find the promotion by ID and delete it
  const deletedPromotion = await Promotion.findByIdAndDelete(id);

  if (!deletedPromotion) {
    return res.status(404).json({
      success: false,
      message: "Promotion not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "Promotion deleted successfully",
    deletedPromotion,
  });
});

export const updatePromotion = asyncError(async (req, res, next) => {
  const { visibility } = req.body;

  const promotion = await Promotion.findById(req.params.id);

  if (!promotion) return next(new ErrorHandler("Promotion not found", 404));

  console.log("Existing visibility:", promotion.visibility);
  console.log("New visibility:", visibility);

  promotion.visibility = visibility;

  await promotion.save();

  res.status(200).json({
    success: true,
    message: "Promotion Updated Successfully",
    promotion,
  });
});

// For Admin

// ####################
// ALL USER
// ####################

export const getAllUser = asyncError(async (req, res, next) => {
  const users = await User.find({}).populate("walletOne").populate("walletTwo");

  res.status(200).json({
    success: true,
    users,
  });
});

// #############################
//  About us Section
// #############################

// About us update

export const updateAbout = asyncError(async (req, res, next) => {
  const about = await LotAppAbout.findById(req.params.id);

  if (!about) return next(new ErrorHandler("about not found", 404));

  const { aboutTitle, aboutDescription } = req.body;

  if (aboutTitle) about.aboutTitle = aboutTitle;
  if (aboutDescription) about.aboutDescription = aboutDescription;

  await about.save();

  res.status(200).json({
    success: true,
    message: "Updated Successfully",
  });
});

// Create Abuut app content
export const createAbout = asyncError(async (req, res, next) => {
  const { aboutTitle, aboutDescription } = req.body;
  // if (!result) return next(new ErrorHandler("Result not found", 404))
  await LotAppAbout.create({ aboutTitle, aboutDescription });

  res.status(200).json({
    success: true,
    message: "Successfully added about us",
  });
});

export const deleteAbout = asyncError(async (req, res, next) => {
  const { id } = req.params;

  // Find the promotion by ID and delete it
  const deletedAbout = await LotAppAbout.findByIdAndDelete(id);

  if (!deletedAbout) {
    return res.status(404).json({
      success: false,
      message: "About not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "Successfully Deleted",
    deleteAbout,
  });
});

// Get all About Us
export const getAllAbout = asyncError(async (req, res, next) => {
  const aboutus = await LotAppAbout.find({});

  res.status(200).json({
    success: true,
    aboutus,
  });
});


// Get All WalletOne 
export const getAllWalletOne = asyncError(async (req, res, next) => {
  const wallets = await WalletOne.find({});

  res.status(200).json({
    success: true,
    wallets,
  });
});

// Get All WalletTwo
export const getAllWalletTwo = asyncError(async (req, res, next) => {
  const wallets = await WalletTwo.find({});

  res.status(200).json({
    success: true,
    wallets,
  });
});

// Update Wallet name
// Controller function to update wallet names in all data
export const updateAllWalletNameOne = asyncError(async (req, res, next) => {
  const walletName = req.body.walletName; // Assuming you pass new wallet name in the request body

  // Update wallet names in all data
  await WalletOne.updateMany({}, { $set: { walletName: walletName } });

  res.status(200).json({
      success: true,
      message: 'Wallet names updated successfully in all data.',
  });
});


// Update Wallet name
// Controller function to update wallet names in all data
export const updateAllWalletNameTwo = asyncError(async (req, res, next) => {
  const walletName = req.body.walletName; // Assuming you pass new wallet name in the request body

  // Update wallet names in all data
  await WalletTwo.updateMany({}, { $set: { walletName: walletName } });

  res.status(200).json({
      success: true,
      message: 'Wallet names updated successfully in all data.',
  });
});