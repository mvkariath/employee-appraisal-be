import { Request, Response, NextFunction, Router } from "express";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";

import SelfAppraisalEntryService from "../services/selfAppraisal.service";
import CreateSelfAppraisalDto from "../dto/create-selfAppraisal.dto";
import { LoggerService } from "../services/logger.service";
import HttpException from "../exceptions/httpExceptions";
import { checkRole } from "../middlewares/authorization.middleware";
import { EmployeeRole } from "../entities/employee.entity";
import { SelfAppraisalEntry } from "../entities/SelfAppraisal.entity";

class SelfAppraisalEntryController {
  private logger = LoggerService.getInstance("SelfAppraisalEntryController");

  constructor(
    private selfAppraisalEntryService: SelfAppraisalEntryService,
    router: Router
  ) {
    router.post(
      "/",
      checkRole([EmployeeRole.HR, EmployeeRole.LEAD]),
      this.createSelfAppraisal.bind(this)
    );
    router.get("/", this.getAllEntries.bind(this));
    router.get("/:id", this.getEntryById.bind(this));
    router.put("/:id", checkRole([EmployeeRole.HR]), this.updateEntry.bind(this));
    router.delete("/:id", checkRole([EmployeeRole.HR]), this.deleteEntry.bind(this));
  }

  async createSelfAppraisal(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = plainToInstance(CreateSelfAppraisalDto, req.body);
      const errors = await validate(dto);
      if (errors.length > 0) {
        this.logger.error(JSON.stringify(errors));
        throw new HttpException(400, JSON.stringify(errors));
      }

      const created = await this.selfAppraisalEntryService.createSelfAppraisal(dto);
      this.logger.info("SelfAppraisalEntry created successfully");
      res.status(201).send(created);
    } catch (error) {
      this.logger.error("SelfAppraisalEntry creation failed: " + error);
      next(error);
    }
  }

  async getAllEntries(req: Request, res: Response, next: NextFunction) {
    try {
      const entries = await this.selfAppraisalEntryService.getAllEntries();
      res.status(200).send(entries);
    } catch (error) {
      this.logger.error("Failed to get SelfAppraisalEntries: " + error);
      next(error);
    }
  }

  async getEntryById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) throw new HttpException(400, "Invalid ID");

      const entry = await this.selfAppraisalEntryService.getEntryById(id);
      res.status(200).send(entry);
    } catch (error) {
      this.logger.error("Failed to fetch entry by ID: " + error);
      next(error);
    }
  }

  async updateEntry(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      this.logger.error("Invalid SelfAppraisalEntry ID");
      throw new HttpException(400, "Invalid ID");
    }

    const updateData = req.body as Partial<SelfAppraisalEntry> & { leadIds?: number[] };

    await this.selfAppraisalEntryService.updateEntry(id, updateData);
    this.logger.info(`SelfAppraisalEntry updated successfully for ID: ${id}`);
    res.status(200).send({ message: "SelfAppraisalEntry updated successfully" });
  } catch (error) {
    this.logger.error("Failed to update SelfAppraisalEntry: " + error);
    next(error);
  }
}


  async deleteEntry(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) throw new HttpException(400, "Invalid ID");

      await this.selfAppraisalEntryService.deleteEntry(id);
      res.status(200).send({ message: "SelfAppraisalEntry deleted successfully" });
    } catch (error) {
      this.logger.error("Failed to delete SelfAppraisalEntry: " + error);
      next(error);
    }
  }
}

export default SelfAppraisalEntryController;
