import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { Appraisal } from "./Appraisal.entity";
import AbstractEntity from "./abstract.entity";
import { Exclude } from "class-transformer";

export enum Competency {
  TECHNICAL = "TECHNICAL",
  FUNCTIONAL = "FUNCTIONAL",
  COMMUNICATION = "COMMUNICATION",
  ENERGY_DRIVE = "ENERGY & DRIVE",
  RESPONSIBILITY_TRUST = "RESPONSIBILITY & TRUST",
  TEAMWORK = "TEAMWORK",
  MANAGINGPROCESSES_WORK = "MANAGING PROCESSES & WORK",
}

@Entity("performance_factors")
export class PerformanceFactor extends AbstractEntity {
  @ManyToOne(() => Appraisal)
  @Exclude()
  @JoinColumn({ name: "appraisal_id" })
  appraisal: Appraisal;

  @Column({
    type: "enum",
    enum: Competency,
    default: Competency.TECHNICAL,
  })
  competency: Competency;

  @Column("text")
  strengths: string;

  @Column("text")
  improvements: string;

  @Column("int")
  rating: number;
}
