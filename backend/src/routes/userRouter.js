// backend/src/routers/userRouter.js
import { Router } from "express";
import {
    createUser,
    getUsers,
    loginController,
} from "../controllers/userController.js"; // Importar las funciones del controlador

const router = Router();

router.post("/", createUser);
router.get("/", getUsers);
router.post("/login", loginController);


export default router;
