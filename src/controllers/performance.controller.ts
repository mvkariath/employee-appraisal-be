import { Router } from "express";
import PerformanceFactorService from "../services/perfomance-factors.services";
import  { Request,Response } from "express";
import { auditLogMiddleware } from "../middlewares/auditLog.middleware";
import { checkRole } from "../middlewares/authorization.middleware";
import { EmployeeRole } from "../entities/employee.entity";
class PerformanceController{
    constructor(private performanceService:PerformanceFactorService, router: Router) {
       
        router.put("/:id",auditLogMiddleware, this.updatePerformanceFactor.bind(this));
       
    }
     async updatePerformanceFactor(req: Request, res: Response){
  const {  competency, strengths, improvements, rating } = req.body;
 const appraisalId=Number(req.params.id);
  try {
    const result = await this.performanceService.updatePerformanceFactor(appraisalId, competency, {
      strengths,
      improvements,
      rating,
    });

    res.status(200).json({ message: "Updated successfully", data: result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
}
export default PerformanceController