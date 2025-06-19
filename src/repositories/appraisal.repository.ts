import { In, Repository } from "typeorm";
import { Appraisal, Status } from "../entities/Appraisal.entity";

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
        "appraisalLeads",
      ],
    });
  }

  async findPastAppraisal(id: number): Promise<Appraisal[]| null> {
    return this.repository.find({
      where: {
        employee: { id: id },
        current_status: Status.ALL_DONE ,
      },
      relations: [
        "employee",
        "cycle",
        "idp",
        "performance_factors",
        "self_appraisal",
      ],
    });
  }

  async findLastNCompletedForEmployee(employeeId: number, limit: number = 5): Promise<Appraisal[]> {
    return this.repository.find({
        where: {
            employee: { id: employeeId },
            current_status: In([Status.DONE, Status.MEETING_DONE])
        },
        relations: [
            "cycle",
            "performance_factors"
        ],
        order: {
            cycle: {
                end_date: 'DESC'
            }
        },
        take: limit
    });
  }

  async findByEmployeeId(employeeId: number): Promise<Appraisal[]> {
    return this.repository.find({
      where: { employee: { id: employeeId } },
      relations: ["cycle"],
    });
  }

   async findByCycleId(cycleId: number): Promise<Appraisal[]> {
    return this.repository.find({
      where: { cycle: { id: cycleId } },
      relations: ["employee"],
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