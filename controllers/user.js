import { asyncError } from "../middlewares/error.js";
import { User } from "../models/user.js";
import ErrorHandler from "../utils/error.js";
import { getDataUri, sendToken } from "../utils/features.js";

export const login = asyncError(async (req, res, next) => {
  const { email, password } = req.body;

  if(!password) return next(new ErrorHandler("Please enter password", 400));

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

  let user = await User.findOne({ email });

  if (user) return next(new ErrorHandler("User Already exist", 400));

  // add cloudinary here

  user = await User.create({
    name,
    email,
    password,
  });

  sendToken(user, res, `Registered Successfully`, 201);

  //   res.status(201).json({
  //     success: true,
  //     message: "Registered Successfully",
  //   });
});

export const getMyProfile = asyncError(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  res.status(200).json({
    success: true,
    user,
  });
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

  const {oldPassword, newPassword}  = req.body;

  // Checking the user have enter old and new password 
  if(!oldPassword && !newPassword) return next(new ErrorHandler("Please enter old and new password", 400));

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
    
    const {email} = req.body;
    const user = await User.findOne({email})

    if(!user) return next(new ErrorHandler("Incorrect email",404))

    // Generating 6 digit otp
    // max,min 2000,10000
    // math.random()*(max-min)+min

    const randomSixDitgitNumber = Math.random() * (999999 - 100000)+ 100000;
    const otp = Math.floor(randomSixDitgitNumber);
    const otp_expire = 15 * 60 * 1000;

    // Adding to the user otp
    user.otp = otp;
    user.otp_expire = new Date(Date.now() + otp_expire);

    console.log("OTP CODE :: "+otp)

    await user.save();

    // After Saving the otp we have to send a email
    // sendEmail()

  
    res.status(200).json({
      success: true,
      message: `Verification code has been sent to ${user.email}`
    });
  });

  export const resetPassword = asyncError(async (req, res, next) => {
    const user = await User.findById(req.user._id);
  
    res.status(200).json({
      success: true,
      user,
    });
  });