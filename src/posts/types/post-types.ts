export type  PostInputType = {
    title: string,
    shortDescription: string,
    content: string,
    blogId: string
}

export type  PostDBType = {
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string | undefined,
    createdAt: string
}
