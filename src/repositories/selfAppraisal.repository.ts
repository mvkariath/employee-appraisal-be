import { Repository } from "typeorm";
import { SelfAppraisalEntry } from "../entities/SelfAppraisal.entity";

class SelfAppraisalEntryRepository {
  constructor(private repository: Repository<SelfAppraisalEntry>) {}

  async create(entry: SelfAppraisalEntry): Promise<SelfAppraisalEntry> {
    return this.repository.save(entry);
  }

  async findMany(): Promise<SelfAppraisalEntry[]> {
    return this.repository.find({
     relations: ["appraisal", "appraisal.appraisalLeads", "appraisal.appraisalLeads.lead"]
    });
  }

  async findById(id: number): Promise<SelfAppraisalEntry | null> {
    return this.repository.findOne({
      where: { id },
     relations: ["appraisal", "appraisal.appraisalLeads", "appraisal.appraisalLeads.lead"]
    });
  }

  async update(id: number, entry: SelfAppraisalEntry): Promise<void> {
    await this.repository.save({ id, ...entry });
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  async remove(entry: SelfAppraisalEntry): Promise<void> {
    await this.repository.softRemove(entry);
  }
}

export default SelfAppraisalEntryRepository;
