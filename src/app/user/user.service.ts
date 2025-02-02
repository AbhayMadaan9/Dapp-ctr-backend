import { Option, PrismaClient, Task, User } from "@prisma/client"

const prismaClient = new PrismaClient();
export const findUser = async(address: string)=>{
return await prismaClient.user.findFirst({

    where: {
        address
    }
})
}
export const createUser = async(user: Omit<User, "id">)=>{
    return await prismaClient.user.create({
       data:user
    })
    }


    export const createTask = async (data: { task: Omit<Task, "id">, options: Array<Omit<Option, "id" | "task_id">> }) => {
       const { task, options } = data;
       await prismaClient.$transaction(async (txn) => {
          const createdTask = await txn.task.create({
             data: task
          })
          await txn.option.createMany({
             data: options.map(option => ({ ...option, task_id: createdTask.id }))
          })
       })
    }