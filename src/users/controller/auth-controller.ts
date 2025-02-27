import express, {Request, Response} from 'express';
import {HttpStatus} from '../../settings';
import {userService} from '../service/user-service';
import {authValidator, loginOrEmailValidator, passwordValidator} from '../../middleware/auth-validator';
import {errorsResultMiddleware} from '../../middleware/errors-result-middleware';
import {jwtService} from '../service/jwt-service';
import {userQwRepository} from '../repository/user.qwery.repository';
import {authMiddleware} from '../validator-middleware/auth-middleware';

interface LoginRequestBody {
    loginOrEmail: string;
    password: string;
}

interface AuthRequest<P = any, ResBody = any, ReqBody = any> extends Request<P, ResBody, ReqBody> {
    userId?: string;
}

export const authRouter = express.Router();

const sendResponse = <T>(res: Response, status: HttpStatus, data?: T) => {
    data ? res.status(status).json(data) : res.sendStatus(status);
};
const authController = {
    async login(req: AuthRequest<{}, {}, LoginRequestBody>, res: Response): Promise<void> {
        const userId = await userService.checkCredentials(req.body.loginOrEmail, req.body.password);
        if (!userId) {
            res.sendStatus(HttpStatus.UNAUTHORIZED);
            return;
        }
        const token = await jwtService.createJWT(userId);
        sendResponse(res, HttpStatus.OK, token);
    },
    async info(req: AuthRequest, res: Response): Promise<void> {
        const userInfo = await userQwRepository.getUserInfo(req.userId!);
        sendResponse(res, HttpStatus.OK, userInfo);
    },
};


authRouter.post('/login',
    authValidator,
    loginOrEmailValidator,
    passwordValidator,
    errorsResultMiddleware,
    authController.login);

authRouter.get('/me',
    authMiddleware,
    authController.info);