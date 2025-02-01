import express, {Request, Response} from 'express';
import {HttpStatus} from '../settings';
import {errorsResultMiddleware} from '../middleware/errors-result-middleware';
import {
    paramIdValidator,
    postBlogIdValidator,
    postContentValidator,
    postShortDescriptionValidator,
    postTitleValidator
} from '../middleware/input-validators';
import {authValidator} from '../middleware/auth-validator';
import {postService} from '../service/post-service';
import {blogService} from '../service/blog-service';

export const postRouter = express.Router();

const postController = {
    async getPosts(req: Request, res: Response): Promise<void> {
        let sortBy = req.query.sortBy ? req.query.sortBy as string : 'createdAt';
        let sortDirection = req.query.sortDirection && req.query.sortDirection === 'asc' ? 'asc' : 'desc';
        let pageNumber = req.query.pageNumber ? +req.query.pageNumber as number: 1;
        let pageSize = req.query.pageSize ? +req.query.pageSize as number: 10;

        const posts = await postService.findPosts({sortBy, sortDirection, pageNumber, pageSize,});
        res.status(HttpStatus.OK).send(posts);
    },
    async getPostById(req: Request, res: Response): Promise<void> {
        const post = await postService.findPostById(req.params.id);
        if (!post) {
            res.sendStatus(HttpStatus.NOT_FOUND);
        } else {
            res.status(HttpStatus.OK).send(post);
        }
    },
    async createPost(req: Request, res: Response): Promise<void> {
        const post = await postService.createPost(req.body);
        if (post) res.status(HttpStatus.CREATED).send(post);
    },
    async updatePost(req: Request, res: Response): Promise<void> {
        const post = await postService.updatePost(req.params.id, req.body);
        if (post) {
            res.sendStatus(HttpStatus.NO_CONTENT);
        } else {
            res.sendStatus(HttpStatus.NOT_FOUND);
        }
    },
    async deletePost(req: Request, res: Response): Promise<void> {
        const post = await postService.deletePost(req.params.id);
        if (post) {
            res.sendStatus(HttpStatus.NO_CONTENT);
        } else {
            res.sendStatus(HttpStatus.NOT_FOUND);
        }
    },
};
postRouter.get('/', postController.getPosts);
postRouter.post('/',
    authValidator,
    postTitleValidator,
    postShortDescriptionValidator,
    postContentValidator,
    postBlogIdValidator,
    errorsResultMiddleware,
    postController.createPost);
postRouter.get('/:id',
    paramIdValidator,
    errorsResultMiddleware,
    postController.getPostById);
postRouter.put('/:id',
    authValidator,
    paramIdValidator,
    postTitleValidator,
    postShortDescriptionValidator,
    postContentValidator,
    postBlogIdValidator,
    errorsResultMiddleware,
    postController.updatePost);
postRouter.delete('/:id',
    authValidator,
    paramIdValidator,
    errorsResultMiddleware,
    postController.deletePost);