import {ObjectId} from 'mongodb';

export type UserInputType = {
    login: string,
    password: string,
    email: string
}

export type emailConfirmation = {
    confirmationCode: string,
    expirationDate: Date,
    isConfirmed: string
}

export type UserDBType = {
    _id: ObjectId
    login: string,
    passwordHash: string,
    passwordSalt: string,
    email: string,
    createdAt: string,
    emailConfirmation: emailConfirmation
}

export type ViewUserType = {
    id: string,
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

export interface LoginRequestBody {
    loginOrEmail: string;
    password: string;
}

export interface ConfirmationCodeRequestBody {
    code: string;
}

export interface ConfirmationResendEmailRequestBody {
    email: string;
}