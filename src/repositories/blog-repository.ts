import {BlogDBType, BlogInputType} from '../types/blog-types';
import {client} from '../db/mongodb';
import {ObjectId} from 'mongodb';
import {SETTINGS} from '../settings';

export const blogCollection = client.db(SETTINGS.DB_NAME).collection('blogs');
console.log('MongoDB Name: ' + SETTINGS.DB_NAME);

export const blogRepository = {
    async deleteAllBlogs() {
        await blogCollection.deleteMany({});
    },
    async createBlog(blogInput: BlogInputType) {
        const newBlog: BlogDBType = {
            id: Date.now() + Math.random().toString(),
            name: blogInput.name,
            description: blogInput.description,
            websiteUrl: blogInput.websiteUrl,
            createdAt: new Date().toISOString(),
            isMembership: false
        };
        const res = await blogCollection.insertOne(newBlog);
        return await blogCollection.find({_id: new ObjectId(res.insertedId)}, {projection: {_id: 0}}).toArray();
    },
    async updateBlog(id: string, blogUpdate: BlogInputType) {
        const res: any = await blogCollection.updateOne({id}, {$set: blogUpdate});

        return res.modifiedCount === 1;
    },
    async findBlogs(id?: string | undefined) {
        if (!id) {
            return await blogCollection.find({}, {projection: {_id: 0}}).toArray();
        } else {
            return await blogCollection.find({id}, {projection: {_id: 0}}).toArray();
        }
    },
    async deleteBlog(id: string) {
        const res = await blogCollection.deleteOne({id});

        return res.deletedCount;
    }
};
