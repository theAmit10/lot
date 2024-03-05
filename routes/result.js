import express from "express"
import { isAdmin, isAuthenticated } from "../middlewares/auth.js";
import { addLotDate, addLotLocatin, addLotTime, createResult, deleteLotDate, deleteLotLocation, deleteLotTime, getAllLotDate, getAllLotLocation, getAllLotTime, getAllResult, getResultDetails, updateDate, updateLocation, updateResult, updateTime } from "../controllers/result.js";


const router = express.Router();


// All Routes
router.get("/searchresult",isAuthenticated,getAllResult);
router.route("/single/:id").get(isAuthenticated,getResultDetails).put(isAuthenticated,updateResult);
router.post("/createresult",isAuthenticated,createResult);

// for LotDates
router.post("/addlotdate",isAuthenticated,addLotDate);
router.get("/alllotdate",isAuthenticated,getAllLotDate);
router.delete("/removelotdate/:id",isAuthenticated,deleteLotDate);
router.put("/updatelotdate/:id",isAuthenticated,updateDate)

// for LotTimes
router.post("/addlottime",isAuthenticated,addLotTime);
router.get("/alllottime",isAuthenticated,getAllLotTime);
router.delete("/removelottime/:id",isAuthenticated,deleteLotTime);
router.put("/updatelottime/:id",isAuthenticated,updateTime)

// for LotLocation
router.post("/addlotlocation",isAuthenticated,addLotLocatin);
router.get("/alllotlocation",isAuthenticated,getAllLotLocation);
router.delete("/removelotlocation/:id",isAuthenticated,deleteLotLocation);
router.put("/updatelotlocation/:id",isAuthenticated,updateLocation)


export default router;


