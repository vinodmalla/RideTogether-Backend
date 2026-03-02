const express=require('express');
const router=express.Router();
const User=require('../models/User');
router.post('/createroom',async(req,res)=>{
    const {roomID,adminUserID,username,destination}=req.body;
    try{
        const newUser=new User({
            roomID,
            adminUserID,
            username,
            destination
        });
        await newUser.save();
        res.status(201).json({message:"Room created successfully",user:newUser});
    }catch(error){
        console.error("Error creating room:",error);
        res.status(500).json({message:"Internal server error"});
    }
});
router.post("/set-destination",async(req,res)=>{
    const {roomID,destination}=req.body;
    console.log("Received set-destination request:",{roomID,destination});
    try{
       const existuser= await User.findOne({roomID:roomID});
       if(!existuser){
            return res.status(404).json({message:"User not found"});
        }
         existuser.destination=destination;
         await existuser.save();

        res.status(200).json({message:"Destination set successfully",user:existuser});
    }catch(error){
        console.error("Error setting destination:",error);
        res.status(500).json({message:"Internal server error"});
    }
});
module.exports=router