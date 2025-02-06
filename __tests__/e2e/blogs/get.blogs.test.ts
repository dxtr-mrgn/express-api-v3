import request from 'supertest';
import {app} from '../../../src/app';
import {HttpStatus, SETTINGS} from '../../../src/settings';
import {client} from '../../../src/db/mongodb';
import {createBlog} from '../../utils/createBlog';
import {clearDB} from '../../utils/clearDB';
import {validBlog} from '../../datasets/blogs';

const api = () => request(app);
describe('GET /blogs, /blogs/:id', () => {
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

    it('200 /blogs', async () => {
        await api()
            .get(SETTINGS.API.BLOGS)
            .expect(HttpStatus.OK, {
                pagesCount: 1,
                page: 1,
                pageSize: 10,
                totalCount: 2,
                items: [blog2, blog1]
            });
    });

    it('404 /blogs/:id - invalid id', async () => {
        await api()
            .get(SETTINGS.API.BLOGS + '/' + 1234)
            .expect(HttpStatus.NOT_FOUND);
    });
    it('200 /blogs/:id', async () => {
        const res = await api()
            .get(blog1IdUrl)
            .expect(HttpStatus.OK);

        console.log(res.body);
        expect(Object.keys(res.body)).toHaveLength(6);

        expect(typeof res.body.id).toBe('string');
        expect(typeof res.body.name).toBe('string');
        expect(typeof res.body.description).toBe('string');
        expect(typeof res.body.websiteUrl).toBe('string');
        expect(typeof res.body.createdAt).toBe('string');
        expect(typeof res.body.isMembership).toBe('boolean');

        expect(res.body.name).toBe(validBlog.payload.name);
        expect(res.body.description).toBe(validBlog.payload.description);
        expect(res.body.websiteUrl).toBe(validBlog.payload.websiteUrl);
        expect(res.body.isMembership).toBe(false);
        expect(res.body.createdAt).toBeTruthy();
        const date = new Date(res.body.createdAt);
        expect(date.toISOString()).toBe(res.body.createdAt);
        // @ts-ignore
        expect(date instanceof Date && !isNaN(date)).toBe(true);
    });
});

