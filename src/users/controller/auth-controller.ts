import express, {Request, Response} from 'express';
import {HttpStatus} from '../../settings';
import {userService} from '../service/user-service';
import {loginOrEmailValidator, passwordValidator} from '../../middleware/auth-validator';
import {errorsResultMiddleware} from '../../middleware/errors-result-middleware';
import {jwtService} from '../service/jwt-service';
import {userQwRepository} from '../repository/user.qwery.repository';
import {UserInfoType} from '../types/user-type';
import {authMiddleware} from '../validator-middleware/auth-middleware';

export const authRouter = express.Router();

const authController = {
    async login(req: Request, res: Response): Promise<void> {
        const userId: string | null = await userService.checkCredentials(req.body.loginOrEmail, req.body.password);
        if (!userId) {
            res.sendStatus(HttpStatus.UNAUTHORIZED);
        } else {
            const token = await jwtService.createJWT(userId)
            res.status(HttpStatus.OK).send(token);
        }
    },
    async info(req: Request, res: Response): Promise<void> {
        // @ts-ignore
        const userInfo: UserInfoType = await userQwRepository.getUserInfo(req.userId)
        res.status(HttpStatus.OK).send(userInfo);
    },
};


authRouter.post('/',
    loginOrEmailValidator,
    passwordValidator,
    errorsResultMiddleware,
    authController.login);

authRouter.get('/',
    authMiddleware,
    authController.info);