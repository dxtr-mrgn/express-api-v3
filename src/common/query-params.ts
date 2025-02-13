import {Request} from 'express';

export const commonQueryParams = (req: Request) => {
    const sortBy = req.query.sortBy ? req.query.sortBy as string : 'createdAt';
    const sortDirection = req.query.sortDirection && req.query.sortDirection === 'asc' ? 'asc' : 'desc';
    const pageNumber = req.query.pageNumber ? +req.query.pageNumber as number : 1;
    const pageSize = req.query.pageSize ? +req.query.pageSize as number : 10;

    return {sortBy, sortDirection, pageNumber, pageSize};
}
export const blogQueryParams = (req: Request) => {
    const searchNameTerm = req.query.searchNameTerm ? req.query.searchNameTerm as string : null;

    return {searchNameTerm};
};

export const userQueryParams = (req: Request) => {
    const searchLoginTerm = req.query.searchLoginTerm ? req.query.searchLoginTerm as string : null;
    const searchEmailTerm = req.query.searchEmailTerm ? req.query.searchEmailTerm as string : null;

    return {searchLoginTerm, searchEmailTerm};

};
