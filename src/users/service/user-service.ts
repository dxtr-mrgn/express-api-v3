import {userRepository} from '../repository/user-repository';
import {UserConstructType, UserDBType, UserInputType, UsersDBType} from '../types/user-type';

export const userService = {
    async deleteAllUsers() {
        await userRepository.deleteAllUsers();
    },
    async createUser(userInput: UserInputType): Promise<UserDBType> {
        const newUser: UserConstructType = {
            login: userInput.login,
            password: userInput.password,
            email: userInput.email,
            createdAt: new Date().toISOString()
        };
        return userRepository.createUser(newUser);
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
