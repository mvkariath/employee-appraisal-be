import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import Employee from './employee.entity';
import AppraisalCycle from './AppraisalCycle.entity';
import AbstractEntity from './abstract.entity';

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

@Entity('appraisals')
export class Appraisal extends AbstractEntity {

    @ManyToOne(() => Employee)
    @JoinColumn({ name: 'employee_id' })
    employee: Employee;

    @ManyToOne(() => AppraisalCycle)
    @JoinColumn({ name: 'cycle_id' })
    cycle: AppraisalCycle;

    @Column({
        type: 'enum',
        enum: Status,
        default: Status.NA
    })
    current_status: Status;

    @Column({ length: 20 })
    remarks_by: 'HR' | 'Lead';

    @Column('text')
    content: string;

    @Column({ type: 'timestamp', nullable: true })
    submitted_at: Date;

    @Column({ type: 'timestamp', nullable: true })
    closed_at: Date;
}
