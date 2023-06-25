const express = require("express");
const { BlogModel } = require("../model/blog.model");
const blogRouter = express.Router();

blogRouter.post("/blogs", async (req, res) => {
  try {
    const blog = new BlogModel(req.body);
    await blog.save();
    res.send({ msg: "Blog has been posted" });
  } catch (error) {
    res.send(error);
  }
});
/*
 db.collection.find({})
  .skip(no_of_docs_each_page * current_page_number)
  .limit(no_of_docs_each_page)
*/

blogRouter.get("/blogs", async (req, res) => {
  const { title, page, limit,category } = req.query;
 
  try {
    if (title) {
      const blogs = await BlogModel.find({ title: { $regex: title } });
      res.send(blogs);
    } 

    else if(category){
      const data = await BlogModel.find({category});
      if (data.length <= 10) {
        res.send({ "data": data, "totalCount": Math.ceil(data.length/10) });
      }
      
      else {
        const blogs = await BlogModel.find({category:req.body.category}).skip(10 * (page-1)).limit(10);
        res.send({ "data": blogs, "totalCount": Math.ceil(data.length/10) });
      }

    }
    
    else if (page && limit) {
      const data = await BlogModel.find();
       
      if (data.length <= 10) {
        res.send({ "data": data, "totalCount": Math.ceil(data.length/10) });
      }
      
      else {
        const blogs = await BlogModel.find({}).skip(10 * (page-1)).limit(10);
        res.send({ "data": blogs, "totalCount": Math.ceil(data.length/10) });
      }
    } 
    
    else {
      const blogs = await BlogModel.find();
      res.send(blogs);
    }
  } catch (error) {
    res.send(error);
  }
});

blogRouter.get("/blogs/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const blogs = await BlogModel.findOne({ _id: id });
    res.send(blogs);
  } catch (error) {
    res.send(error);
  }
});

blogRouter.patch("/blogs/:id/like", async (req, res) => {
  const { id } = req.params;
  try {
    await BlogModel.findByIdAndUpdate({ _id: id }, req.body);
    res.send({ msg: "You like it👍" });
  } catch (error) {
    res.send(error);
  }
});

blogRouter.patch("/blogs/:id/comment", async (req, res) => {
  const { id } = req.params;
  console.log(req.body);
  try {
    await BlogModel.updateMany(
      { _id: id },
      { $push: { comments: { ...req.body } } }
    );
    res.send({ msg: "Your comment posted👍" });
  } catch (error) {
    res.send(error);
  }
});

//delete blog
blogRouter.delete("/blogs/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const post=await BlogModel.findOne({_id:id})
    if(req.body.userID==post.userID){
      await BlogModel.findByIdAndDelete({ _id: id });
      res.status(200).send({ "msg": `Your blog has been deleted` });
    }
    else{
      res.status(200).send({ "msg": `You are not authorized` });
    }
  
  } catch (error) {
    res.send(error);
  }
});


//update or edit blog
blogRouter.patch("/blogs/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const post=await BlogModel.findOne({_id:id})
    if(req.body.userID==post.userID){
      await BlogModel.findByIdAndUpdate({ _id: id },req.body);
      res.status(200).send({ "msg": `Your blog has been updated` });
    }
    else{
      res.status(200).send({ "msg": `You are not authorized` });
    }
  
  } catch (error) {
    res.send(error);
  }
});

//login user total post
blogRouter.get("/userTotalPost",async(req,res)=>{
  const {userID}=req.body
  try {
    const userPosts=await BlogModel.find({userID})
    let totalLikes=0
    let totalComments=0
    for (let i of userPosts) {
        totalLikes+=i.likes
        totalComments+=i.comments.length
  
    }
    // console.log(totalComments);
    res.send({"userGotTotalLikes":totalLikes,"userGotTotalComments":totalComments,"userTotalPost":userPosts.length})
    
  } catch (error) {
    res.send(error)
  }

})





module.exports = {
  blogRouter,
};
