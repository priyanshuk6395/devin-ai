import userModel from "../models/user.model.js";

export const createUser = async ({ email, password }) => {
      // Hash password before saving
  const user = await userModel.create({ email, password });
  return user;
};


export const getAllUser= async({userId})=>{
  const users= await userModel.find({
    _id:{$ne :userId}
  });
  return users;
}