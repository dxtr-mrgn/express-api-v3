import express, {Request, Response, Router} from 'express';
import {HttpStatus} from '../../settings';
import {blogService} from '../service/blog-service';
import {postService} from '../../posts/service/post-service';
import {blogQwRepository} from '../repository/blog.qw.reposiitory';
import {postQwRepository} from '../../posts/repository/post.qw.repository';
import {blogQueryParams, commonQueryParams} from '../../common/query-params';
import {authValidator} from '../../middleware/auth-validator';
import {errorsResultMiddleware} from '../../middleware/errors-result-middleware';
import {paramIdValidator} from '../../common/input-validator';
import {
    blogDescriptionValidator,
    blogNameValidator,
    blogWebsiteUrlValidator,
} from '../../middleware/input-validators';
import {
    postContentValidator,
    postShortDescriptionValidator,
    postTitleValidator,
} from '../../middleware/input-validators';
import {sendResponse} from '../../common/helper';
import {BlogInputType} from '../types/blog-types';
import {PostInputType} from '../../posts/types/post-types';

interface BlogQueryRequest extends Request {
    query: {
        searchNameTerm?: string;
        sortBy?: string;
        sortDirection?: 'asc' | 'desc';
        pageNumber?: string;
        pageSize?: string;
    };
}

interface BlogRequest<Params = any, ReqBody = any> extends Request<Params, any, ReqBody> {
}

const blogController = {
    async getBlogs(req: BlogQueryRequest, res: Response): Promise<void> {
        const query = {...blogQueryParams(req), ...commonQueryParams(req)};
        const blogs = await blogQwRepository.findBlogs(query);
        sendResponse(res, HttpStatus.OK, blogs);
    },

    async getBlogById(req: BlogRequest<{ id: string }>, res: Response): Promise<void> {
        const blog = await blogQwRepository.findBlogById(req.params.id);
        sendResponse(res, blog ? HttpStatus.OK : HttpStatus.NOT_FOUND, blog);
    },

    async createBlog(req: BlogRequest<{}, BlogInputType>, res: Response): Promise<void> {
        const blogId = await blogService.createBlog(req.body);
        const blog = await blogQwRepository.findBlogById(blogId);
        sendResponse(res, blog ? HttpStatus.CREATED : HttpStatus.INTERNAL_SERVER_ERROR, blog);
    },

    async updateBlog(req: BlogRequest<{ id: string }, BlogInputType>, res: Response): Promise<void> {
        const updated = await blogService.updateBlog(req.params.id, req.body);
        sendResponse(res, updated ? HttpStatus.NO_CONTENT : HttpStatus.NOT_FOUND);
    },

    async deleteBlog(req: BlogRequest<{ id: string }>, res: Response): Promise<void> {
        const deleted = await blogService.deleteBlog(req.params.id);
        sendResponse(res, deleted ? HttpStatus.NO_CONTENT : HttpStatus.NOT_FOUND);
    },

    async getPostsByBlogId(req: BlogRequest<{ id: string }>, res: Response): Promise<void> {
        const blog = await blogQwRepository.findBlogById(req.params.id);
        if (!blog) {
            return sendResponse(res, HttpStatus.NOT_FOUND);
        }

        const query = {blogId: req.params.id, ...commonQueryParams(req)};
        const posts = await postQwRepository.findPosts(query);
        sendResponse(res, HttpStatus.OK, posts);
    },

    async createPostByBlogId(req: BlogRequest<{ id: string }, PostInputType>, res: Response): Promise<void> {
        const blog = await blogQwRepository.findBlogById(req.params.id);
        if (!blog) {
            return sendResponse(res, HttpStatus.NOT_FOUND);
        }

        const postData = {...req.body, blogId: req.params.id};
        const postId = await postService.createPost(postData);
        const post = await postQwRepository.findPostById(postId);
        sendResponse(res, post ? HttpStatus.CREATED : HttpStatus.INTERNAL_SERVER_ERROR, post);
    },
};

export const blogRouter: Router = express.Router();

blogRouter
    .route('/')
    .get(blogController.getBlogs)
    .post(
        authValidator,
        blogNameValidator,
        blogDescriptionValidator,
        blogWebsiteUrlValidator,
        errorsResultMiddleware,
        blogController.createBlog
    );

blogRouter
    .route('/:id')
    .get(paramIdValidator, errorsResultMiddleware, blogController.getBlogById)
    .put(
        authValidator,
        paramIdValidator,
        blogNameValidator,
        blogDescriptionValidator,
        blogWebsiteUrlValidator,
        errorsResultMiddleware,
        blogController.updateBlog
    )
    .delete(authValidator, paramIdValidator, errorsResultMiddleware, blogController.deleteBlog);

blogRouter
    .route('/:id/posts')
    .get(paramIdValidator, errorsResultMiddleware, blogController.getPostsByBlogId)
    .post(
        authValidator,
        paramIdValidator,
        postTitleValidator,
        postShortDescriptionValidator,
        postContentValidator,
        errorsResultMiddleware,
        blogController.createPostByBlogId
    );