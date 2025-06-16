import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, ManyToOne } from 'typeorm';
import { Appraisal } from './Appraisal.entity';
import Employee from './/employee.entity';
import AbstractEntity from './abstract.entity';
import { Exclude } from 'class-transformer';

export enum IDP_Competency {
    TECHNICAL = "TECHNICAL",
    BEHAVIORAL = "BEHAVIORAL",
    FUNCTIONAL = "FUNCTIONAL",
}

@Entity('individual_development_plan')
export class IndividualDevelopmentPlan extends AbstractEntity {

    @ManyToOne(() => Appraisal)
    @Exclude()
    @JoinColumn({ name: 'appraisal_id' })
    appraisal: Appraisal;

    @Column({
        type: 'enum',
        enum: IDP_Competency,
        default: IDP_Competency.TECHNICAL
    })
    competency: IDP_Competency


    @Column('text')
    technical_objective: string;

    @Column('text')
    technical_plan: string;


    @ManyToOne(() => Employee)
    @JoinColumn({ name: 'filled_by' })
    filled_by: Employee;
}
