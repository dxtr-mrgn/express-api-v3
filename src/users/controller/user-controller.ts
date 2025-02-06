import express, {Request, Response} from 'express';
import {HttpStatus} from '../../settings';
import {commonQueryParams, userQueryParams} from '../../blogs/controller/query-params';
import {userService} from '../service/user-service';

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
    userController.createUser);
userRouter.delete('/:id',
    userController.deleteUser);