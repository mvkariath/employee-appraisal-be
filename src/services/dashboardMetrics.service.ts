import AppraisalRepository from "../repositories/appraisal.repository";
import EmployeeRepository from "../repositories/employee.repository";

class dashboardMetrics {

    constructor(
    private appraisalRepository: AppraisalRepository,
    private employeeRepositoru: EmployeeRepository,

  ) {}

    async getDashboardMetrics(userId: number, role: string) {
  switch (role) {
    case "DEVELOPER":
      return {
        currentAppraisal: await this.appraisalRepository.findCurrentAppraisalNameByEmployee(userId),
        lastAppraisal: await this.appraisalRepository.findLastCompletedAppraisalNameByEmployee(userId),
      };

    // case "LEAD":
    //   return {
    //     teamPendingSubmissions: await this.appraisalRepository.countTeamPending(userId),
    //     appraisalsToReview: await this.appraisalRepository.countTeamAppraisalsToReview(userId),
    //   };

    case "HR":
      return {
        totalEmployees: await this.employeeRepositoru.countAll(),
        completedAppraisals: await this.appraisalRepository.countCompleted(),
        pendingAppraisals: await this.appraisalRepository.countPending(),
      };

    default:
      throw new Error("Unsupported role");
  }
}
}

export default dashboardMetrics;