import express from "express"
import { isAdmin, isAuthenticated } from "../middlewares/auth.js";
import { addLotDate, createResult, deleteLotDate, getAllLotDate, getResult, getResultDetails } from "../controllers/result.js";


const router = express.Router();


// All Routes
router.get("/searchresult",isAuthenticated,getResult);
router.route("/single/:id").get(isAuthenticated,getResultDetails);
router.get("/createresult",isAuthenticated,createResult);

// for LotDates
router.get("/addlotdate",isAuthenticated,isAdmin,addLotDate);
router.get("/alllotdate",isAuthenticated,getAllLotDate);
router.delete("/removelotdate/:id",isAuthenticated,isAdmin,deleteLotDate);


export default router;


