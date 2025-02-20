import {NextFunction, Response, Request} from 'express';
import {HttpStatus} from '../../settings';
import {jwtService} from '../service/jwt-service';
import {userQwRepository} from '../repository/user.qwery.repository';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) {
        res.sendStatus(HttpStatus.UNAUTHORIZED);
        return;
    }

    const token = req.headers.authorization.split(' ')[1];
    const userId = await jwtService.getUserIdByToken(token);
    if (userId) {
        req.userId = await userQwRepository.getUserInfo(userId);
    }
    next();
};