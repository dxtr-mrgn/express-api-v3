import {PostDBType, PostInputType} from '../types/post-types';
import {client} from '../db/mongodb';
import {ObjectId} from 'mongodb';
import {blogCollection} from './blog-repository';
import {SETTINGS} from '../settings';

const postCollection = client.db(SETTINGS.DB_NAME).collection('posts');
console.log('MongoDB Name: ' + SETTINGS.DB_NAME);

export const postRepository = {
    async deleteAllPosts() {
        await postCollection.deleteMany({});
    },
    async createPost(postInput: PostInputType) {
        const blog: any = (await blogCollection.find({id: postInput.blogId}, {projection: {_id: 0}}).toArray())[0];

        const newPost: PostDBType = {
            id: Date.now() + Math.random().toString(),
            title: postInput.title,
            shortDescription: postInput.shortDescription,
            content: postInput.content,
            blogId: postInput.blogId,
            blogName: blog?.name,
            createdAt: new Date().toISOString()
        };

        const res = await postCollection.insertOne(newPost);
        return await postCollection.find({_id: new ObjectId(res.insertedId)}, {projection: {_id: 0}}).toArray();
    },
    async updatePost(id: string, postUpdate: PostInputType) {
        const res: any = await postCollection.updateOne({id}, {$set: postUpdate});

        return res.modifiedCount === 1;
    },
    async findPosts(id?: string | undefined) {
        if (!id) {
            return await postCollection.find({}, {projection: {_id: 0}}).toArray();
        } else {
            return await postCollection.find({id}, {projection: {_id: 0}}).toArray();
        }
    },
    async deletePost(id: string) {
        const res = await postCollection.deleteOne({id});

        return res.deletedCount;
    }
};