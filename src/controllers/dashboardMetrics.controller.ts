import { Request, Response, NextFunction, Router } from "express";
import DashboardMetrics from "../services/dashboardMetrics.service";
import { LoggerService } from "../services/logger.service";
import { checkRole } from "../middlewares/authorization.middleware";
import { EmployeeRole } from "../entities/employee.entity";

class DashboardController {
  private logger = LoggerService.getInstance("DashboardController");

  constructor(
    private dashboardService: DashboardMetrics,
    router: Router
  ) {
    router.get(
      "/",
      this.getDashboardMetrics.bind(this)
    );
  }

  async getDashboardMetrics(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      const role = req.user?.role;

      if (!userId || !role) {
        this.logger.error("Missing user context");
        return res.status(400).send({ message: "Missing user context" });
      }

      const metrics = await this.dashboardService.getDashboardMetrics(userId, role);
      this.logger.info(`Fetched metrics for user ${userId} with role ${role}`);
      res.status(200).send(metrics);
    } catch (error) {
      this.logger.error("Fetching dashboard metrics failed: " + error);
      next(error);
    }
  }
}

export default DashboardController;
