import {BlogDBType, BlogInputType} from '../types/blog-types';
import {Collection, DeleteResult, ObjectId} from 'mongodb';
import {toIdString} from '../../common/helper';
import {getBlogsCollection} from '../../db/mongodb';

export const blogRepository = {
    async getCollection(): Promise<Collection<BlogDBType>> {
        return getBlogsCollection();
    },

    async deleteAllBlogs() {
        const collection = await this.getCollection();
        await collection.deleteMany({});
    },

    async createBlog(newBlog: Omit<BlogDBType, '_id'>): Promise<string> {
        const collection = await this.getCollection();
        const res = await collection.insertOne(newBlog as BlogDBType);
        return toIdString(res.insertedId);
    },

    async updateBlog(id: string, blogUpdate: BlogInputType): Promise<boolean> {
        const collection = await this.getCollection();
        const res: any = await collection.updateOne({_id: new ObjectId(id)}, {$set: blogUpdate});

        return res.modifiedCount === 1;
    },

    async deleteBlog(id: string): Promise<boolean> {
        const collection = await this.getCollection();
        const res: DeleteResult = await collection.deleteOne({_id: new ObjectId(id)});

        return res.deletedCount === 1;
    }
};
