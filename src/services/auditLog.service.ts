import AuditLogRepository from "../repositories/auditLog.repository";
import { AuditLog } from "../entities/AuditLog.entity";
import HttpException from "../exceptions/httpExceptions";
import { LoggerService } from "./logger.service";

class AuditLogService {
  private logger = LoggerService.getInstance("AuditLogService");

  constructor(private auditLogRepo: AuditLogRepository) {}

  async getAllLogs(): Promise<AuditLog[]> {
    this.logger.info("Fetching all audit logs");
    return this.auditLogRepo.findAll();
  }

  async getLogById(id: number): Promise<AuditLog> {
    const log = await this.auditLogRepo.findById(id);
    if (!log) {
      throw new HttpException(404, "Audit log not found");
    }
    return log;
  }
}

export default AuditLogService;
