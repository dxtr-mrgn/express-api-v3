import request from 'supertest';
import {app} from '../../../src/app';
import {HttpStatus, SETTINGS} from '../../../src/settings';
import {client} from '../../../src/db/mongodb';
import {clearDB} from '../../utils/clearDB';
import {createUser} from '../../utils/createUser';

const api = () => request(app);

describe('DELETE /posts/:id', () => {
    let user1: any = {};
    let user2: any = {};
    let user1IdUrl: string = '';

    beforeAll(async () => {
        await clearDB();

        user1 = await createUser();
        user2 = await createUser();

        user1IdUrl = SETTINGS.API.USERS + '/' + user1.id;
    });
    afterAll(async () => {
        await client.close();
    });
    describe('204', () => {
        it('204', async () => {
            await api()
                .delete(user1IdUrl)
                .auth(SETTINGS.LOGIN, SETTINGS.PASSWORD)
                .expect(HttpStatus.NO_CONTENT);
        });
        it('404 - cannot delete the second time', async () => {
            await api()
                .delete(user1IdUrl)
                .auth(SETTINGS.LOGIN, SETTINGS.PASSWORD)
                .expect(HttpStatus.NOT_FOUND);
        });
        it('404 - cannot get a deleted post', async () => {
            await api()
                .get(user1IdUrl)
                .expect(HttpStatus.NOT_FOUND);
        });
        it('200 - deleted post is not coming with get', async () => {
            await api()
                .get(SETTINGS.API.USERS)
                .auth(SETTINGS.LOGIN, SETTINGS.PASSWORD)
                .expect(HttpStatus.OK, {
                    pagesCount: 1,
                    page: 1,
                    pageSize: 10,
                    totalCount: 1,
                    items: [user2]
                });
        });
    });
    describe('4xx', () => {
        it('404 - invalid id', async () => {
            await api()
                .delete(SETTINGS.API.USERS + '/' + 1234)
                .auth(SETTINGS.LOGIN, SETTINGS.PASSWORD)
                .expect(HttpStatus.NOT_FOUND);
        });
        it('404 - no id', async () => {
            await api()
                .delete(SETTINGS.API.USERS + '/')
                .auth(SETTINGS.LOGIN, SETTINGS.PASSWORD)
                .expect(HttpStatus.NOT_FOUND);
        });
        it('401 - no auth', async () => {
            await api()
                .delete(user1IdUrl)
                .expect(HttpStatus.UNAUTHORIZED);
        });
    });
});