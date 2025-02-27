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
import {paramIdValidator, paramPostIdValidator} from '../../common/input-validator';
import {authValidator} from '../../middleware/auth-validator';
import {UserInfoType} from '../../users/types/user-type';
import {userQwRepository} from '../../users/repository/user.qwery.repository';
import {commentService} from '../../comments/service/comment-service';
import {commentContentValidator} from '../../comments/validator-middleware/input-validator';
import {commentQwRepository} from '../../comments/repository/comment.qwery.repository';
import {authMiddleware} from '../../users/validator-middleware/auth-middleware';

interface AuthRequest<T = any> extends Request<T> {
    userId?: string;
}

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
    async createCommentByPostId(req: AuthRequest<{ postId: string }>, res: Response): Promise<void> {
        const post: any = await postService.findPostById(req.params.postId);
        if (!post) {
            res.sendStatus(HttpStatus.NOT_FOUND);
        } else {
            const userInfo: UserInfoType | null = await userQwRepository.getUserInfo(req.userId!);
            if (!userInfo) {
                res.sendStatus(HttpStatus.NOT_FOUND);
            } else {
                const commentId = await commentService.createComment(
                    req.body, req.params.postId, userInfo.userId, userInfo.login);
                const comment = await commentQwRepository.findCommentById(commentId);
                if (comment) res.status(HttpStatus.CREATED).send(comment);
            }
        }
    },
    async getCommentsByPostId(req: AuthRequest<{ postId: string }>, res: Response): Promise<void> {
        const post: any = await postService.findPostById(req.params.postId);
        if (!post) {
            res.sendStatus(HttpStatus.NOT_FOUND);
        } else {
            const queryParams = commonQueryParams(req);

            const comments = await commentQwRepository.findComments(queryParams, req.params.postId);
            res.status(HttpStatus.OK).send(comments);
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

postRouter
    .route('/')
    .get(
        postController.getPosts)
    .post(
        authValidator,
        postTitleValidator,
        postShortDescriptionValidator,
        postContentValidator,
        postBlogIdValidator,
        errorsResultMiddleware,
        postController.createPost);

postRouter
    .route('/:id')
    .get(
        paramIdValidator,
        errorsResultMiddleware,
        postController.getPostById)
    .put(
        authValidator,
        paramIdValidator,
        postTitleValidator,
        postShortDescriptionValidator,
        postContentValidator,
        postBlogIdValidator,
        errorsResultMiddleware,
        postController.updatePost)
    .delete(
        authValidator,
        paramIdValidator,
        errorsResultMiddleware,
        postController.deletePost);

postRouter
    .route('/:postId/comments')
    .post(
        authMiddleware,
        paramPostIdValidator,
        commentContentValidator,
        errorsResultMiddleware,
        postController.createCommentByPostId)
    .get(
        paramPostIdValidator,
        errorsResultMiddleware,
        postController.getCommentsByPostId);