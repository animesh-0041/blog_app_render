const mongoose=require("mongoose")

const commentSchema=mongoose.Schema({
    username:String,
    content:String
})


const blogSchema=mongoose.Schema({
    username:{type:String},
    userID:{type:String},
    avtar:{type:String},
    title:{type:String},
    content:{type:String},
    category:{type:String},
    date:{type:String},
    likes:{type:Number},
   comments:[commentSchema]
})

const BlogModel=mongoose.model("blog",blogSchema)

module.exports={
    BlogModel
}