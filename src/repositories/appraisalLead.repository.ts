import { Repository } from "typeorm";
import { AppraisalLead } from "../entities/AppraisalLead.entity";

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
}

export default AppraisalLeadRepository;
