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
import diffArrayById from "../utils/deepDiff";
import SelfAppraisalEntryService from "./selfAppraisal.service";
import { IDPService } from "./idp.services";
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
    console.log("we are going through", field);
    if (field in input) filtered[field] = input[field];
  }
  return filtered;
}
class AppraisalService {
  private logger = LoggerService.getInstance("AppraisalService");

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
  async getPastAppraisals(employeeId: number): Promise<Appraisal[] | null> {
    this.logger.info(
      `getPastAppraisals - START for employee ID: ${employeeId}`
    );
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
  async updateFormData(
    appraisalId: number,
    userId: number,
    role: string,
    incomingData: Partial<Appraisal>
  ) {
    const existing = await this.appraisalRepository.findById(appraisalId);
    if (!existing) throw new Error("Appraisal not found");

    // Authorization check (assumes same logic as fetchFormData)
    const isDev = role === "DEVELOPER" && existing.employee.id === userId;
    const isLead =
      role === "LEAD" && existing.appraisalLeads?.some((l) => l.id === userId);
    const isHR = role === "HR";

    if (!isDev && !isLead && !isHR) throw new Error("Access denied");

    const allowedFields = getAllowedFieldsForRole(
      role,
      existing.current_status
    );
    const sanitizedData = filterFieldsByRole(incomingData, allowedFields);

    // IDP diff and update
    if (sanitizedData.idp) {
      const { toUpdate } = diffArrayById(existing.idp || [], sanitizedData.idp);
      // we are using the updat service because add and delete does not happen when we update the form as it is initlaly created
      if (toUpdate.length === 0) {
        this.logger.info("No IDP updates found");
      } else {
        this.logger.info(`Updating ${toUpdate.length} IDP entries`);
        //loop throught toUpdate and update each IDP
        for (const idp of toUpdate) {
          const updatedIdp = await this.idpService.updateIDP(
            idp.id,
            idp as IndividualDevelopmentPlan
          );
          this.logger.info(`Updated IDP with ID ${updatedIdp.id}`);
        }
      }

      // Self Appraisal
      if (sanitizedData.self_appraisal) {
        const { toCreate, toUpdate, toDelete } = diffArrayById(
          existing.self_appraisal || [],
          sanitizedData.self_appraisal
        );

        //for all add update and delete operations loop trouh the aray please
        if (
          toCreate.length === 0 &&
          toUpdate.length === 0 &&
          toDelete.length === 0
        ) {
          this.logger.info("No Self Appraisal updates found");
        } else {
          this.logger.info(
            `Self Appraisal updates - Create: ${toCreate.length}, Update: ${toUpdate.length}, Delete: ${toDelete.length}`
          );
        }
        // Create new self appraisals
        if (toCreate.length > 0) {
          this.logger.info(`Creating ${toCreate.length} new self appraisals`);
          for (const entry of toCreate) {
            const newEntry =
              await this.selfAppraisalService.createSelfAppraisal(
                entry as any // Assuming entry is compatible with CreateSelfAppraisalDto
              );
            this.logger.info(`Created Self Appraisal Entry ID: ${newEntry.id}`);
          }
        }
        // Update existing self appraisals
        if (toUpdate.length > 0) {
          this.logger.info(`Updating ${toUpdate.length} self appraisals`);
          for (const entry of toUpdate) {
            const updatedEntry = await this.selfAppraisalService.updateEntry(
              entry.id,
              entry as any // Assuming entry is compatible with UpdateSelfAppraisalDto
            );
            this.logger.info(`Updated Self Appraisal Entry ID: ${entry.id}`);
          }
        }
        if (toDelete.length > 0) {
          this.logger.info(`Deleting ${toDelete.length} self appraisals`);
          for (const entry of toDelete) {
            await this.selfAppraisalService.deleteEntry(entry);
            this.logger.info(`Updated Self Appraisal Entry ID: ${entry}`);
          }
        }
      }

      // Performance Factors
      if (sanitizedData.performance_factors) {
        const { toCreate, toUpdate, toDelete } = diffArrayById(
          existing.performance_factors || [],
          sanitizedData.performance_factors
        );
        //do the same as self appraisal
        if (toUpdate.length === 0) {
          this.logger.info("No Performance Factor updates found");
        } else {
          this.logger.info(`Updating ${toUpdate.length} performance factors`);
          for (const factor of toUpdate) {
            const updatedFactor =
              await this.performanceFactorServices.updatePerformanceFactor(
                appraisalId,
                factor.competency,
                factor as PerformanceFactor
              );
            this.logger.info(
              `Updated Performance Factor ID: ${updatedFactor.id}`
            );
          }
        }
      }
    }

    return { message: "Form data updated successfully" };
  }
  async fetchFormData(appraisalId: number, userId: number, userRole: string) {
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

    //check if the user has the access to view the form
    const isEmployeeAccessible =
      appraisal.employee?.id === userId && userRole === "DEVELOPER";
    const isLeadAccessible =
      appraisal.appraisalLeads?.some((lead) => lead.id === userId) &&
      userRole === "LEAD";
    const isHRAccessible = userRole === "HR";
    if (!isEmployeeAccessible && !isLeadAccessible && !isHRAccessible) {
      this.logger.error(
        `fetchFormData - ACCESS DENIED: Appraisal ID: ${appraisalId}, User ID: ${userId}, Role: ${userRole}`
      );
      throw new httpException(403, "Access denied");
    }

    const isHR = userRole === "HR";
    const isLead = userRole === "LEAD";
    const isDev = userRole === "DEVELOPER";

    const baseData: any = {
      id: appraisal.id,
      current_status: appraisal.current_status,
      employee: {
        employeeId: appraisal.employee?.employeeId,
      },
      viewing_as: userRole,
      visible_fields: [],
    };

    if (isHR) {
      // HR sees everything
      return {
        ...baseData,
        visible_fields: ["idp", "performance_factors", "self_appraisal"],
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
      };
    }

    if (isDev) {
      baseData.visible_fields.push("self_appraisal");
      baseData.self_appraisal = appraisal.self_appraisal || [];
      return baseData;
    }

    if (isLead) {
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

    // Default fallback (e.g., Lead in INITIATED phase, etc.)
    return baseData;
  }
}

export default AppraisalService;
