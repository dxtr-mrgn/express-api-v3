import {client} from '../../db/mongodb';
import {Collection, ObjectId, WithId} from 'mongodb';
import {SETTINGS} from '../../settings';
import {CommentsType, CommentType, MappedCommentType} from '../types/comment-type';

export const commentCollection: Collection<CommentType> = client
    .db(SETTINGS.DB_NAME)
    .collection<CommentType>('Comments');


export const commentQwRepository = {
    async findCommentById(id: string): Promise<MappedCommentType | null> {
        try {
            const comment: WithId<CommentType> | null = await commentCollection.findOne({_id: new ObjectId(id)});
            return comment ? this.mapComment(comment) : null;
        } catch (e) {
            console.error('Invalid ObjectId:', e);
            return null;
        }
    },

    async findComments(filterDto: {
        sortBy: string,
        sortDirection: 'asc' | 'desc',
        pageNumber: number,
        pageSize: number,
    }, postId: string): Promise<CommentsType> {
        const {sortBy, sortDirection, pageNumber, pageSize} = filterDto;
        const filter = {postId};

        const comments: WithId<CommentType>[] = await commentCollection
            .find(filter)
            .sort({[sortBy]: sortDirection === 'asc' ? 1 : -1})
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .toArray();

        const commentCount: number = await commentCollection.countDocuments(filter);

        return {
            pagesCount: Math.ceil(commentCount / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: commentCount,
            items: this.mapComments(comments),
        };
    },

    mapComment(comment: WithId<CommentType>): MappedCommentType {
        return {
            id: comment._id,
            content: comment.content,
            commentatorInfo: comment.commentatorInfo,
            createdAt: comment.createdAt,
        };
    },

    mapComments(comments: WithId<CommentType>[]): MappedCommentType[] {
        return comments.map(comment => this.mapComment(comment));
    },
};