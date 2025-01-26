import {NextFunction, Request, Response} from 'express';
import {SETTINGS} from '../settings';

const loginPassword = `${SETTINGS.LOGIN}:${SETTINGS.PASSWORD}`;
const encodedAuth = Buffer.from(loginPassword, 'utf-8').toString('base64');
export const authToken = 'Basic ' + encodedAuth;

export const authValidator = (req: Request, res: Response, next: NextFunction) => {
    const authorization = req.headers['authorization'] as string;
    console.log(authorization);
    if (!authorization || !authorization.startsWith('Basic ') || authorization !== authToken) {
        res.sendStatus(401);
        return;
    }
    next();
};
