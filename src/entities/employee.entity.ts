import { Column, Entity, ManyToOne, OneToOne } from "typeorm";
import AbstractEntity from "./abstract.entity";

export enum EmployeeRole {
  LEAD = 'LEAD',
  DEVELOPER = 'DEVELOPER',
  HR = 'HR'
}

export enum Status {
 ACTIVE = "ACTIVE",
 INACTIVE = "INACTIVE",
 PROBATION = "PROBATION"
}

@Entity()
class Employee extends AbstractEntity {

  @Column({unique: true})
  employeeId: string

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column()
  age: number;

  @Column({
    type: 'enum',
    enum: EmployeeRole,
    default: EmployeeRole.DEVELOPER
  })
  role: EmployeeRole;

  @Column()
  password?: string;

  @Column()
  experience: number;

   @Column({
    type: 'enum',
    enum: Status,
    default: Status.INACTIVE
  })
  status: Status;

  @Column({type:"date"})
  dateOfJoining: Date;
}

export default Employee;
