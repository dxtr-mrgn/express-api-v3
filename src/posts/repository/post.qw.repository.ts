import {PostDBType, ViewPostsType, ViewPostType} from '../types/post-types';
import {Collection, ObjectId} from 'mongodb';
import {toIdString} from '../../common/helper';
import {getPostsCollection} from '../../db/mongodb';

interface PostFilterDto {
    blogId?: string,
    sortBy: string,
    sortDirection: 'asc' | 'desc';
    pageNumber: number,
    pageSize: number
}

export const postQwRepository = {
    async getCollection(): Promise<Collection<PostDBType>> {
        return getPostsCollection();
    },

    async findPosts({
                        blogId,
                        sortBy,
                        sortDirection,
                        pageNumber,
                        pageSize
                    }: PostFilterDto): Promise<ViewPostsType> {
        const postCollection = await this.getCollection();
        const filter = blogId ? {blogId} : {};

        const posts = await postCollection
            .find(filter)
            .sort({[sortBy]: sortDirection === 'asc' ? 1 : -1})
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .toArray();

        const postCount = await postCollection.countDocuments(filter);

        return {
            pagesCount: Math.ceil(postCount / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: postCount,
            items: this.mapPosts(posts)
        };
    },

    async findPostById(id: string): Promise<ViewPostType | null> {
        const postCollection = await this.getCollection();
        try {
            const post: PostDBType | null = await postCollection.findOne({_id: new ObjectId(id)});
            return post ? this.mapPost(post) : null;
        } catch (e) {
            console.error('Invalid ObjectId:', e);
            return null;
        }
    },

    mapPost(post: PostDBType): ViewPostType {
        return {
            id: toIdString(post._id),
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            blogName: post.blogName,
            createdAt: post.createdAt
        };
    },

    mapPosts(posts: PostDBType[]): ViewPostType[] {
        return posts.map(post => this.mapPost(post));
    }
};