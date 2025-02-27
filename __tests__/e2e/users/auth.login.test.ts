import request from 'supertest';
import {app} from '../../../src/app';
import {HttpStatus, SETTINGS} from '../../../src/settings';
import {client} from '../../../src/db/mongodb';
import {clearDB} from '../../utils/clearDB';
import {createUser} from '../../utils/createUser';
import {
    invalidLoginOrEmailAuth,
    invalidPasswordAuth,
    missingLoginOrEmailAuth,
    missingPasswordAuth
} from '../../datasets/auth';


const api = () => request(app);

describe('POST /auth/login', () => {
    let user1: any = {};
    let jwtToken: any = {};

    beforeAll(async () => {
        await clearDB();

        user1 = await createUser();

    });
    afterAll(async () => {
        await client.close();
    });
    describe('200', () => {
        it('200 Login', async () => {
            const url = SETTINGS.API.AUTH;
            console.log(url);
            const res = await api()
                .post(url)
                .send({
                    loginOrEmail: user1.login,
                    password: 'validpassword123'
                })
                .auth(SETTINGS.LOGIN, SETTINGS.PASSWORD)
                .expect(HttpStatus.OK);

            jwtToken = res.body
            console.log(jwtToken)
        });
        it('200 Email', async () => {
            await api()
                .post(SETTINGS.API.AUTH)
                .send({
                    loginOrEmail: user1.email,
                    password: 'validpassword123'
                })
                .auth(SETTINGS.LOGIN, SETTINGS.PASSWORD)
                .expect(HttpStatus.OK);
        });
        it('400 Invalid Login', async () => {
            await api()
                .post(SETTINGS.API.AUTH)
                .send({
                    loginOrEmail: user1.login + 'XXX',
                    password: 'validpassword123'
                })
                .auth(SETTINGS.LOGIN, SETTINGS.PASSWORD)
                .expect(HttpStatus.UNAUTHORIZED);
        });
        it('400 Invalid Email', async () => {
            await api()
                .post(SETTINGS.API.AUTH)
                .send({
                    loginOrEmail: user1.email + 'XXX',
                    password: 'validpassword123'
                })
                .auth(SETTINGS.LOGIN, SETTINGS.PASSWORD)
                .expect(HttpStatus.UNAUTHORIZED);
        });
        it('400 Valid Login + Invalid Password', async () => {
            await api()
                .post(SETTINGS.API.AUTH)
                .send({
                    loginOrEmail: user1.login,
                    password: 'XXX'
                })
                .auth(SETTINGS.LOGIN, SETTINGS.PASSWORD)
                .expect(HttpStatus.UNAUTHORIZED);
        });
        it('400 Valid Email + Invalid Password', async () => {
            await api()
                .post(SETTINGS.API.AUTH)
                .send({
                    loginOrEmail: user1.email,
                    password: 'XXX'
                })
                .auth(SETTINGS.LOGIN, SETTINGS.PASSWORD)
                .expect(HttpStatus.UNAUTHORIZED);
        });
        it('400 Missing Login or Email', async () => {
            await api()
                .post(SETTINGS.API.AUTH)
                .send({
                    loginOrEmail: '',
                    password: 'validpassword123'
                })
                .auth(SETTINGS.LOGIN, SETTINGS.PASSWORD)
                .expect(HttpStatus.BAD_REQUEST, missingLoginOrEmailAuth.error);
        });
        it('400 Valid Email + Missing Password', async () => {
            await api()
                .post(SETTINGS.API.AUTH)
                .send({
                    loginOrEmail: user1.email,
                    password: ''
                })
                .auth(SETTINGS.LOGIN, SETTINGS.PASSWORD)
                .expect(HttpStatus.BAD_REQUEST, missingPasswordAuth.error);
        });
        it('400 Valid Login + Missing Password', async () => {
            await api()
                .post(SETTINGS.API.AUTH)
                .send({
                    loginOrEmail: user1.login,
                    password: ''
                })
                .auth(SETTINGS.LOGIN, SETTINGS.PASSWORD)
                .expect(HttpStatus.BAD_REQUEST, missingPasswordAuth.error);
        });
        it('400 Invalid Login or Email', async () => {
            await api()
                .post(SETTINGS.API.AUTH)
                .send({
                    loginOrEmail: [],
                    password: 'validpassword123'
                })
                .auth(SETTINGS.LOGIN, SETTINGS.PASSWORD)
                .expect(HttpStatus.BAD_REQUEST, invalidLoginOrEmailAuth.error);
        });
        it('400 Invalid password', async () => {
            await api()
                .post(SETTINGS.API.AUTH)
                .send({
                    loginOrEmail: user1.login,
                    password: []
                })
                .auth(SETTINGS.LOGIN, SETTINGS.PASSWORD)
                .expect(HttpStatus.BAD_REQUEST, invalidPasswordAuth.error);
        });
        it('401 Unauthorized', async () => {
            await api()
                .post(SETTINGS.API.AUTH)
                .send({
                    loginOrEmail: user1.email,
                    password: 'validpassword123'
                })
                .expect(HttpStatus.UNAUTHORIZED);
        });
    });
});