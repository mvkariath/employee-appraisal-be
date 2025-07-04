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
    router.put("/:id", this.updateAppraisal.bind(this));
    router.get("/past-appraisals/:id", this.getPastAppraisals.bind(this));
    router.get("/in-cycle/:id", this.getAppraisalByCycleId.bind(this));
    router.put(
      "/status/:id",
      checkRole([EmployeeRole.HR]),
      this.updateAppraisalStatus.bind(this)
    );
    router.get(
      "/appraisal/employee/:id",
      this.getAppraisalByEmployeeId.bind(this)
    );
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
      // console.log(appraisals);

      const filtered = appraisals.map((appraisal) => {
        // console.dir(appraisal.appraisalLeads, { depth: null });

        return {
          id: appraisal.id,
          cycle_name: appraisal.cycle.name,
          employee_name: appraisal.employee.name,
          startDate: appraisal.cycle.start_date,
          endDate: appraisal.cycle.end_date,
          cycle_status: appraisal.cycle.status,
          appraisal_status: appraisal.current_status,
          idp: appraisal.idp,
          performance_factors: appraisal.performance_factors,
          self_appraisal: appraisal.self_appraisal,
          created_by: appraisal.cycle.created_by,
          closed_at: appraisal.closed_at,
          appraisalLeads: appraisal.appraisalLeads.map((al) => ({
            id: al.lead.id,
            name: al.lead.name,
          })),
        };
      });
      res.status(200).json(filtered);
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

  async updateAppraisalStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) throw new HttpException(400, "Invalid appraisal ID");
      const { status } = req.body;
      if (!status) throw new HttpException(400, "Status is required");

      const updated = await this.appraisalService.updateAppraisalStatus(
        id,
        status
      );
      res.status(200).json({ message: "Appraisal status updated", updated });
    } catch (error) {
      this.logger.error("updateAppraisalStatus - FAILED" + error);
      next(error);
    }
  }
  async getAppraisalByEmployeeId(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const employeeId = Number(req.params.id);
      if (isNaN(employeeId))
        throw new HttpException(400, "Invalid employee ID");
      const appraisals = await this.appraisalService.getAppraisalByEmployeeId(
        employeeId
      );
      // console.dir(appraisals, { depth: null });
      const filtered = appraisals.map((appraisal) => ({
        ...appraisal,
        appraisalLeads:
          appraisal.appraisalLeads?.map((al) => ({
            id: al.lead?.id,
            name: al.lead?.name,
          })) || [],
      }));

      console.log(filtered);
      res.status(200).json(filtered);

      // console.log("HELLO");
    } catch (error) {
      this.logger.error("getAppraisalByEmployeeId - FAILED" + error);
      next(error);
    }
  }

  async updateAppraisal(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      console.log(req.body)
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

  async getAppraisalByCycleId(req: Request, res: Response, next: NextFunction) {
    try {
      const appraisalCycleId = Number(req.params.id);
      if (isNaN(appraisalCycleId))
        throw new HttpException(400, "Invalid appraisal-cycle ID");

      const appraisalData = await this.appraisalService.getAppraisalByCycleId(
        appraisalCycleId
      );
      res.status(200).json(appraisalData);
    } catch (error) {
      this.logger.error("getAppraisalbycycleid - FAILED" + error);
      next(error);
    }
  }
}

export default AppraisalController;
