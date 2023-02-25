const jwt=require("jsonwebtoken");
require("dotenv").config();
const auth=(req,res,next)=>{
    const token=req.headers.authorization;

    if(token){
        const decode=jwt.verify(token,`${process.env.key}`);
        if(decode){
            // console.log(decode)
            next();
        }
        else{
            res.status(404).send("please login");
        }
    }
    else{
        res.status(404).send("please login");
    }
}

module.exports={
    auth
};