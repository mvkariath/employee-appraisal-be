import { JwtPayload } from "../dto/jwt-payload";
import HttpException from "../exceptions/httpExceptions";
import { JWT_SECRET, JWT_VALIDITY } from "../utils/constants";
import EmployeeService from "./employee.service";
import  bcrypt  from "bcrypt" ;
import jwt from 'jsonwebtoken'
import { LoggerService } from "./logger.service";

class AuthService {
    private logger = LoggerService.getInstance('AuthService');
    
    constructor(private employeeService: EmployeeService) {}

    async login(email: string, password: string) {
        const employee = await this.employeeService.getEmployeeByEmail(email);
        if(!employee) {
            this.logger.error('invalid user email');
            throw new HttpException(404,"No such user");
        }
        const isPasswordValid = await bcrypt.compare(password,employee.password);

        if (!isPasswordValid) {
            this.logger.error('invalid password');
            throw new HttpException(400,"Invalid Password");
        }

        const payload: JwtPayload = {
            id: employee.id,
            email:employee.email,
            name: employee.name,
            role:employee.role
        }
        const token = jwt.sign(payload,JWT_SECRET,{expiresIn:JWT_VALIDITY})
        return {
            tokenType: "Bearer",
            accessToken: {...payload,token}
        }
    }
}

export default AuthService;