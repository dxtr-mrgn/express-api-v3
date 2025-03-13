import request from 'supertest';
import {app} from '../../../src/app';
import {HttpStatus, SETTINGS} from '../../../src/settings';
import {connectDB, disconnectDB} from '../../../src/db/mongodb';
import {clearDB} from '../../utils/clearDB';
import {createPost} from '../../utils/createPost';
import {MongoMemoryServer} from 'mongodb-memory-server';

const api = () => request(app);

describe('GET /posts, /posts/:id', () => {
    let post1: any = {};
    let post2: any = {};
    let post1IdUrl: string = '';
    let mongoServer: MongoMemoryServer;

    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        await connectDB(mongoServer.getUri());
        await clearDB();

        post1 = await createPost();
        post2 = await createPost();
        post1IdUrl = SETTINGS.API.POSTS + '/' + post1.id;
    });
    afterAll(async () => {
        await disconnectDB();
        await mongoServer.stop();
    });
    it('200 /posts', async () => {
        await api()
            .get(SETTINGS.API.POSTS)
            .expect(HttpStatus.OK, {
                pagesCount: 1,
                page: 1,
                pageSize: 10,
                totalCount: 2,
                items: [post2, post1]
            });
    });
    it('404 /posts/:id - invalid id', async () => {
        await api()
            .get(SETTINGS.API.POSTS + '/' + 1234)
            .expect(HttpStatus.NOT_FOUND);
    });
    it('200 /posts/:id', async () => {
        const res = await api()
            .get(post1IdUrl)
            .expect(HttpStatus.OK);

        expect(Object.keys(res.body)).toHaveLength(7);

        expect(typeof res.body.id).toBe('string');
        expect(typeof res.body.title).toBe('string');
        expect(typeof res.body.shortDescription).toBe('string');
        expect(typeof res.body.blogId).toBe('string');
        expect(typeof res.body.blogName).toBe('string');
        expect(typeof res.body.createdAt).toBe('string');

        expect(res.body.title).toBe(post1.title);
        expect(res.body.shortDescription).toBe(post1.shortDescription);
        expect(res.body.blogId).toBe(post1.blogId);
        expect(res.body.blogName).toBe(post1.blogName);
        expect(res.body.createdAt).toBeTruthy();
        const date = new Date(res.body.createdAt);
        expect(date.toISOString()).toBe(res.body.createdAt);
        // @ts-ignore
        expect(date instanceof Date && !isNaN(date)).toBe(true);
    });
});