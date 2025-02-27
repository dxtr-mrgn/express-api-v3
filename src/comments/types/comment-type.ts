import {ObjectId} from 'mongodb';

export type CommentInputType = {
    content: string
}

export type CommentType = {
    content: string,
    commentatorInfo: CommentatorInfo,
    postId: string,
    createdAt: string
}

export type CommentatorInfo = {
    userId: string,
    userLogin: string
}

export type MappedCommentType = {
    id: string | ObjectId,
    content: string,
    commentatorInfo: CommentatorInfo,
    createdAt: string
}

export type CommentsType = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: MappedCommentType[]
}
