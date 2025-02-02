import { Option, Prisma, PrismaClient, Task } from "@prisma/client"

const prismaClient = new PrismaClient();

export const findWorker = async(address: string)=>{
return await prismaClient.worker.findFirst({

    where: {
        address
    }
})
}
export const createWorker = async(worker: Prisma.WorkerCreateInput)=>{
   const createdWorker = await prismaClient.worker.create({
       data: {...worker,
         balance: { create: { pending_amount: 0, locked_amount: 0 } }
       },
    });
return createdWorker;
}
export const createTask = async(data: {task: Omit<Task, "id">, options: Array<Omit<Option, "id" | "task_id">>})=>{
   const {task, options} = data;
    await prismaClient.$transaction(async(txn)=>{
    const createdTask = await txn.task.create({
         data: task
      })
      await txn.option.createMany({
         data: options.map(option => ({ ...option, task_id: createdTask.id }))
      })
    })
    }

    export const getTask = async(userId:number, id?: number)=>{
      await prismaClient.$transaction(async(txn)=>{
         const tasks = await txn.task.findMany({
              where: {
                ...(!id? {} : { id }),
                 user_id: userId
              }
           })
        const count =   await txn.task.count({
         where: {
            ...(!id? {} : { id }),
             user_id: userId
          }
           })
           return {tasks, count}
         })
       }

       export const workerNextTask = async (userId:number) => {
         await prismaClient.task.findFirst({
            where: {
               submissions: {
                  none: {
                     worker_id: userId,
                  }
               }
            }
         })
       }