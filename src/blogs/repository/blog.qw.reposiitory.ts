import {BlogDBType, ViewBlogsType, ViewBlogType} from '../types/blog-types';
import {Collection, ObjectId} from 'mongodb';
import {toIdString} from '../../common/helper';
import {getBlogsCollection} from '../../db/mongodb';

interface BlogFilterDto {
    searchNameTerm: string | null,
    sortBy: string,
    sortDirection: 'asc' | 'desc';
    pageNumber: number,
    pageSize: number
}

export const blogQwRepository = {
    async getCollection(): Promise<Collection<BlogDBType>> {
        return getBlogsCollection();
    },

    async findBlogs({
                        searchNameTerm,
                        sortBy,
                        sortDirection,
                        pageNumber,
                        pageSize,
                    }: BlogFilterDto): Promise<ViewBlogsType> {
        const collection = await this.getCollection();
        const filter: any = searchNameTerm ? {name: RegExp(searchNameTerm, 'i')} : {};

        const blogs = await collection
            .find(filter)
            .sort({[sortBy]: sortDirection === 'asc' ? 1 : -1})
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .toArray();

        const blogCount = await collection.countDocuments(filter);

        return {
            pagesCount: Math.ceil(blogCount / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: blogCount,
            items: this.mapBlogs(blogs)
        };
    },

    async findBlogById(id: string): Promise<ViewBlogType | null> {
        const collection = await this.getCollection();
        try {
            const blog: BlogDBType | null = await collection.findOne({_id: new ObjectId(id)});
            return blog ? this.mapBlog(blog) : null;
        } catch (e) {
            console.error('Invalid ObjectId:', e);
            return null;
        }
    },

    mapBlog(blog: BlogDBType): ViewBlogType {
        return {
            id: toIdString(blog._id),
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            createdAt: blog.createdAt,
            isMembership: blog.isMembership
        };
    },

    mapBlogs(blogs: BlogDBType[]): ViewBlogType[] {
        return blogs.map(blog => this.mapBlog(blog));
    }
};
