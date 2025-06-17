import AppraisalCycle from "../entities/AppraisalCycle.entity";
import AppraisalCycleRepository from "../repositories/appraisalCycle.repository";
import { LoggerService } from "./logger.service";
import httpException from "../exceptions/httpExceptions";
import { CreateAppraisalCycleDto } from "../dto/create-appraisalCycle.dto";
import { UpdateAppraisalCycleDto } from "../dto/update-appraisalCycle.dto";
import AppraisalService from "./appraisal.service";
// import { UpdateAppraisalCycleDto } from "../dto/update-appraisal-cycle.dto";

class AppraisalCycleService {
    private logger = LoggerService.getInstance("AppraisalCycleService");

    constructor(private cycleRepository: AppraisalCycleRepository,
        private appraisalService: AppraisalService

    ) { }

    async createCycle(appraisalCycleDto: CreateAppraisalCycleDto): Promise<AppraisalCycle> {
        const { name, start_date, end_date, status, created_by, employees } = appraisalCycleDto;

        this.logger.info("createCycle - START");

        const cycle = new AppraisalCycle();
        cycle.name = name;
        cycle.start_date = start_date;
        cycle.end_date = end_date;
        cycle.status = status;
        cycle.created_by = created_by;

        this.logger.debug(`Creating appraisal cycle: ${name}`);
        const createdCycle = await this.cycleRepository.create(cycle);

        this.logger.info(`createCycle - SUCCESS: Appraisal cycle '${createdCycle.name}' created`);

        if (employees && employees.length > 0) {
            await this.appraisalService.createAppraisals({
                employeeIds: employees,
                cycle: createdCycle,
            });
        } else {
            this.logger.warn("No employees selected for the appraisal cycle.");
        }

        this.logger.info(
            `createCycleWithAppraisals - SUCCESS: Appraisal cycle '${createdCycle.name}' and associated appraisals created`
        );
        return createdCycle;
    }

    async getAllCycles(): Promise<AppraisalCycle[]> {
        this.logger.info("getAllCycles - START");
        const cycles = await this.cycleRepository.findMany();
        this.logger.info(`getAllCycles - SUCCESS: Retrieved ${cycles.length} cycles`);
        return cycles;
    }

    async getCycleById(id: number): Promise<AppraisalCycle> {
        this.logger.info(`getCycleById - START: ID = ${id}`);
        const cycle = await this.cycleRepository.findById(id);

        if (!cycle) {
            this.logger.error(`getCycleById - FAILED: No cycle found with ID ${id}`);
            throw new httpException(404, "Appraisal Cycle not found");
        }

        this.logger.info(`getCycleById - SUCCESS: Found cycle with ID ${id}`);
        return cycle;
    }

    async updateCycle(id: number, dto: UpdateAppraisalCycleDto): Promise<void> {
        this.logger.info(`updateCycle - START: ID = ${id}`);

        const existing = await this.cycleRepository.findById(id);
        if (!existing) {
            this.logger.error(`updateCycle - FAILED: Cycle with ID ${id} not found`);
            throw new httpException(404, "Appraisal Cycle not found");
        }

        existing.name = dto.name || existing.name;
        existing.start_date = dto.start_date || existing.start_date;
        existing.end_date = dto.end_date || existing.end_date;
        existing.status = dto.status || existing.status;

        await this.cycleRepository.update(id, existing);
        this.logger.info(`updateCycle - SUCCESS: Updated cycle with ID ${id}`);
    }

    async removeCycle(id: number): Promise<void> {
        this.logger.info(`removeCycle - START: ID = ${id}`);
        const existing = await this.cycleRepository.findById(id);
        if (!existing) {
            this.logger.error(`removeCycle - FAILED: No cycle with ID ${id}`);
            throw new httpException(400, "Invalid Appraisal Cycle ID");
        }

        await this.cycleRepository.remove(existing);
        this.logger.info(`removeCycle - SUCCESS: Removed cycle with ID ${id}`);
    }
}

export default AppraisalCycleService;
