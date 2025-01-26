import {Request, Response, NextFunction} from 'express';
import {validationResult} from 'express-validator';
import {HttpStatus} from '../settings';

export const errorsResultMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    console.log(req.body)

    if (!errors.isEmpty()) {
        const filteredError = errors.array({onlyFirstError: true})
            .map((e) => {
                return {message: e.msg, field: (e as any).path};
            });

        if (filteredError[0].field == 'id') {
            res.sendStatus(HttpStatus.NOT_FOUND);
            return;
        }

        res.status(HttpStatus.BAD_REQUEST).send({errorsMessages: filteredError});
        return;
    }
    next();
};