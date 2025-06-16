import { Repository } from "typeorm";
import { PerformanceFactor } from "../entities/PerformanceFactor.entity";

class PerformanceFactorsRepository {
  constructor(private repository: Repository<PerformanceFactor>) {}
  async create(
    performanceFactor: PerformanceFactor
  ): Promise<PerformanceFactor> {
    return this.repository.save(performanceFactor);
  }
}

export default PerformanceFactorsRepository;
