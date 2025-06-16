import { NextFunction, Request, Response } from "express";
import HttpException from "../exceptions/httpExceptions";
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from "../utils/constants";
import { JwtPayload } from "../dto/jwt-payload";

const getToken = (req:Request) : string => {
    const token = req.headers.authorization;
    if (!token) {
        throw new HttpException(401,'Not authorized');
    }
    const tokenSplits = token.split(' ');
    if(tokenSplits.length != 2){
        throw new HttpException(401,"Invalid token");
    }
    return tokenSplits[1];
}
export const authMiddleware = (req:Request,res: Response,next: NextFunction) => {
    const token = getToken(req);
    if (!token) {
        throw new HttpException(401,'Not authorized');
    }
    try {
        const payload = jwt.verify(token,JWT_SECRET) as JwtPayload;
        req.user = payload;
        // console.log(payload);
    } catch (error) {
        throw new HttpException(401,"Invalid or expired token");   
    }
    next();
}