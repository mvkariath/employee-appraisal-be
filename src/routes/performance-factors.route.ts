import express from "express";
import datasource from "../../db/data-source";

import Per from "../repositories/appraisal.repository";
import AppraisalService from "../services/appraisal.service";
import AppraisalController from "../controllers/appraisal.controller";
import { Appraisal } from "../entities/Appraisal.entity";

import PerformanceFactorService from "../services/perfomance-factors.services";
import PerformanceFactorsRepository from "../repositories/perfomance-factors.repository";
import { PerformanceFactor } from "../entities/PerformanceFactor.entity";
import PerformanceController from "../controllers/performance.controller";

const appraisalRouter = express.Router();

// Repositories
const performanceFactorsRepository = new PerformanceFactorsRepository(
  datasource.getRepository(PerformanceFactor)
);

// Service
const performanceFactorServices = new PerformanceFactorService(
  performanceFactorsRepository
);
const performanceFacrorController = new PerformanceController(performanceFactorServices, appraisalRouter);
export {appraisalRouter as performanceFactorsRouter};
export default performanceFactorServices;
