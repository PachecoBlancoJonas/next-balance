import { Router } from "express";
import * as userController from "../controllers/userController.js";
import verifyUser from "../middleware/verifyUser.js";

const router = Router();

router.post("/create", userController.createUser);
router.post("/login", userController.loginUser);
router.get("/logout", userController.logoutUser);

router.post("/addgocardless", verifyUser, userController.addGocardless);

router.get("/list", verifyUser, userController.getUsers);
router.get("/me", verifyUser, userController.getCurrentUser);
router.get("/gocardless", verifyUser, userController.getGocardless);
router.get("/accounts", verifyUser, userController.getAccounts);


export default router;
