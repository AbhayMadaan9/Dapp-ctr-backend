import {Router} from "express"
import workerRoutes from "./app/worker/worker.route"
import userRoutes from "./app/user/user.route"
const router = Router();



router.use("/worker", workerRoutes)
router.use("/user", userRoutes)
export default router;