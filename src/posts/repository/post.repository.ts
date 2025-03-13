import {PostDBType, PostInputType} from '../types/post-types';
import {getPostsCollection} from '../../db/mongodb';
import {Collection, DeleteResult, ObjectId, OptionalId} from 'mongodb';
import {toIdString} from '../../common/helper';

export const postRepository = {
    async getCollection(): Promise<Collection<PostDBType>> {
        return getPostsCollection();
    },

    async deleteAllPosts(): Promise<void> {
        const postCollection = await this.getCollection();
        await postCollection.deleteMany({});
    },

    async createPost(postInput: OptionalId<PostDBType>): Promise<string> {
        const postCollection = await this.getCollection();
        const res = await postCollection.insertOne(postInput as PostDBType);
        return toIdString(res.insertedId);
    },

    async updatePost(id: string, postUpdate: PostInputType): Promise<boolean> {
        const postCollection = await this.getCollection();
        const res: any = await postCollection.updateOne({_id: new ObjectId(id)}, {$set: postUpdate});

        return res.modifiedCount === 1;
    },

    async deletePost(id: string): Promise<boolean> {
        const postCollection = await this.getCollection();
        const res: DeleteResult = await postCollection.deleteOne({_id: new ObjectId(id)});

        return res.deletedCount === 1;
    }
};