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


const appraisalCycleRouter = express.Router();
const appraisalCycleRepository = new AppraisalCycleRepository(datasource.getRepository(AppraisalCycle));

const appraisalRepository = new AppraisalRepository(
  datasource.getRepository(Appraisal)
);
const appraisalService = new AppraisalService(
  appraisalRepository,
  performanceFactorServices
);
const appraisalCycleService = new AppraisalCycleService(appraisalCycleRepository,appraisalService);
const appraisalCycleController = new AppraisalCycleController(appraisalCycleService,appraisalCycleRouter);

export default appraisalCycleRouter;

