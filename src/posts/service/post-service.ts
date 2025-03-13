import {PostDBType, PostInputType} from '../types/post-types';
import {postRepository} from '../repository/post.repository';
import {blogQwRepository} from '../../blogs/repository/blog.qw.reposiitory';

export const postService = {
    async deleteAllPosts() {
        await postRepository.deleteAllPosts();
    },

    async createPost(postInput: PostInputType, id?: string): Promise<string> {
        const blogId = id ? id : postInput.blogId;
        const blog: any = await blogQwRepository.findBlogById(blogId);

        const newPost: Omit<PostDBType, '_id'> = {
            title: postInput.title,
            shortDescription: postInput.shortDescription,
            content: postInput.content,
            blogId: postInput.blogId,
            blogName: blog?.name,
            createdAt: new Date().toISOString()
        };
        return postRepository.createPost(newPost);
    },

    async updatePost(id: string, postUpdate: PostInputType): Promise<boolean> {
        return postRepository.updatePost(id, postUpdate);
    },

    async deletePost(id: string): Promise<boolean> {
        return postRepository.deletePost(id);
    }
};