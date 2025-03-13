import {Request} from 'express';

export type ResultObj = {
    status: 'success' | 'error',
    id?: string,
    error?: any
}

export type errorMessage = {
    field: string,
    message: string
}

export interface AuthRequest<Params = any, ReqBody = any> extends Request<Params, any, ReqBody> {
    userId?: string;
}