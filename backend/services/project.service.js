import mongoose from "mongoose";
import projectModel from "../models/project.model.js";

export const createProject = async ({ name, user }) => {
  try {
    const project = await projectModel.create({ name: name, users: [user] });
    return project;
  } catch (error) {
    throw new Error("Failed to create project");
  }
};

export const getAllProject = async (userId) => {
  try {
    const allProjects = projectModel.find({ users: userId });
    return allProjects;
  } catch (err) {
    throw new Error("Failed to fetch list");
  }
};

export const addUsersToProject = async ({ projectId, users, userId }) => {
  try {
    const project = await projectModel.findOne({
      _id: projectId,
      users: userId,
    });
    if (!project) {
      throw new Error("User not belong to this project");
    }
    const updatedProject = await projectModel.findOneAndUpdate(
      {
        _id: projectId,
      },
      {
        $addToSet: {
          users: {
            $each: users,
          },
        },
      },
      {
        new: true,
      }
    );

    return updatedProject;
  } catch (err) {
    throw new Error("Failed to add user");
  }
};

export const getProjectById = async({projectId})=>{
  if(!projectId){
    throw new Error("projectId is required")
  }
  if(!mongoose.Types.ObjectId.isValid(projectId)){
    throw new Error("Invalid projectId");
  }

  const project = await projectModel.findOne({_id:projectId}).populate('users','email');
  if(!project){
    throw new Error("Invalid Project");
  }
  return project;

}

export const updateFileTree= async({projectId,fileTree})=>{
  if(!projectId){
    throw new Error('projectId is required');
  }
  if(!mongoose.Types.ObjectId.isValid(projectId)){
    throw new Error('Invalid projectId')
  }
  if(!fileTree){
    throw new Error('FileTree is required');
  }

  const project= await projectModel.findOneAndUpdate({_id:projectId},
    {fileTree},
    {new:true}
  )
  return project;
}