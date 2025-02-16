import {body} from 'express-validator';

export const createLoginValidator = body('login')
    .trim()
    .notEmpty().withMessage('login is required')
    .isString().withMessage('login should be string')
    .custom(value => {
        if (typeof value !== 'string') {
            throw new Error('login should be string');
        }
        if (!isNaN(Number(value))) {
            throw new Error('login should be string');
        }
        return true;
    })
    .isLength({min: 3, max: 10}).withMessage('login should contain 3 - 10 characters')
    .matches('^[a-zA-Z0-9_-]*$').withMessage('login should match Login pattern');

export const createPasswordValidator = body('password')
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
    })
    .isLength({min: 6, max: 20}).withMessage('password should contain 6 - 20 characters');

export const createEmailValidator = body('email')
    .trim()
    .notEmpty().withMessage('email is required')
    .isString().withMessage('email should be string')
    .custom(value => {
        if (typeof value !== 'string') {
            throw new Error('email should be string');
        }
        if (!isNaN(Number(value))) {
            throw new Error('email should be string');
        }
        return true;
    })
    .isLength({min: 1, max: 100}).withMessage('email should contain 1 - 100 characters')
    .matches('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$').withMessage('email should match Email pattern');

