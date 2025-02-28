import express, {Request, Response} from 'express';
import {HttpStatus} from '../../settings';
import {commentService} from '../service/comment-service';
import {paramCommentIdValidator, paramIdValidator} from '../../common/input-validator';
import {errorsResultMiddleware} from '../../middleware/errors-result-middleware';
import {commentQwRepository} from '../repository/comment.qwery.repository';
import {userQwRepository} from '../../users/repository/user.qwery.repository';
import {authMiddleware} from '../../users/validator-middleware/auth-middleware';
import {MappedCommentType} from '../types/comment-type';

interface AuthRequest<T = any> extends Request<T> {
    userId?: string;
}

export const commentRouter = express.Router();

const sendResponse = (res: Response, status: HttpStatus, data?: any) => {
    status === HttpStatus.NO_CONTENT || !data
        ? res.sendStatus(status)
        : res.status(status).json(data);
};
export const commentController = {
    async getCommentById(req: Request, res: Response): Promise<void> {
        const comment = await commentQwRepository.findCommentById(req.params.id);
        sendResponse(res, comment ? HttpStatus.OK : HttpStatus.NOT_FOUND, comment);
    },
    async updateComment(req: AuthRequest<{ commentId: string }>, res: Response): Promise<void> {
        const userInfo = await userQwRepository.getUserInfo(req.userId!);
        if (!userInfo) {
            res.sendStatus(HttpStatus.NOT_FOUND);
            return;
        }
        const comment: MappedCommentType | null = await commentQwRepository.findCommentById(req.params.commentId);

        if (!comment) {
            res.sendStatus(HttpStatus.NOT_FOUND);
        }
        if (comment && comment.commentatorInfo.userId !== userInfo.userId) {
            res.sendStatus(HttpStatus.FORBIDDEN);
        }
        const updated: boolean = await commentService.updateComment(req.params.commentId, req.body);
        sendResponse(res, updated ? HttpStatus.NO_CONTENT : HttpStatus.NOT_FOUND);
    },
    async deleteComment(req: AuthRequest<{ commentId: string }>, res: Response): Promise<void> {
        const deleted: boolean = await commentService.deleteComment(req.params.commentId);
        sendResponse(res, deleted ? HttpStatus.NO_CONTENT : HttpStatus.NOT_FOUND);
    },
};

commentRouter
    .get('/:id',
        paramIdValidator,
        errorsResultMiddleware,
        commentController.getCommentById);

commentRouter
    .put('/:commentId',
        authMiddleware,
        paramCommentIdValidator,
        errorsResultMiddleware,
        commentController.updateComment)
    .delete('/:commentId',
        authMiddleware,
        paramCommentIdValidator,
        errorsResultMiddleware,
        commentController.deleteComment);