import {Request, Router, NextFunction, Response} from "express";
import AuthService from "../services/auth.service";
import HttpException from "../exceptions/httpExceptions";
import { LoggerService } from "../services/logger.service";

export class AuthController {
    private logger = LoggerService.getInstance('AuthController');
    
    constructor(private authService: AuthService, private router: Router) {
        router.post('/login',this.login.bind(this))
    }

    async login (req : Request,res: Response,next: NextFunction) {
        try {
            const {email,password} = req.body;
            if(!email || !password) {
                this.logger.error('require email and password');
                throw new HttpException (400,"Email and password is required");
            }
            const data = await this.authService.login(email,password)
            this.logger.info('Authentication successfull');
            return res.status(200).json({data})
            
        } catch (error) {
            this.logger.error('Authentication failed');
            next(error);
        }
    }
}