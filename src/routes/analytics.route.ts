import { Router } from 'express';
import datasource from '../../db/data-source';

import { Appraisal } from '../entities/Appraisal.entity';
import Employee, { EmployeeRole } from '../entities/employee.entity'; // Import EmployeeRole enum

import AppraisalRepository from '../repositories/appraisal.repository';
import EmployeeRepository from '../repositories/employee.repository';
import AnalyticsService from '../services/analytics.service';
import AnalyticsController from '../controllers/analytics.controller';

import { checkRole } from '../middlewares/authorization.middleware'; // Correctly import checkRole

const appraisalRepository = new AppraisalRepository(datasource.getRepository(Appraisal));
const employeeRepository = new EmployeeRepository(datasource.getRepository(Employee));

const analyticsService = new AnalyticsService(appraisalRepository, employeeRepository);

const analyticsController = new AnalyticsController(analyticsService);

const router = Router();

router.get(
    '/employees/:employeeId/analytics',
    checkRole([EmployeeRole.HR, EmployeeRole.LEAD, EmployeeRole.DEVELOPER]), // Use checkRole with the enum
    analyticsController.getEmployeeAnalytics
);

export default router;