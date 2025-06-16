import { Repository } from "typeorm";
import AppraisalCycle from "../entities/AppraisalCycle.entity";

class AppraisalCycleRepository {
    constructor(private repository: Repository<AppraisalCycle>) {}

    async create(cycle: AppraisalCycle): Promise<AppraisalCycle> {
        return this.repository.save(cycle);
    }

    async findMany(): Promise<AppraisalCycle[]> {
        return this.repository.find({ relations: ['created_by'] });
    }

    async findById(id: number): Promise<AppraisalCycle | null> {
        return this.repository.findOne({
            where: { id },
            relations: ['created_by'],
        });
    }

    async update(id: number, cycle: Partial<AppraisalCycle>): Promise<void> {
        await this.repository.update(id, cycle);
    }

    async delete(id: number): Promise<void> {
        await this.repository.delete(id);
    }

    async remove(cycle: AppraisalCycle): Promise<void> {
        await this.repository.softRemove(cycle);
    }
}

export default AppraisalCycleRepository;
