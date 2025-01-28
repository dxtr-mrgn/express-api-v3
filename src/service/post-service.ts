import {PostDBType, PostInputType} from '../types/post-types';
import {postRepository} from '../repositories/post-repository';

export const postService = {
    async deleteAllPosts() {
        await postRepository.deleteAllPosts();
    },
    async createPost(postInput: PostInputType) {
        const blog: any = await postRepository.findPosts(postInput.blogId);

        const newPost: PostDBType = {
            id: Date.now() + Math.random().toString(),
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
    async findPosts(id?: string | undefined) {
        return postRepository.findPosts(id);
    },
    async deletePost(id: string) {
        return postRepository.deletePost(id);
    }
};