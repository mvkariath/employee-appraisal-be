import { Router } from "express";
import LeadsService from "../services/leads.services";

class LeadsController{
    constructor(private leadsService:LeadsService,private router:Router) {
        this.router.get('/', this.getAllAppraisalsByLeadId.bind(this));
    }
    async getAllAppraisalsByLeadId(req: any, res: any) {
        const leadId = parseInt(req.params.leadId, 10);
        if (isNaN(leadId)) {
            return res.status(400).json({ error: "Invalid lead ID" });
        }
        try {
            const appraisals = await this.leadsService.findAllAppraisalsByLeadId(leadId);
            return res.status(200).json(appraisals);
        } catch (error) {
            console.error("Error fetching appraisals:", error);
            return res.status(500).json({ error: "Internal server error" });
        }
    }
}
export default LeadsController;