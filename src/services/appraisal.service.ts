import { Appraisal, Status } from "../entities/Appraisal.entity";
import AppraisalRepository from "../repositories/appraisal.repository";
import httpException from "../exceptions/httpExceptions";
import { LoggerService } from "./logger.service";
import AppraisalCycle from "../entities/AppraisalCycle.entity";
import Employee from "../entities/employee.entity";
import {
  IndividualDevelopmentPlan,
  IDP_Competency,
} from "../entities/IndividualDevelopmentPlan.entity";
import PerformanceFactorsRepository from "../repositories/perfomance-factors.repository";
import PerformanceFactorService from "./perfomance-factors.services";
import {
  Competency,
  PerformanceFactor,
} from "../entities/PerformanceFactor.entity";

class AppraisalService {
  private logger = LoggerService.getInstance("AppraisalService");

  constructor(
    private appraisalRepository: AppraisalRepository,
    private performanceFactorServices: PerformanceFactorService
  ) {}

  async createAppraisals(data: {
    employeeIds: number[];
    cycle: AppraisalCycle;
    content?: string;
    remarks_by?: "HR" | "Lead";
    current_status?: Status;
    submitted_at?: Date;
    closed_at?: Date;
  }): Promise<Appraisal[]> {
    this.logger.info("createAppraisals - START");

    if (!data.employeeIds || data.employeeIds.length === 0 || !data.cycle) {
      this.logger.error("Invalid appraisal data - missing required fields");
      throw new httpException(400, "Missing required fields");
    }

    const createdAppraisals: Appraisal[] = [];

    for (const employeeId of data.employeeIds) {
      const appraisal = new Appraisal();
      appraisal.employee = { id: employeeId } as Employee;
      appraisal.cycle = data.cycle;
      appraisal.content = data.content || null;
      appraisal.remarks_by = data.remarks_by || null;
      appraisal.current_status = data.current_status ?? Status.NA;
      appraisal.submitted_at = data.submitted_at ?? null;
      appraisal.closed_at = data.closed_at ?? null;
      appraisal.self_appraisal = [];
      appraisal.performance_factors = [];
      const idps: IndividualDevelopmentPlan[] = Object.values(
        IDP_Competency
      ).map((competency) => {
        const idp = new IndividualDevelopmentPlan();
        idp.competency = competency;
        idp.technical_objective = ""; // start empty
        idp.technical_plan = "";
        idp.appraisal = appraisal;
        return idp;
      });

      appraisal.idp = idps;
      const savedAppraisal = await this.appraisalRepository.create(appraisal);
      createdAppraisals.push(savedAppraisal);
    }

    this.logger.info(
      `createAppraisals - SUCCESS: Created ${createdAppraisals.length} appraisals`
    );
    return createdAppraisals;
  }

  async getAllAppraisals(): Promise<Appraisal[]> {
    this.logger.info("getAllAppraisals - START");
    return await this.appraisalRepository.findAll();
  }
 async getPastAppraisals(employeeId: number): Promise<Appraisal[] |null> {
    this.logger.info(`getPastAppraisals - START for employee ID: ${employeeId}`);
    if (!employeeId) {
      this.logger.error("Invalid employee ID");
      throw new httpException(400, "Invalid employee ID");
    }
    return await this.appraisalRepository.findPastAppraisal(employeeId);
 }
  async getAppraisalById(id: number): Promise<Appraisal> {
    this.logger.info(`getAppraisalById - ID: ${id}`);
    const appraisal = await this.appraisalRepository.findById(id);
    if (!appraisal) {
      this.logger.error("Appraisal not found");
      throw new httpException(404, "Appraisal not found");
    }
    return appraisal;
  }

  async updateAppraisalById(
    id: number,
    data: Partial<Appraisal>
  ): Promise<void> {
    this.logger.info(`updateAppraisalById - ID: ${id}`);
    const existing = await this.appraisalRepository.findById(id);
    if (!existing) {
      this.logger.error("Appraisal not found");
      throw new httpException(404, "Appraisal not found");
    }

    Object.assign(existing, data);
    await this.appraisalRepository.update(id, existing);
    this.logger.info(`Appraisal updated: ${id}`);
  }
  async pushToLead(appraisal: Appraisal): Promise<void> {
    this.logger.info(`pushToLead - START: ID = ${appraisal.id}`);
    for (let competency of Object.values(Competency)) {
      const newPerformanceFactor = new PerformanceFactor();
      newPerformanceFactor.appraisal = appraisal as Appraisal;
      newPerformanceFactor.competency = competency;
      newPerformanceFactor.strengths = "";
      newPerformanceFactor.improvements = "";
      newPerformanceFactor.rating = 0;

      await this.performanceFactorServices.createPerformanceFactor(
        newPerformanceFactor
      );
    }
  }
 
  async deleteAppraisalById(id: number): Promise<void> {
    this.logger.info(`removeAppraisalById - START: ID = ${id}`);
    const existingAppraisal = await this.appraisalRepository.findById(id);
    if (existingAppraisal) {
      await this.appraisalRepository.remove(existingAppraisal);
      this.logger.info(
        `removeAppraisalById - SUCCESS: Removed appraisal with ID ${id}`
      );
    } else {
      this.logger.error(
        `removeAppraisalById - NOT FOUND: appraisal with ID ${id}`
      );
      throw new httpException(400, "Invalid appraisal ID");
    }
  }
}

export default AppraisalService;
