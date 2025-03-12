import { Router } from "express";
import * as userController from "../controllers/userController.js";
import verifyToken from "../middleware/verifyToken.js";

const router = Router();

router.post("/create", userController.createUser);
router.post("/addgocardless", verifyToken, userController.addGocardless);

router.post("/login", userController.loginUser);
router.get("/logout", userController.logoutUser);

router.get("/list", verifyToken, userController.getUsers);
router.get("/me", verifyToken, userController.getCurrentUser);
router.get("/gocardless", verifyToken, userController.getGocardless);


export default router;
