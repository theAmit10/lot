import express from "express"
import { isAdmin, isAuthenticated } from "../middlewares/auth.js";
import { addLotDate, createResult, deleteLotDate, getAllLotDate, getAllResult, getResultDetails, updateResult } from "../controllers/result.js";


const router = express.Router();


// All Routes
router.get("/searchresult",isAuthenticated,getAllResult);
router.route("/single/:id").get(isAuthenticated,getResultDetails).put(isAuthenticated,updateResult);
router.post("/createresult",isAuthenticated,createResult);

// for LotDates
router.post("/addlotdate",isAuthenticated,addLotDate);
router.get("/alllotdate",isAuthenticated,getAllLotDate);
router.delete("/removelotdate/:id",isAuthenticated,deleteLotDate);
router.put("/updatelotdate/:id",isAuthenticated,updateResult)


export default router;


