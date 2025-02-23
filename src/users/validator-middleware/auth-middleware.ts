import { Request, Response } from 'express';
import { NextFunction } from 'express-serve-static-core';
import {HttpStatus} from '../../settings';
import {jwtService} from '../service/jwt-service';
import {userQwRepository} from '../repository/user.qwery.repository';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) {
        res.sendStatus(HttpStatus.UNAUTHORIZED);
        return;
    }

    const token = req.headers.authorization.split(' ')[1];
    // @ts-ignore
    req.userId = await jwtService.getUserIdByToken(token);
    // if (userId) {
    //     req.userId = await userQwRepository.getUserInfo(userId);
    // }
    next();
};