import express, {Request, Response} from 'express';
import {HttpStatus} from '../../settings';
import {commonQueryParams, userQueryParams} from '../../common/query-params';
import {userService} from '../service/user-service';
import {
    createEmailValidator,
    createLoginValidator,
    createPasswordValidator
} from '../validator-middleware/input-validator';
import {paramIdValidator} from '../../common/input-validator';
import {errorsResultMiddleware} from '../../middleware/errors-result-middleware';
import {authValidator} from '../../middleware/auth-validator';
import {userQwRepository} from '../repository/user.qwery.repository';
import {ResultObj} from '../../common/types';

export const userRouter = express.Router();

const userController = {
    async getUsers(req: Request, res: Response): Promise<void> {
        const queryParams = {...userQueryParams(req), ...commonQueryParams(req)};

        const users =
            await userQwRepository.findUsers(queryParams);
        res.status(HttpStatus.OK).send(users);
    },
    async createUser(req: Request, res: Response): Promise<void> {
        const result: ResultObj = await userService.createUser(req.body);
        if (result.status === 'success') {
            const user = await userQwRepository.findUserById(result.id!);
            res.status(HttpStatus.CREATED).send(user);
        } else {
            res.status(HttpStatus.BAD_REQUEST).send(result.error);
        }
    },
    async deleteUser(req: Request, res: Response): Promise<void> {
        const user = await userService.deleteUser(req.params.id);
        if (user) {
            res.sendStatus(HttpStatus.NO_CONTENT);
        } else {
            res.sendStatus(HttpStatus.NOT_FOUND);
        }
    },
};
userRouter.get('/',
    authValidator,
    userController.getUsers);
userRouter.post('/',
    authValidator,
    createLoginValidator,
    createPasswordValidator,
    createEmailValidator,
    errorsResultMiddleware,
    userController.createUser);
userRouter.delete('/:id',
    authValidator,
    paramIdValidator,
    errorsResultMiddleware,
    userController.deleteUser);