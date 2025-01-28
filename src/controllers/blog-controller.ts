import express, {Request, Response} from 'express';
import {blogService} from '../service/blog-service';
import {HttpStatus} from '../settings';
import {
    blogDescriptionValidator,
    blogNameValidator,
    blogWebsiteUrlValidator,
    paramIdValidator
} from '../middleware/input-validators';
import {errorsResultMiddleware} from '../middleware/errors-result-middleware';
import {authValidator} from '../middleware/auth-validator';
import {BlogDBType} from '../types/blog-types';

export const blogRouter = express.Router();

const blogController = {
    async getBlogs(req: Request, res: Response): Promise<void> {
        let searchNameTerm = req.query.searchNameTerm ? req.query.searchNameTerm as string : null;
        let sortBy = req.query.sortBy ? req.query.sortBy as string : 'createdAt';
        let sortDirection = req.query.sortDirection && req.query.sortDirection === 'asc' ? 'asc' : 'desc';
        let pageNumber = req.query.pageNumber ? +req.query.pageNumber as number: 1;
        let pageSize = req.query.pageSize ? +req.query.pageSize as number: 10;

        const blogs =
            await blogService.findBlogs({searchNameTerm, sortBy, sortDirection, pageNumber, pageSize,});
        res.status(HttpStatus.OK).send(blogs);
    },
    async getBlogById(req: Request, res: Response): Promise<void> {
        let blog: any = (await blogService.findBlogsById(req.params.id))[0];
        if (!blog) {
            res.sendStatus(HttpStatus.NOT_FOUND);
        } else {
            res.status(HttpStatus.OK).send(blog);
        }
    },
    async createBlog(req: Request, res: Response): Promise<void> {
        const blog = (await blogService.createBlog(req.body))[0];
        if (blog) res.status(HttpStatus.CREATED).send(blog);
    },
    async updateBlog(req: Request, res: Response): Promise<void> {
        const blog = await blogService.updateBlog(req.params.id, req.body);
        if (blog) {
            res.sendStatus(HttpStatus.NO_CONTENT);
        } else {
            res.sendStatus(HttpStatus.NOT_FOUND);
        }
    },
    async deleteBlog(req: Request, res: Response): Promise<void> {
        const blog = await blogService.deleteBlog(req.params.id);
        if (blog) {
            res.sendStatus(HttpStatus.NO_CONTENT);
        } else {
            res.sendStatus(HttpStatus.NOT_FOUND);
        }
    },
};
blogRouter.get('/', blogController.getBlogs);
blogRouter.post('/',
    authValidator,
    blogNameValidator,
    blogDescriptionValidator,
    blogWebsiteUrlValidator,
    errorsResultMiddleware,
    blogController.createBlog);
blogRouter.get('/:id',
    paramIdValidator,
    blogController.getBlogById);
blogRouter.put('/:id',
    authValidator,
    paramIdValidator,
    blogNameValidator,
    blogDescriptionValidator,
    blogWebsiteUrlValidator,
    errorsResultMiddleware,
    blogController.updateBlog);
blogRouter.delete('/:id',
    authValidator,
    paramIdValidator,
    blogController.deleteBlog);