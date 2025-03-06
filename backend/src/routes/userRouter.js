// backend/src/routers/userRouter.js
import { Router } from "express";
import * as userController from "../controllers/userController.js";
import verifyToken from "../middleware/verifyToken.js";

const router = Router();

router.post("/create", userController.createUser);
router.post("/login", userController.loginUser);
router.get("/list", verifyToken, userController.getUsers);


export default router;
