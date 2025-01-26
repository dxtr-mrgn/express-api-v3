import express, {Request, Response} from 'express';
import {HttpStatus} from '../settings';
import {postRepository} from '../repositories/post-repository';
import {errorsResultMiddleware} from '../middleware/errors-result-middleware';
import {
    // postBlogIdValidator,
    postContentValidator,
    paramIdValidator,
    postShortDescriptionValidator,
    postTitleValidator, postBlogIdValidator
} from '../middleware/input-validators';
import {authValidator} from '../middleware/auth-validator';

export const postRouter = express.Router();

const postController = {
    async getPosts(req: Request, res: Response) {
        const posts = await postRepository.findPosts();
        res.status(HttpStatus.OK).send(posts);
    },
    async getPostById(req: Request, res: Response) {
        const post = (await postRepository.findPosts(req.params.id))[0];
        if (!post) {
            res.sendStatus(HttpStatus.NOT_FOUND);
        } else {
            res.status(HttpStatus.OK).send(post);
        }
    },
    async createPost(req: Request, res: Response) {
        const post = (await postRepository.createPost(req.body))[0];
        if (post) res.status(HttpStatus.CREATED).send(post);
    },
    async updatePost(req: Request, res: Response) {
        const post = await postRepository.updatePost(req.params.id, req.body);
        if (post) {
            res.sendStatus(HttpStatus.NO_CONTENT);
        } else {
            res.sendStatus(HttpStatus.NOT_FOUND);
        }
    },
    async deletePost(req: Request, res: Response) {
        const post = await postRepository.deletePost(req.params.id);
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
    postController.deletePost);