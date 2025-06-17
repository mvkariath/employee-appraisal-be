import { Repository } from "typeorm";
import { Appraisal } from "../entities/Appraisal.entity";
import { IndividualDevelopmentPlan } from "../entities/IndividualDevelopmentPlan.entity";

class IDPRepository {
  constructor(private repository: Repository<IndividualDevelopmentPlan>) {}

  async create(
    idp: IndividualDevelopmentPlan
  ): Promise<IndividualDevelopmentPlan> {
    return this.repository.save(idp);
  }

  async findByAppraisalId(
    appraisalId: number
  ): Promise<IndividualDevelopmentPlan[]> {
    return this.repository.find({
      where: { appraisal: { id: appraisalId } },
    });
  }

  async update(
    id: number,
    updatedData: Partial<IndividualDevelopmentPlan>
  ): Promise<IndividualDevelopmentPlan> {
    const existing = await this.repository.findOneBy({ id });

    if (!existing) {
      throw new Error(`IndividualDevelopmentPlan with id ${id} not found`);
    }

    const updated = this.repository.merge(existing, updatedData);
    return this.repository.save(updated);
  }
}

export default IDPRepository;
