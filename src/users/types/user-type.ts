export type UserInputType = {
    login: string,
    password: string,
    email: string
}

export type UserConstructType = {
    login: string,
    password: string,
    email: string,
    createdAt: string
}


export type UserDBType = {
    id: string,
    login: string,
    password: string,
    email: string,
    createdAt: string
}

export type UsersDBType = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: UserDBType[]
}
