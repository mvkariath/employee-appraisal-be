import { IsDateString, IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { Status } from '../entities/AppraisalCycle.entity';
import Employee from '../entities/employee.entity';

export class UpdateAppraisalCycleDto {
  @IsOptional()
  name?: string;

  @IsOptional()
  @IsDateString()
  start_date?: string;

  @IsOptional()
  @IsDateString()
  end_date?: string;

  @IsOptional()
  @IsEnum(Status)
  status?: Status;

  @IsOptional()
  created_by?: Employee;
}
