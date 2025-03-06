import {userRepository} from '../repository/user-repository';
import {UserType, UserInputType} from '../types/user-type';
import bcrypt from 'bcrypt';
import {ResultObj} from '../../common/types';
import {v4 as uuidv4} from 'uuid';
import {add} from 'date-fns';
import {format} from 'date-fns/format';
import {emailManager} from '../adapters/emaiil-manager';
import {ObjectId} from 'mongodb';
import {userService} from './user-service';

const toIdString = (id: ObjectId): string => id.toString();

export const authService = {
    errorMessage(field: string) {
        return {
            errorsMessages: [{field: field, message: field + ' should be unique'}]
        };
    },
    async registerUser(userInput: UserInputType): Promise<ResultObj> {
        const userDoesExist = await userService.checkExistingUser(userInput.login, userInput.email);
        if (userDoesExist) return userDoesExist;

        const passwordSalt = await bcrypt.genSalt(10);
        const passwordHash = await this._generateHash(userInput.password, passwordSalt);

        const confirmationCode = uuidv4()
        const newUser: UserType = {
            accountData: {
                login: userInput.login,
                passwordHash: passwordHash,
                passwordSalt: passwordSalt,
                email: userInput.email,
                createdAt: new Date().toISOString()
            },
            emailConfirmation: {
                confirmationCode,
                expirationDate: add(new Date(), {minutes: 5}),
                isConfirmed: 'no'
            }
        };
        const userId: string = await userRepository.createUser(newUser);
        try {
            await emailManager.sendEmailConfirmation(userInput.email, confirmationCode);
        } catch (error) {
            console.log(error);
            await userRepository.deleteUser(new ObjectId(userId));
            return {
                status: 'error',
                error: error
            };
        }
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
    async _generateHash(password: string, passwordSalt: string) {
        return await bcrypt.hash(password, passwordSalt);
    },
    async confirmEmail(code: string) {
        let user = await userRepository.findByConfirmationCode(code);
        if (!user) return false;
        if (user.emailConfirmation.confirmationCode !== code) return false;
        if (user.emailConfirmation.expirationDate < new Date()) return false;

        return await userRepository.updateUserById(user._id, {'emailConfirmation.isConfirmed': 'yes'});
    },
    async resendConfirmation(email: string) {
        const user = await userRepository.findByEmail(email);
        if (!user) return false;

        const confirmationCode =  uuidv4()
        const updatedUser = {
            ...user, emailConfirmation: {
                confirmationCode,
                expirationDate: add(new Date(), {minutes: 5}),
                isConfirmed: 'no'
            }
        };
        const userId = user._id
        const updated = await userRepository.updateUserById(userId, updatedUser);
        if (!updated) return false;
        try {
            await emailManager.sendEmailConfirmation(email, confirmationCode);
        } catch (error) {
            console.log(error);
            await userRepository.deleteUser(userId);
            return {
                status: 'error',
                error: error
            };
        }
        return {
            status: 'success',
            id: userId
        };
    },

};
