import {Router} from "express"
import { getNextTaskController, workerSignInController, createSubmissionsController, getBalanceController, createPayoutController } from "./worker.controller";
import { authMiddlware } from "../common/middlewares/auth.middleware";

const router = Router();



router.get("/nextTask",authMiddlware, getNextTaskController)
router.post("/submissions",authMiddlware, createSubmissionsController)
router.get("/balance",authMiddlware, getBalanceController)
router.post("/payout",authMiddlware, createPayoutController)
router.post("/signin", workerSignInController)

export default router;