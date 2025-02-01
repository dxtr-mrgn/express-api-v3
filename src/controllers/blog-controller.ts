import express, {Request, Response} from 'express';
import {blogService} from '../service/blog-service';
import {HttpStatus} from '../settings';
import {
    blogDescriptionValidator,
    blogNameValidator,
    blogWebsiteUrlValidator,
    paramIdValidator,
    postContentValidator,
    postShortDescriptionValidator,
    postTitleValidator
} from '../middleware/input-validators';
import {errorsResultMiddleware} from '../middleware/errors-result-middleware';
import {authValidator} from '../middleware/auth-validator';
import {postService} from '../service/post-service';

export const blogRouter = express.Router();

const blogController = {
    async getBlogs(req: Request, res: Response): Promise<void> {
        let searchNameTerm = req.query.searchNameTerm ? req.query.searchNameTerm as string : null;
        let sortBy = req.query.sortBy ? req.query.sortBy as string : 'createdAt';
        let sortDirection = req.query.sortDirection && req.query.sortDirection === 'asc' ? 'asc' : 'desc';
        let pageNumber = req.query.pageNumber ? +req.query.pageNumber as number : 1;
        let pageSize = req.query.pageSize ? +req.query.pageSize as number : 10;

        const blogs =
            await blogService.findBlogs({searchNameTerm, sortBy, sortDirection, pageNumber, pageSize,});
        res.status(HttpStatus.OK).send(blogs);
    },
    async getPostByBlogId(req: Request, res: Response): Promise<void> {
        let sortBy = req.query.sortBy ? req.query.sortBy as string : 'createdAt';
        let sortDirection = req.query.sortDirection && req.query.sortDirection === 'asc' ? 'asc' : 'desc';
        let pageNumber = req.query.pageNumber ? +req.query.pageNumber as number : 1;
        let pageSize = req.query.pageSize ? +req.query.pageSize as number : 10;
        const blogId = req.params.id;

        const blog: any = await blogService.findBlogsById(req.params.id);
        if (!blog) {
            res.sendStatus(HttpStatus.NOT_FOUND);
        }

        const posts = await postService.findPosts({blogId, sortBy, sortDirection, pageNumber, pageSize,});
        res.status(HttpStatus.OK).send(posts);
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
        const blogId = req.params.id;

        const blog: any = await blogService.findBlogsById(req.params.id);
        if (!blog) {
            res.sendStatus(HttpStatus.NOT_FOUND);
        }
        req.body.blogId = blogId;
        const post = await postService.createPost(req.body);
        if (post) res.status(HttpStatus.CREATED).send(post);
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