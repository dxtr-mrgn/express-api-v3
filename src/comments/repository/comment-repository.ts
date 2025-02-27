import {client} from '../../db/mongodb';
import {Collection, DeleteResult, ObjectId, UpdateResult, WithId} from 'mongodb';
import {SETTINGS} from '../../settings';
import {CommentType, CommentInputType} from '../types/comment-type';

export const commentCollection: Collection<CommentType> = client
    .db(SETTINGS.DB_NAME)
    .collection<CommentType>('Comments');

const toIdString = (id: ObjectId): string => id.toString()

export const commentRepository = {
    async deleteAllComments(): Promise<void> {
        await commentCollection.deleteMany({});
    },

    async createComment(newComment: CommentType): Promise<string> {
        const { insertedId } = await commentCollection.insertOne(newComment);
        return toIdString(insertedId)
    },

    async deleteComment(id: string): Promise<boolean> {
        const result: DeleteResult = await commentCollection.deleteOne(
            {_id: new ObjectId(id)}
        );
        return result.deletedCount === 1;
    },

    async updateComment(id: string, commentUpdate: CommentInputType): Promise<boolean> {
        const result: UpdateResult = await commentCollection.updateOne(
            {_id: new ObjectId(id)},
            {$set: commentUpdate}
        );
        return result.modifiedCount === 1;
    },
};
