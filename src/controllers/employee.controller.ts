import HttpException from "../exceptions/httpExceptions";
import EmployeeService from "../services/employee.service";
import {Request, Router, NextFunction, Response} from "express";
import { CreateEmployeeDto } from "../dto/create-employee.dto";
import { validate } from "class-validator";
import { plainToInstance } from "class-transformer";
import { checkRole } from "../middlewares/authorization.middleware";
import { EmployeeRole } from "../entities/employee.entity";
import { UpdateEmployeeDto } from "../dto/update-employee.dto";
import { LoggerService } from "../services/logger.service";
import { error } from "winston";

class EmployeeController {
    private logger = LoggerService.getInstance('EmployeeController');

    constructor(private employeeService: EmployeeService, router: Router) {
        router.post("/",checkRole([EmployeeRole.HR]), this.createEmployee.bind(this));
        router.get("/", this.getAllEmployees.bind(this));
        router.get("/:id", this.getEmployeeById.bind(this));
        router.put("/:id", checkRole([EmployeeRole.HR]),this.updateEmployee.bind(this));
        router.delete("/:id", checkRole([EmployeeRole.HR,EmployeeRole.DEVELOPER]), this.removeEmployee.bind(this));
    }

    async createEmployee (req: Request, res: Response, next: NextFunction) {
            
        try {
            const createEmployeeDto = plainToInstance(CreateEmployeeDto, req.body);
            const errors = await validate(createEmployeeDto);
            if (errors.length > 0) {
                this.logger.error(error);
                throw new HttpException(400, JSON.stringify(errors));
             }
            const savedEmployee = await this.employeeService.createEmployee(createEmployeeDto);
            this.logger.info("Employee created successfully");
            res.status(201).send(savedEmployee);
        } 
        catch (error) {
            this.logger.error("employee creation failed" + error);
            next(error);
        }
      
    }

    async getAllEmployees (req: Request, res: Response, next: NextFunction) {
        try {
            const employees = await this.employeeService.getAllEmployees();
            this.logger.info("Employee retrieved successfully");
            res.status(200).send(employees);
        } catch (error) {
            this.logger.error("employee retrieval failed" + error);
            next(error);
        }
    }

    async getEmployeeById(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);
            if(isNaN(id)) {
                this.logger.error('invalid employee id')
                throw new HttpException(400,"Invalid employee ID");
            }
            const employee = await this.employeeService.getEmployeeById(id);
            if(!employee) {
                this.logger.error('employee does not exist')
                throw new HttpException(404,"employee not found");
            }
            res.status(200).send(employee);
        } catch (error) {
            this.logger.error(error);
            next(error);
        }
        
    }

    async updateEmployee(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);
            if(isNaN(id)) {
                this.logger.error('invalid employee id')
                throw new HttpException(400,"Invalid employee ID");
            }
            const employeeDto = plainToInstance(UpdateEmployeeDto, req.body);
            const errors = await validate(employeeDto);
            if (errors.length > 0) {
                this.logger.error(JSON.stringify(errors));
                throw new HttpException(400, JSON.stringify(errors));
             }
            await this.employeeService.updateEmployeeById(id,employeeDto);
            res.status(200).send({ message: "Employee updated successfully" });
            
        } catch (error) {
            this.logger.error("employee updation failed" + error);
            next(error)
            
        }
    }

    // async deleteEmployee(req: Request, res: Response) {
    //     const id = Number(req.params.id);
    //     await this.employeeService.deleteEmployeeById(id);
    //     res.status(200).send();
    // }

    async removeEmployee(req: Request, res: Response,next: NextFunction) {
        try {
            const id = Number(req.params.id);
            if(isNaN(id)) {
                this.logger.error('invalid employee id')
                throw new HttpException(400,"Invalid employee ID");
            }
            await this.employeeService.removeEmployeeById(id);
            res.status(200).send({ message: "Employee deleted successfully" });
            
        } catch (error) {
            this.logger.error("employee deletion failed" + error);
            next(error);
        }
    }
}

export default EmployeeController;