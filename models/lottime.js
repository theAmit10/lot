import mongoose from "mongoose";

const schema = new mongoose.Schema({
    lotdate: {
        type: String,
        required: [true,"Please enter time"]
    },
    lotlocation:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "LotLocation"
    },
    createdAt:{
        type: Date,
        default: Date.now(),
    }
})

export const LotTime = mongoose.model("LotTime",schema);