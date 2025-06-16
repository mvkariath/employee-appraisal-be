import { IsDate, IsEmail, IsEnum, isNotEmpty, IsNotEmpty, IsNumber, IsString, ValidateNested } from "class-validator";
import { EmployeeRole, Status } from "../entities/employee.entity";

export class CreateEmployeeDto {
  @IsNotEmpty()
  @IsString()
  employeeId: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  age: number;

  @IsNotEmpty()
  password: string;
  
  // @IsNumber()
  // departmentId: number;

  @IsEnum(EmployeeRole)
  role: EmployeeRole

  // @ValidateNested({each: true})
  // @Type(() => CreateAddressDto)
  // address: CreateAddressDto;

  @IsNumber()
  experience: number;

  @IsEnum(Status)
  status: Status

  // @IsDate()
  dateOfJoining: Date;
}