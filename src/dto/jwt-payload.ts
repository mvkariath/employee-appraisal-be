import { EmployeeRole } from "../entities/employee.entity";

export class JwtPayload {
    id:number;
    name:string;
    email: string;
    role: EmployeeRole
}