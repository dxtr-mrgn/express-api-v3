import {userRepository} from '../repository/user-repository';
import {UserConstructType, UserInputType} from '../types/user-type';
import bcrypt from 'bcrypt';
import {ResultObj} from '../../common/types';

export const userService = {
    async deleteAllUsers() {
        await userRepository.deleteAllUsers();
    },
    errorMessage(field: string) {
        return {
            errorsMessages: [{field: field, message: field + ' should be unique'}]
        };
    },
    async createUser(userInput: UserInputType): Promise<ResultObj> {
        const existLoginUser = await userRepository.findByLogin(userInput.login);
        if (existLoginUser.length !== 0) {
            return {
                status: 'error',
                error: this.errorMessage('login')
            };
        }
        const existEmailUser = await userRepository.findByEmail(userInput.email);
        if (existEmailUser.length !== 0) {
            return {
                status: 'error',
                error: this.errorMessage('email')
            };
        }

        const passwordSalt = await bcrypt.genSalt(10);
        const passwordHash = await this._generateHash(userInput.password, passwordSalt);

        const newUser: UserConstructType = {
            login: userInput.login,
            passwordHash: passwordHash,
            passwordSalt: passwordSalt,
            email: userInput.email,
            createdAt: new Date().toISOString()
        };
        const userId: string = await userRepository.createUser(newUser);
        return {
            status: 'success',
            id: userId
        };
    },
    async checkCredentials(loginOrEmail: string, password: string): Promise<string | null> {
        const user = await userRepository.findByLoginOrEmail(loginOrEmail);
        if (!user) return null;

        const passwordHash = await this._generateHash(password, user.passwordSalt);
        if (user.passwordHash === passwordHash) {
            return user.id;
        } else {
            return null;
        }

    },
    async _generateHash(password: string, passwordSalt: string) {
        return await bcrypt.hash(password, passwordSalt);
    },
    async deleteUser(id: string) {
        return userRepository.deleteUser(id);
    }
};
