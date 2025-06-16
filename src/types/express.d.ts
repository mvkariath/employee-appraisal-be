import { JwtPayload } from "../dto/jwt-payload";

declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload
        }
    }
}