import { Router, Request, Response, NextFunction } from "express";
import { instanceToPlain, plainToInstance } from "class-transformer";
import { validate } from "class-validator";

import AppraisalService from "../services/appraisal.service";
import { LoggerService } from "../services/logger.service";
import HttpException from "../exceptions/httpExceptions";
import { checkRole } from "../middlewares/authorization.middleware";
import { EmployeeRole } from "../entities/employee.entity";
import { auditLogMiddleware } from "../middlewares/auditLog.middleware";

class AppraisalController {
  private logger = LoggerService.getInstance("AppraisalController");

  constructor(private appraisalService: AppraisalService, router: Router) {
    router.post(
      "/",
      checkRole([EmployeeRole.HR, EmployeeRole.LEAD]),
      this.createAppraisals.bind(this)
    );
    router.post(
      "/push_to_lead/:id",
      checkRole([EmployeeRole.HR, EmployeeRole.LEAD]),
      this.pushToLead.bind(this)
    );
    router.get("/", this.getAllAppraisals.bind(this));
    router.get("/:id", this.getAppraisalById.bind(this));
    router.put(
      "/:id",
      checkRole([EmployeeRole.HR, EmployeeRole.LEAD]),
      this.updateAppraisal.bind(this)
    );
    router.get("/past-appraisals/:id", this.getPastAppraisals.bind(this));
    router.delete(
      "/:id",
      checkRole([EmployeeRole.HR]),
      this.deleteAppraisal.bind(this)
    );
  }

  async createAppraisals(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        employeeIds,
        cycle,
        content,
        remarks_by,
        current_status,
        submitted_at,
        closed_at,
      } = req.body;

      if (!Array.isArray(employeeIds) || employeeIds.length === 0) {
        throw new HttpException(400, "employeeIds must be a non-empty array");
      }
      if (!cycle || !cycle.id) {
        throw new HttpException(400, "Valid cycle must be provided");
      }

      const created = await this.appraisalService.createAppraisals({
        employeeIds,
        cycle,
        content,
        remarks_by,
        current_status,
        submitted_at,
        closed_at,
      });

      this.logger.info(`createAppraisals - SUCCESS`);
      res.status(201).json(instanceToPlain(created));
    } catch (error) {
      this.logger.error("createAppraisals - FAILED" + error);
      next(error);
    }
  }

  async getAllAppraisals(req: Request, res: Response, next: NextFunction) {
    try {
      const appraisals = await this.appraisalService.getAllAppraisals();
      res.status(200).json(appraisals);
    } catch (error) {
      this.logger.error("getAllAppraisals - FAILED" + error);
      next(error);
    }
  }
  async getPastAppraisals(req: Request, res: Response, next: NextFunction) {
    try {
      const appraisals = await this.appraisalService.getPastAppraisals(
        Number(req.params.id)
      );
      res.status(200).json(appraisals);
    } catch (error) {
      this.logger.error("getPastAppraisals - FAILED" + error);
      next(error);
    }
  }
  async pushToLead(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) throw new HttpException(400, "Invalid appraisal ID");
      const appraisal = await this.appraisalService.getAppraisalById(id);
      const updated = await this.appraisalService.pushToLead(appraisal);
      res.status(200).json({ message: "Appraisal pushed to lead", updated });
    } catch (error) {
      this.logger.error("pushToLead - FAILED" + error);
      next(error);
    }
  }
  // async getAppraisalById(req: Request, res: Response, next: NextFunction) {
  //   try {
  //     const id = Number(req.params.id);
  //     if (isNaN(id)) throw new HttpException(400, "Invalid appraisal ID");
  //     const appraisal = await this.appraisalService.getAppraisalById(id);
  //     res.status(200).json(appraisal);
  //   } catch (error) {
  //     this.logger.error("getAppraisalById - FAILED" + error);
  //     next(error);
  //   }
  // }

  async updateAppraisal(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) throw new HttpException(400, "Invalid appraisal ID");
      const updated = await this.appraisalService.updateFormData(
        id,
        req.user.id,
        req.user.role,
        req.body
      );
      res.status(200).json({ message: "Appraisal updated", updated });
    } catch (error) {
      this.logger.error("updateAppraisal - FAILED" + error);
      next(error);
    }
  }

  async deleteAppraisal(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) throw new HttpException(400, "Invalid appraisal ID");
      await this.appraisalService.deleteAppraisalById(id);
      res.status(200).json({ message: "Appraisal deleted successfully" });
    } catch (error) {
      this.logger.error("deleteAppraisal - FAILED" + error);
      next(error);
    }
  }
  async getAppraisalById(req: Request, res: Response, next: NextFunction) {
    try {
      const appraisalId = Number(req.params.id);
      if (isNaN(appraisalId))
        throw new HttpException(400, "Invalid appraisal ID");

      const appraisalForm = await this.appraisalService.fetchFormData(
        appraisalId,
        req.user.id,
        req.user.role
      );
      res.status(200).json(appraisalForm);
    } catch (error) {
      this.logger.error("getAppraisalForm - FAILED" + error);
      next(error);
    }
  }
}

export default AppraisalController;
