import express, {Request, Response} from 'express';
import {blogService} from '../service/blog-service';
import {HttpStatus} from '../../settings';
import {
    blogDescriptionValidator,
    blogNameValidator,
    blogWebsiteUrlValidator,
    paramIdValidator,
    postContentValidator,
    postShortDescriptionValidator,
    postTitleValidator
} from '../../middleware/input-validators';
import {errorsResultMiddleware} from '../../middleware/errors-result-middleware';
import {authValidator} from '../../middleware/auth-validator';
import {postService} from '../../posts/service/post-service';
import {blogQueryParams, commonQueryParams, userQueryParams} from './query-params';

export const blogRouter = express.Router();

const blogController = {
    async getBlogs(req: Request, res: Response): Promise<void> {
        const queryParams = {...blogQueryParams(req), ...commonQueryParams(req)};

        const blogs =
            await blogService.findBlogs(queryParams);
        res.status(HttpStatus.OK).send(blogs);
    },
    async getPostByBlogId(req: Request, res: Response): Promise<void> {
        const blogId = req.params.id;
        const blog: any = await blogService.findBlogsById(blogId);
        if (!blog) {
            res.sendStatus(HttpStatus.NOT_FOUND);
        } else {

            const queryParams = {blogId, ...commonQueryParams(req)};


            const posts = await postService.findPosts(queryParams);
            if (posts) res.status(HttpStatus.OK).send(posts);
        }
    },
    async getBlogById(req: Request, res: Response): Promise<void> {
        const blog: any = await blogService.findBlogsById(req.params.id);
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
    async createPostByBlogId(req: Request, res: Response): Promise<void> {
        const blog: any = await blogService.findBlogsById(req.params.id);
        if (!blog) {
            res.sendStatus(HttpStatus.NOT_FOUND);
        } else {
            req.body.blogId = req.params.id;
            const post = await postService.createPost(req.body);
            if (post) res.status(HttpStatus.CREATED).send(post);
        }
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
    errorsResultMiddleware,
    blogController.getBlogById);
blogRouter.get('/:id/posts',
    paramIdValidator,
    errorsResultMiddleware,
    blogController.getPostByBlogId);
blogRouter.post('/:id/posts',
    authValidator,
    paramIdValidator,
    postTitleValidator,
    postShortDescriptionValidator,
    postContentValidator,
    errorsResultMiddleware,
    blogController.createPostByBlogId);
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
    errorsResultMiddleware,
    blogController.deleteBlog);