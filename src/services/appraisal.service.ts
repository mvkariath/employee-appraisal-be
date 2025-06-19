import { Appraisal, Status } from "../entities/Appraisal.entity";
import AppraisalRepository from "../repositories/appraisal.repository";
import httpException from "../exceptions/httpExceptions";
import { LoggerService } from "./logger.service";
import AppraisalCycle from "../entities/AppraisalCycle.entity";
import Employee, { EmployeeRole } from "../entities/employee.entity";
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
import diffArrayById from "../utils/deepDiff";
import SelfAppraisalEntryService from "./selfAppraisal.service";
import { IDPService } from "./idp.services";
import CreateSelfAppraisalDto from "../dto/create-selfAppraisal.dto";
import { EntityRepository } from "typeorm";
import accessLevelValidations from "../utils/accessLevelValidations";
function getAllowedFieldsForRole(role: string, status: string): string[] {
  const rules = {
    HR: ["idp", "self_appraisal", "performance_factors"],
    LEAD:
      status === "FEEDBACK_SUBMITTED"
        ? ["idp", "self_appraisal", "performance_factors"]
        : ["self_appraisal", "performance_factors"],
    DEVELOPER: ["self_appraisal"],
  };
  return rules[role] || [];
}

function filterFieldsByRole(input: any, allowedFields: string[]) {
  const filtered: any = {};
  for (const field of allowedFields) {
    console.log("we are going through", field, allowedFields);
    if (field in input) filtered[field] = input[field];
  }
  console.log("Filtered fields:", filtered);
  return filtered;
}
class AppraisalService {
  private logger = LoggerService.getInstance("AppraisalService");
  // Helper methods
  private initializeChangesTracker(role: string) {
    return {
      updatedBy: role,
      idpUpdated: 0,
      selfAppraisal: { created: 0, updated: 0, deleted: 0 },
      performanceFactors: { updated: 0 },
      leadsUpdated: false,
    };
  }

  private async processUpdates(
    appraisalId: number,
    sanitizedData: Partial<Appraisal>,
    existing: Appraisal,
    changes: any,
    isEmployeeAccessible: boolean,
    incomingData: Partial<Appraisal>
  ) {
    // Process IDP updates
    if (sanitizedData.idp) {
      changes.idpUpdated = await this.processIdpUpdates(
        existing.idp || [],
        sanitizedData.idp
      );
    }

    // Process lead assignment
    if (isEmployeeAccessible && incomingData.appraisalLeads) {
      changes.leadsUpdated = await this.processLeadUpdates(
        appraisalId,
        incomingData.appraisalLeads
      );
    }

    // Process self appraisal
    if (sanitizedData.self_appraisal) {
      const selfAppraisalChanges = await this.processSelfAppraisalUpdates(
        appraisalId,
        existing.self_appraisal || [],
        sanitizedData.self_appraisal
      );
      Object.assign(changes.selfAppraisal, selfAppraisalChanges);
    }

    // Process performance factors
    if (sanitizedData.performance_factors) {
      changes.performanceFactors.updated =
        await this.processPerformanceFactorUpdates(
          appraisalId,
          existing.performance_factors || [],
          sanitizedData.performance_factors
        );
    }
  }

  private async processIdpUpdates(
    existingIdps: any[],
    newIdps: any[]
  ): Promise<number> {
    const { toUpdate } = diffArrayById(existingIdps, newIdps);
    if (toUpdate.length === 0) return 0;

    for (const idp of toUpdate) {
      await this.idpService.updateIDP(idp.id, idp as IndividualDevelopmentPlan);
      this.logger.info(`Updated IDP with ID ${idp.id}`);
    }
    return toUpdate.length;
  }

  private async processLeadUpdates(
    appraisalId: number,
    newLeads: any[]
  ): Promise<boolean> {
    await this.selfAppraisalService.updateLeads(appraisalId, newLeads);
    this.logger.info(`Updated Leads for appraisal ID: ${appraisalId}`);
    return true;
  }

  private async processSelfAppraisalUpdates(
    appraisalId: number,
    existingSelfAppraisals: any[],
    newSelfAppraisals: any[]
  ): Promise<{ created: number; updated: number; deleted: number }> {
    const changes = { created: 0, updated: 0, deleted: 0 };
    const { toCreate, toUpdate, toDelete } = diffArrayById(
      existingSelfAppraisals,
      newSelfAppraisals
    );

    if (toCreate.length > 0) {
      await this.selfAppraisalService.createMultipleSelfAppraisals(
        appraisalId,
        toCreate as any
      );
      this.logger.info(`Created ${toCreate.length} self appraisal entries`);
      changes.created = toCreate.length;
    }

    if (toUpdate.length > 0) {
      for (const entry of toUpdate) {
        await this.selfAppraisalService.updateSelfAppraisal(entry.id, entry);
        this.logger.info(`Updated Self Appraisal Entry ID: ${entry.id}`);
      }
      changes.updated = toUpdate.length;
    }

    if (toDelete.length > 0) {
      for (const entry of toDelete) {
        await this.selfAppraisalService.deleteEntry(entry);
        this.logger.info(`Deleted Self Appraisal Entry ID: ${entry}`);
      }
      changes.deleted = toDelete.length;
    }

    return changes;
  }

