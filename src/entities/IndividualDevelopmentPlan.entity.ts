import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, ManyToOne } from 'typeorm';
import { Appraisal } from './Appraisal.entity';
import Employee from './/employee.entity';
import AbstractEntity from './abstract.entity';

export enum IDP_Competency {
    TECHNICAL = "TECHNICAL",
    BEHAVIORAL = "BEHAVIORAL",
    FUNCTIONAL = "FUNCTIONAL",
}

@Entity('individual_development_plan')
export class IndividualDevelopmentPlan extends AbstractEntity {

    @OneToOne(() => Appraisal)
    @JoinColumn({ name: 'appraisal_id' })
    appraisal: Appraisal;

    @Column({
        type: 'enum',
        enum: IDP_Competency,
        default: IDP_Competency.TECHNICAL
    })
    competency: IDP_Competency


    @Column('text')
    objective: string;

    @Column('text')
    development_plan: [string];


    @ManyToOne(() => Employee)
    @JoinColumn({ name: 'filled_by' })
    filled_by: Employee;
}
