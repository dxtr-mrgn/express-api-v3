import {userRepository} from '../repository/user-repository';
import {UserInputType, UserType} from '../types/user-type';
import bcrypt from 'bcrypt';
import {ResultObj} from '../../common/types';
import {v4 as uuidv4} from 'uuid';
import {add} from 'date-fns';
import {sendEmail} from '../adapters/email-manager';
import {ObjectId} from 'mongodb';
import {userService} from './user-service';
import {getRegistrationEmailTemplate} from '../controller/registration-message';

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

        const confirmationCode = uuidv4();
        const message = getRegistrationEmailTemplate(confirmationCode);
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
                expirationDate: add(new Date(), {minutes: 10}),
                isConfirmed: 'no'
            }
        };
        const userId: string = await userRepository.createUser(newUser);

        const emailSent = await sendEmail(userInput.email, message);
        if (emailSent) {
            return {
                status: 'success',
                id: userId
            };
        } else {
            await userRepository.deleteUser(new ObjectId(userId));
            return this.errorSendingEmail();
        }
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
    async confirmEmail(code: string): Promise<ResultObj> {
        let message;
        const user = await userRepository.findByConfirmationCode(code);
        if (user) {
            if (user.emailConfirmation.expirationDate < new Date()) message = 'Confirmation code has expired';
            if (user.emailConfirmation.isConfirmed === 'yes') message = 'Confirmed email already exists';

            const updated = await userRepository.updateUserById(user!._id, {'emailConfirmation.isConfirmed': 'yes'});
            if (!updated) message = 'isConfirmed status was not updated';
        } else {
            message = 'The confirmation code is invalid';
        }

        if (message) return {
            status: 'error',
            error: {
                errorsMessages: [
                    {
                        message,
                        field: 'User'
                    }
                ]
            }
        };

        return {status: 'success'};
    },
    async resendConfirmation(email: string): Promise<ResultObj> {
        const user = await userRepository.findByEmail(email);
        if (!user) return {
            status: 'error',
            error: {
                errorsMessages: [
                    {
                        message: 'No user with provided email',
                        field: 'User'
                    }
                ]
            }
        };
        if (user.emailConfirmation.isConfirmed === 'yes') return {
            status: 'error',
            error: {
                errorsMessages: [
                    {
                        message: 'Email already has been confirmed',
                        field: 'Email'
                    }
                ]
            }
        };

        const confirmationCode = uuidv4();
        const message = getRegistrationEmailTemplate(confirmationCode);
        const updatedUser = {
            ...user, emailConfirmation: {
                confirmationCode,
                expirationDate: add(new Date(), {minutes: 10}),
                isConfirmed: 'no'
            }
        };
        const userId = user._id;
        const updated = await userRepository.updateUserById(userId, updatedUser);
        if (!updated) return {
            status: 'error',
            error: {
                errorsMessages: [
                    {
                        message: 'The user has not been updated',
                        field: 'User'
                    }
                ]
            }
        };
        const emailSent = await sendEmail(email, message);
        if (emailSent) {
            return {
                status: 'success',
                id: toIdString(userId)
            };
        } else {
            await userRepository.deleteUser(userId);
            return this.errorSendingEmail();
        }
    },
    errorSendingEmail(): ResultObj {
        return {
            status: 'error',
            error: {
                errorsMessages: [
                    {
                        message: 'There was an error sending email confirmation. The user has been deleted',
                        field: 'Email'
                    }
                ]
            }
        };
    }
};
