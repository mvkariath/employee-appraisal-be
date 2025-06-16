import express from "express";
import datasource from "../../db/data-source";
import AppraisalCycleRepository from "../repositories/appraisalCycle.repository";
import AppraisalCycle from "../entities/AppraisalCycle.entity";
import AppraisalCycleService from "../services/appraisalCycle.service";
import AppraisalCycleController from "../controllers/appraisalCycle.controller";


const appraisalCycleRouter = express.Router();
const appraisalCycleRepository = new AppraisalCycleRepository(datasource.getRepository(AppraisalCycle));
const appraisalCycleService = new AppraisalCycleService(appraisalCycleRepository);
const appraisalCycleController = new AppraisalCycleController(appraisalCycleService,appraisalCycleRouter);

export default appraisalCycleRouter;

