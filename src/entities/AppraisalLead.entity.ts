import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column } from 'typeorm';
import { Appraisal } from './Appraisal.entity';
import Employee from './employee.entity';
import AbstractEntity from './abstract.entity';

@Entity('appraisal_leads')
export class AppraisalLead extends AbstractEntity {

  @ManyToOne(() => Appraisal)
  @JoinColumn({ name: 'appraisal_id' })
  appraisal: Appraisal;

  @ManyToOne(() => Employee, { eager: true }) // eager = true if you want to auto-load lead
  @JoinColumn({ name: 'lead_id' })
  lead: Employee;

}
