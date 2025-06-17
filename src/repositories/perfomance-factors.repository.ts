import { Repository } from "typeorm";
import { Competency, PerformanceFactor } from "../entities/PerformanceFactor.entity";

class PerformanceFactorsRepository {
  constructor(private repository: Repository<PerformanceFactor>) {}
  async create(
    performanceFactor: PerformanceFactor
  ): Promise<PerformanceFactor> {
    return this.repository.save(performanceFactor);
  }
  async findByAppraisalId(
    appraisalId: number,
    competency: Competency
  ): Promise<PerformanceFactor | null> {
    return this.repository.findOne({
      where: {
        appraisal: { id: appraisalId },
        competency,
      },
      relations: ['appraisal'],
    });


    
  }
  // async update(
  //   appraisalId: number,
  //   competency: Competency,
  //   updates: {
  //     strengths?: string;
  //     improvements?: string;
  //     rating?: number;
  //   }
  // ): Promise<PerformanceFactor> {
    


  //   return  this.repository.save({appraisalId,competency,...updates});
  // }
  async update(
  id:number,updates:PerformanceFactor
  ): Promise<PerformanceFactor> {
    


    return  this.repository.save({id, ...updates});
  }
}

export default PerformanceFactorsRepository;
