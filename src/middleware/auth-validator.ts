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

import {body} from 'express-validator';

export const loginOrEmailValidator = body('loginOrEmail')
    .trim()
    .notEmpty().withMessage('loginOrEmail is required')
    .isString().withMessage('loginOrEmail should be string')
    .custom(value => {
        if (typeof value !== 'string') {
            throw new Error('loginOrEmail should be string');
        }
        if (!isNaN(Number(value))) {
            throw new Error('loginOrEmail should be string');
        }
        return true;
    });


export const passwordValidator = body('password')
    .trim()
    .notEmpty().withMessage('password is required')
    .isString().withMessage('password should be string')
    .custom(value => {
        if (typeof value !== 'string') {
            throw new Error('password should be string');
        }
        if (!isNaN(Number(value))) {
            throw new Error('password should be string');
        }
        return true;
    });