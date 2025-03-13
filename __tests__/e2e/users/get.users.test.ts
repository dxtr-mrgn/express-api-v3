import request from 'supertest';
import {app} from '../../../src/app';
import {HttpStatus, SETTINGS} from '../../../src/settings';
import {connectDB, disconnectDB} from '../../../src/db/mongodb';
import {clearDB} from '../../utils/clearDB';
import {createUser} from '../../utils/createUser';
import {MongoMemoryServer} from 'mongodb-memory-server';

const api = () => request(app);

describe('GET /users', () => {
    let user1: any = {};
    let user2: any = {};
    let user3: any = {};
    let mongoServer: MongoMemoryServer;

    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        await connectDB(mongoServer.getUri());
        await clearDB();

        user1 = await createUser({
            login: 'aaa',
            password: 'validpassword123',
            email: 'aaa@gmail.com'
        });
        user2 = await createUser({
            login: 'bbb',
            password: 'validpassword123',
            email: 'bbb@gmail.com'
        });
        user3 = await createUser({
            login: 'ccc',
            password: 'validpassword123',
            email: 'ccc@gmail.com'
        });
    });
    afterAll(async () => {
        await disconnectDB();
        await mongoServer.stop();
    });
    it('200 /users default', async () => {
        await api()
            .get(SETTINGS.API.USERS)
            .auth(SETTINGS.LOGIN, SETTINGS.PASSWORD)
            .expect(HttpStatus.OK, {
                pagesCount: 1,
                page: 1,
                pageSize: 10,
                totalCount: 3,
                items: [user3, user2, user1]
            });
    });
    it('200 /users sortDirection=asc', async () => {
        await api()
            .get(SETTINGS.API.USERS + '?sortBy=createdAt&sortDirection=asc&pageNumber=1&pageSize=10')
            .auth(SETTINGS.LOGIN, SETTINGS.PASSWORD)
            .expect(HttpStatus.OK, {
                pagesCount: 1,
                page: 1,
                pageSize: 10,
                totalCount: 3,
                items: [user1, user2, user3]
            });
    });
    it('200 /users pageNumber=2&pageSize=1', async () => {
        await api()
            .get(SETTINGS.API.USERS + '?sortBy=createdAt&pageNumber=2&pageSize=1')
            .auth(SETTINGS.LOGIN, SETTINGS.PASSWORD)
            .expect(HttpStatus.OK, {
                pagesCount: 3,
                page: 2,
                pageSize: 1,
                totalCount: 3,
                items: [user2]
            });
    });
    it('200 /users sortBy=login', async () => {
        await api()
            .get(SETTINGS.API.USERS + '?sortBy=login')
            .auth(SETTINGS.LOGIN, SETTINGS.PASSWORD)
            .expect(HttpStatus.OK, {
                pagesCount: 1,
                page: 1,
                pageSize: 10,
                totalCount: 3,
                items: [user3, user2, user1]
            });
    });
    it('200 /users login / asc / 2 / 2', async () => {
        await api()
            .get(SETTINGS.API.USERS + '?sortBy=login&sortDirection=asc&pageNumber=2&pageSize=2')
            .auth(SETTINGS.LOGIN, SETTINGS.PASSWORD)
            .expect(HttpStatus.OK, {
                pagesCount: 2,
                page: 2,
                pageSize: 2,
                totalCount: 3,
                items: [user3]
            });
    });
    it('200 /users searchLoginTerm=aaa', async () => {
        await api()
            .get(SETTINGS.API.USERS + '?searchLoginTerm=aaa')
            .auth(SETTINGS.LOGIN, SETTINGS.PASSWORD)
            .expect(HttpStatus.OK, {
                pagesCount: 1,
                page: 1,
                pageSize: 10,
                totalCount: 1,
                items: [user1]
            });
    });
    it('200 /users searchEmailTerm=ccc', async () => {
        await api()
            .get(SETTINGS.API.USERS + '?searchEmailTerm=ccc')
            .auth(SETTINGS.LOGIN, SETTINGS.PASSWORD)
            .expect(HttpStatus.OK, {
                pagesCount: 1,
                page: 1,
                pageSize: 10,
                totalCount: 1,
                items: [user3]
            });
    });
    it('200 /users searchLoginTerm=aaa&searchEmailTerm=ccc', async () => {
        await api()
            .get(SETTINGS.API.USERS + '?searchLoginTerm=aaa&searchEmailTerm=ccc')
            .auth(SETTINGS.LOGIN, SETTINGS.PASSWORD)
            .expect(HttpStatus.OK, {
                pagesCount: 1,
                page: 1,
                pageSize: 10,
                totalCount: 2,
                items: [user3, user1]
            });
    });
});