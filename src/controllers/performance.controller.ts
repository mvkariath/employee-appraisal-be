import { Router } from "express";
import PerformanceFactorService from "../services/perfomance-factors.services";
import  { Request,Response } from "express";
class PerformanceController{
    constructor(private performanceService:PerformanceFactorService, router: Router) {
       
        router.put("/", this.updatePerformanceFactor.bind(this));
       
    }
     async updatePerformanceFactor(req: Request, res: Response){
  const { appraisalId, competency, strengths, improvements, rating } = req.body;

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