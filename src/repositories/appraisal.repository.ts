import { Not, Repository } from "typeorm";
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

async countTeamPending(leadId: number): Promise<number> {
  return this.repository
    .createQueryBuilder("appraisal")
    .innerJoin("appraisal.appraisalLeads", "appraisalLeads")
    .where("appraisalLeads.lead = :leadId", { leadId })
    .andWhere("appraisal.current_status = :status", { status: Status.INITIATED })
    .getCount();
}

async countTeamAppraisalsToReview(leadId: number): Promise<number> {
  return this.repository
    .createQueryBuilder("appraisal")
    .innerJoin("appraisal.appraisalLeads", "lead")
    .where("lead.lead = :leadId", { leadId })
    .andWhere("appraisal.current_status IN (:...statuses)", {
      statuses: [Status.SELF_APPRAISED, Status.INITIATE_FEEDBACK],
    })
    .getCount();
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

  async countCompleted(): Promise<number> {
  return this.repository.count({
    where: { current_status: Status.ALL_DONE },
  });
}

// Count all pending/in-progress appraisals
async countPending(): Promise<number> {
  return this.repository.count({
    where: { current_status: Not(Status.ALL_DONE) },
  });
}

async findCurrentAppraisalNameByEmployee(employeeId: number): Promise<string | null> {
  const result = await this.repository
    .createQueryBuilder("appraisal")
    .leftJoin("appraisal.cycle", "cycle")
    .select("cycle.name", "name")
    .where("appraisal.employee.id = :employeeId", { employeeId })
    .andWhere("appraisal.current_status != :status", { status: Status.ALL_DONE })
    .orderBy("cycle.start_date", "DESC")
    .limit(1)
    .getRawOne();

  return result?.name || null;
}


async findLastCompletedAppraisalNameByEmployee(employeeId: number): Promise<string | null> {
  const result = await this.repository
    .createQueryBuilder("appraisal")
    .leftJoin("appraisal.cycle", "cycle")
    .select("cycle.name", "name")
    .where("appraisal.employee.id = :employeeId", { employeeId })
    .andWhere("appraisal.current_status = :status", { status: Status.ALL_DONE })
    .orderBy("cycle.start_date", "DESC")
    .limit(1)
    .getRawOne();

  return result?.name || null;
}

}



export default AppraisalRepository;
