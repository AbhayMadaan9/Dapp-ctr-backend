import { Request, Response } from "express";
import { generatePresignedUrl } from "../common/services/aws.service";
import { createTaskValidation } from "./worker.validation";
import { createTask, createWorker, findWorker, getTask, workerNextTask } from "./worker.service";
import jwt from "jsonwebtoken"
export async function workerSignInController(req: Request, res: Response) {
    const hardcodedAddress = "0x2546BcD3c84621e976D8185a91A922aE77ECEc30";
    const existingWorker = await findWorker(hardcodedAddress);
    const jwt_secret = process.env.JWT_SECRET ?? "secret"
    if (existingWorker) {
        const token = jwt.sign({
            userId: existingWorker.id
        }, jwt_secret);
        res.json({
            token
        })
    }
    else {
        const worker = await createWorker({ address: hardcodedAddress })
        const token = jwt.sign({
            userId: worker.id
        }, jwt_secret);
        res.json({
            token
        })
    }
}
export function workerGeneratePreSignedInUrlController(req: Request, res: Response) {
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
        },
        options: parseData.data.options.map((option: { imageUrl: string }) => ({
            image_url: option.imageUrl,
        }))
    });
}
export async function getNextTaskController(req: Request, res: Response) {
   const userId = req.userId as number;
   //find the task for the worker where there is no submission
   const task = workerNextTask(userId)

}

export async function getTaskController(req: Request, res: Response) {
    const taskId = req.query.taskId;
    if(!taskId)
    {
        throw new Error("TaskId is required")
    }
    const userId = req.userId;
    if (!userId) {
        throw new Error("User id is required");
    }
   return getTask(Number(taskId))
}