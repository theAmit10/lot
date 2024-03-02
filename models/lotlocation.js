import mongoose from "mongoose";

const schema = new mongoose.Schema({
    lotlocation: {
        type: String,
        required: [true,"Please enter location name"]
    },
    createdAt:{
        type: Date,
        default: Date.now(),
    }
    
})

export const LotLocation = mongoose.model("LotLocation",schema);