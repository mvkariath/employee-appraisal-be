import { Request, Response, NextFunction } from 'express';
import AnalyticsService from '../services/analytics.service';
import httpException from '../exceptions/httpExceptions';

class AnalyticsController {
    constructor(private analyticsService: AnalyticsService) {}

    public getEmployeeAnalytics = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const employeeId = parseInt(req.params.employeeId, 10);
            if (isNaN(employeeId)) {
                throw new httpException(400, 'Invalid employee ID format.');
            }

            const data = await this.analyticsService.generateEmployeeAnalytics(employeeId);
            res.status(200).json(data);
        } catch (error) {
            next(error);
        }
    };
}

export default AnalyticsController;