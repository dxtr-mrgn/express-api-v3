import {UserDBType, UserInputType} from '../../src/users/types/user-type';
import {ObjectId} from 'mongodb';
import {userService} from '../../src/users/service/user-service';
import {userRepository} from '../../src/users/repository/user-repository';
import {authService} from '../../src/users/service/auth-service';
import {sendEmail} from '../../src/users/adapters/email-manager';
import {add} from 'date-fns';
import {v4 as uuidv4} from 'uuid';
import {getRegistrationEmailTemplate} from '../../src/users/controller/registration-message';
import {MongoMemoryServer} from 'mongodb-memory-server';

jest.mock('../../src/users/adapters/email-manager', () => ({
    sendEmail: jest.fn(),
}));

jest.mock('../../src/users/repository/user-repository', () => ({
    userRepository: {
        createUser: jest.fn(),
        deleteUser: jest.fn(),
        findByLoginOrEmail: jest.fn(),
        findByConfirmationCode: jest.fn(),
        updateUserById: jest.fn(),
        findByEmail: jest.fn(),
    }
}));

jest.mock('../../src/users/service/user-service', () => ({
    userService: {
        checkExistingUser: jest.fn(),
        createUser: jest.fn(async function (userInput) {
            await this.checkExistingUser(userInput.login, userInput.email);
        })
    }
}));

describe('Auth Service Tests', () => {
    let mongoServer: MongoMemoryServer;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('registerUser - success with email sent', async () => {
        const userInput: UserInputType = {
            login: 'testuser',
            password: 'password123',
            email: 'test@example.com',
        };
        const userId = new ObjectId().toString();
        const confirmationCode = uuidv4();
        const message = getRegistrationEmailTemplate(confirmationCode);

        (userService.checkExistingUser as jest.Mock).mockResolvedValue(null);
        (userRepository.createUser as jest.Mock).mockResolvedValue(userId);
        (sendEmail as jest.Mock).mockResolvedValue(true);
        jest.spyOn(authService, '_getUniqueCode').mockReturnValue(confirmationCode);

        const result = await authService.registerUser(userInput);

        expect(result).toEqual({status: 'success', id: userId});
        expect(userService.checkExistingUser).toHaveBeenCalledWith('testuser', 'test@example.com');
        expect(userRepository.createUser).toHaveBeenCalledWith(expect.any(Object));
        expect(sendEmail).toHaveBeenCalledWith('test@example.com', message);
    });

    test('registerUser - email fails, user is deleted', async () => {
        const userInput: UserInputType = {
            login: 'testuser',
            email: 'test@example.com',
            password: 'password123',
        };
        const userId = new ObjectId().toString();

        (userService.checkExistingUser as jest.Mock).mockResolvedValue(null);
        (userRepository.createUser as jest.Mock).mockResolvedValue(userId);
        (sendEmail as jest.Mock).mockResolvedValue(false);

        const result = await authService.registerUser(userInput);

        expect(result.status).toBe('error');
        expect(result.error?.errorsMessages[0].message).toBe(
            'There was an error sending email confirmation. The user has been deleted'
        );
        expect(userRepository.deleteUser).toHaveBeenCalledWith(userId);
    });

    test('checkCredentials - valid credentials', async () => {
        const user: UserDBType = {
            _id: new ObjectId(),
            login: 'testuser',
            email: 'test@example.com',
            passwordHash: '$2b$10$WA2uuW6aaRX6rKxZtohRt.La/mkC7av9bRsdZHOSYU3PmDrSsaPZm',
            passwordSalt: '$2b$10$WA2uuW6aaRX6rKxZtohRt.',
            createdAt: new Date().toISOString(),
            emailConfirmation: {
                confirmationCode: 'old-code',
                expirationDate: new Date(),
                isConfirmed: 'no',
            },
        };
        (userRepository.findByLoginOrEmail as jest.Mock).mockResolvedValue(user);

        const result = await authService.checkCredentials(user.login, 'validpassword123');

        expect(result).toBe(user._id.toString());
        expect(userRepository.findByLoginOrEmail).toHaveBeenCalledWith(user.login);

        const result2 = await authService.checkCredentials(user.email, 'validpassword123');

        expect(result2).toBe(user._id.toString());
        expect(userRepository.findByLoginOrEmail).toHaveBeenCalledWith(user.email);
    });

    test('confirmEmail - successful confirmation', async () => {
        const user: UserDBType = {
            _id: new ObjectId(),
            login: 'testuser',
            email: 'test@example.com',
            passwordHash: 'hashedpassword',
            passwordSalt: 'salt',
            createdAt: new Date().toISOString(),
            emailConfirmation: {
                confirmationCode: 'valid-code',
                expirationDate: add(new Date(), {minutes: 5}),
                isConfirmed: 'no',
            },
        };
        (userRepository.findByConfirmationCode as jest.Mock).mockResolvedValue(user);
        (userRepository.updateUserById as jest.Mock).mockResolvedValue(true);

        const result = await authService.confirmEmail('valid-code');

        expect(result).toEqual({status: 'success'});
        expect(userRepository.updateUserById).toHaveBeenCalledWith(
            user._id,
            {'emailConfirmation.isConfirmed': 'yes'}
        );
    });

    test('resendConfirmation - success with email sent', async () => {
        const user: UserDBType = {
            _id: new ObjectId(),
            login: 'testuser',
            email: 'test@example.com',
            passwordHash: 'hashedpassword',
            passwordSalt: 'salt',
            createdAt: new Date().toISOString(),
            emailConfirmation: {
                confirmationCode: 'old-code',
                expirationDate: new Date(),
                isConfirmed: 'no',
            },
        };

        const confirmationCode = uuidv4();
        const message = getRegistrationEmailTemplate(confirmationCode);

        jest.spyOn(authService, '_getUniqueCode').mockReturnValue(confirmationCode);
        (userRepository.findByEmail as jest.Mock).mockResolvedValue(user);
        (userRepository.updateUserById as jest.Mock).mockResolvedValue(true);
        (sendEmail as jest.Mock).mockResolvedValue(true);

        const result = await authService.resendConfirmation('test@example.com');

        expect(result).toEqual({status: 'success', id: user._id.toString()});
        expect(userRepository.updateUserById).toHaveBeenCalledWith(
            user._id,
            expect.objectContaining({
                emailConfirmation: expect.objectContaining({isConfirmed: 'no', confirmationCode}),
            })
        );
        expect(sendEmail).toHaveBeenCalledWith(
            'test@example.com',
            expect.stringContaining(message)
        );
    });

    test('resendConfirmation - email fails, user deleted', async () => {
        const user: UserDBType = {
            _id: new ObjectId(),
            login: 'testuser',
            email: 'test@example.com',
            passwordHash: 'hashedpassword',
            passwordSalt: 'salt',
            createdAt: new Date().toISOString(),
            emailConfirmation: {
                confirmationCode: 'old-code',
                expirationDate: new Date(),
                isConfirmed: 'no',
            },
        };
        (userRepository.findByEmail as jest.Mock).mockResolvedValue(user);
        (userRepository.updateUserById as jest.Mock).mockResolvedValue(true);
        (sendEmail as jest.Mock).mockResolvedValue(false);
        (userRepository.deleteUser as jest.Mock).mockResolvedValue(true);

        const result = await authService.resendConfirmation('test@example.com');

        expect(result.status).toBe('error');
        expect(result.error?.errorsMessages[0].message).toBe(
            'There was an error sending email confirmation. The user has been deleted'
        );
        expect(userRepository.deleteUser).toHaveBeenCalledWith(user._id.toString());
    });
});