  private async processPerformanceFactorUpdates(
    appraisalId: number,
    existingFactors: any[],
    newFactors: any[]
  ): Promise<number> {
    const { toUpdate } = diffArrayById(existingFactors, newFactors);
    if (toUpdate.length === 0) return 0;

    for (const factor of toUpdate) {
      await this.performanceFactorServices.updatePerformanceFactor(
        appraisalId,
        factor.competency,
        factor as PerformanceFactor
      );
      this.logger.info(`Updated Performance Factor ID: ${factor.id}`);
    }
    return toUpdate.length;
  }

  private logSummary(appraisalId: number, role: string, changes: any) {
    this.logger.info(
      `Appraisal [${appraisalId}] updated by ${role}. Summary: ${JSON.stringify(
        changes
      )}`
    );
  }

  constructor(
    private appraisalRepository: AppraisalRepository,
    private performanceFactorServices: PerformanceFactorService,
    private idpService: IDPService,
    private selfAppraisalService: SelfAppraisalEntryService
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
  async getPastAppraisals(id: number): Promise<Appraisal[] | null> {
    this.logger.info(`getPastAppraisals - START for employee ID: ${id}`);
    if (!id) {
      this.logger.error("Invalid employee ID");
      throw new httpException(400, "Invalid employee ID");
    }
    return await this.appraisalRepository.findPastAppraisal(id);
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

  async getAppraisalByCycleId(id: number): Promise<any> {
    this.logger.info(`getAppraisalById - ID: ${id}`);

    const appraisals = await this.appraisalRepository.findByCycleId(id);

    if (!appraisals) {
      this.logger.error("Appraisal not found");
      throw new httpException(404, "Appraisal not found");
    }

    const employeesWithAppraisal = appraisals.map((appraisal) => {
      const { password, createdAt, updatedAt, deletedAt, ...cleanEmployee } =
        appraisal.employee;

      return {
        ...cleanEmployee,
        appraisalId: appraisal.id,
        status: appraisal.current_status,
      };
    });

    return employeesWithAppraisal;
  }

  async updateAppraisalStatus(
    id: number,
    request_status: Status
  ): Promise<void> {
    this.logger.info(`updateAppraisalById - ID: ${id}`);
    const existing = await this.appraisalRepository.findById(id);
    if (!existing) {
      this.logger.error("Appraisal not found");
      throw new httpException(404, "Appraisal not found");
    }

    // here we need to check wthere the exisint and new status obeys hierecarhy as in one comes after the other and not able to jump or skip one staus
    const availableStatus = Object.values(Status);
    if (!availableStatus.includes(request_status)) {
      this.logger.error("Invalid status");
      throw new httpException(400, "Invalid status");
    } else {
      //if index of incoming is one greater that hte current one then allow
      const currentIndex = availableStatus.indexOf(existing.current_status);
      const incomingIndex = availableStatus.indexOf(request_status);
      if (Math.abs(incomingIndex - currentIndex) === 1) {
        this.logger.info("Status transition is valid");
      } else {
        this.logger.error("Invalid status transition");
        throw new httpException(400, "Invalid status transition");
      }
    }
    existing.current_status = request_status || existing.current_status;
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
    this.updateAppraisalStatus(appraisal.id, Status.INITIATE_FEEDBACK);
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
  async updateFormData(
    appraisalId: number,
    userId: number,
    role: string,
    incomingData: Partial<Appraisal> & { save_type?: "draft" | "submit" }
  ): Promise<{
    message: string;
    updatedBy: string;
    idpUpdated: number;
    selfAppraisal: { created: number; updated: number; deleted: number };
    performanceFactors: { updated: number };
    leadsUpdated: boolean;
  }> {
    const existing = await this.appraisalRepository.findById(appraisalId);
    if (!existing) throw new Error("Appraisal not found");

    const leadIds = existing.appraisalLeads?.map((lead) => lead.lead.id) || [];
    const current_status = existing.current_status;

    //save- type ? submit -- state changes service
    console.log(incomingData.save_type, "saveType");
    // Authorization check
    const { isEmployeeAccessible } = accessLevelValidations(
      role as EmployeeRole,
      existing.employee.id,
      userId,
      leadIds,
      this.logger,
      appraisalId
    );

    // Sanitize input
    const allowedFields = getAllowedFieldsForRole(
      role,
      existing.current_status
    );
    const sanitizedData = filterFieldsByRole(incomingData, allowedFields);
    this.logger.info("Sanitized Data:" + sanitizedData);

    // Initialize changes tracker
    const changes = this.initializeChangesTracker(role);

    // Process updates based on sanitized data
    await this.processUpdates(
      appraisalId,
      sanitizedData,
      existing,
      changes,
      isEmployeeAccessible,
      incomingData
    );
    //we update the state here
    if (incomingData.save_type === "submit") {
      this.logger.info(`changing status: ${appraisalId}`);
      //call the function to compute the new state and then change state
      //case -1 role is developer and then he submits his form
      if (role === "DEVELOPER" && current_status === Status.INITIATED) {
        this.updateAppraisalStatus(appraisalId, Status.SELF_APPRAISED);
      }
      //case -2 role is lead and then he submits his form
      if (role === "LEAD" && current_status === Status.INITIATE_FEEDBACK) {
        this.updateAppraisalStatus(appraisalId, Status.FEEDBACK_SUBMITTED);
      } //case -3 role is HR  or lead and then he submits his idp form;
      if (
        (role === "HR" || role === "LEAD") &&
        current_status === Status.FEEDBACK_SUBMITTED
      ) {
        this.updateAppraisalStatus(appraisalId, Status.MEETING_DONE);
      }
    }

    // Log summary
    this.logSummary(appraisalId, role, changes);

    return {
      message: "Appraisal form updated successfully",
      ...changes,
    };
  }
  async fetchFormData(appraisalId: number, userId: number, userRole: string) {
    {
      /*fetch data from the repo layer*/
    }
    const appraisal = await this.appraisalRepository.findById(appraisalId);
    if (!appraisal) {
      this.logger.error(`Appraisal with ID ${appraisalId} not found`);
      throw new httpException(
        404,
        `Appraisal with ID ${appraisalId} not found`
      );
    }
    this.logger.info(
      `fetchFormData - Appraisal ID: ${appraisalId}, Role: ${userRole}`
    );

    {
      /*Authorization logic*/
    }

    const { isEmployeeAccessible, isLeadAccessible, isHRAccessible } =
      accessLevelValidations(
        userRole as EmployeeRole,
        appraisal.employee.id,
        userId,
        appraisal.appraisalLeads?.map((lead) => lead.lead.id) || [],
        this.logger,
        appraisalId
      );

    {
      /*Prepare the base data structure*/
    }
    const baseData: any = {
      id: appraisal.id,
      current_status: appraisal.current_status,
      employee: {
        id: appraisal.employee?.id,
      },
      viewing_as: userRole,
      visible_fields: [],
    };

    if (isHRAccessible) {
      return {
        ...baseData,
        visible_fields: [
          "idp",
          "performance_factors",
          "self_appraisal",
          "appraisalLeads",
        ],
        idp: appraisal.idp?.map(
          ({ id, competency, technical_objective, technical_plan }) => ({
            id,
            competency,
            technical_objective,
            technical_plan,
          })
        ),
        performance_factors: appraisal.performance_factors?.map(
          ({ id, competency, strengths, improvements, rating }) => ({
            id,
            competency,
            strengths,
            improvements,
            rating,
          })
        ),
        self_appraisal: appraisal.self_appraisal || [],
        appraisalLeads: appraisal.appraisalLeads || [],
      };
    }

    if (isEmployeeAccessible) {
      baseData.visible_fields.push("self_appraisal", "appraisalLeads");
      baseData.self_appraisal = appraisal.self_appraisal || [];
      baseData.appraisalLeads = appraisal.appraisalLeads || [];

      return baseData;
    }

    if (isLeadAccessible) {
      baseData.visible_fields.push("self_appraisal", "performance_factors");
      baseData.self_appraisal = appraisal.self_appraisal || [];
      baseData.performance_factors = appraisal.performance_factors?.map(
        ({ id, competency, strengths, improvements, rating }) => ({
          id,
          competency,
          strengths,
          improvements,
          rating,
        })
      );
      if (appraisal.current_status === "FEEDBACK_SUBMITTED") {
        baseData.visible_fields.push("idp");
        baseData.idp = appraisal.idp?.map(
          ({ id, competency, technical_objective, technical_plan }) => ({
            id,
            competency,
            technical_objective,
            technical_plan,
          })
        );
      }
      return baseData;
    }
    return baseData;
  }
}

export default AppraisalService;
