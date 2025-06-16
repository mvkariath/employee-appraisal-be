import AppraisalCycle from "../entities/AppraisalCycle.entity";
import {Appraisal} from "../entities/Appraisal.entity";
import Employee from "../entities/employee.entity";

export const entityMap: Record<string, any> = {
  appraisalCycle: AppraisalCycle,
  appraisal: Appraisal,
  employee: Employee,
  // Add others as needed
};
