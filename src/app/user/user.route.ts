import {Router} from "express"
import { createTaskController, generatePreSignedInUrlController, userSignInController } from "./user.controller";
import { authMiddlware } from "../common/middlewares/auth.middleware";

const router = Router();


router.post("/signin", userSignInController)
router.post("/presignedurl",authMiddlware, generatePreSignedInUrlController)
router.post("/task",authMiddlware, createTaskController)