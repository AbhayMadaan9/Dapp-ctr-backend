import jwt from "jsonwebtoken";

import expressAsyncHandler from "express-async-handler";
import createHttpError from "http-errors";
import { NextFunction, Request, Response } from "express";

export const authMiddlware = (publicRoutes: string[] = []) =>
    expressAsyncHandler(
        async (req: Request, res: Response, next: NextFunction) => {
            if (publicRoutes.includes(req.path)) {
                next();
                return;
            }
            const token = req.headers.authorization?.replace("Bearer ", "");

            if (!token) {
                throw createHttpError(401, {
                    message: `Invalid token`,
                });
            }

            const decodedUser = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number };
            req.userId = decodedUser.userId as number;

            next();
        },
    );
