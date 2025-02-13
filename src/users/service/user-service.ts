import {userRepository} from '../repository/user-repository';
import {NotUniqueError, UserConstructType, UserDBType, UserInputType, UsersDBType} from '../types/user-type';
import bcrypt from 'bcrypt';

export const userService = {
    async deleteAllUsers() {
        await userRepository.deleteAllUsers();
    },
    errorMessage(field: string) {
        return {
            errorsMessages: [{field: field, message: field + ' should be unique'}]
        }
    },
    async createUser(userInput: UserInputType): Promise<UserDBType | NotUniqueError> {
        // const existLoginUser = await userRepository.findByLogin(userInput.login);
        // if (existLoginUser) {
        //     return this.errorMessage('login')
        // }
        // const existEmailUser = await userRepository.findByEmail(userInput.email);
        // if (existEmailUser) {
        //     return this.errorMessage('email')
        // }

        const passwordSalt = await bcrypt.genSalt(10);
        const passwordHash = await this._generateHash(userInput.password, passwordSalt);

        const newUser: UserConstructType = {
            login: userInput.login,
            passwordHash: passwordHash,
            passwordSalt: passwordSalt,
            email: userInput.email,
            createdAt: new Date().toISOString()
        };
        return userRepository.createUser(newUser);
    },
    async checkCredentials(loginOrEmail: string, password: string): Promise<boolean> {
        const user = await userRepository.findByLoginOrEmail(loginOrEmail);
        if (!user) return false;

        const passwordHash = await this._generateHash(password, user.passwordSalt);
        return user.passwordHash === passwordHash;

    },
    async _generateHash(password: string, passwordSalt: string) {
        return await bcrypt.hash(password, passwordSalt);
    },
    async findUsers(filterDto: {
        searchLoginTerm: string | null,
        searchEmailTerm: string | null,
        sortBy: string,
        sortDirection: string,
        pageNumber: number,
        pageSize: number,
    }): Promise<UsersDBType> {
        const {searchLoginTerm, searchEmailTerm, sortBy, sortDirection, pageNumber, pageSize} = filterDto;

        const blogs: UserDBType[] = await userRepository.findUsers({
            searchLoginTerm,
            searchEmailTerm,
            sortBy,
            sortDirection,
            pageNumber,
            pageSize
        });
        const blogCount = await userRepository.getUsersCount(searchLoginTerm, searchEmailTerm);

        return {
            pagesCount: Math.ceil(blogCount / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: blogCount,
            items: blogs
        };

    },
    async deleteUser(id: string) {
        return userRepository.deleteUser(id);
    }
};
