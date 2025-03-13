import {ObjectId} from 'mongodb';
import {Response} from 'express';
import {HttpStatus} from '../settings';

export const toIdString = (id: ObjectId): string => id.toString();

export const sendResponse = (res: Response, status: HttpStatus, data?: any): void => {
    console.log(`Sending response: status=${status}`, data ? `data=${JSON.stringify(data)}` : '');
    if (status === HttpStatus.NO_CONTENT || !data) {
        res.sendStatus(status);
    } else {
        res.status(status).json(data);
    }
};