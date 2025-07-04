import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    OneToMany,
} from "typeorm";
import Employee from "./employee.entity";
import AppraisalCycle from "./AppraisalCycle.entity";
import AbstractEntity from "./abstract.entity";
import { IsOptional } from "class-validator";
import { IndividualDevelopmentPlan } from "./IndividualDevelopmentPlan.entity";
import { SelfAppraisalEntry } from "./SelfAppraisal.entity";
import { PerformanceFactor } from "./PerformanceFactor.entity";
import { AppraisalLead } from "./AppraisalLead.entity";

export enum Status {
    NA = "N/A",
    INITIATED = "INITIATED",
    SELF_APPRAISED = "SELF_APPRAISED",
    INITIATE_FEEDBACK = "INITIATE_FEEDBACK",
    FEEDBACK_SUBMITTED = "FEEDBACK_SUBMITTED",
    MEETING_DONE = "MEETING_DONE",
    DONE = "DONE",
    ALL_DONE = "ALL_DONE",
}

@Entity("appraisals")
export class Appraisal extends AbstractEntity {
    @ManyToOne(() => Employee, { eager: true })
    @JoinColumn({ name: "employee_id" })
    employee: Employee;

    @ManyToOne(() => AppraisalCycle, { eager: true })
    @JoinColumn({ name: "cycle_id" })
    cycle: AppraisalCycle;

    @Column({
        type: "enum",
        enum: Status,
        default: Status.NA,
    })
    current_status: Status;

    @IsOptional()
    @Column({ length: 20, nullable: true })
    remarks_by?: "HR" | "Lead";

    @IsOptional()
    @Column("text", { nullable: true })
    content?: string;

    @Column({ type: "timestamp", nullable: true })
    submitted_at: Date;

    @Column({ type: "timestamp", nullable: true })
    closed_at: Date;

    @OneToMany(() => AppraisalLead, (lead) => lead.appraisal, { cascade: true, eager: false })
    appraisalLeads: AppraisalLead[];

    @OneToMany(() => IndividualDevelopmentPlan, (idp) => idp.appraisal, {
        cascade: true,
    })
    idp: IndividualDevelopmentPlan[];

    @OneToMany(
        () => SelfAppraisalEntry,
        (selfAppraisal) => selfAppraisal.appraisal,
        {
            cascade: true,
        }
    )
    self_appraisal: SelfAppraisalEntry[];

    @OneToMany(
        () => PerformanceFactor,
        (performanceFactor) => performanceFactor.appraisal,
        {
            cascade: true,
        }
    )
    performance_factors: PerformanceFactor[];
}
