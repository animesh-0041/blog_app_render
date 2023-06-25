const express=require("express")
const { connection } = require("./db")
const { userRoute } = require("./routes/user.route")
const { blogRouter } = require("./routes/blog.route")
const cors = require('cors')
const { auth } = require("./middlewares/auth.middleware")

require('dotenv').config()
const app=express()
app.use(cors())
app.use(express.json())

app.use("/api",userRoute)
app.use(auth)
app.use("/api",blogRouter)


app.listen(process.env.PORT||4000,async()=>{
    try {
        await connection
        console.log("connected to DB");
    } catch (error) {
        console.log(error);
    }
    console.log("runing at 8080");
})