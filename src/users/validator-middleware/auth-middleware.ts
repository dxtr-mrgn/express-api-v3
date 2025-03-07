import {Request, Response} from 'express';
import {NextFunction} from 'express-serve-static-core';
import {HttpStatus} from '../../settings';
import {jwtService} from '../service/jwt-service';

type MessageType = {
    message: string,
    field: string
}

type ErrorMessagesType = {
    errorsMessages: MessageType[]
}
export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) {
        res.sendStatus(HttpStatus.UNAUTHORIZED);
        return;
    }

    const token = req.headers.authorization.split(' ')[1];
    const userId = await jwtService.getUserIdByToken(token);
    if (userId) {
        // @ts-ignore
        req.userId = userId;
    } else {
        res.sendStatus(HttpStatus.UNAUTHORIZED);
        return;
    }
    next();
};

export const provideCodeMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<ErrorMessagesType | void> => {
    req.body.code = req.query.code;
    next();
};
