export type BlogInputType = {
    name: string,
    description: string,
    websiteUrl: string
}

export type BlogConstructType = {
    name: string,
    description: string,
    websiteUrl: string,
    createdAt: string,
    isMembership: boolean
}


export type BlogDBType = {
    id: string,
    name: string,
    description: string,
    websiteUrl: string,
    createdAt: string,
    isMembership: boolean
}