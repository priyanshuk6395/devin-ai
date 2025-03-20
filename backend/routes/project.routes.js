import { Router } from "express";
import {
  createProjectController,
  getProjectController,
  addUserController,
  getProjectByIdController,
  updateFileTreeController
} from "../controllers/project.controller.js";
import { body } from "express-validator";
import { authUser } from "../middlewares/auth.middleware.js";

const router = Router();

router.post(
  "/create",
  body("name").isString().withMessage("Invalid Name"),
  authUser,
  createProjectController
);

router.get("/all", authUser, getProjectController);

router.put(
  "/add-user",
  authUser,
  body("projectId").isString().withMessage("Project ID is required"),
  body("users")
    .isArray({ min: 1 })
    .withMessage("Users must be an array of strings")
    .bail()
    .custom((users) => users.every((user) => typeof user === "string"))
    .withMessage("Each user must be a string"),
  addUserController
);

router.get("/get-project/:projectId", authUser, getProjectByIdController);

router.put(
  "/update-file-tree",
  authUser,
  body("projectId").isString().withMessage("Invalid project Id"),
  body('fileTree').isObject().withMessage("File Tree is required"),
  updateFileTreeController
);

export default router;
