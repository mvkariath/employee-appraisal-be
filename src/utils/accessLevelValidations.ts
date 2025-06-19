import Employee, { EmployeeRole } from "../entities/employee.entity";
import HttpException from "../exceptions/httpExceptions"; // Adjust the import path as needed
import { LoggerService } from "../services/logger.service";

export function accessLevelValidations(
  userRole: EmployeeRole,
  appraisalUserId: number,
  requestUserId: number,
  leadIds: number[],
  logger?: LoggerService,
  appraisalId?: number
): {
  isEmployeeAccessible: boolean;
  isLeadAccessible: boolean;
  isHRAccessible: boolean;
} {
  const isEmployeeAccessible =
    appraisalUserId === requestUserId && userRole === "DEVELOPER";
  const isLeadAccessible =
    leadIds.includes(requestUserId) && userRole === "LEAD";
  const isHRAccessible = userRole === "HR";

  if (userRole === "LEAD" && !isLeadAccessible) {
    logger?.info(
      `updateFormData - ACCESS DENIED: Appraisal ID: ${appraisalId}, User ID: ${requestUserId}, Role: ${userRole}`
    );
    throw new HttpException(
      403,
      "This form is not yet accessible to this lead"
    );
  }

  // No access at all
  if (!isEmployeeAccessible && !isLeadAccessible && !isHRAccessible) {
    logger?.info(
      `fetchFormData - ACCESS DENIED: Appraisal ID: ${appraisalId}, User ID: ${requestUserId}, Role: ${userRole}`
    );
    throw new HttpException(403, "Access denied");
  }

  return { isEmployeeAccessible, isLeadAccessible, isHRAccessible };
}

export default accessLevelValidations;
