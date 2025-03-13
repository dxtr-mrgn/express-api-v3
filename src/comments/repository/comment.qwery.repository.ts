import {Collection, ObjectId, WithId} from 'mongodb';
import {CommentDBType, ViewCommentsType, ViewCommentType} from '../types/comment-type';
import {toIdString} from '../../common/helper';
import {getCommentsCollection} from '../../db/mongodb';


export const commentQwRepository = {
    async getCollection(): Promise<Collection<CommentDBType>> {
        return getCommentsCollection();
    },

    async findCommentById(id: string): Promise<ViewCommentType | null> {
        const collection = await this.getCollection();
        try {
            const comment: WithId<CommentDBType> | null = await collection.findOne({_id: new ObjectId(id)});
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
    }, postId: string): Promise<ViewCommentsType> {
        const collection = await this.getCollection();
        const {sortBy, sortDirection, pageNumber, pageSize} = filterDto;
        const filter = {postId};

        const comments: WithId<CommentDBType>[] = await collection
            .find(filter)
            .sort({[sortBy]: sortDirection === 'asc' ? 1 : -1})
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .toArray();

        const commentCount: number = await collection.countDocuments(filter);

        return {
            pagesCount: Math.ceil(commentCount / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: commentCount,
            items: this.mapComments(comments),
        };
    },

    mapComment(comment: WithId<CommentDBType>): ViewCommentType {
        return {
            id: toIdString(comment._id),
            content: comment.content,
            commentatorInfo: comment.commentatorInfo,
            createdAt: comment.createdAt,
        };
    },

    mapComments(comments: WithId<CommentDBType>[]): ViewCommentType[] {
        return comments.map(comment => this.mapComment(comment));
    },
};