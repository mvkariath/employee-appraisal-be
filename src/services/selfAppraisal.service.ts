import { AppraisalLead } from "../entities/AppraisalLead.entity";
import {Appraisal} from "../entities/Appraisal.entity";
import Employee from "../entities/employee.entity";
import httpException from "../exceptions/httpExceptions";
import { LoggerService } from "./logger.service";
import { SelfAppraisalEntry } from "../entities/SelfAppraisal.entity";
import SelfAppraisalEntryRepository from "../repositories/selfAppraisal.repository";
import AppraisalLeadRepository from "../repositories/appraisalLead.repository";
import CreateSelfAppraisalDto from "../dto/create-selfAppraisal.dto";

class SelfAppraisalEntryService {
  private logger = LoggerService.getInstance("SelfAppraisalEntryService");

  constructor(
    private selfAppraisalEntryRepo: SelfAppraisalEntryRepository,
    private appraisalLeadRepo: AppraisalLeadRepository
  ) {}

  async createSelfAppraisal(data: CreateSelfAppraisalDto): Promise<SelfAppraisalEntry> {
    this.logger.info("createSelfAppraisal - START");

    if (!data.appraisalId || !data.leadIds || data.leadIds.length === 0) {
      this.logger.error("Missing required fields in request");
      throw new httpException(400, "Missing required fields");
    }

    const entry = new SelfAppraisalEntry();
    entry.appraisal = { id: data.appraisalId } as Appraisal;
    entry.delivery_details = data.delivery_details;
    entry.accomplishments = data.accomplishments;
    entry.approach_solution = data.approach_solution;
    entry.improvement_possibilities = data.improvement_possibilities;
    entry.project_time_frame = data.project_time_frame;

    const createdEntry = await this.selfAppraisalEntryRepo.create(entry);

    const leads: AppraisalLead[] = data.leadIds.map((leadId) => {
      const lead = new AppraisalLead();
      lead.appraisal = { id: data.appraisalId } as Appraisal;
      lead.lead = { id: leadId } as Employee;
      return lead;
    });

    await this.appraisalLeadRepo.createMany(leads);

    this.logger.info("createSelfAppraisal - SUCCESS");
    return createdEntry;
  }

  async getAllEntries(): Promise<SelfAppraisalEntry[]> {
    return this.selfAppraisalEntryRepo.findMany();
  }

  async getEntryById(id: number): Promise<SelfAppraisalEntry> {
    const entry = await this.selfAppraisalEntryRepo.findByAppraisalId(id);
    if (!entry) {
      throw new httpException(404, "Self Appraisal Entry not found");
    }
    return entry;
  }
    async findAllAppraisalsByLeadId(leadId: number) {
        return this.appraisalLeadRepo.findAllAppraisalsByLeadId(leadId);
    }
async updateEntry(
  id: number,
  data: Partial<SelfAppraisalEntry> & { leadIds?: number[] }
): Promise<void> {
  let existing = await this.selfAppraisalEntryRepo.findByAppraisalId(id);

  if (!existing) {
    await this.createSelfAppraisal(data as CreateSelfAppraisalDto);
    return;
  }

  Object.assign(existing, data);
  await this.selfAppraisalEntryRepo.update(id, existing);
  

  if (data.leadIds && data.leadIds.length > 0) {
    const appraisalId = existing.appraisal.id;

    // Delete old AppraisalLeads
    await this.appraisalLeadRepo.deleteByAppraisalId(appraisalId);

    // Insert new AppraisalLeads
    const newLeads = data.leadIds.map((leadId) => {
      const lead = new AppraisalLead();
      lead.appraisal = { id: appraisalId } as any;
      lead.lead = { id: leadId } as any;
      return lead;
    });

    await this.appraisalLeadRepo.createMany(newLeads);
  }
}


  async deleteEntry(id: number): Promise<void> {
    const existing = await this.selfAppraisalEntryRepo.findById(id);
    if (!existing) {
      throw new httpException(404, "Self Appraisal Entry not found");
    }

    await this.selfAppraisalEntryRepo.remove(existing);
  }
}

export default SelfAppraisalEntryService;
