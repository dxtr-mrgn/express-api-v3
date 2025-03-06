import {ObjectId} from 'mongodb';

export type UserInputType = {
    login: string,
    password: string,
    email: string
}

export type accountData = {
    login: string,
    passwordHash: string,
    passwordSalt: string,
    email: string,
    createdAt: string
}

export type emailConfirmation = {
    confirmationCode: string,
    expirationDate: Date,
    isConfirmed: string
}

export type UserType = {
    accountData: accountData,
    emailConfirmation: emailConfirmation
}

export type ViewUserType = {
    id: ObjectId,
    login: string,
    email: string,
    createdAt: string
}

export type UserInfoType = {
    email: string,
    login: string,
    userId: string,
}

export type ViewUsersType = {
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items: ViewUserType[]
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