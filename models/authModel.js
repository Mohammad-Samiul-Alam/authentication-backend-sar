import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const UserSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please provide a username"]
        }, 
        email: {
            type: String,
            required: [true, "Please provide a email"],
            unique: [true, "Please provide a unque email"],
            // match: [
            //     ("^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$"), "Please provide a valid email"
            // ]
        },
        password: {
            type: String,
            required: [true, "Please provide a password"],
            minlength: 6,
            select: false
        },
        resetPasswordToken: String,
        resetPasswordExpire: Date,
    }, 
    {
        timestamps: true
    }
);

// Bcrypt password
UserSchema.pre('save', async function(next){
    if(!this.isModified('password')) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt)
    next();
})

// Passwords Match
UserSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}

// Jsonwebtoken
UserSchema.methods.getSignedToken = function() {
    return jwt.sign({id: this._id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    })
}

// Generate Hash Password Token
UserSchema.methods.getResetPasswordToken = function() {
    const resetToken = crypto.randomBytes(20).toString("hex");

    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    this.resetPasswordExpire = Date.now() + 10 * (60 * 1000);
    return resetToken;
}

const User = mongoose.model("User", UserSchema);
export default User;
