import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import Employee from './employee.entity';
import AbstractEntity from './abstract.entity';

export enum Status {
    INITIATED = "INITIATED",
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED"
}


@Entity('appraisal_cycles')
class AppraisalCycle extends AbstractEntity {

    @Column({ length: 100 })
    name: string;

    @Column({ type: 'date' })
    start_date: string;

    @Column({ type: 'date' })
    end_date: string;

    @Column({
        type: 'enum',
        enum: Status,
        default: Status.INITIATED
    })
    status : Status

    @ManyToOne(() => Employee)
    @JoinColumn({ name: 'created_by' })
    created_by: Employee;
}

export default AppraisalCycle