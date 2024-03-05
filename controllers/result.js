import { asyncError } from "../middlewares/error.js";
import { Result } from "../models/result.js";
import ErrorHandler from "../utils/error.js";
import { LotDate } from "../models/lotdate.js";
import { LotTime } from "../models/lottime.js";
import { LotLocation } from "../models/lotlocation.js";

// ####################
// RESULTS
// ####################


export const getAllResult = asyncError(async (req, res, next) => {
  // Searching for Reasult
  // const results = await Result.find({}).populate("lotdate");
  const results = await Result.find({}).populate("lotdate").populate("lottime").populate("lotlocation");

  res.status(200).json({
    success: true,
    results,
  });
});

export const getResultDetails = asyncError(async (req, res, next) => {
  const result = await Result.findById(req.params.id);

  if (!result) return next(new ErrorHandler("Result not found", 404));

  res.status(200).json({
    success: true,
    result,
  });
});

export const createResult = asyncError(async (req, res, next) => {
  const { resultNumber, lotdate,lottime,lotlocation } = req.body;
  // if (!result) return next(new ErrorHandler("Result not found", 404))
  await Result.create({
    resultNumber,
    lotdate,
    lottime,
    lotlocation
  });

  res.status(200).json({
    success: true,
    message: "Result Created Successfully",
  });
});

export const updateResult = asyncError(async (req, res, next) => {
    const { resultNumber } = req.body;

    const result = await Result.findById(req.params.id);

    if (!result) return next(new ErrorHandler("Result not found", 404));

    if(resultNumber) result.resultNumber = resultNumber;
  
    await result.save();
  
    res.status(200).json({
      success: true,
      message: "Result Updated Successfully",
    });
  });


// ####################
// LOT DATE
// ####################

export const addLotDate = asyncError(async (req, res, next) => {
  await LotDate.create(req.body);

  res.status(201).json({
    success: true,
    message: "Date Added Successfully",
  });
});

export const getAllLotDate = asyncError(async (req, res, next) => {
  const lotdates = await LotDate.find({}).populate("lottime");
  res.status(200).json({
    success: true,
    lotdates,
  });
});

export const deleteLotDate = asyncError(async (req, res, next) => {
  const lotdate = await LotDate.findById(req.params.id);

  if (!lotdate) return next(new ErrorHandler("Date not found", 404));

  const results = await Result.find({ lotdate: lotdate._id });

  for (let index = 0; index < results.length; index++) {
    const result = array[index];
    result.lotdate = undefined;
    await result.save();
  }

  await lotdate.deleteOne();

  res.status(200).json({
    success: true,
    message: "Date Deleted Successfully",
  });
});

export const updateDate = asyncError(async (req, res, next) => {
    const { lotdate } = req.body;

    const ldate = await LotDate.findById(req.params.id);

    if (!ldate) return next(new ErrorHandler("Date not found", 404));

    if(lotdate) ldate.lotdate = lotdate;
  
    await ldate.save();
  
    res.status(200).json({
      success: true,
      message: "Date Updated Successfully",
    });
  });


// ####################
// LOT TIME
// ####################

export const addLotTime = asyncError(async (req, res, next) => {
    await LotTime.create(req.body);
  
    res.status(201).json({
      success: true,
      message: "Time Added Successfully",
    });
  });
  
  export const getAllLotTime = asyncError(async (req, res, next) => {
    const lottimes = await LotTime.find({}).populate("lotlocation");
    res.status(200).json({
      success: true,
      lottimes,
    });
  });

  export const deleteLotTime = asyncError(async (req, res, next) => {
    const lottime = await LotTime.findById(req.params.id);
  
    if (!lottime) return next(new ErrorHandler("Time not found", 404));
  
    const lottimes = await LotDate.find({ lottime: lottime._id });
  
    for (let index = 0; index < lottimes.length; index++) {
      const lottime = array[index];
      lottime.lottime = undefined;
      await lottime.save();
    }
  
    await lottime.deleteOne();
  
    res.status(200).json({
      success: true,
      message: "Time Deleted Successfully",
    });
  });
  
  export const updateTime = asyncError(async (req, res, next) => {
      const { lottime } = req.body;
  
      const ltime = await LotTime.findById(req.params.id);
  
      if (!ltime) return next(new ErrorHandler("Time not found", 404));
  
      if(lottime) ltime.lottime = lottime;
    
      await ltime.save();
    
      res.status(200).json({
        success: true,
        message: "TIme Updated Successfully",
      });
    });
  


// ####################
// LOT LOCATION
// ####################

export const addLotLocatin = asyncError(async (req, res, next) => {
  await LotLocation.create(req.body);

  res.status(201).json({
    success: true,
    message: "Location Added Successfully",
  });
});

export const getAllLotLocation = asyncError(async (req, res, next) => {
  const lotlocations = await LotLocation.find({});
  res.status(200).json({
    success: true,
    lotlocations,
  });
});

export const deleteLotLocation = asyncError(async (req, res, next) => {
  const lotlocation = await LotLocation.findById(req.params.id);

  if (!lotlocation) return next(new ErrorHandler("Location not found", 404));

  const lotlocations = await LotTime.find({ lotlocation: lotlocation._id });

  for (let index = 0; index < lotlocations.length; index++) {
    const lotlocation = array[index];
    lotlocation.lottime = undefined;
    await lotlocation.save();
  }

  await lotlocation.deleteOne();

  res.status(200).json({
    success: true,
    message: "Location Deleted Successfully",
  });
});

export const updateLocation = asyncError(async (req, res, next) => {
    const { lotlocation } = req.body;

    const llocation = await LotLocation.findById(req.params.id);

    if (!llocation) return next(new ErrorHandler("Location not found", 404));

    if(lotlocation) llocation.lotlocation = lotlocation;
  
    await llocation.save();
  
    res.status(200).json({
      success: true,
      message: "Location Updated Successfully",
    });
  });
