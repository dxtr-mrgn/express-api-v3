import request from 'supertest';
import {app} from '../../../src/app';
import {HttpStatus, SETTINGS} from '../../../src/settings';
import {client} from '../../../src/db/mongodb';
import {clearDB} from '../../utils/clearDB';
import {
    invalidEmailUser,
    invalidLoginUser,
    invalidPasswordUser,
    missingAllUser,
    missingEmailUser,
    missingLoginUser,
    missingPasswordUser,
    notUniqueEmailUser, notUniqueLoginUser,
    tooLongLoginUser,
    tooLongPasswordUser,
    tooShortLoginUser,
    tooShortPasswordUser,
    validUser
} from '../../datasets/users';


const api = () => request(app);

describe('POST /posts', () => {
    beforeAll(async () => {
        await clearDB();
    });
    afterAll(async () => {
        await client.close();
    });
    describe('4xx', () => {
        it('400 invalid Login', async () => {
            await api()
                .post(SETTINGS.API.USERS)
                .send(invalidLoginUser.payload)
                .auth(SETTINGS.LOGIN, SETTINGS.PASSWORD)
                .expect(HttpStatus.BAD_REQUEST, invalidLoginUser.error);
        });
        it('400 invalid password', async () => {
            await api()
                .post(SETTINGS.API.USERS)
                .send(invalidPasswordUser.payload)
                .auth(SETTINGS.LOGIN, SETTINGS.PASSWORD)
                .expect(HttpStatus.BAD_REQUEST, invalidPasswordUser.error);
        });
        it('400 invalid Email', async () => {
            await api()
                .post(SETTINGS.API.USERS)
                .send(invalidEmailUser.payload)
                .auth(SETTINGS.LOGIN, SETTINGS.PASSWORD)
                .expect(HttpStatus.BAD_REQUEST, invalidEmailUser.error);
        });
        it('400 missing Login', async () => {
            await api()
                .post(SETTINGS.API.USERS)
                .send(missingLoginUser.payload)
                .auth(SETTINGS.LOGIN, SETTINGS.PASSWORD)
                .expect(HttpStatus.BAD_REQUEST, missingLoginUser.error);
        });
        it('400 missing Password', async () => {
            await api()
                .post(SETTINGS.API.USERS)
                .send(missingPasswordUser.payload)
                .auth(SETTINGS.LOGIN, SETTINGS.PASSWORD)
                .expect(HttpStatus.BAD_REQUEST, missingPasswordUser.error);
        });
        it('400 missing Email', async () => {
            await api()
                .post(SETTINGS.API.USERS)
                .send(missingEmailUser.payload)
                .auth(SETTINGS.LOGIN, SETTINGS.PASSWORD)
                .expect(HttpStatus.BAD_REQUEST, missingEmailUser.error);
        });
        it('400 empty payload', async () => {
            await api()
                .post(SETTINGS.API.USERS)
                .send(missingAllUser.payload)
                .auth(SETTINGS.LOGIN, SETTINGS.PASSWORD)
                .expect(HttpStatus.BAD_REQUEST, missingAllUser.error);
        });
        it('400 too long Login', async () => {
            await api()
                .post(SETTINGS.API.USERS)
                .send(tooLongLoginUser.payload)
                .auth(SETTINGS.LOGIN, SETTINGS.PASSWORD)
                .expect(HttpStatus.BAD_REQUEST, tooLongLoginUser.error);
        });
        it('400 too short Login', async () => {
            await api()
                .post(SETTINGS.API.USERS)
                .send(tooShortLoginUser.payload)
                .auth(SETTINGS.LOGIN, SETTINGS.PASSWORD)
                .expect(HttpStatus.BAD_REQUEST, tooShortLoginUser.error);

        });
        it('400 too long Password', async () => {
            await api()
                .post(SETTINGS.API.USERS)
                .send(tooLongPasswordUser.payload)
                .auth(SETTINGS.LOGIN, SETTINGS.PASSWORD)
                .expect(HttpStatus.BAD_REQUEST, tooLongPasswordUser.error);
        });
        it('400 too short Password', async () => {
            await api()
                .post(SETTINGS.API.USERS)
                .send(tooShortPasswordUser.payload)
                .auth(SETTINGS.LOGIN, SETTINGS.PASSWORD)
                .expect(HttpStatus.BAD_REQUEST, tooShortPasswordUser.error);
        });
        it('401 no auth', async () => {
            await api()
                .post(SETTINGS.API.USERS)
                .send(validUser.payload)
                .expect(HttpStatus.UNAUTHORIZED);
        });
        it('401 invalid login', async () => {
            await api()
                .post(SETTINGS.API.USERS)
                .send(validUser.payload)
                .auth(SETTINGS.LOGIN + ' ', SETTINGS.PASSWORD)
                .expect(HttpStatus.UNAUTHORIZED);
        });
        it('401 invalid password', async () => {
            await api()
                .post(SETTINGS.API.USERS)
                .send(validUser.payload)
                .auth(SETTINGS.LOGIN, SETTINGS.PASSWORD + ' ')
                .expect(HttpStatus.UNAUTHORIZED);
        });
        it('401 invalid login and password', async () => {
            await api()
                .post(SETTINGS.API.USERS)
                .send(validUser.payload)
                .auth(SETTINGS.LOGIN + ' ', SETTINGS.PASSWORD + ' ')
                .expect(HttpStatus.UNAUTHORIZED);
        });
    });
    describe('201', () => {
        it('201', async () => {

            const res = await api()
                .post(SETTINGS.API.USERS)
                .auth(SETTINGS.LOGIN, SETTINGS.PASSWORD)
                .send(validUser.payload);

            expect(res.status).toBe(HttpStatus.CREATED);
            expect(Object.keys(res.body)).toHaveLength(4);

            expect(typeof res.body.id).toBe('string');
            expect(typeof res.body.login).toBe('string');
            expect(typeof res.body.email).toBe('string');
            expect(typeof res.body.createdAt).toBe('string');

            expect(res.body.login).toBe(validUser.payload.login);
            expect(res.body.email).toBe(validUser.payload.email);
            expect(res.body.createdAt).toBeTruthy();
            const date = new Date(res.body.createdAt);
            expect(date.toISOString()).toBe(res.body.createdAt);
            // @ts-ignore
            expect(date instanceof Date && !isNaN(date)).toBe(true);
        });
        it('400 - Duplicate Login', async () => {
            const res = await api()
                .post(SETTINGS.API.USERS)
                .send(notUniqueLoginUser.payload)
                .auth(SETTINGS.LOGIN, SETTINGS.PASSWORD)
                .expect(HttpStatus.BAD_REQUEST, notUniqueLoginUser.error);
        });
        it('400 - Duplicate Email', async () => {
            const res = await api()
                .post(SETTINGS.API.USERS)
                .send(notUniqueEmailUser.payload)
                .auth(SETTINGS.LOGIN, SETTINGS.PASSWORD)
                .expect(HttpStatus.BAD_REQUEST, notUniqueEmailUser.error);
        });
    });
});