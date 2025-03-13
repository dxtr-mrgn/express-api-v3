import express, {Request, Response, Router} from 'express';
import {HttpStatus} from '../../settings';
import {commonQueryParams, userQueryParams} from '../../common/query-params';
import {userService} from '../service/user-service';
import {userQwRepository} from '../repository/user.qwery.repository';
import {ResultObj} from '../../common/types';
import {authValidator} from '../../middleware/auth-validator';
import {errorsResultMiddleware} from '../../middleware/errors-result-middleware';
import {paramIdValidator} from '../../common/input-validator';
import {
    createEmailValidator,
    createLoginValidator,
    createPasswordValidator,
} from '../validator-middleware/input-validator';
import {UserInputType} from '../types/user-type';

interface UserQueryRequest extends Request {
    query: {
        searchLoginTerm?: string;
        searchEmailTerm?: string;
        sortBy?: string;
        sortDirection?: 'asc' | 'desc';
        pageNumber?: string;
        pageSize?: string;
    };
}

interface UserCreateRequest extends Request<{}, {}, UserInputType> {
}

interface UserDeleteRequest extends Request<{ id: string }> {
}

const sendResponse = (res: Response, status: HttpStatus, data?: any): void => {
    console.log(`Sending response: status=${status}`, data ? `data=${JSON.stringify(data)}` : '');
    if (status === HttpStatus.NO_CONTENT || !data) {
        res.sendStatus(status);
    } else {
        res.status(status).json(data);
    }
};

const userController = {
    async getUsers(req: UserQueryRequest, res: Response): Promise<void> {
        const query = {...userQueryParams(req), ...commonQueryParams(req)};
        const users = await userQwRepository.findUsers(query);
        sendResponse(res, HttpStatus.OK, users);
    },

    async createUser(req: UserCreateRequest, res: Response): Promise<void> {
        const result: ResultObj = await userService.createUser(req.body);

        if (result.status === 'success') {
            const user = await userQwRepository.findUserById(result.id!);
            sendResponse(res, HttpStatus.CREATED, user);
        } else {
            sendResponse(res, HttpStatus.BAD_REQUEST, result.error);
        }
    },

    async deleteUser(req: UserDeleteRequest, res: Response): Promise<void> {
        const deleted = await userService.deleteUser(req.params.id);
        sendResponse(res, deleted ? HttpStatus.NO_CONTENT : HttpStatus.NOT_FOUND);
    },
};

export const userRouter: Router = express.Router();

userRouter.get(
    '/', authValidator,
    userController.getUsers
);

userRouter.post(
    '/',
    authValidator,
    createLoginValidator,
    createPasswordValidator,
    createEmailValidator,
    errorsResultMiddleware,
    userController.createUser
);

userRouter.delete(
    '/:id',
    authValidator,
    paramIdValidator,
    errorsResultMiddleware,
    userController.deleteUser
);
