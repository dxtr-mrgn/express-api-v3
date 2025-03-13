import {ObjectId} from 'mongodb';

export type BlogInputType = {
    name: string,
    description: string,
    websiteUrl: string
}

export type BlogDBType = {
    _id: ObjectId,
    name: string,
    description: string,
    websiteUrl: string,
    createdAt: string,
    isMembership: boolean
}

export type ViewBlogType = {
    id: string,
    name: string,
    description: string,
    websiteUrl: string,
    createdAt: string,
    isMembership: boolean
}

export type ViewBlogsType = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: ViewBlogType[]
}