import { Request, Response } from "express";
import { createSubmission, createWorker, findWorker, getBalance, getTask, getWorkerById, upateBalanceAfterPayout, workerNextTask } from "./worker.service";
import jwt from "jsonwebtoken"
import { createSubmissionValidation } from "./worker.validation";
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

export async function getNextTaskController(req: Request, res: Response) {
    const userId = req.userId as number;
    //find the task for the worker where there is no submission
    const task = await workerNextTask(userId);
    if (!task) {
        throw new Error("No task found for this worker")
    }
    res.status(200).json(task)

}

export async function getTaskController(req: Request, res: Response) {
    const taskId = req.query.taskId;
    if (!taskId) {
        throw new Error("TaskId is required")
    }
    const userId = req.userId;
    if (!userId) {
        throw new Error("User id is required");
    }
    return getTask(Number(taskId))
}

export async function createSubmissionsController(req: Request, res: Response) {

    const userId = req.userId;
    if (!userId) {
        throw new Error("User id is required");
    }
    const parsedBody = createSubmissionValidation.safeParse
        (req.body)
    if (!parsedBody.success && parsedBody.error) {
        throw new Error(parsedBody.error.message)
    }
    const task = await workerNextTask(userId);
    if (!task || task.id !== Number(parsedBody.data.taskId)) {
        throw new Error("Invalid task id")
    }
    await createSubmission({
        worker_id: userId, task_id: task.id, amount: (Number(task.amount) / 100).toString(),
        option_id: Number(parsedBody.data.selection)
    })
    res.send("Submission created successfully ")
}

export async function getBalanceController(req: Request, res: Response) {

    const userId = req.userId;
    if (!userId) {
        throw new Error("User id is required");
    }

    const balance = await getBalance(userId);
    res.json(balance)
}
export async function createPayoutController(req: Request, res: Response) {

    const userId = req.userId;
    if (!userId) {
        throw new Error("User id is required");
    }

    const workerBalance = await getBalance(userId);
    if (!workerBalance) { throw new Error("Worker account not found"); }

    await upateBalanceAfterPayout(workerBalance)

}

