import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import Employee from './employee.entity';
import AbstractEntity from './abstract.entity';

@Entity('audit_logs')
export class AuditLog extends AbstractEntity{

  @ManyToOne(() => Employee)
  @JoinColumn({ name: 'employee_id' })
  Employee: Employee;

  @Column('text')
  action: string;

  @Column('text')
  table_name: string;

  @Column('int')
  record_id: number;

  @Column('json', { nullable: true })
  old_value: Record<string, any>;

  @Column('json', { nullable: true })
  new_value: Record<string, any>;

  @CreateDateColumn()
  timestamp: Date;
}
