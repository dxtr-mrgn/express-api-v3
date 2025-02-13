import express, {Request, Response} from 'express';
import {HttpStatus} from '../../settings';
import {errorsResultMiddleware} from '../../middleware/errors-result-middleware';
import {
    postBlogIdValidator,
    postContentValidator,
    postShortDescriptionValidator,
    postTitleValidator
} from '../../middleware/input-validators';
import {postService} from '../service/post-service';
import {commonQueryParams} from '../../common/query-params';
import {paramIdValidator} from '../../common/input-validator';
import {authValidator} from '../../middleware/auth-validator';

export const postRouter = express.Router();

const postController = {
    async getPosts(req: Request, res: Response): Promise<void> {
        const queryParams = commonQueryParams(req);

        const posts = await postService.findPosts(queryParams);
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