import { asyncError } from "../middlewares/error.js";
import { Result } from "../models/result.js";
import ErrorHandler from "../utils/error.js";
import {LotDate} from '../models/lotdate.js'
import {LotTime} from '../models/lottime.js'
import {LotLocation} from '../models/lotlocation.js'

export const getResult = asyncError(async (req,res,next) => {

    // Searching for Reasult

    const results = await Result.find({});

    res.status(200).json({
        success: true,
        results,
    })

    
})

export const getResultDetails = asyncError(async (req,res,next) => {

    const result = await Result.findById(req.params.id);

    if (!result) return next(new ErrorHandler("Result not found", 404))
   
    res.status(200).json({
        success: true,
        result,
    }) 
})


export const createResult = asyncError(async (req,res,next) => {

    const result = await Result.findById(req.params.id);

    if (!result) return next(new ErrorHandler("Result not found", 404))
   
    res.status(200).json({
        success: true,
        result,
    }) 
})

// for LotDate
export const addLotDate = asyncError(async (req,res,next) => {
    await LotDate.create(req.body);

    res.status(201).json({
        success: true,
        message: "Date Added Successfully"
    })

})

export const getAllLotDate = asyncError(async (req,res,next) => {

    const lotdates = await LotDate.find({});

    res.status(200).json({
        success: true,
        lotdates
    })

})

export const deleteLotDate = asyncError(async (req,res,next) => {

    const lotdate = await LotDate.findById(req.params.id);

    if(!lotdate) return next(new ErrorHandler("Result not found",404));

    const results = await Result.find({lotdate: lotdate._id});

    for (let index = 0; index < results.length; index++) {
        const result = array[index];
        result.lotdate = undefined;
        await result.save();
        
    }

    await lotdate.deleteOne();

    

    res.status(200).json({
        success: true,
        message: "Date Deleted Successfully"
    })

})