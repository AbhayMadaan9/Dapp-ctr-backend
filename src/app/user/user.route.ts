import {Router} from "express"
import { userSignInController } from "./user.controller";

const router = Router();


router.post("/signin", userSignInController)