import { Request, Response } from "express"
import jwt from "jsonwebtoken"
import { createUser, findUser } from "./user.service";
export async function userSignInController(req: Request, res: Response) {
    const hardcodedAddress = "0x2546BcD3c84621e976D8185a91A922aE77ECEc30";
    const existingUser = await findUser(hardcodedAddress);
    const jwt_secret = process.env.JWT_SECRET ?? "secret"
    if (existingUser) {
        const token = jwt.sign({
            userId: existingUser.id
        }, jwt_secret);
        res.json({
            token
        })
    }
    else {
        const user = await createUser({ address: hardcodedAddress })
        const token = jwt.sign({
            userId: user.id
        }, jwt_secret);
        res.json({
            token
        })
    }
}