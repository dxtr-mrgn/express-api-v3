import express, {Request, Response} from 'express';
import {HttpStatus} from '../../settings';
import {userService} from '../service/user-service';
import {loginOrEmailValidator, passwordValidator} from '../../middleware/auth-validator';
import {errorsResultMiddleware} from '../../middleware/errors-result-middleware';

export const authRouter = express.Router();

const authController = {
    async login(req: Request, res: Response): Promise<void> {
        const loggedIn: boolean = await userService.checkCredentials(req.body.loginOrEmail, req.body.password);
        if (!loggedIn) {
            res.sendStatus(HttpStatus.UNAUTHORIZED);
        } else {
            res.sendStatus(HttpStatus.NO_CONTENT);
        }
    },
};

authRouter.get('/',
    loginOrEmailValidator,
    passwordValidator,
    errorsResultMiddleware,
    authController.login);