import express from "express";
import AppraisalRepository from "../repositories/appraisal.repository";
import EmployeeRepository from "../repositories/employee.repository";
import DashboardMetrics from "../services/dashboardMetrics.service";
import DashboardController from "../controllers/dashboardMetrics.controller";
import datasource from "../../db/data-source";
import { Appraisal } from "../entities/Appraisal.entity";
import Employee from "../entities/employee.entity";

const dashboardMetricsRouter = express.Router();


const appraisalRepo = new AppraisalRepository(datasource.getRepository(Appraisal));
const employeeRepo = new EmployeeRepository(datasource.getRepository(Employee));
const dashboardService = new DashboardMetrics(appraisalRepo, employeeRepo);

new DashboardController(dashboardService, dashboardMetricsRouter);

export default dashboardMetricsRouter;
