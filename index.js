const  {connection,UserModel}=require("./model/db");
const express=require("express");
const cors=require("cors");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const { auth } = require("./middlewares/tokenauth");
const app=express();
app.use(express.json());
app.use(cors({origin:"*"}));

app.get("/",async(req,res)=>{
    try{
        res.status(200).send("welcome to authentication app")
    }
    catch(err){
       res.status(404).send({"msg":"error 404"})
    }
})

app.get("/users",async(req,res)=>{
        try{
            const users=await UserModel.find();
            res.status(200).send(users)
        }
        catch(err){
            res.status(404).send({"msg":"error 404"})
         }
})

app.post("/register",async(req,res)=>{
    const {Profilepicture,Name,Bio,Phone,Email,Password}=req.body;
    try{
          bcrypt.hash(Password,5,async(err,newpass)=>{
            if(err){
                console.log(err)
                res.status(404).send({"msg":"error 404"});
            }
            else{
                const user=new UserModel({Profilepicture,Name,Bio,Phone,Email,Password:newpass});
                await user.save();
                res.status(200).send({"msg":"registered"})
            }
          })
    }
    catch(err){
        res.status(404).send({"msg":"error 404"});
        console.log(err)
    }
})



app.post("/login",async(req,res)=>{
    const {Email,Password}=req.body;

    try{
        const user=await UserModel.find({Email});
        const hashedpass=user[0].Password
        if(user.length>0){
            bcrypt.compare(Password,hashedpass,(err,result)=>{
                if(result){
                    const token=jwt.sign({course:process.env.course},process.env.key);
                    res.send({"msg":"login","id":user[0]._id,"token":token,"name":user[0].Name})
                }
                else{
                    res.status(404).send({"msg":"wrong-credentials"});
                }
            })
        }
        else{
            res.status(404).send({"msg":"wrong-credentials"});
        }
    }
    catch(err){
        res.status(404).send({"msg":"error 404"});
        console.log(err)
    }
})

app.use(auth);

app.get("/userdata/:id",async(req,res)=>{
    const id=req.params.id;
    
    try{
        const user=await UserModel.find({_id:id});
        res.status(200).send(user)
    }
    catch(err){
        res.status(404).send({"msg":"error 404"});
        console.log(err)
    }
});

app.patch("/userdata/:id",async(req,res)=>{
    const id=req.params.id;
    const payload=req.body;
    try{
        const user=await UserModel.findByIdAndUpdate({_id:id},payload);
        res.status(200).send(user)
    }
    catch(err){
        res.status(404).send({"msg":"error 404"});
        console.log(err)
    }
})

app.listen(4500,async()=>{
    try{
        await connection;
        console.log("coonected to db")
    }
    catch(err){
       res.status(404).send({"msg":"error 404"})
    }
    console.log("server running")
})
