import { AppraisalLead } from "../entities/AppraisalLead.entity";
import { Appraisal } from "../entities/Appraisal.entity";
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

  async createSelfAppraisal(
    data: CreateSelfAppraisalDto,
    leadIds: number[]
  ): Promise<SelfAppraisalEntry> {
    this.logger.info("createSelfAppraisal - START");

    if (!data.appraisalId || !Array.isArray(leadIds) || leadIds.length === 0) {
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

    const leads: AppraisalLead[] = leadIds.map((leadId) => {
      const lead = new AppraisalLead();
      lead.appraisal = { id: data.appraisalId } as Appraisal;
      lead.lead = { id: leadId } as Employee;
      return lead;
    });

    await this.appraisalLeadRepo.createMany(leads);

    this.logger.info("createSelfAppraisal - SUCCESS");
    return createdEntry;
  }

  async createMultipleSelfAppraisals(
    appraisalId: number,
    entries: CreateSelfAppraisalDto[]
  ): Promise<SelfAppraisalEntry[]> {
    this.logger.info("createMultipleSelfAppraisals - START" + appraisalId);

    const selfAppraisalEntities = entries.map((data) => {
      const entry = new SelfAppraisalEntry();
      entry.appraisal = { id: appraisalId } as Appraisal;
      entry.delivery_details = data.delivery_details;
      entry.accomplishments = data.accomplishments;
      entry.approach_solution = data.approach_solution;
      entry.improvement_possibilities = data.improvement_possibilities;
      entry.project_time_frame = data.project_time_frame;
      return entry;
    });

    const createdEntries = await this.selfAppraisalEntryRepo.createMany(
      selfAppraisalEntities
    );

    this.logger.info("createMultipleSelfAppraisals - SUCCESS");
    return createdEntries;
  }

  async getAllEntries(): Promise<SelfAppraisalEntry[]> {
    return this.selfAppraisalEntryRepo.findMany();
  }

  async getEntryById(id: number): Promise<SelfAppraisalEntry> {
    const entry = await this.selfAppraisalEntryRepo.findById(id);
    if (!entry) {
      throw new httpException(404, "Self Appraisal Entry not found");
    }
    return entry;
  }

  async findAllAppraisalsByLeadId(leadId: number) {
    return this.appraisalLeadRepo.findAllAppraisalsByLeadId(leadId);
  }

  async getEntriesByAppraisalId(
    appraisalId: number
  ): Promise<SelfAppraisalEntry[]> {
    return this.selfAppraisalEntryRepo.findAllByAppraisalId(appraisalId);
  }
  async updateLeads(appraisalId: number, leadIds: number[]) {
    await this.appraisalLeadRepo.deleteByAppraisalId(appraisalId);
    if (leadIds && leadIds.length > 0) {
      const newLeads = leadIds.map((leadId) => {
        // to-do - check if leadId exists in Employee table and role is lead
        const lead = new AppraisalLead();
        lead.appraisal = { id: appraisalId } as Appraisal;
        lead.lead = { id: leadId } as Employee;
        return lead;
      });

      await this.appraisalLeadRepo.createMany(newLeads);
    }
  }
  async updateSelfAppraisal(id: number, data: Partial<Appraisal>) {
    const appraisal = await this.selfAppraisalEntryRepo.findById(id);
    if (!appraisal) {
      throw new Error("Self Appraisal not found");
    }
    Object.assign(appraisal, data);
    return this.selfAppraisalEntryRepo.update(id, appraisal);
  }
  async updateEntryByAppraisalId(
    appraisalId: number,
    data: { entries: CreateSelfAppraisalDto[]; leadIds?: number[] }
  ): Promise<void> {
    const existingEntries =
      await this.selfAppraisalEntryRepo.findAllByAppraisalId(appraisalId);

    if (!existingEntries || existingEntries.length === 0) {
      const createPayload = data.entries.map((entry) => ({
        ...entry,
        appraisalId,
      })) as CreateSelfAppraisalDto[];

      // await this.createMultipleSelfAppraisals(
      //   createPayload,
      //   data.leadIds || []
      // );
      return;
    }

    // Update each entry using matching ID
    for (const entryData of data.entries) {
      if (!entryData.appraisalId) continue; // Skip if no ID

      const entry = existingEntries.find((e) => e.id === entryData.appraisalId);
      if (!entry) continue;

      Object.assign(entry, entryData);
      await this.selfAppraisalEntryRepo.update(entry.id, entry);
    }

    // Handle lead updates
    if (data.leadIds && data.leadIds.length > 0) {
      await this.appraisalLeadRepo.deleteByAppraisalId(appraisalId);

      const newLeads = data.leadIds.map((leadId) => {
        const lead = new AppraisalLead();
        lead.appraisal = { id: appraisalId } as Appraisal;
        lead.lead = { id: leadId } as Employee;
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
