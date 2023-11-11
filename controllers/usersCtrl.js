import User from "../model/User.js";
import bcrypt from "bcryptjs";
import asyncHandler from "express-async-handler";
import generateToken from "../utils/generateToken.js"
import { getTokenFromHeader } from "../utils/getTokenFromHeader.js";

//@desc Register User
//@route POST /api/v1/users/register
//@access Private/Admin

export const registerUserCtrl = asyncHandler(async (req, res) => {
    const { fullname, email, password } = req.body;
    //check user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
        //throw
        throw new Error("User already exists")
    }
    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // create the user
    const user = await User.create({
        fullname,
        email,
        password: hashedPassword
    });
    res.status(201).json({
        status: "success",
        message: "User Registered Successfully",
        data: user,
    })

})

// @desc Login User
// @route POST /api/v1/users/login
// @access Public

export const loginUserCtrl = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    // find the user in db by email only
    const userFound = await User.findOne({
        email
    });
    if (userFound && (await bcrypt.compare(password, userFound?.password))) {
        res.json({
            status: "success",
            msg: "User Login Completed",
            userFound,
            token:generateToken(userFound?._id)
        })
    }
    else {
        throw new Error("Invalid login credentials");
    }
})

// @desc Get user profile
// @route GET /api/v1/users/profile
// @access Private

export const getUserProfileCtrl = asyncHandler (async (req,res)=>{
    const token = getTokenFromHeader(req)
    console.log(token)
    res.json({
        msg:"Welcome Profile page"
    })
})