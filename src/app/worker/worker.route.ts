import {Router} from "express"
import {  createTaskController, getNextTaskController, getTaskController, workerGeneratePreSignedInUrlController, workerSignInController } from "./worker.controller";
import { authMiddlware } from "../common/middlewares/auth.middleware";

const router = Router();


router.get("/task",authMiddlware, getNextTaskController)

router.get("/nextTask",authMiddlware, createTaskController)
router.post("/signin", workerSignInController)
router.post("/presignedurl",authMiddlware, workerGeneratePreSignedInUrlController)
router.post("/task",authMiddlware, createTaskController)