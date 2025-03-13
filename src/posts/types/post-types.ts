import {ObjectId} from 'mongodb';

export type  PostInputType = {
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
}

export type PostDBType = {
    _id: ObjectId,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string | undefined,
    createdAt: string
}

export type ViewPostType = {
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string | undefined,
    createdAt: string
}

export type ViewPostsType = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: ViewPostType[]
}
