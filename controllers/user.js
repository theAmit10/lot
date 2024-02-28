 import {User} from "../models/user.js"
 
 export const login = async (req,res,next) => {

    const {email, password} = req.body;

    
    const user  = await User.findOne({ email }).select("+password")
    console.log(password)
    console.log(user)

    const isMatched = await user.comparePassword(password)
    console.log(isMatched)
    if(!isMatched){
        
        return res.status(400).json({
            success: false,
            message: "Incorrect Password"
        });
    }

    res.status(200).json({
        success: true,
        message: `Welcome back ${user.name}`
    })
} 

export const register = async (req,res,next) => {

    const {name,email,password} = req.body;

    // add cloudinary here

    await User.create({
        name,
        email,
        password
    });


    res.status(201).json(({
        success: true,
        message: "Registered Successfully"
    }))
} 