import { Request, Response, NextFunction, Router } from "express";
import AuditLogService from "../services/auditLog.service";
import HttpException from "../exceptions/httpExceptions";
import { LoggerService } from "../services/logger.service";

class AuditLogController {
  private logger = LoggerService.getInstance("AuditLogController");

  constructor(private auditLogService: AuditLogService, router: Router) {
    router.get("/", this.getAllLogs.bind(this));
    router.get("/:id", this.getLogById.bind(this));
  }

  async getAllLogs(req: Request, res: Response, next: NextFunction) {
    try {
      const logs = await this.auditLogService.getAllLogs();
      res.status(200).send(logs);
    } catch (error) {
      this.logger.error("Failed to fetch audit logs: " + error);
      next(error);
    }
  }

  async getLogById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) throw new HttpException(400, "Invalid ID");

      const log = await this.auditLogService.getLogById(id);
      res.status(200).send(log);
    } catch (error) {
      this.logger.error("Failed to fetch audit log by ID: " + error);
      next(error);
    }
  }
}

export default AuditLogController;
