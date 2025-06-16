import { Request, Response, NextFunction } from "express";
import datasource from "../../db/data-source";
import { AuditLog } from "../entities/AuditLog.entity";
import Employee from "../entities/employee.entity";
import { entityMap } from "../utils/entityMap"; // ✅ this contains table -> Entity mapping

// Symbol to prevent duplicate attachment
const auditLoggedSymbol = Symbol("auditLogged");

export const auditLogMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  if (req.method !== "PUT") return next();

  // Prevent double-attachment
  if ((req as any)[auditLoggedSymbol]) return next();
  (req as any)[auditLoggedSymbol] = true;

  const employeeId = (req as any).user?.id;
  const table = req.originalUrl.split("/")[1];
  const recordId = Number(req.params.id);

  if (!employeeId || isNaN(recordId) || !table) {
    console.warn("[AuditLog] Missing or invalid data", { employeeId, recordId, table });
    return next();
  }

  const entityClass = entityMap[table];
  if (!entityClass) {
    console.warn(`[AuditLog] No entity class found for table: ${table}`);
    return next();
  }

  const repository = datasource.getRepository(entityClass);

  let oldRecord: any = null;
  try {
    oldRecord = await repository.findOne({ where: { id: recordId } });
  } catch (error) {
    console.error(`[AuditLog] Failed to fetch old record (${table}:${recordId})`, error);
    return next(); // don't block request
  }

  // After response is sent
  res.on("finish", async () => {
    try {
      const newRecord = await repository.findOne({ where: { id: recordId } });

      if (!newRecord) {
        console.warn(`[AuditLog] Record not found after update (${table}:${recordId})`);
        return;
      }

      if (JSON.stringify(oldRecord) === JSON.stringify(newRecord)) {
        console.info(`[AuditLog] No changes for ${table}:${recordId}, skipping log.`);
        return;
      }

      const auditLog = new AuditLog();
      auditLog.Employee = { id: employeeId } as Employee;
      auditLog.action = "UPDATE";
      auditLog.table_name = table;
      auditLog.record_id = recordId;
      auditLog.old_value = oldRecord || {};
      auditLog.new_value = newRecord;
      auditLog.timestamp = new Date();

      await datasource.getRepository(AuditLog).save(auditLog);
      console.log(`[AuditLog] Saved audit for ${table}:${recordId}`);
    } catch (err) {
      console.error(`[AuditLog] Error saving audit log for ${table}:${recordId}`, err);
    }
  });

  next();
};
