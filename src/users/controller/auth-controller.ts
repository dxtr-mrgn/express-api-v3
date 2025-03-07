import express, {Request, Response} from 'express';
import {HttpStatus} from '../../settings';
import {userService} from '../service/user-service';
import {loginOrEmailValidator, passwordValidator} from '../../middleware/auth-validator';
import {errorsResultMiddleware} from '../../middleware/errors-result-middleware';
import {jwtService} from '../service/jwt-service';
import {userQwRepository} from '../repository/user.qwery.repository';
import {authMiddleware, provideCodeMiddleware} from '../validator-middleware/auth-middleware';
import {UserInputType} from '../types/user-type';
import {authService} from '../service/auth-service';
import {
    createEmailValidator,
    createLoginValidator,
    createPasswordValidator
} from '../validator-middleware/input-validator';

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
        const result = await authService.registerUser(req.body);
        if (result.status === 'success') {
            res.sendStatus(HttpStatus.NO_CONTENT);
        } else {
            res.sendStatus(HttpStatus.BAD_REQUEST);
        }
    },
    async registrationConfirmation(req: AuthRequest<{}, {}, ConfirmationCodeRequestBody>, res: Response): Promise<void> {
        const result = await authService.confirmEmail(req.body.code);
        if (result.status !== 'success') {
            res.status(HttpStatus.BAD_REQUEST).json(result.error);
        } else {
            res.sendStatus(HttpStatus.NO_CONTENT);
        }
    },
    async resendConfirmation(req: AuthRequest<{}, {}, ConfirmationResendEmailRequestBody>, res: Response): Promise<void> {
        const resent = await authService.resendConfirmation(req.body.email);
        if (resent.status === 'success') {
            res.sendStatus(HttpStatus.NO_CONTENT);
        } else {
            res.status(HttpStatus.BAD_REQUEST).json(resent.error);
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
    createLoginValidator,
    createPasswordValidator,
    createEmailValidator,
    errorsResultMiddleware,
    authController.registration);

authRouter.post('/registration-confirmation',
    provideCodeMiddleware,
    errorsResultMiddleware,
    authController.registrationConfirmation);

authRouter.post('/registration-email-resending',
    errorsResultMiddleware,
    authController.resendConfirmation);

authRouter.get('/me',
    authMiddleware,
    authController.info);