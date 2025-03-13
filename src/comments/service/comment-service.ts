import {commentRepository} from '../repository/comment-repository';
import {CommentatorInfo, CommentInputType, CommentDBType} from '../types/comment-type';


export const commentService = {
    async deleteAllComments(): Promise<void> {
        await commentRepository.deleteAllComments();
    },

    async updateComment(id: string, commentInput: CommentInputType): Promise<boolean> {
        return await commentRepository.updateComment(id, commentInput);
    },

    async createComment(
        commentInput: CommentInputType,
        postId: string,
        userId: string,
        userLogin: string
    ): Promise<string> {
        const newComment: Omit<CommentDBType, '_id'> = {
            content: commentInput.content,
            commentatorInfo: {userId, userLogin} as CommentatorInfo,
            postId,
            createdAt: new Date().toISOString()
        };
        return await commentRepository.createComment(newComment);
    },

    async deleteComment(id: string): Promise<boolean> {
        return await commentRepository.deleteComment(id);
    }
};
