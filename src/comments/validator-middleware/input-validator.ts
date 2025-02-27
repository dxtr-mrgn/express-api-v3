import {body} from 'express-validator';

const MIN_CONTENT_LENGTH = 20;
const MAX_CONTENT_LENGTH = 300;

export const commentContentValidator = body('content')
    .trim()
    .notEmpty()
        .withMessage('content is required')
    .isString()
        .withMessage('content should be string')
    .custom((value: string) => {
        if (!isNaN(Number(value))) {
            throw new Error('content should be string');
        }
        return true;
    })
    .isLength({min: MIN_CONTENT_LENGTH, max: MAX_CONTENT_LENGTH})
        .withMessage(`content should contain ${MIN_CONTENT_LENGTH} - ${MAX_CONTENT_LENGTH} characters`);

