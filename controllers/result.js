import { asyncError } from "../middlewares/error.js";
import { Result } from "../models/result.js";
import ErrorHandler from "../utils/error.js";
import { LotDate } from "../models/lotdate.js";
import { LotTime } from "../models/lottime.js";
import { LotLocation } from "../models/lotlocation.js";

// ####################
// RESULTS
// ####################

// Searching for Reasult
// const results = await Result.find({}).populate("lotdate");

export const getAllResult = asyncError(async (req, res, next) => {
  const results = await Result.find({})
    .populate("lotdate")
    .populate("lottime")
    .populate("lotlocation");

  res.status(200).json({
    success: true,
    results,
  });
});

export const getAllResultAccordingToLocation = asyncError(
  async (req, res, next) => {
    const { locationid } = req.query;

    let results = await Result.find({})
      .populate("lotdate")
      .populate("lottime")
      .populate("lotlocation");


    if (locationid) {
      // Filter results array based on locationid
      results = results.filter(
        (item) => item.lotlocation._id.toString() === locationid
      );
    }

    res.status(200).json({
      success: true,
      results,
    });
  }
);

// for timer
// export const getAllResultAccordingToLocation = asyncError(
//   async (req, res, next) => {
//     const { locationid } = req.query;

//     // Get current date and time
//     const currentDate = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-');
//     const currentTime = new Date().toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit' });

//     console.log("Current Date:", currentDate);
//     console.log("Current Time:", currentTime);

//     let results = await Result.find({})
//       .populate("lotdate")
//       .populate("lottime")
//       .populate("lotlocation");

//     console.log("All Results:", results);

//     // Filter results based on current date and time
//     results = results.filter(item => {
//       const lotDate = item.lotdate.lotdate;
//       const lotTime = item.lottime.lottime;

//       // Check if lotdate is same as current date and lottime is greater than or equal to current time
//       return lotDate === currentDate && lotTime >= currentTime;
//     });

//     console.log("Filtered Results:", results);

//     if (locationid) {
//       // Filter results array based on locationid
//       results = results.filter(item => item.lotlocation._id.toString() === locationid);
//     }

//     res.status(200).json({
//       success: true,
//       results,
//     });
//   }
// );

export const getNextResult = asyncError(
  async (req, res, next) => {
    const { locationid } = req.query;

    // Get current date and time
    const currentDate = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-');
    const currentTime = new Date().toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit' });

    console.log("Current Date:", currentDate);
    console.log("Current Time:", currentTime);

    let results = await Result.find({})
      .populate("lotdate")
      .populate("lottime")
      .populate("lotlocation");

    console.log("All Results:", results);

    // Filter results based on current date and time
    results = results.filter(item => {
      const lotDate = item.lotdate.lotdate;
      const lotTime = item.lottime.lottime;

      console.log("Lot Date:", lotDate);
      console.log("Lot Time:", lotTime);

      // Check if lotdate is same as current date and lottime is greater than or equal to current time
      return lotDate === currentDate && (lotTime >= currentTime || !item.lotdate.lotdate);
    });

    console.log("Filtered Results:", results);

    if (locationid) {
      // Filter results array based on locationid
      results = results.filter(item => item.lotlocation._id.toString() === locationid);
    }

    res.status(200).json({
      success: true,
      results,
    });
  }
);





export const getAllResultAccordingToDateTimeLocation = asyncError(
  async (req, res, next) => {
    const { lotdateId, lottimeId, lotlocationId } = req.query;

    try {
      let results = await Result.find({})
        .populate("lotdate")
        .populate("lottime")
        .populate("lotlocation")
        .exec();

      if (lotdateId && lottimeId && lotlocationId) {
        // Filter results array based on all three parameters
        results = results.filter(
          (item) =>
            item.lotdate &&
            item.lottime &&
            item.lotlocation && // Ensure all populated fields are not null
            item.lotdate._id.toString() === lotdateId &&
            item.lottime._id.toString() === lottimeId &&
            item.lotlocation._id.toString() === lotlocationId
        );
      }

      res.status(200).json({
        success: true,
        results,
      });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  }
);

export const getResultDetails = asyncError(async (req, res, next) => {
  const result = await Result.findById(req.params.id);

  if (!result) return next(new ErrorHandler("Result not found", 404));

  res.status(200).json({
    success: true,
    result,
  });
});

export const createResult = asyncError(async (req, res, next) => {
  const { resultNumber, lotdate, lottime, lotlocation } = req.body;
  // if (!result) return next(new ErrorHandler("Result not found", 404))
  await Result.create({
    resultNumber,
    lotdate,
    lottime,
    lotlocation,
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

  if (resultNumber) result.resultNumber = resultNumber;

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

export const getAllLotDateAccordindLocationAndTime = asyncError(
  async (req, res, next) => {
    const { lottimeId, lotlocationId } = req.query;

    let lotdates = await LotDate.find({}).populate("lottime");

    if (lottimeId && lotlocationId) {
      // Filter lotdates array based on both lottimeId and lotlocationId
      lotdates = lotdates.filter(
        (item) =>
          item.lottime._id.toString() === lottimeId &&
          item.lottime.lotlocation.toString() === lotlocationId
      );
    } else if (lottimeId) {
      // Filter lotdates array based on lottimeId
      lotdates = lotdates.filter(
        (item) => item.lottime._id.toString() === lottimeId
      );
    } else if (lotlocationId) {
      // Filter lotdates array based on lotlocationId
      lotdates = lotdates.filter(
        (item) => item.lottime.lotlocation.toString() === lotlocationId
      );
    }

    res.status(200).json({
      success: true,
      lotdates,
    });
  }
);

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

  if (lotdate) ldate.lotdate = lotdate;

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

export const getAllLotTimeAccordindLocation = asyncError(
  async (req, res, next) => {
    const { locationid } = req.query;

    let lottimes = await LotTime.find({}).populate("lotlocation");

    if (locationid) {
      // Filter lottimes array based on locationid
      lottimes = lottimes.filter(
        (item) => item.lotlocation._id.toString() === locationid
      );
    }

    res.status(200).json({
      success: true,
      lottimes,
    });
  }
);

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

  if (lottime) ltime.lottime = lottime;

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

  const { lotlocation, maximumRange } = req.body;

  if (!lotlocation) return next(new ErrorHandler("enter lotlocation missing", 404));
  if (!maximumRange) return next(new ErrorHandler("enter maximum range", 404));

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
  const { lotlocation,locationTitle, locationDescription } = req.body;

  const llocation = await LotLocation.findById(req.params.id);

  if (!llocation) return next(new ErrorHandler("Location not found", 404));

  if (lotlocation) llocation.lotlocation = lotlocation;
  if (locationTitle) llocation.locationTitle = locationTitle;
  if (locationDescription) llocation.locationDescription = locationDescription;

  await llocation.save();

  res.status(200).json({
    success: true,
    message: "Location Updated Successfully",
  });
});




