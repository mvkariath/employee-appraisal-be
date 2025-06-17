import express from "express";
import datasource from "../../db/data-source";
import AppraisalCycleRepository from "../repositories/appraisalCycle.repository";
import AppraisalCycle from "../entities/AppraisalCycle.entity";
import AppraisalCycleService from "../services/appraisalCycle.service";
import AppraisalCycleController from "../controllers/appraisalCycle.controller";
import AppraisalService from "../services/appraisal.service";
import AppraisalRepository from "../repositories/appraisal.repository";
import { Appraisal } from "../entities/Appraisal.entity";
import performanceFactorServices from "./performance-factors.route";
import IDPRepository from "../repositories/idp.repository";
import { IndividualDevelopmentPlan } from "../entities/IndividualDevelopmentPlan.entity";
import SelfAppraisalEntryRepository from "../repositories/selfAppraisal.repository";
import { SelfAppraisalEntry } from "../entities/SelfAppraisal.entity";
import AppraisalLeadRepository from "../repositories/appraisalLead.repository";
import { AppraisalLead } from "../entities/AppraisalLead.entity";
import SelfAppraisalEntryService from "../services/selfAppraisal.service";
import { IDPService } from "../services/idp.services";


const appraisalCycleRouter = express.Router();
const appraisalCycleRepository = new AppraisalCycleRepository(datasource.getRepository(AppraisalCycle));

const appraisalRepository = new AppraisalRepository(
  datasource.getRepository(Appraisal)
);

const idpRepository = new IDPRepository(
  datasource.getRepository(IndividualDevelopmentPlan)
);

const selfAppraisalEntryRepository = new SelfAppraisalEntryRepository(
  datasource.getRepository(SelfAppraisalEntry)
);
const appraisalLeadRepository = new AppraisalLeadRepository(
  datasource.getRepository(AppraisalLead)
);

const selfAppraisalEntryService = new SelfAppraisalEntryService(
  selfAppraisalEntryRepository,
  appraisalLeadRepository
);

const idpService = new IDPService(idpRepository);


const appraisalService = new AppraisalService(
  appraisalRepository,
  performanceFactorServices,
  idpService,selfAppraisalEntryService
);
const appraisalCycleService = new AppraisalCycleService(appraisalCycleRepository,appraisalService);
const appraisalCycleController = new AppraisalCycleController(appraisalCycleService,appraisalCycleRouter);

export default appraisalCycleRouter;

