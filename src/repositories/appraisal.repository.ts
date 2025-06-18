import { Repository } from "typeorm";
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
async findPastAppraisal(id: number): Promise<Appraisal[] | null> {
  return this.repository
    .createQueryBuilder("appraisal")
    .leftJoinAndSelect("appraisal.employee", "employee")
    .leftJoinAndSelect("appraisal.cycle", "cycle")
    .leftJoinAndSelect("appraisal.idp", "idp")
    .leftJoinAndSelect("appraisal.performance_factors", "performance_factors")
    .leftJoinAndSelect("appraisal.self_appraisal", "self_appraisal")
    .leftJoinAndSelect("appraisal.appraisalLeads", "appraisalLeads")
    .leftJoin("appraisalLeads.lead", "lead")
    .addSelect(["lead.id", "lead.name"]) 

    .leftJoin("cycle.created_by", "created_by")
    .addSelect(["created_by.id"])

    .where("employee.id = :id", { id })
    .andWhere("appraisal.current_status = :status", { status: Status.ALL_DONE })

    .getMany();
}



  async findByEmployeeId(employeeId: number): Promise<Appraisal[]> {
  return this.repository
    .createQueryBuilder("appraisal")
    .leftJoinAndSelect("appraisal.employee", "employee")
    .leftJoinAndSelect("appraisal.cycle", "cycle")
    
    .leftJoin("cycle.created_by", "created_by")
    .addSelect("created_by.id")
    .leftJoinAndSelect("appraisal.self_appraisal", "self_appraisal")
    .where("employee.id = :id", { id: employeeId })
    .getMany();
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
