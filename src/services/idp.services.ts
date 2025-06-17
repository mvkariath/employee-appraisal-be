import { Repository } from "typeorm";

import { IndividualDevelopmentPlan } from "../entities/IndividualDevelopmentPlan.entity";
import { Appraisal } from "../entities/Appraisal.entity";
import IDPRepository from "../repositories/idp.repository";

export class IDPService {
  constructor(private readonly idpRepository: IDPRepository) {}

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
