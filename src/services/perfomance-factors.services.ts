import AppraisalCycle from "../entities/AppraisalCycle.entity";
import AppraisalCycleRepository from "../repositories/appraisalCycle.repository";
import { LoggerService } from "./logger.service";
import httpException from "../exceptions/httpExceptions";
import { CreateAppraisalCycleDto } from "../dto/create-appraisalCycle.dto";
import { UpdateAppraisalCycleDto } from "../dto/update-appraisalCycle.dto";
import { Competency, PerformanceFactor } from "../entities/PerformanceFactor.entity";
import PerformanceFactorsRepository from "../repositories/perfomance-factors.repository";
// import { UpdateAppraisalCycleDto } from "../dto/update-appraisal-cycle.dto";

class PerformanceFactorService {
  private logger = LoggerService.getInstance("PerformanceFactorService");

  constructor(
    private performanceFactorRepository: PerformanceFactorsRepository
  ) {}

  async createPerformanceFactor(
    performanceFactorDto: PerformanceFactor
  ): Promise<PerformanceFactor> {
    this.logger.info("createPerformanceFactor - START");

    const performance_factor = new PerformanceFactor();
    performance_factor.competency = performanceFactorDto.competency;
    performance_factor.appraisal = performanceFactorDto.appraisal;
    performance_factor.strengths = performanceFactorDto.strengths || null;
    performance_factor.improvements = performanceFactorDto.improvements || null;
    performance_factor.rating = performanceFactorDto.rating || 0;

    this.logger.debug(
      `Creating performance factor: ${performance_factor.competency}`
    );
    const created = await this.performanceFactorRepository.create(
      performance_factor
    );

    this.logger.info(
      `createPerformanceFactor - SUCCESS: Performance factor '${created.competency}' created`
    );
    return created;
  }
   async updatePerformanceFactor(
    appraisalId: number,
    competency: Competency,
    updates: {
      strengths?: string;
      improvements?: string;
      rating?: number;
    }
  ) {
    const existing = await this.performanceFactorRepository.findByAppraisalId(appraisalId,competency);

    if (!existing) {
      throw new httpException(401,`PerformanceFactor not found for competency: ${competency}`);
    }

    
      existing.strengths = updates.strengths || existing.strengths;
    
  
      existing.improvements = updates.improvements || existing.improvements;
    
 
      existing.rating = updates.rating || existing.rating;
    

    return (await this.performanceFactorRepository.update(existing.id, existing));
  }
}


export default PerformanceFactorService;
