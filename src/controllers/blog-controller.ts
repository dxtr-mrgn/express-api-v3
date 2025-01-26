import express, {Request, Response} from 'express';
import {blogRepository} from '../repositories/blog-repository';
import {HttpStatus} from '../settings';
import {
    blogDescriptionValidator,
    paramIdValidator,
    blogNameValidator,
    blogWebsiteUrlValidator
} from '../middleware/input-validators';
import {errorsResultMiddleware} from '../middleware/errors-result-middleware';
import {authValidator} from '../middleware/auth-validator';

export const blogRouter = express.Router();

const blogController: any = {
    async getBlogs(req: Request, res: Response) {
        const blogs = await blogRepository.findBlogs();
        res.status(HttpStatus.OK).send(blogs);
    },
    async getBlogById(req: Request, res: Response) {
        const blog = (await blogRepository.findBlogs(req.params.id))[0];
        if (!blog) {
            res.sendStatus(HttpStatus.NOT_FOUND);
        } else {
            res.status(HttpStatus.OK).send(blog);
        }
    },
    async createBlog(req: Request, res: Response) {
        const blog = (await blogRepository.createBlog(req.body))[0];
        if (blog) res.status(HttpStatus.CREATED).send(blog);
    },
    async updateBlog(req: Request, res: Response) {
        const blog = await blogRepository.updateBlog(req.params.id, req.body);
        if (blog) {
            res.sendStatus(HttpStatus.NO_CONTENT);
        } else {
            res.sendStatus(HttpStatus.NOT_FOUND);
        }
    },
    async deleteBlog(req: Request, res: Response) {
        const blog = await blogRepository.deleteBlog(req.params.id);
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