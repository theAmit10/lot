import express from "express"
import { changePassword, forgetPassword, getAllUser, getMyProfile, getUserDetails, login, logout, register, resetPassword, updatePic, updateProfile, updateProfilePic, updateWallet,getProfilePic } from "../controllers/user.js";
import { isAuthenticated, verifyToken } from "../middlewares/auth.js";
import { singleUpload } from "../middlewares/multer.js";

const router = express.Router();

// router.route("/login").get(login)

// All Routes
router.post("/login",login);
router.post("/register",register);

router.get("/profile",isAuthenticated,getMyProfile);
router.get("/logout",isAuthenticated,logout);

// All Routes regarding update
router.put("/updateprofile",isAuthenticated,updateProfile);
router.put("/changepassword",isAuthenticated,changePassword);
router.put("/updatepic",isAuthenticated,singleUpload,updatePic);
router.route("/singleuser/:id").get(isAuthenticated,getUserDetails);
router.put("/wallet/:walletId",isAuthenticated,updateWallet)

// All routes regardin reset and forgot password
router.route("/forgetpassword").post(forgetPassword).put(resetPassword)

// FOR ADMIN WORK
router.get("/alluser",isAuthenticated,getAllUser);

router.post("/updateprofilepic",isAuthenticated,singleUpload,updateProfilePic);
router.get("/getprofilepic",isAuthenticated,getProfilePic)


export default router;


// authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NWRmODcyNmZkMmQ3ZmIwNDAzZWVkYjkiLCJpYXQiOjE3MDkzNTI4NTF9.GBHJjBZEOqDXUA2ic0YpEhosA7QWByWmqh0DwyqtNn0'