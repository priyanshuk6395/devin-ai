import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";
import redisClient from "../services/redis.service.js";
export const authUser = async (req, res, next) => {
    try{
        const token = req.headers.authorization.split(' ')[1] || req.cookies.token;
        if (!token) {
            return res.status(401).send("Unauthorized");
        }
        const isBlackListed = await redisClient.get(token);
        if(isBlackListed){
            return res.status(401).send("Unauthorized Token");
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);        
        req.user = await userModel.findById(decoded.id);
        next();
    }catch(err){
        res.status(401).send("Unauthorized");
    }
}