import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    email:{
        required:true,
        type:String,
        unique:true,
        trim:true,
        minLength:[5,"Email must be at least 5 characters long"],
    },
    password:{
        required:true,
        type:String,
        select:false,
        minLength:[5,"Password must be at least 5 characters long"],
    }
});

userSchema.statics.hashPassword = async function(password){
    return await bcrypt.hash(password,10);
}

userSchema.methods.comparePassword = async function(hash){
    return await bcrypt.compare(hash,this.password);
}

userSchema.methods.generateToken = function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRES_IN
    });
}

const User=mongoose.model('user',userSchema);

export default User;