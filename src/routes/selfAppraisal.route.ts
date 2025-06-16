import express from "express";
import datasource from "../../db/data-source";

import {SelfAppraisalEntry} from "../entities/SelfAppraisal.entity";
import {AppraisalLead} from "../entities/AppraisalLead.entity";
import SelfAppraisalEntryRepository from "../repositories/selfAppraisal.repository";
import AppraisalLeadRepository from "../repositories/appraisalLead.repository";

import SelfAppraisalEntryService from "../services/selfAppraisal.service";
import SelfAppraisalEntryController from "../controllers/selfAppraisal.controller";

const selfAppraisalEntryRouter = express.Router();

// Repositories
const selfAppraisalEntryRepository = new SelfAppraisalEntryRepository(
  datasource.getRepository(SelfAppraisalEntry)
);
const appraisalLeadRepository = new AppraisalLeadRepository(
  datasource.getRepository(AppraisalLead)
);

// Service
const selfAppraisalEntryService = new SelfAppraisalEntryService(
  selfAppraisalEntryRepository,
  appraisalLeadRepository
);

// Controller
new SelfAppraisalEntryController(selfAppraisalEntryService, selfAppraisalEntryRouter);

export default selfAppraisalEntryRouter;
