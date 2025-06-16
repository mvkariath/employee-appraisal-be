import AppraisalLeadRepository from "../repositories/leads.repository";

class LeadsService{
    constructor(private leadsRepository:AppraisalLeadRepository) {}
    async findAllAppraisalsByLeadId(leadId: number) {
        return this.leadsRepository.findAllAppraisalsByLeadId(leadId);
    }

}
export default LeadsService;