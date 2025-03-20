import { Router } from "express";
import {createUserController,loginController,profileController,logoutController,getAllUserController}  from "../controllers/user.controller.js"; 
import { body } from "express-validator";
import { authUser } from "../middlewares/auth.middleware.js";

const router = Router();

router.post(
  "/register",
  body("email").isEmail().withMessage("Email is not valid"),
  body("password")
    .isLength({ min: 5 })
    .withMessage("Password must be at least 5 characters long"),
    createUserController // Corrected function reference
);

router.post("/login",
  body("email").isEmail().withMessage("Email is not valid"),
  body("password")
    .isLength({ min: 5 })
    .withMessage("Password must be at least 5 characters long"),
  loginController
)

router.get('/profile',authUser,profileController);

router.get('/logout',authUser,logoutController);

router.get('/all',authUser,getAllUserController);


export default router;
