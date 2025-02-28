import express, {Request, Response} from 'express';
import {HttpStatus} from '../../settings';
import {commentService} from '../service/comment-service';
import {paramCommentIdValidator, paramIdValidator} from '../../common/input-validator';
import {errorsResultMiddleware} from '../../middleware/errors-result-middleware';
import {commentQwRepository} from '../repository/comment.qwery.repository';
import {userQwRepository} from '../../users/repository/user.qwery.repository';
import {authMiddleware} from '../../users/validator-middleware/auth-middleware';
import {MappedCommentType} from '../types/comment-type';
import {commentContentValidator} from '../validator-middleware/input-validator';

interface AuthRequest<T = any> extends Request<T> {
    userId?: string;
}

export const commentRouter = express.Router();

const sendResponse = (res: Response, status: HttpStatus, data?: any) => {
    console.log(`sendResponse: status=${status}, data=`, data); // Debug log
    status === HttpStatus.NO_CONTENT || !data
        ? res.sendStatus(status)
        : res.status(status).json(data);
};

export const commentController = {
    async getCommentById(req: Request, res: Response): Promise<void> {
        console.log('getCommentById called with id:', req.params.id); // Debug log
        const comment = await commentQwRepository.findCommentById(req.params.id);
        sendResponse(res, comment ? HttpStatus.OK : HttpStatus.NOT_FOUND, comment);
    },
    async updateComment(req: AuthRequest<{ commentId: string }>, res: Response): Promise<void> {
        const status = await this.validateCommentOwner(req.userId!, req.params.commentId, res);
        if (status !== HttpStatus.NO_CONTENT) {
            sendResponse(res, status);
            return
        }
        const updated: boolean = await commentService.updateComment(req.params.commentId, req.body);
        sendResponse(res, updated ? HttpStatus.NO_CONTENT : HttpStatus.NOT_FOUND);

    },
    async deleteComment(req: AuthRequest<{ commentId: string }>, res: Response): Promise<void> {
        const status = await this.validateCommentOwner(req.userId!, req.params.commentId, res);
        if (status !== HttpStatus.NO_CONTENT) {
            sendResponse(res, status);
            return
        }
        const deleted: boolean = await commentService.deleteComment(req.params.commentId);
        sendResponse(res, deleted ? HttpStatus.NO_CONTENT : HttpStatus.NOT_FOUND);

    },
    async validateCommentOwner(userId: string, commentId: string, res: Response): Promise<HttpStatus> {
        console.log('validateCommentOwner called with userId:', userId, 'commentId:', commentId); // Debug log
        const userInfo = await userQwRepository.getUserInfo(userId);
        if (!userInfo) {
            return HttpStatus.NOT_FOUND;
        }
        const comment: MappedCommentType | null = await commentQwRepository.findCommentById(commentId);
        if (!comment) {
            return HttpStatus.NOT_FOUND;
        }
        if (comment.commentatorInfo.userId !== userInfo!.userId) {
            return HttpStatus.FORBIDDEN;
        }
        return HttpStatus.NO_CONTENT;
    }
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
        commentContentValidator,
        errorsResultMiddleware,
        commentController.updateComment.bind(commentController))
    .delete('/:commentId',
        authMiddleware,
        paramCommentIdValidator,
        errorsResultMiddleware,
        commentController.deleteComment.bind(commentController));