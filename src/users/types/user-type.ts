export type UserInputType = {
    login: string,
    password: string,
    email: string
}

export type UserConstructType = {
    login: string,
    passwordHash: string,
    passwordSalt: string,
    email: string,
    createdAt: string
}


export type UserDBType = {
    id: string,
    login: string,
    passwordHash: string,
    passwordSalt: string,
    email: string,
    createdAt: string
}

export type UserInfoType = {
    email: string,
    login: string,
    userId: string,
}

export type UsersDBType = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: UserDBType[]
}

export type LoginUser = {
    loginOrEmail: string,
    password: string,
}

export type errorMessage = {
    field: string,
    message: string
}
export type NotUniqueError = {
    errorsMessages: errorMessage[]
};