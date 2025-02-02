import { PrismaClient, User } from "@prisma/client"

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