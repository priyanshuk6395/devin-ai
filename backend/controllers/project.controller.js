import mongoose from "mongoose";
import {
  createProject,
  getAllProject,
  addUsersToProject,
  getProjectById,
  updateFileTree,
} from "../services/project.service.js";
import { validationResult } from "express-validator";

export const createProjectController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const name = req.body.name;
    const user = req.user._id;

    if (!name || !user) {
      return res.status(401).send("Project name is required.");
    }

    const project = await createProject({ name, user });
    if (!project) {
      return res.status(400).send("Project name must be unique.");
    }

    res.status(201).json(project);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getProjectController = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    if (!loggedInUserId) {
      return res.status(401).send("Unauthorized");
    }

    const allProjects = await getAllProject(loggedInUserId);
    res.status(200).json({ projects: allProjects });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const addUserController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(403).json({ errors: errors.array() });
  }
  try {
    const { projectId, users } = req.body;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).send("Invalid project ID.");
    }

    if (
      !Array.isArray(users) ||
      users.some((id) => !mongoose.Types.ObjectId.isValid(id))
    ) {
      return res.status(400).send("Invalid user ID(s) in users array.");
    }

    const updatedProject = await addUsersToProject({
      projectId,
      users,
      userId,
    });

    res.status(201).json({ project: updatedProject });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getProjectByIdController = async (req, res) => {
  const { projectId } = req.params;
  try {
    const project = await getProjectById({ projectId });
    return res.status(200).json({ project });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

export const updateFileTreeController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(500).json({ errors: errors.array() });
  }
  try {
    const { projectId, fileTree } = req.body;
    const project = await updateFileTree({ projectId, fileTree });
    return res.status(200).json({ project });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
