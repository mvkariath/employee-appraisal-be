import { Repository } from "typeorm";
import { AppraisalLead } from "../entities/AppraisalLead.entity";
class AppraisalLeadRepository{
    constructor(private repository:Repository<AppraisalLead>) {}
    async findAllAppraisalsByLeadId(leadId: number): Promise<AppraisalLead[]> {
        return this.repository.find({
            where: {
                lead: {
                    id: leadId
                }
            },
            relations: ['appraisal', 'lead']
        });
    }




}
export default AppraisalLeadRepository;