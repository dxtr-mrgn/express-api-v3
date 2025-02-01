import {BlogConstructType, BlogInputType} from '../types/blog-types';
import {client} from '../db/mongodb';
import {DeleteResult, ObjectId} from 'mongodb';
import {SETTINGS} from '../settings';

export const blogCollection = client.db(SETTINGS.DB_NAME).collection('blogs');
console.log('MongoDB Name: ' + SETTINGS.DB_NAME);

export const blogRepository = {
    async getBlogs(filter?: any) {
        const blogs = await blogCollection.aggregate([
            ...filter,
            {
                $project: {
                    _id: 0,
                    id: '$_id',
                    name: 1,
                    description: 1,
                    websiteUrl: 1,
                    createdAt: 1,
                    isMembership: 1
                }
            }]).toArray();

        return blogs;
    },
    async deleteAllBlogs() {
        await blogCollection.deleteMany({});
    },
    async createBlog(newBlog: BlogConstructType): Promise<any> {
        const res = await blogCollection.insertOne(newBlog);
        return await blogRepository.getBlogs([{$match: {_id: new ObjectId(res.insertedId)}}]);
    },
    async updateBlog(id: string, blogUpdate: BlogInputType) {
        const res: any = await blogCollection.updateOne({_id: new ObjectId(id)}, {$set: blogUpdate});

        return res.modifiedCount === 1;
    },
    async findBlogs(filterDto: {
        searchNameTerm: string | null,
        sortBy: string,
        sortDirection: string,
        pageNumber: number,
        pageSize: number,
    }) {
        const filter: any = {};
        const aggregateFilter: any = [];
        const {searchNameTerm, sortBy, sortDirection, pageNumber, pageSize} = filterDto;

        if (searchNameTerm) {
            filter.name = RegExp(searchNameTerm, 'i');
        }

        aggregateFilter.push({$match: filter});
        aggregateFilter.push({$sort: {[sortBy]: sortDirection === 'asc' ? 1 : -1}});
        aggregateFilter.push({$skip: (pageNumber - 1) * pageSize});
        aggregateFilter.push({$limit: pageSize});

        return blogRepository.getBlogs(aggregateFilter);
    },
    async getBlogsCount(searchNameTerm: string | null): Promise<number> {
        const filter: any = {};

        if (searchNameTerm) {
            filter.title = {$regex: searchNameTerm, $options: 'i'};

        }
        return blogCollection.countDocuments(filter);
    },
    async findBlogsById(id: string): Promise<any> {
        return (await blogRepository.getBlogs([{$match: {_id: new ObjectId(id)}}]))[0];
    },
    async deleteBlog(id: string): Promise<number> {
        const res: DeleteResult = await blogCollection.deleteOne({id});

        return res.deletedCount;
    }
};
