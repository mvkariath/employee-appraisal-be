import { NextFunction, Request, Response } from "express";
import { EmployeeRole } from "../entities/employee.entity";
import HttpException from "../exceptions/httpExceptions";

export const checkRole = (allowedRoles: EmployeeRole[]) => {
    return (req: Request, res: Response,next: NextFunction) => {
        const role = req.user?.role;
        if(! allowedRoles.includes(role)) {
            throw new HttpException (401,"User has no previlage to access this resource");
        }
        next();
    } 
}