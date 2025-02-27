import request from 'supertest';
import {app} from '../../../src/app';
import {HttpStatus, SETTINGS} from '../../../src/settings';
import {client} from '../../../src/db/mongodb';
import {clearDB} from '../../utils/clearDB';
import {createUser} from '../../utils/createUser';


const api = () => request(app);
const loginUrl = SETTINGS.API.AUTH + '/login';
const meUrl = SETTINGS.API.AUTH + '/me';

describe('POST /auth/login', () => {
    let user1: any = {};
    let token: any = {};

    beforeAll(async () => {
        await clearDB();

        user1 = await createUser();

    });
    afterAll(async () => {
        await client.close();
    });
    describe('200', () => {
        it('200 Login', async () => {
            const res = await api()
                .post(loginUrl)
                .send({
                    loginOrEmail: user1.login,
                    password: 'validpassword123'
                })
                .auth(SETTINGS.LOGIN, SETTINGS.PASSWORD)
                .expect(HttpStatus.OK);

            token = res.body;
        });
        it('200 Get Info', async () => {
            console.log(token);
            const res = await api()
                .get(meUrl)
                .set('Authorization', `Bearer ${token}`)
                .expect(HttpStatus.OK);

            expect(Object.keys(res.body)).toHaveLength(3);

            expect(typeof res.body.email).toBe('string');
            expect(typeof res.body.login).toBe('string');
            expect(typeof res.body.userId).toBe('string');

            expect(res.body.login).toBe(user1.login);
            expect(res.body.email).toBe(user1.email);
            expect(res.body.userId).toBe(user1.id);
        });
        it('401 Unauthorized', async () => {
            await api()
                .get(meUrl)
                .expect(HttpStatus.UNAUTHORIZED);
        });
    });
});