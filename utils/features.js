import {createTransport} from "nodemailer"


export const sendToken = (user,res,message,statucCode) => {
    const token = user.generateToken()

    // console.log("TOKEN :: "+token)

    res.status(statucCode).json({ 
        success: true,
        message: message,
        token,
    })
}

// For Uploading Profile Image
export const getDataUri  = (file) => {}

// for sending email
export const sendEmail = async (subject, to, text) => {

    // const transpoter = createTransport({});
    const transporter = createTransport({
        service: 'gmail',
        auth: {
            user: 'prasadak66@gmail.com',
            pass: 'uuey bzow yzqr qrcm',
        },
    });

    await transporter.sendMail({
        to,
        subject,
        text,
    })
}
