import { Repository } from "typeorm";
import { Appraisal } from "../entities/Appraisal.entity";

class AppraisalRepository {
  constructor(private repository: Repository<Appraisal>) {}

  async create(appraisal: Appraisal): Promise<Appraisal> {
    return this.repository.save(appraisal);
  }

  async findAll(): Promise<Appraisal[]> {
    return this.repository.find({
      relations: [
        "employee",
        "cycle",
        "idp",
        "performance_factors",
        "self_appraisal",
      ],
    });
  }

  async findById(id: number): Promise<Appraisal | null> {
    return this.repository.findOne({
      where: { id },
      relations: [
        "employee",
        "cycle",
        "idp",
        "performance_factors",
        "self_appraisal",
      ],
    });
  }

  async findByEmployeeId(employeeId: number): Promise<Appraisal[]> {
    return this.repository.find({
      where: { employee: { id: employeeId } },
      relations: ["cycle"],
    });
  }

  async update(id: number, appraisal: Appraisal): Promise<void> {
    await this.repository.save({ id, ...appraisal });
  }

  async remove(appraisal: Appraisal): Promise<void> {
    await this.repository.softRemove(appraisal);
  }
}

export default AppraisalRepository;
