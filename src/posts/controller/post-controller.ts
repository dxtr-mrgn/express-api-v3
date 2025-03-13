import express, {Request, Response, Router} from 'express';
import {HttpStatus} from '../../settings';
import {postService} from '../service/post-service';
import {postQwRepository} from '../repository/post.qw.repository';
import {commentService} from '../../comments/service/comment-service';
import {commentQwRepository} from '../../comments/repository/comment.qwery.repository';
import {userQwRepository} from '../../users/repository/user.qwery.repository';
import {commonQueryParams} from '../../common/query-params';
import {authValidator} from '../../middleware/auth-validator';
import {authMiddleware} from '../../users/validator-middleware/auth-middleware';
import {errorsResultMiddleware} from '../../middleware/errors-result-middleware';
import {paramIdValidator, paramPostIdValidator} from '../../common/input-validator';
import {
    postBlogIdValidator,
    postContentValidator,
    postShortDescriptionValidator,
    postTitleValidator,
} from '../../middleware/input-validators';
import {commentContentValidator} from '../../comments/validator-middleware/input-validator';
import {sendResponse} from '../../common/helper';
import {AuthRequest} from '../../common/types';
import {PostInputType} from '../types/post-types';
import {CommentInputType} from '../../comments/types/comment-type';

const postController = {
    async getPosts(req: Request, res: Response): Promise<void> {
        const query = commonQueryParams(req);
        const posts = await postQwRepository.findPosts(query);
        sendResponse(res, HttpStatus.OK, posts);
    },

    async getPostById(req: AuthRequest<{ id: string }>, res: Response): Promise<void> {
        const post = await postQwRepository.findPostById(req.params.id);
        sendResponse(res, post ? HttpStatus.OK : HttpStatus.NOT_FOUND, post);
    },

    async createPost(req: AuthRequest<{}, PostInputType>, res: Response): Promise<void> {
        const postId = await postService.createPost(req.body);
        const post = await postQwRepository.findPostById(postId);
        if (post) {
            sendResponse(res, HttpStatus.CREATED, post);
        } else {
            sendResponse(res, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    },

    async updatePost(req: AuthRequest<{ id: string }, PostInputType>, res: Response): Promise<void> {
        const updated = await postService.updatePost(req.params.id, req.body);
        sendResponse(res, updated ? HttpStatus.NO_CONTENT : HttpStatus.NOT_FOUND);
    },

    async deletePost(req: AuthRequest<{ id: string }>, res: Response): Promise<void> {
        const deleted = await postService.deletePost(req.params.id);
        sendResponse(res, deleted ? HttpStatus.NO_CONTENT : HttpStatus.NOT_FOUND);
    },

    async getCommentsByPostId(req: AuthRequest<{ postId: string }>, res: Response): Promise<void> {
        const post = await postQwRepository.findPostById(req.params.postId);
        if (!post) {
            return sendResponse(res, HttpStatus.NOT_FOUND);
        }

        const query = commonQueryParams(req);
        const comments = await commentQwRepository.findComments(query, req.params.postId);
        sendResponse(res, HttpStatus.OK, comments);
    },

    async createCommentByPostId(req: AuthRequest<{ postId: string }, CommentInputType>, res: Response): Promise<void> {
        const post = await postQwRepository.findPostById(req.params.postId);
        if (!post) {
            return sendResponse(res, HttpStatus.NOT_FOUND);
        }

        const userInfo = await userQwRepository.getUserInfo(req.userId!);
        if (!userInfo) {
            return sendResponse(res, HttpStatus.NOT_FOUND);
        }

        const commentId = await commentService.createComment(
            req.body,
            req.params.postId,
            userInfo.userId,
            userInfo.login
        );
        const comment = await commentQwRepository.findCommentById(commentId);
        sendResponse(res, comment ? HttpStatus.CREATED : HttpStatus.INTERNAL_SERVER_ERROR, comment);
    },
};

export const postRouter: Router = express.Router();

postRouter
    .route('/')
    .get(postController.getPosts)
    .post(
        authValidator,
        postTitleValidator,
        postShortDescriptionValidator,
        postContentValidator,
        postBlogIdValidator,
        errorsResultMiddleware,
        postController.createPost
    );

postRouter
    .route('/:id')
    .get(paramIdValidator, errorsResultMiddleware, postController.getPostById)
    .put(
        authValidator,
        paramIdValidator,
        postTitleValidator,
        postShortDescriptionValidator,
        postContentValidator,
        postBlogIdValidator,
        errorsResultMiddleware,
        postController.updatePost
    )
    .delete(authValidator, paramIdValidator, errorsResultMiddleware, postController.deletePost);

postRouter
    .route('/:postId/comments')
    .get(paramPostIdValidator, errorsResultMiddleware, postController.getCommentsByPostId)
    .post(
        authMiddleware,
        paramPostIdValidator,
        commentContentValidator,
        errorsResultMiddleware,
        postController.createCommentByPostId
    );