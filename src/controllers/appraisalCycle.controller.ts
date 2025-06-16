import { Request, Response, NextFunction, Router } from "express";
import AppraisalCycleService from "../services/appraisalCycle.service";
import { CreateAppraisalCycleDto } from "../dto/create-appraisalCycle.dto";
import { validate } from "class-validator";
import { plainToInstance } from "class-transformer";
import { LoggerService } from "../services/logger.service";
import HttpException from "../exceptions/httpExceptions";
import { checkRole } from "../middlewares/authorization.middleware";
import { EmployeeRole } from "../entities/employee.entity";
import { UpdateAppraisalCycleDto } from "../dto/update-appraisalCycle.dto";
import { auditLogMiddleware } from "../middlewares/auditLog.middleware";

class AppraisalCycleController {
    private logger = LoggerService.getInstance("AppraisalCycleController");

    constructor(private appraisalCycleService: AppraisalCycleService, router: Router) {
        router.post("/", checkRole([EmployeeRole.HR]), this.createAppraisalCycle.bind(this));
        router.get("/", this.getAllAppraisalCycles.bind(this));
        router.get("/:id", this.getAppraisalCycleById.bind(this));
        router.put("/:id", checkRole([EmployeeRole.HR]),auditLogMiddleware,this.updateCycle.bind(this));
        router.delete("/:id", checkRole([EmployeeRole.HR]), this.removeAppraisalCycle.bind(this));
    }

    async createAppraisalCycle(req: Request, res: Response, next: NextFunction) {
        try {
            const dto = plainToInstance(CreateAppraisalCycleDto, req.body);
            const errors = await validate(dto);
            if (errors.length > 0) {
                this.logger.error(JSON.stringify(errors));
                throw new HttpException(400, JSON.stringify(errors));
            }

            const created = await this.appraisalCycleService.createCycle(dto);
            this.logger.info("AppraisalCycle created successfully");
            res.status(201).send(created);
        } catch (error) {
            this.logger.error("AppraisalCycle creation failed: " + error);
            next(error);
        }
    }

    async getAllAppraisalCycles(req: Request, res: Response, next: NextFunction) {
        try {
            const list = await this.appraisalCycleService.getAllCycles();
            res.status(200).send(list);
        } catch (error) {
            this.logger.error("Failed to get AppraisalCycles: " + error);
            next(error);
        }
    }

    async getAppraisalCycleById(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);
            if (isNaN(id)) {
                throw new HttpException(400, "Invalid ID");
            }

            const cycle = await this.appraisalCycleService.getCycleById(id);
            res.status(200).send(cycle);
        } catch (error) {
            this.logger.error("Get AppraisalCycle by ID failed: " + error);
            next(error);
        }
    }

    async updateCycle(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);
            if(isNaN(id)) {
                this.logger.error('invalid appraisal cycle id')
                throw new HttpException(400,"Invalid appraisal cycle ID");
            }
            const appraisalCycleDto = plainToInstance(UpdateAppraisalCycleDto, req.body);
            const errors = await validate(appraisalCycleDto);
            if (errors.length > 0) {
                this.logger.error(JSON.stringify(errors));
                throw new HttpException(400, JSON.stringify(errors));
             }
            await this.appraisalCycleService.updateCycle(id,appraisalCycleDto);
            res.status(200).send({ message: "Appraisal cycle updated successfully" });
            
        } catch (error) {
            this.logger.error("Appraisal cycle updation failed" + error);
            next(error)
            
        }
    }

    async removeAppraisalCycle(req: Request, res: Response, next: NextFunction) {
        try {
            const id = Number(req.params.id);
            if (isNaN(id)) {
                throw new HttpException(400, "Invalid ID");
            }

            await this.appraisalCycleService.removeCycle(id);
            res.status(200).send({ message: "AppraisalCycle deleted successfully" });
        } catch (error) {
            this.logger.error("Delete AppraisalCycle failed: " + error);
            next(error);
        }
    }
}

export default AppraisalCycleController;
