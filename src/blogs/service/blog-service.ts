import {BlogDBType, BlogInputType} from '../types/blog-types';
import {blogRepository} from '../repository/blog.repository';

export const blogService = {
    async deleteAllBlogs() {
        await blogRepository.deleteAllBlogs();
    },
    async createBlog(blogInput: BlogInputType) {
        const newBlog: Omit<BlogDBType, '_id'> = {
            name: blogInput.name,
            description: blogInput.description,
            websiteUrl: blogInput.websiteUrl,
            createdAt: new Date().toISOString(),
            isMembership: false
        };
        return blogRepository.createBlog(newBlog);
    },
    async updateBlog(id: string, blogUpdate: BlogInputType) {
        return blogRepository.updateBlog(id, blogUpdate);
    },
    async deleteBlog(id: string) {
        return blogRepository.deleteBlog(id);
    }
};
