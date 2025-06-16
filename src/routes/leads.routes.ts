import { Router } from "express";
import AppraisalLeadRepository from "../repositories/leads.repository";
import datasource from "../../db/data-source";

import LeadsController from "../controllers/leads.controller";
import LeadsService from "../services/leads.service";

const leadsRouter=Router();
const leadsRepository=new AppraisalLeadRepository(datasource.getRepository("AppraisalLead"));
const leadsService=new LeadsService(leadsRepository);
const leadsController = new LeadsController(leadsService, leadsRouter);
export default leadsRouter;