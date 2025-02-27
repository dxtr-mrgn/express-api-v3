import {Request} from 'express';

export const commonQueryParams = (req: Request) => {
    const sortBy: string = req.query.sortBy ? req.query.sortBy as string : 'createdAt';
    const sortDirection: 'asc' | 'desc' = req.query.sortDirection && req.query.sortDirection === 'asc' ? 'asc' : 'desc';
    const pageNumber: number = req.query.pageNumber ? +req.query.pageNumber as number : 1;
    const pageSize: number = req.query.pageSize ? +req.query.pageSize as number : 10;

    return {sortBy, sortDirection, pageNumber, pageSize};
}
export const blogQueryParams = (req: Request) => {
    const searchNameTerm: string | null = req.query.searchNameTerm ? req.query.searchNameTerm as string : null;

    return {searchNameTerm};
};

export const userQueryParams = (req: Request) => {
    const searchLoginTerm: string = req.query.searchLoginTerm ? req.query.searchLoginTerm as string : '';
    const searchEmailTerm: string = req.query.searchEmailTerm ? req.query.searchEmailTerm as string : '';

    return {searchLoginTerm, searchEmailTerm};

};
