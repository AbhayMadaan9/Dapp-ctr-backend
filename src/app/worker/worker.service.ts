import { Balance, Option, Prisma, PrismaClient, Submission, Task, Worker } from "@prisma/client"
import { AMOUNT_DECIMAL } from "../../../constant";

const prismaClient = new PrismaClient();

export const findWorker = async (address: string) => {
   return await prismaClient.worker.findFirst({
      where: {
         address
      }
   })
}
export const getWorkerById = async (id: number) => {
   return await prismaClient.worker.findFirst({
      where: {
         id
      },
      select: {
         id: true,
         address: true,
         balance: true
      }
   })
}
export const createWorker = async (worker: Prisma.WorkerCreateInput) => {
   const createdWorker = await prismaClient.worker.create({
      data: {
         ...worker,
         balance: { create: { pending_amount: 0, locked_amount: 0 } }
      },
   });
   return createdWorker;
}


export const getTask = async (userId: number, id?: number) => {
   return await prismaClient.$transaction(async (txn) => {
      const tasks = await txn.task.findMany({
         where: {
            ...(!id ? {} : { id }),
            user_id: userId
         }
      })
      const count = await txn.task.count({
         where: {
            ...(!id ? {} : { id }),
            user_id: userId
         }
      })
      return { tasks, count }
   })
}

export const workerNextTask = async (userId: number) => {
   return await prismaClient.task.findFirst({
      where: {
         done: false,
         submissions: {
            none: {
               worker_id: userId,
            }
         }
      },
      select: {
         id: true,
         title: true,
         options: true,
         amount: true,
      }
   })
}

export const createSubmission = async (data: Omit<Submission, "id">) => {


   return await prismaClient.$transaction(async (txn) => {
      const res = await txn.submission.create({
         data
      });
      await txn.balance.update({
         where: {
            worker_id: data.worker_id
         },
         data: {
            pending_amount: {
               increment: Number(data.amount) * AMOUNT_DECIMAL
            }
         }
      })
      return res;
   })
}
export const getBalance = async (workerId: number) => {
   const res = await prismaClient.balance.findFirst({
      where: {
         worker_id: workerId
      }
   });

   return res;
}


export const upateBalanceAfterPayout = async (balance: Balance) => {
   return await prismaClient.$transaction(async (txn) => {
      await txn.balance.update({
         where: {
            id: balance.id
         },
         data: {
            pending_amount: {
               decrement: balance.pending_amount
            },
            locked_amount: {
               increment: balance.pending_amount
            }
         }
      })
      await txn.payouts.create({
         data: {
            user_id: balance.worker_id,
            amount: balance.pending_amount,
            status: "PENDING",
            signature: "0sns"
         }
      })
   })
}