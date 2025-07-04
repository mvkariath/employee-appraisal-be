import { Repository } from "typeorm";
import Employee, { EmployeeRole } from "../entities/employee.entity";

class EmployeeRepository {
    constructor(private repository: Repository<Employee>) { }

    async create(employee: Employee): Promise<Employee> {
        return this.repository.save(employee);
    }

    async findMany(): Promise<Employee[]> {
        return this.repository.find();
    }

    async findById(id: number): Promise<Employee> {
        return this.repository.findOne({
            where: { id }
        });
    }
    async findByRole(givenRole:EmployeeRole):Promise<Employee[]>{
        return this.repository.find({
            where:{role:givenRole}
        })
    }

    async findByEmail(email: string): Promise<Employee> {
        return this.repository.findOne({
            where: { email: email }
        })
    }

    async update(id: number, employee: Employee): Promise<void> {
        await this.repository.save({ id, ...employee });
    }

    async delete(id: number): Promise<void> {
        await this.repository.delete(id);
    }

    async remove(employee: Employee): Promise<void> {
        await this.repository.softRemove(employee);
    }

    async countAll(): Promise<number> {
        return this.repository.count();
    }

}

export default EmployeeRepository;