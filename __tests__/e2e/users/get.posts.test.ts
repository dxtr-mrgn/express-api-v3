import request from 'supertest';
import {app} from '../../../src/app';
import {HttpStatus, SETTINGS} from '../../../src/settings';
import {client} from '../../../src/db/mongodb';
import {createBlog, getValidBlogId} from '../../utils/createBlog';
import {clearDB} from '../../utils/clearDB';
import {createPost} from '../../utils/createPost';
import {createUser} from '../../utils/createUser';

const api = () => request(app);

describe('GET /users', () => {
    let user1: any = {};
    let user2: any = {};

    beforeAll(async () => {
        await clearDB();

        user1 = await createUser();
        user2 = await createUser();
    });
    afterAll(async () => {
        await client.close();
    });
    it('200 /users', async () => {
        await api()
            .get(SETTINGS.API.USERS)
            .auth(SETTINGS.LOGIN, SETTINGS.PASSWORD)
            .expect(HttpStatus.OK, {
                pagesCount: 1,
                page: 1,
                pageSize: 10,
                totalCount: 2,
                items: [user2, user1]
            });
    });
});