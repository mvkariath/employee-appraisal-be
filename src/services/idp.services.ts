import { Repository } from "typeorm";

import { IndividualDevelopmentPlan } from "../entities/IndividualDevelopmentPlan.entity";
import { Appraisal } from "../entities/Appraisal.entity";
import IDPRepository from "../repositories/idp.reposiotry";

export class IDPService {
  private idpRepository: IDPRepository;

  constructor(
    private readonly repository: Repository<IndividualDevelopmentPlan>
  ) {
    this.idpRepository = new IDPRepository(this.repository);
  }

  async createIDP(
    idp: IndividualDevelopmentPlan
  ): Promise<IndividualDevelopmentPlan> {
    return this.idpRepository.create(idp);
  }

  async getIDPsByAppraisalId(
    appraisalId: number
  ): Promise<IndividualDevelopmentPlan[]> {
    return this.idpRepository.findByAppraisalId(appraisalId);
  }

  async updateIDP(
    id: number,
    updatedData: Partial<IndividualDevelopmentPlan>
  ): Promise<IndividualDevelopmentPlan> {
    return this.idpRepository.update(id, updatedData);
  }
}
