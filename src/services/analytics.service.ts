import { Appraisal } from '../entities/Appraisal.entity';
import AppraisalRepository from '../repositories/appraisal.repository';
import EmployeeRepository from '../repositories/employee.repository';
import httpException from '../exceptions/httpExceptions';
import { LoggerService } from './logger.service';

class AnalyticsService {
    private logger = LoggerService.getInstance("AnalyticsService");

    constructor(
        private appraisalRepository: AppraisalRepository,
        private employeeRepository: EmployeeRepository
    ) {}

    public async generateEmployeeAnalytics(employeeId: number) {
        this.logger.info(`generateEmployeeAnalytics - START for employee ID: ${employeeId}`);

        const employee = await this.employeeRepository.findById(employeeId);
        if (!employee) {
            this.logger.error(`Employee with ID ${employeeId} not found.`);
            throw new httpException(404, `Employee with ID ${employeeId} not found.`);
        }

        const appraisals = await this.appraisalRepository.findLastNCompletedForEmployee(employeeId, 5);

        if (appraisals.length === 0) {
            this.logger.warn(`No completed appraisal data found for employee ${employeeId}.`);
            return {
                employee: { id: employee.id, name: employee.name },
                summary: { message: "No completed appraisal data found to generate analytics." },
                cycleData: [],
            };
        }

        const cycleData = this.transformAppraisalsToCycleData(appraisals);
        const summary = this.calculateSummary(cycleData);
        
        this.logger.info(`generateEmployeeAnalytics - SUCCESS for employee ID: ${employeeId}`);

        return {
            employee: { id: employee.id, name: employee.name },
            summary,
            cycleData,
        };
    }

    private transformAppraisalsToCycleData(appraisals: Appraisal[]) {
        return appraisals.map(appraisal => {
            const ratings = appraisal.performance_factors.map(pf => pf.rating);
            const averageRating = ratings.length > 0
                ? ratings.reduce((sum, current) => sum + current, 0) / ratings.length
                : 0;

            return {
                cycleName: appraisal.cycle.name,
                endDate: appraisal.cycle.end_date,
                overallRating: parseFloat(averageRating.toFixed(2)),
                competencyRatings: appraisal.performance_factors.map(pf => ({
                    competency: pf.competency,
                    rating: pf.rating,
                })),
            };
        });
    }

    private calculateSummary(cycleData: any[]) {
        const overallAverageRating = parseFloat(
            (cycleData.reduce((sum, cycle) => sum + cycle.overallRating, 0) / cycleData.length).toFixed(2)
        );

        let performanceTrend = 'Stable';
        if (cycleData.length > 1) {
            const latestRating = cycleData[0].overallRating;
            const oldestRating = cycleData[cycleData.length - 1].overallRating;
            if (latestRating > oldestRating) performanceTrend = 'Improving';
            if (latestRating < oldestRating) performanceTrend = 'Declining';
        }

        return {
            overallAverageRating,
            performanceTrend,
            appraisalsAnalyzed: cycleData.length,
        };
    }
}

export default AnalyticsService;