import AppraisalCycle from "../entities/AppraisalCycle.entity";
import {Appraisal} from "../entities/Appraisal.entity";
import Employee from "../entities/employee.entity";
import { PerformanceFactor } from "../entities/PerformanceFactor.entity";

export const entityMap: Record<string, any> = {
  appraisalCycle: AppraisalCycle,
  appraisal: Appraisal,
  employee: Employee,
  performance_factors:PerformanceFactor
  // Add others as needed
};
