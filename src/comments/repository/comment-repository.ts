import {getCommentsCollection} from '../../db/mongodb';
import {Collection, DeleteResult, ObjectId, UpdateResult} from 'mongodb';
import {CommentDBType, CommentInputType} from '../types/comment-type';
import {toIdString} from '../../common/helper';


export const commentRepository = {
    async getCollection(): Promise<Collection<CommentDBType>> {
        return getCommentsCollection();
    },

    async deleteAllComments(): Promise<void> {
        const collection = await this.getCollection();
        await collection.deleteMany({});
    },

    async createComment(newComment: Omit<CommentDBType, '_id'>): Promise<string> {
        const collection = await this.getCollection();
        const {insertedId} = await collection.insertOne(newComment as CommentDBType);
        return toIdString(insertedId);
    },

    async deleteComment(id: string): Promise<boolean> {
        const collection = await this.getCollection();
        const result: DeleteResult = await collection.deleteOne(
            {_id: new ObjectId(id)}
        );
        return result.deletedCount === 1;
    },

    async updateComment(id: string, commentUpdate: CommentInputType): Promise<boolean> {
        const collection = await this.getCollection();
        const result: UpdateResult = await collection.updateOne(
            {_id: new ObjectId(id)},
            {$set: commentUpdate}
        );
        return result.modifiedCount === 1;
    },
};
