import {userRepository} from '../repository/user-repository';
import {UserInputType, UserType} from '../types/user-type';
import bcrypt from 'bcrypt';
import {ResultObj} from '../../common/types';
import {v4 as uuidv4} from 'uuid';
import {add} from 'date-fns';
import {ObjectId} from 'mongodb';

const toIdString = (id: ObjectId): string => id.toString();

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
        const userDoesExist = await this.checkExistingUser(userInput.login, userInput.email);
        if (userDoesExist) return userDoesExist;

        const passwordSalt = await bcrypt.genSalt(10);
        const passwordHash = await this._generateHash(userInput.password, passwordSalt);

        const newUser: UserType = {
            accountData: {
                login: userInput.login,
                passwordHash: passwordHash,
                passwordSalt: passwordSalt,
                email: userInput.email,
                createdAt: new Date().toISOString()
            },
            emailConfirmation: {
                confirmationCode: uuidv4(),
                expirationDate: add(new Date(), {minutes: 5}),
                isConfirmed: 'yes'
            }
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

        const passwordHash = await this._generateHash(password, user.accountData.passwordSalt);
        if (user.accountData.passwordHash === passwordHash) {
            return toIdString(user._id);
        } else {
            return null;
        }

    },
    async checkExistingUser(login: string, email: string): Promise<ResultObj | null> {
        const existLoginUser = await userRepository.findByLogin(login);
        if (existLoginUser !== null) {
            return {
                status: 'error',
                error: this.errorMessage('login')
            };
        }
        const existEmailUser = await userRepository.findByEmail(email);
        if (existEmailUser !== null) {
            return {
                status: 'error',
                error: this.errorMessage('email')
            };
        }
        return null;
    },
    async _generateHash(password: string, passwordSalt: string) {
        return await bcrypt.hash(password, passwordSalt);
    },
    async deleteUser(id: string) {
        return userRepository.deleteUser(new ObjectId(id));
    }
};
