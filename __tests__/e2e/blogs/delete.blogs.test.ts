import request from 'supertest';
import {app} from '../../../src/app';
import {HttpStatus, SETTINGS} from '../../../src/settings';
import {client} from '../../../src/db/mongodb';
import {createBlog} from '../../utils/createBlog';
import {clearDB} from '../../utils/clearDB';

const api = () => request(app);

describe('DELETE /blogs/:id', () => {
    let blog1: any = {};
    let blog2: any = {};
    let blog1IdUrl: string = '';

    beforeAll(async () => {
        await clearDB();

        blog1 = await createBlog();
        blog2 = await createBlog();

        blog1IdUrl = SETTINGS.API.BLOGS + '/' + blog1.id;
    });

    afterAll(async () => {
        await client.close();
    });

    describe('4xx', () => {
        it('404 invalid id', async () => {
            await api()
                .delete(SETTINGS.API.BLOGS + '/' + 1234)
                .auth(SETTINGS.LOGIN, SETTINGS.PASSWORD)
                .expect(HttpStatus.NOT_FOUND);
        });
        it('404 no id', async () => {
            await api()
                .delete(SETTINGS.API.BLOGS + '/')
                .auth(SETTINGS.LOGIN, SETTINGS.PASSWORD)
                .expect(HttpStatus.NOT_FOUND);
        });
        it('401 no auth', async () => {
            await api()
                .delete(blog1IdUrl)
                .expect(HttpStatus.UNAUTHORIZED);
        });
    })
    describe('204', () => {
        it('204', async () => {
            await api()
                .delete(blog1IdUrl)
                .auth(SETTINGS.LOGIN, SETTINGS.PASSWORD)
                .expect(HttpStatus.NO_CONTENT);
        });
        it('404 - Cannot delete again', async () => {
            await api()
                .delete(blog1IdUrl)
                .auth(SETTINGS.LOGIN, SETTINGS.PASSWORD)
                .expect(HttpStatus.NOT_FOUND);
        });
        it('404 - Cannot get a deleted blog', async () => {
            await api()
                .get(blog1IdUrl)
                .expect(HttpStatus.NOT_FOUND);
        });
        it('200 - Deleted Blog is not returned with all blogs', async () => {
            await api()
                .get(SETTINGS.API.BLOGS)
                .expect(HttpStatus.OK, {
                    pagesCount: 1,
                    page: 1,
                    pageSize: 10,
                    totalCount: 1,
                    items: [blog2]
                });
        });
    });
});