import { Repository,In } from "typeorm";
import { AppraisalLead } from "../entities/AppraisalLead.entity";
import { Status } from "../entities/AppraisalCycle.entity";
class AppraisalLeadRepository {
  constructor(private repository: Repository<AppraisalLead>) {}

  async create(lead: AppraisalLead): Promise<AppraisalLead> {
    return this.repository.save(lead);
  }

  async createMany(leads: AppraisalLead[]): Promise<AppraisalLead[]> {
    return this.repository.save(leads);
  }

  async deleteByAppraisalId(appraisalId: number): Promise<void> {
    await this.repository.delete({ appraisal: { id: appraisalId } });
  }
async findAllAppraisalsByLeadId(leadId: number): Promise<AppraisalLead[]> {
  return this.repository.find({
    where: {
      lead: { id: leadId },
      appraisal:{
        cycle:{
           status: In([Status.IN_PROGRESS, Status.INITIATED]),
          

      }
    }},
    relations: [
      'appraisal',
            // ← property name is 'self_appraisal'
      'appraisal.performance_factors',    // ← property name is 'performance_factors'
    ],
  });
}
}
export default AppraisalLeadRepository
