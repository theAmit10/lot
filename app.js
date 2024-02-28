import express from "express";
import { config } from "dotenv";

import user from "./routes/user.js"

config({
    path: "./data/config.env",
});


export const app = express();


// Use Middleware 

app.use(express.json())

// Handeling Routes

app.get("/",(req,res,next) => {
    res.send("Namaste Codethenic")
})

app.use("/api/v1/user",user)