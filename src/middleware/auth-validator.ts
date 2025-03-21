import {NextFunction, Request, Response} from 'express';
import {SETTINGS} from '../settings';
import {body} from 'express-validator';

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

export const loginOrEmailValidator = body('loginOrEmail')
    .trim()
    .notEmpty().withMessage('loginOrEmail is required')
    .isString().withMessage('loginOrEmail should be string');


export const passwordValidator = body('password')
    .trim()
    .notEmpty().withMessage('password is required')
    .isString().withMessage('password should be string');