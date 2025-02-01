import {PostInputType} from '../types/post-types';
import {client} from '../db/mongodb';
import {ObjectId} from 'mongodb';
import {SETTINGS} from '../settings';

const postCollection = client.db(SETTINGS.DB_NAME).collection('posts');
console.log('MongoDB Name: ' + SETTINGS.DB_NAME);

export const postRepository = {
    async getPosts(filter?: any) {
        const posts = await postCollection.aggregate([
            ...filter,
            {
                $project: {
                    _id: 0,
                    id: '$_id',
                    title: 1,
                    shortDescription: 1,
                    content: 1,
                    blogId: 1,
                    blogName: 1,
                    createdAt: 1
                }
            }]).toArray();

        return posts;
    },
    async deleteAllPosts() {
        await postCollection.deleteMany({});
    },
    async createPost(postInput: PostInputType) {
        const res = await postCollection.insertOne(postInput);
        return (await postRepository.getPosts([{$match: {_id: new ObjectId(res.insertedId)}}]))[0];
    },
    async updatePost(id: string, postUpdate: PostInputType) {
        const res: any = await postCollection.updateOne({_id: new ObjectId(id)}, {$set: postUpdate});

        return res.modifiedCount === 1;
    },
    async findPosts(filterDto: {
        blogId?: string,
        sortBy: string,
        sortDirection: string,
        pageNumber: number,
        pageSize: number
    }) {
        let blogIdFilter = {};
        const aggregateFilter: any = [];
        const {blogId, sortBy, sortDirection, pageNumber, pageSize} = filterDto;

        if (blogId) {
            blogIdFilter = {blogId};
        }

        aggregateFilter.push({$match: blogIdFilter});
        aggregateFilter.push({$sort: {[sortBy]: sortDirection === 'asc' ? 1 : -1}});
        aggregateFilter.push({$skip: (pageNumber - 1) * pageSize});
        aggregateFilter.push({$limit: pageSize});

        return postRepository.getPosts(aggregateFilter);
    },
    async getPostsCount(blogIdFilter: Object): Promise<number> {
        return postCollection.countDocuments(blogIdFilter);
    },
    async findPostById(id: string): Promise<any> {
        return (await postRepository.getPosts([{$match: {_id: new ObjectId(id)}}]))[0];
    },
    async deletePost(id: string) {
        const res = await postCollection.deleteOne({_id: new ObjectId(id)});

        return res.deletedCount;
    }
};