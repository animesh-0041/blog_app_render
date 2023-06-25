const express=require("express")
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {UserModel}=require("../model/user.model")
const userRoute=express.Router()

//register

userRoute.post("/register",async(req,res)=>{
    const {email,username,avtar,password}=req.body
    try {
        const existUser= await UserModel.findOne({email})
        if(existUser){
            res.send({"msg":"Email already exist!"})
        }
        else{

            bcrypt.hash(password, 5, async(err, hash)=> {
                if(hash){
                    const user=new UserModel({username,email,password:hash,avtar})
                   await user.save()
                   res.send({"msg":"Registration successful"})
                }
            });
        }
        
    } catch (error) {
        res.send(error)
    }

})


// login

userRoute.post("/login",async(req,res)=>{
    const {email,password}=req.body
    
    
    try {
        const user= await UserModel.findOne({email})
        if(user){
            console.log(user);
            bcrypt.compare(password, user.password, function(err, result) {
                if(result){
                   const token= jwt.sign({ username:user.username,avtar:user.avtar,userID:user._id}, "blogs")
                        res.send({"msg":"Login successful","token":token,"username":user.username,"userID":user._id})
                }
                else{
                    res.status(400).send({"msg":"Password is wrong!"})
                }
            });

        }
        else{
            res.status(400).send({"msg":"user not found!"})
        }
        
        
    } catch (error) {
        res.send(error)
    }
})

module.exports={
    userRoute
}

