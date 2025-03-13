import {ObjectId} from 'mongodb';

export type CommentInputType = {
    content: string
}
export type CommentatorInfo = {
    userId: string,
    userLogin: string
}

export type CommentDBType = {
    _id: ObjectId,
    content: string,
    commentatorInfo: CommentatorInfo,
    postId: string,
    createdAt: string
}

export type ViewCommentType = {
    id: string | ObjectId,
    content: string,
    commentatorInfo: CommentatorInfo,
    createdAt: string
}

export type ViewCommentsType = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: ViewCommentType[]
}
