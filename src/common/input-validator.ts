import {param} from 'express-validator';
import {ObjectId} from 'mongodb';

export const paramIdValidator = param('id')
    .notEmpty()
    .custom(value => {
        if (!ObjectId.isValid(value)) {
            throw new Error('Id should be valid');
        }
        return true;
    });