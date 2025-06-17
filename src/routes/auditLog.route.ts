import express from "express";
import datasource from "../../db/data-source";
import { AuditLog } from "../entities/AuditLog.entity";
import AuditLogRepository from "../repositories/auditLog.repository";
import AuditLogService from "../services/auditLog.service";
import AuditLogController from "../controllers/auditLog.controller";

const auditLogRouter = express.Router();
const auditLogRepository = new AuditLogRepository(datasource.getRepository(AuditLog));
const auditLogService = new AuditLogService(auditLogRepository);
new AuditLogController(auditLogService, auditLogRouter);

export default auditLogRouter;
