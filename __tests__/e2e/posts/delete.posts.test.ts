import request from 'supertest';
import {app} from '../../../src/app';
import {HttpStatus, SETTINGS} from '../../../src/settings';
import {client} from '../../../src/db/mongodb';
import {createBlog} from '../../utils/createBlog';
import {clearDB} from '../../utils/clearDB';
import {createPost} from '../../utils/createPost';

const api = () => request(app);

describe('DELETE /posts/:id', () => {
    let post1: any = {};
    let post2: any = {};
    let post1IdUrl: string = '';

    beforeAll(async () => {
        await clearDB();

        post1 = await createPost();
        post2 = await createPost();

        post1IdUrl = SETTINGS.API.POSTS + '/' + post1.id;
    });

    afterAll(async () => {
        await client.close();
    });
    describe('204', () => {
        it('204', async () => {
            await api()
                .delete(post1IdUrl)
                .auth(SETTINGS.LOGIN, SETTINGS.PASSWORD)
                .expect(HttpStatus.NO_CONTENT);
        });
        it('404 - cannot delete the second time', async () => {
            await api()
                .delete(post1IdUrl)
                .auth(SETTINGS.LOGIN, SETTINGS.PASSWORD)
                .expect(HttpStatus.NOT_FOUND);
        });
        it('404 - cannot get a deleted post', async () => {
            await api()
                .get(post1IdUrl)
                .expect(HttpStatus.NOT_FOUND);
        });
        it('200 - deleted post is not coming with get', async () => {
            await api()
                .get(SETTINGS.API.POSTS)
                .expect(HttpStatus.OK, {
                    pagesCount: 1,
                    page: 1,
                    pageSize: 10,
                    totalCount: 1,
                    items: [post2]
                });
        });
    });
    describe('4xx', () => {
        it('404 - invalid id', async () => {
            await api()
                .delete(SETTINGS.API.POSTS + '/' + 1234)
                .auth(SETTINGS.LOGIN, SETTINGS.PASSWORD)
                .expect(HttpStatus.NOT_FOUND);
        });
        it('404 - no id', async () => {
            await api()
                .delete(SETTINGS.API.POSTS + '/')
                .auth(SETTINGS.LOGIN, SETTINGS.PASSWORD)
                .expect(HttpStatus.NOT_FOUND);
        });
        it('401 - no auth', async () => {
            await api()
                .delete(post1IdUrl)
                .expect(HttpStatus.UNAUTHORIZED);
        });
    });
});