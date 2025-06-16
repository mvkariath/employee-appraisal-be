import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsArray,
  ArrayNotEmpty,
  IsOptional,
} from "class-validator";

class CreateSelfAppraisalDto {
  @IsNumber()
  @IsNotEmpty()
  appraisalId: number;

  @IsString()
  @IsNotEmpty()
  delivery_details: string;

  @IsString()
  @IsNotEmpty()
  accomplishments: string;

  @IsString()
  @IsNotEmpty()
  approach_solution: string;

  @IsString()
  @IsNotEmpty()
  improvement_possibilities: string;

  @IsString()
  @IsNotEmpty()
  project_time_frame: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  leadIds: number[];
}

export default CreateSelfAppraisalDto