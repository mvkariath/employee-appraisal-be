import { Repository } from "typeorm";
import { AuditLog } from "../entities/AuditLog.entity";

class AuditLogRepository {
    constructor(private repository: Repository<AuditLog>) { }

    async findAll(): Promise<AuditLog[]> {
        const logs = await this.repository.find({ relations: ["Employee"] });

        // Remove password from related Employee
        return logs.map(log => {
            if (log.Employee) {
                const { password, ...sanitizedEmployee } = log.Employee;
                log.Employee = sanitizedEmployee as any;
            }
            return log;
        });
    }


    async findById(id: number): Promise<AuditLog | null> {
        const log = await this.repository.findOne({
            where: { id },
            relations: ["Employee"],
        });

        if (log?.Employee) {
            const { password, ...sanitizedEmployee } = log.Employee;
            log.Employee = sanitizedEmployee as any;
        }

        return log;
    }

    async findByEmployeeId(id: number): Promise<AuditLog | null> {
        const log = await this.repository.findOne({
            where: { Employee:{id:id} },
            relations: ["Employee"],
        });

        if (log?.Employee) {
            const { password, ...sanitizedEmployee } = log.Employee;
            log.Employee = sanitizedEmployee as any;
        }

        return log;
    }
}
export default AuditLogRepository;
