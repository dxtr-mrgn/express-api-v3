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

export const userRouter = express.Router();

const userController = {
    async getUsers(req: Request, res: Response): Promise<void> {
        const queryParams = {...userQueryParams(req), ...commonQueryParams(req)};

        const users =
            await userService.findUsers(queryParams);
        res.status(HttpStatus.OK).send(users);
    },
    async createUser(req: Request, res: Response): Promise<void> {

        const user = await userService.createUser(req.body);
        if (user) res.status(HttpStatus.CREATED).send(user);
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
userRouter.get('/', userController.getUsers);
userRouter.post('/',
    createLoginValidator,
    createPasswordValidator,
    createEmailValidator,
    errorsResultMiddleware,
    userController.createUser);
userRouter.delete('/:id',
    paramIdValidator,
    errorsResultMiddleware,
    userController.deleteUser);