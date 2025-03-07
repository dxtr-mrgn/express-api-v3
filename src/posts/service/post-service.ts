import {PostDBType, PostInputType} from '../types/post-types';
import {postRepository} from '../repository/post-repository';
import {blogRepository} from '../../blogs/repository/blog-repository';

export const postService = {
    async deleteAllPosts() {
        await postRepository.deleteAllPosts();
    },
    async createPost(postInput: PostInputType, id?: string) {
        const blogId = id ? id : postInput.blogId;
        const blog: any = await blogRepository.findBlogsById(blogId);

        const newPost: PostDBType = {
            title: postInput.title,
            shortDescription: postInput.shortDescription,
            content: postInput.content,
            blogId: postInput.blogId,
            blogName: blog?.name,
            createdAt: new Date().toISOString()
        };
        return postRepository.createPost(newPost);
    },
    async updatePost(id: string, postUpdate: PostInputType) {
        return postRepository.updatePost(id, postUpdate);
    },
    async findPosts(filterDto: {
        blogId?: string,
        sortBy: string,
        sortDirection: string,
        pageNumber: number,
        pageSize: number,
    }) {
        const {blogId, sortBy, sortDirection, pageNumber, pageSize} = filterDto;

        const posts = await postRepository.findPosts({
            blogId,
            sortBy,
            sortDirection,
            pageNumber,
            pageSize
        });

        let blogIdFilter = {};
        if (blogId) {
            blogIdFilter = {blogId};
        }
        const blogCount = await postRepository.getPostsCount(blogIdFilter);

        return {
            pagesCount: Math.ceil(blogCount / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: blogCount,
            items: posts
        };

    },
    async findPostById(id: string): Promise<any> {
        return postRepository.findPostById(id);
    },
    async deletePost(id: string) {
        return postRepository.deletePost(id);
    }
};