import express from "express";
import datasource from "../../db/data-source";

import { IDPService } from "../services/idp.services";
import IDPRepository from "../repositories/idp.repository";
import { IndividualDevelopmentPlan } from "../entities/IndividualDevelopmentPlan.entity";

const idprouter = express.Router();

// Repositories
const idpRepository = new IDPRepository(
  datasource.getRepository(IndividualDevelopmentPlan)
);

// Service
const idpService = new IDPService(idpRepository);

export default idpService;
