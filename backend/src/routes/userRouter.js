import { Router } from "express";
import * as userController from "../controllers/userController.js";
import verifyUser from "../middleware/verifyUser.js";

const router = Router();

router.post("/create", userController.createUser);
router.post("/addgocardless", verifyUser, userController.addGocardless);

router.post("/login", userController.loginUser);
router.get("/logout", userController.logoutUser);

router.get("/list", verifyUser, userController.getUsers);
router.get("/me", verifyUser, userController.getCurrentUser);
router.get("/gocardless", verifyUser, userController.getGocardless);

export default router;
