import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Appraisal } from './Appraisal.entity';
import AbstractEntity from './abstract.entity';

@Entity('self_appraisal_entries')
export class SelfAppraisalEntry extends AbstractEntity{

  @ManyToOne(() => Appraisal)
  @JoinColumn({ name: 'appraisal_id' })
  appraisal: Appraisal;

//   @Column()
//   sn: number;

  @Column('text')
  delivery_details: string;

  @Column('text')
  accomplishments: string;

  @Column('text')
  approach_solution: string;

  @Column('text')
  improvement_possibilities: string;

  @Column('text')
  project_time_frame: string;
}
