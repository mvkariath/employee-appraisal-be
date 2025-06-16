import express from "express";
import datasource from "../../db/data-source";

import AppraisalRepository from "../repositories/appraisal.repository";
import AppraisalService from "../services/appraisal.service";
import AppraisalController from "../controllers/appraisal.controller";
import { Appraisal } from "../entities/Appraisal.entity";

const appraisalRouter = express.Router();

// Repositories
const appraisalRepository = new AppraisalRepository(datasource.getRepository(Appraisal));

// Service
const appraisalService = new AppraisalService(appraisalRepository);

// Controller
const appraisalController = new AppraisalController(appraisalService, appraisalRouter);

export default appraisalRouter;
