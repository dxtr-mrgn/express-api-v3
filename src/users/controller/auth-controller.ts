import express, {Request, Response, Router} from 'express';
import {HttpStatus} from '../../settings';
import {userService} from '../service/user-service';
import {jwtService} from '../service/jwt-service';
import {authService} from '../service/auth-service';
import {userQwRepository} from '../repository/user.qwery.repository';
import {loginOrEmailValidator, passwordValidator} from '../../middleware/auth-validator';
import {errorsResultMiddleware} from '../../middleware/errors-result-middleware';
import {authMiddleware, provideCodeMiddleware} from '../validator-middleware/auth-middleware';
import {
    createEmailValidator,
    createLoginValidator,
    createPasswordValidator,
} from '../validator-middleware/input-validator';
import {
    ConfirmationCodeRequestBody,
    ConfirmationResendEmailRequestBody,
    LoginRequestBody,
    UserInputType,
} from '../types/user-type';
import {sendResponse} from '../../common/helper';

interface AuthRequest<ReqBody = any> extends Request<any, any, ReqBody> {
    userId?: string;
}

const authController = {
    async login(req: AuthRequest<LoginRequestBody>, res: Response): Promise<void> {
        const {loginOrEmail, password} = req.body;
        const userId = await authService.checkCredentials(loginOrEmail, password);

        if (!userId) {
            return sendResponse(res, HttpStatus.UNAUTHORIZED);
        }

        const token = await jwtService.createJWT(userId);
        sendResponse(res, HttpStatus.OK, {accessToken: token});
    },

    async register(req: AuthRequest<UserInputType>, res: Response): Promise<void> {
        const result = await authService.registerUser(req.body);
        sendResponse(
            res,
            result.status === 'success' ? HttpStatus.NO_CONTENT : HttpStatus.BAD_REQUEST,
            result.error
        );
    },

    async confirmRegistration(req: AuthRequest<ConfirmationCodeRequestBody>, res: Response): Promise<void> {
        const {code} = req.body;
        const result = await authService.confirmEmail(code);
        sendResponse(
            res,
            result.status === 'success' ? HttpStatus.NO_CONTENT : HttpStatus.BAD_REQUEST,
            result.error
        );
    },

    async resendConfirmationEmail(req: AuthRequest<ConfirmationResendEmailRequestBody>, res: Response): Promise<void> {
        const {email} = req.body;
        const result = await authService.resendConfirmation(email);
        sendResponse(
            res,
            result.status === 'success' ? HttpStatus.NO_CONTENT : HttpStatus.BAD_REQUEST,
            result.error
        );
    },

    async getUserInfo(req: AuthRequest, res: Response): Promise<void> {
        const userInfo = await userQwRepository.getUserInfo(req.userId!);
        sendResponse(res, HttpStatus.OK, userInfo);
    },
};

export const authRouter: Router = express.Router();

authRouter.post(
    '/login',
    loginOrEmailValidator,
    passwordValidator,
    errorsResultMiddleware,
    authController.login
);

authRouter.post(
    '/registration',
    createLoginValidator,
    createPasswordValidator,
    createEmailValidator,
    errorsResultMiddleware,
    authController.register
);

authRouter.post(
    '/registration-confirmation',
    provideCodeMiddleware,
    errorsResultMiddleware,
    authController.confirmRegistration
);

authRouter.post(
    '/registration-email-resending',
    errorsResultMiddleware,
    authController.resendConfirmationEmail
);

authRouter.get(
    '/me',
    authMiddleware,
    authController.getUserInfo
);