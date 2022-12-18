import User from "../models/authModel.js";
import ErrorResponse from "../utils/errorHandling.js";
import { sendEmail } from "../utils/sendEmail.js";
import crypto from "crypto";

// Register User
export const registerUser = async(req, res, next) => {
    const {name, email, password} = req.body;

    try {
        const user = await User.create({name, email, password});

        sendToken(user, 201, res);
        // res.status(201).json({
        //     success: true,
        //     user,
        // })
        
    } catch (error) {
        next(error);
        // res.status(500).json({
        //     success: false,
        //     error: error.message,
        // })
    }
}

// Login user
export const loginUser = async(req, res, next) => {
    const {email, password} = req.body;

    if(!email || !password) {
        return next(new ErrorResponse("Please provide email and password", 400));
        // res.status(401).json({
        //     success: false,
        //     error: "Please provide email and password"
        // })
    }

    try {
        const user = await User.findOne({email}).select("+password");
        if(!user) {
        return next(new ErrorResponse("Invalid Credectials", 401));
            // res.status(404).json({
            //     success: false,
            //     error: "Invalid Credectials"
            // })
        }

        const isMatchedPassword = await user.matchPassword(password);

        if(!isMatchedPassword) {
            return next(new ErrorResponse("Invalid Credectials", 401));
            // res.status(404).json({
            //     success: false,
            //     error: "Invalid Credentials",
            // })
        }
        
        sendToken(user, 200, res);
        // res.status(200).json({
        //     success: true,
        //     token: "fdfo5r4cfd",
        // })
    } catch (error) {
        next(error);
        // res.status(500).json({
        //     success: false,
        //     error: error.message,
        // })
    }
}

// Fogot Password
export const forgotPassword = async(req, res, next) => {
    const {email} = req.body;

    try {
        const user = await User.findOne({email});

        if(!user) {
            return next(new ErrorResponse("Email could not be send", 404));
        }

        const resetToken = user.getResetPasswordToken();

        await user.save();

        const reseturl = `https://authentication-front-sar.onrender.com/resetpassword/${resetToken}`;

        const message = `
        <h1>You have requested a password reset</h1>
        <p>Please go to this link to reset your password</p>
        <a href=${reseturl} clicktracking=off>${reseturl}</a>
        `
        try {
            await sendEmail({
                to:user.email,
                subject: "Password reset token",
                text: message
            })
            res.status(200).json({
                success: true,
                data: "Email Sent",
            })
        } catch (error) {
            user.getResetPasswordToken = undefined;
            user.getResetPasswordExpire = undefined;

            await user.save();
            return next(new ErrorResponse("Email could not be send", 500));
        }
    } catch (error) {
        next(error);
    }
}

// Reset Password
export const resetPassword = async(req, res, next) => {
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.resetToken).digest('hex');
    try {
        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: {
                $gt: Date.now()
                // $gt means greater than
            }
        })

        if(!user) {
            return next(new ErrorResponse("Invalid Reset Token", 400))
        }

        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();
        
        res.status(201).json({
            success: true,
            data: "password Reset Success"
        })
        
    } catch (error) {
        next(error);
    }
}

// Send Token
const sendToken = (user, statusCode, res) => {
    const token = user.getSignedToken();
    res.status(statusCode).json({
        success: true,
        token
    })
}
