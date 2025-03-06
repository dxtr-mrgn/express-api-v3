import express, {Request, Response} from 'express';
import {HttpStatus} from '../../settings';
import {userService} from '../service/user-service';
import {loginOrEmailValidator, passwordValidator} from '../../middleware/auth-validator';
import {errorsResultMiddleware} from '../../middleware/errors-result-middleware';
import {jwtService} from '../service/jwt-service';
import {userQwRepository} from '../repository/user.qwery.repository';
import {authMiddleware} from '../validator-middleware/auth-middleware';
import {UserInputType} from '../types/user-type';
import { getRegistrationEmailTemplate } from './registration-message';
import {authService} from '../service/auth-service';

interface LoginRequestBody {
    loginOrEmail: string;
    password: string;
}

interface ConfirmationCodeRequestBody {
    code: string;
}

interface ConfirmationResendEmailRequestBody {
    email: string;
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
        sendResponse(res, HttpStatus.OK, {accessToken: token});
    },
    async registration(req: AuthRequest<{}, {}, UserInputType>, res: Response): Promise<void> {
        const result = await userService.createUser(req.body);
        if (result.status === 'success') {
            res.send(HttpStatus.CREATED).json(HttpStatus.OK);
        } else {
            res.sendStatus(HttpStatus.BAD_REQUEST);
        }
    },
    async registrationConfirmation(req: AuthRequest<{}, {}, ConfirmationCodeRequestBody>, res: Response): Promise<void> {
        const registrationConfirmed = await authService.confirmEmail(req.body.code);
        if (!registrationConfirmed) {
            res.sendStatus(HttpStatus.BAD_REQUEST);
        } else {
            res.send(HttpStatus.CREATED).json(HttpStatus.OK);
        }
    },
    async resendConfirmation(req: AuthRequest<{}, {}, ConfirmationCodeRequestBody>, res: Response): Promise<void> {
        const registrationConfirmed = await authService.confirmEmail(req.body.code);
        if (!registrationConfirmed) {
            res.sendStatus(HttpStatus.BAD_REQUEST);
        } else {
            res.send(HttpStatus.CREATED).json(HttpStatus.OK);
        }
    },
    async info(req: AuthRequest, res: Response): Promise<void> {
        const userInfo = await userQwRepository.getUserInfo(req.userId!);
        sendResponse(res, HttpStatus.OK, userInfo);
    },
};


authRouter.post('/login',
    loginOrEmailValidator,
    passwordValidator,
    errorsResultMiddleware,
    authController.login);

authRouter.post('/registration',
    errorsResultMiddleware,
    authController.registration);

authRouter.post('/registration-confirmation',
    errorsResultMiddleware,
    authController.registrationConfirmation);

authRouter.post('/registration-email-resending',
    errorsResultMiddleware,
    authController.registration);

authRouter.get('/me',
    authMiddleware,
    authController.info);