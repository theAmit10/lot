import mongoose from "mongoose";

const schema = new mongoose.Schema({
    resultNumber:{
        type: String,
        required: [true, "Please enter result"]
    },
    lotdate:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "LotDate",
        required: [true,"please enter date id"]
    }
    ,
    createdAt:{
        type: Date,
        default: Date.now(),
    }
})

export const Result = mongoose.model("Result",schema);


// Basic Starting Syntex

// import mongoose from "mongoose";

// const schema = new mongoose.Schema({})

// export const Results = mongoose.model("Result",schema);