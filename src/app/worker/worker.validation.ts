import z from "zod"
export const createSubmissionValidation = z.object({
    taskId: z.string(),
    selection: z.string(),

})