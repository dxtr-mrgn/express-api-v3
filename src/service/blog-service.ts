import {BlogConstructType, BlogInputType} from '../types/blog-types';
import {blogRepository} from '../repositories/blog-repository';

export const blogService = {
    async deleteAllBlogs() {
        await blogRepository.deleteAllBlogs();
    },
    async createBlog(blogInput: BlogInputType) {
        const newBlog: BlogConstructType = {
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
    async findBlogs(filterDto: {
        searchNameTerm: string | null,
        sortBy: string,
        sortDirection: string,
        pageNumber: number,
        pageSize: number,
    }) {
        const {searchNameTerm, sortBy, sortDirection, pageNumber, pageSize} = filterDto;

        const blogs = await blogRepository.findBlogs({
            searchNameTerm,
            sortBy,
            sortDirection,
            pageNumber,
            pageSize
        });
        const blogCount = await blogRepository.getBlogsCount(searchNameTerm);

        return {
            pageCount: Math.ceil(blogCount / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: blogCount,
            items: blogs,

        };

    },
    async findBlogsById(id: string): Promise<any> {
        return blogRepository.findBlogsById(id);
    },
    async deleteBlog(id: string) {
        return blogRepository.deleteBlog(id);
    }
};
