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
    // router.post(
    //   "/",
    //   checkRole([EmployeeRole.HR, EmployeeRole.LEAD]),
    //   this.createSelfAppraisal.bind(this)
    // );
    router.post(
      "/",

      this.createManySelfAppraisal.bind(this)
    );
    router.get("/", this.getAllEntries.bind(this));
    router.get(
      "/get-appraisals-of-lead/:leadId",
      checkRole([EmployeeRole.LEAD]),
      this.getAllAppraisalsByLeadId.bind(this)
    );
    router.get("/:id", this.getEntryById.bind(this));
    router.get(
      "/by-appraisal/:appraisalId",
      this.getAllSelfAppraisalsByAppraisalId.bind(this)
    );
    router.put(
      "/:id",
      checkRole([EmployeeRole.HR]),
      this.updateEntry.bind(this)
    );
    router.delete(
      "/:id",
      checkRole([EmployeeRole.HR]),
      this.deleteEntry.bind(this)
    );
  }

  async createSelfAppraisal(req: Request, res: Response, next: NextFunction) {
    try {
      const { data, leadIds } = req.body;
      const dto = plainToInstance(CreateSelfAppraisalDto, data);
      const errors = await validate(dto);
      if (errors.length > 0) {
        this.logger.error(JSON.stringify(errors));
        throw new HttpException(400, JSON.stringify(errors));
      }

      const created = await this.selfAppraisalEntryService.createSelfAppraisal(
        dto,
        leadIds
      );
      this.logger.info("SelfAppraisalEntry created successfully");
      res.status(201).send(created);
    } catch (error) {
      this.logger.error("SelfAppraisalEntry creation failed: " + error);
      next(error);
    }
  }

  async createManySelfAppraisal(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { entries, leadIds } = req.body;

      if (
        !Array.isArray(entries) ||
        entries.length === 0 ||
        !Array.isArray(leadIds)
      ) {
        throw new HttpException(
          400,
          "Invalid payload: entries and leadIds are required"
        );
      }

      // Validate each entry
      const dtos = entries.map((entry: any) =>
        plainToInstance(CreateSelfAppraisalDto, entry)
      );
      for (const dto of dtos) {
        const errors = await validate(dto);
        if (errors.length > 0) {
          this.logger.error(JSON.stringify(errors));
          throw new HttpException(
            400,
            "Validation failed for one or more entries"
          );
        }
      }

      const created =
        await this.selfAppraisalEntryService.createMultipleSelfAppraisals(
          1,
          dtos
        ); //hardcoded appraisalId for now

      this.logger.info("SelfAppraisalEntries created successfully");
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
      const appraisalId = Number(req.params.id);
      if (isNaN(appraisalId)) {
        this.logger.error("Invalid Appraisal ID");
        throw new HttpException(400, "Invalid Appraisal ID");
      }

      const { entries, leadIds } = req.body;

      if (!Array.isArray(entries) || entries.length === 0) {
        this.logger.error("Entries array is required and cannot be empty");
        throw new HttpException(
          400,
          "Entries array is required and cannot be empty"
        );
      }

      await this.selfAppraisalEntryService.updateEntryByAppraisalId(
        appraisalId,
        {
          entries,
          leadIds,
        }
      );

      this.logger.info(
        `SelfAppraisalEntries updated successfully for Appraisal ID: ${appraisalId}`
      );
      res
        .status(200)
        .json({ message: "SelfAppraisalEntries updated successfully" });
    } catch (error) {
      this.logger.error("Failed to update SelfAppraisalEntries: " + error);
      next(error);
    }
  }

  async getAllAppraisalsByLeadId(req: any, res: any) {
    const leadId = parseInt(req.params.leadId, 10);
    if (isNaN(leadId)) {
      return res.status(400).json({ error: "Invalid lead ID" });
    }
    try {
      const appraisals =
        await this.selfAppraisalEntryService.findAllAppraisalsByLeadId(leadId);
      const filtered = appraisals
        .filter(
          (entry) =>
            entry.appraisal &&
            Array.isArray(entry.appraisal.performance_factors) &&
            entry.appraisal.performance_factors.length > 0
        )
        .map((entry) => {
          const employee = entry.appraisal.employee;
          const cycle = entry.appraisal.cycle;

          return {
            name: employee?.name,
            department: employee?.department,
            cycleName: cycle?.name,
            startDate: cycle?.start_date,
            endDate: cycle?.end_date,
          };
        });

      return res.status(200).json(filtered);
    } catch (error) {
      console.error("Error fetching appraisals:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async getAllSelfAppraisalsByAppraisalId(req: any, res: any) {
    const appraisalId = parseInt(req.params.appraisalId, 10);
    if (isNaN(appraisalId)) {
      return res.status(400).json({ error: "Invalid lead ID" });
    }
    try {
      const appraisals =
        await this.selfAppraisalEntryService.getEntriesByAppraisalId(
          appraisalId
        );
      return res.status(200).json(appraisals);
    } catch (error) {
      console.error("Error fetching appraisals:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async deleteEntry(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) throw new HttpException(400, "Invalid ID");

      await this.selfAppraisalEntryService.deleteEntry(id);
      res
        .status(200)
        .send({ message: "SelfAppraisalEntry deleted successfully" });
    } catch (error) {
      this.logger.error("Failed to delete SelfAppraisalEntry: " + error);
      next(error);
    }
  }
}

export default SelfAppraisalEntryController;
