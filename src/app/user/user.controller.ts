import { Request, Response } from "express"
import jwt from "jsonwebtoken"
import { createTask, createUser, findUser } from "./user.service";
import { generatePresignedUrl } from "../common/services/aws.service";
import { createTaskValidation } from "./user.validation";
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

export function generatePreSignedInUrlController(req: Request, res: Response) {
    const userId = req.userId;
    if (!userId) {
        throw new Error("User Wallet Address is required");
    }
    return generatePresignedUrl(userId);

}
export async function createTaskController(req: Request, res: Response) {
    const parseData = createTaskValidation.safeParse(req.body);
    if (!parseData.success && parseData.error) {
        throw new Error(parseData.error.message)
    }
    const userId = req.userId;
    if (!userId) {
        throw new Error("User id is required");
    }
    await createTask({
        task: {
            title: parseData.data.title ?? "Select a option you like",
            signature: parseData.data.signature,
            amount: "1",
            user_id: userId,
            done: false
        },
        options: parseData.data.options.map((option: { imageUrl: string }) => ({
            image_url: option.imageUrl,
        }))
    });
}