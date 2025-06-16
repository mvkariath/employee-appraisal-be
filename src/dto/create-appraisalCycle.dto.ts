import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import Employee from "../entities/employee.entity";
import { Status } from "../entities/AppraisalCycle.entity";

// create-appraisal-cycle.dto.ts
export class CreateAppraisalCycleDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    start_date: string;

    end_date: string;

    @IsEnum(Status)
    status: Status;

    @IsNotEmpty()
    created_by: Employee; // ideally: Employee
}
