import request from 'supertest';
import {app} from '../../../src/app';
import {HttpStatus, SETTINGS} from '../../../src/settings';
import {client} from '../../../src/db/mongodb';
import {clearDB} from '../../utils/clearDB';
import {
    invalidBlogIdPost,
    invalidContentPost,
    invalidDescPost,
    invalidTitlePost,
    missingAllPost,
    missingContentPost,
    missingDescPost,
    missingIdPost,
    missingTitlePost,
    tooLongContentPost,
    tooLongDescPost,
    tooLongTitlePost,
    validPost
} from '../../datasets/posts';
import {getValidBlogId} from '../../utils/createBlog';

const api = () => request(app);

describe('POST /posts', () => {
    beforeAll(async () => {
        await clearDB();

        validPost.payload.blogId = await getValidBlogId()

    });
    afterAll(async () => {
        await client.close();
    });
    describe('4xx', () => {
        it('400 invalid Title', async () => {
            await api()
                .post(SETTINGS.API.POSTS)
                .send(invalidTitlePost.payload)
                .auth(SETTINGS.LOGIN, SETTINGS.PASSWORD)
                .expect(HttpStatus.BAD_REQUEST, invalidTitlePost.error);
        });
        it('400 invalid Desc', async () => {
            await api()
                .post(SETTINGS.API.POSTS)
                .send(invalidDescPost.payload)
                .auth(SETTINGS.LOGIN, SETTINGS.PASSWORD)
                .expect(HttpStatus.BAD_REQUEST, invalidDescPost.error);
        });
        it('400 invalid Content', async () => {
            await api()
                .post(SETTINGS.API.POSTS)
                .send(invalidContentPost.payload)
                .auth(SETTINGS.LOGIN, SETTINGS.PASSWORD)
                .expect(HttpStatus.BAD_REQUEST, invalidContentPost.error);
        });
        it('400 invalid Blog Id', async () => {
            await api()
                .post(SETTINGS.API.POSTS)
                .send(invalidBlogIdPost.payload)
                .auth(SETTINGS.LOGIN, SETTINGS.PASSWORD)
                .expect(HttpStatus.BAD_REQUEST, invalidBlogIdPost.error);
        });
        it('400 missing Title', async () => {
            await api()
                .post(SETTINGS.API.POSTS)
                .send(missingTitlePost.payload)
                .auth(SETTINGS.LOGIN, SETTINGS.PASSWORD)
                .expect(HttpStatus.BAD_REQUEST, missingTitlePost.error);
        });
        it('400 missing Desc', async () => {
            await api()
                .post(SETTINGS.API.POSTS)
                .send(missingDescPost.payload)
                .auth(SETTINGS.LOGIN, SETTINGS.PASSWORD)
                .expect(HttpStatus.BAD_REQUEST, missingDescPost.error);
        });
        it('400 missing Content', async () => {
            await api()
                .post(SETTINGS.API.POSTS)
                .send(missingContentPost.payload)
                .auth(SETTINGS.LOGIN, SETTINGS.PASSWORD)
                .expect(HttpStatus.BAD_REQUEST, missingContentPost.error);
        });
        it('400 missing Blog Id', async () => {
            await api()
                .post(SETTINGS.API.POSTS)
                .send(missingIdPost.payload)
                .auth(SETTINGS.LOGIN, SETTINGS.PASSWORD)
                .expect(HttpStatus.BAD_REQUEST, missingIdPost.error);
        });
        it('400 too long Title', async () => {
            await api()
                .post(SETTINGS.API.POSTS)
                .send(tooLongTitlePost.payload)
                .auth(SETTINGS.LOGIN, SETTINGS.PASSWORD)
                .expect(HttpStatus.BAD_REQUEST, tooLongTitlePost.error);
        });
        it('400 too long Desc', async () => {
            await api()
                .post(SETTINGS.API.POSTS)
                .send(tooLongDescPost.payload)
                .auth(SETTINGS.LOGIN, SETTINGS.PASSWORD)
                .expect(HttpStatus.BAD_REQUEST, tooLongDescPost.error);

        });
        it('400 too long Content', async () => {
            await api()
                .post(SETTINGS.API.POSTS)
                .send(tooLongContentPost.payload)
                .auth(SETTINGS.LOGIN, SETTINGS.PASSWORD)
                .expect(HttpStatus.BAD_REQUEST, tooLongContentPost.error);
        });
        it('400 empty payload', async () => {
            await api()
                .post(SETTINGS.API.POSTS)
                .send(missingAllPost.payload)
                .auth(SETTINGS.LOGIN, SETTINGS.PASSWORD)
                .expect(HttpStatus.BAD_REQUEST, missingAllPost.error);
        });
        it('401 no auth', async () => {
            await api()
                .post(SETTINGS.API.POSTS)
                .send(validPost.payload)
                .expect(HttpStatus.UNAUTHORIZED);
        });
        it('401 invalid login', async () => {
            await api()
                .post(SETTINGS.API.POSTS)
                .send(validPost.payload)
                .auth(SETTINGS.LOGIN + ' ', SETTINGS.PASSWORD)
                .expect(HttpStatus.UNAUTHORIZED);
        });
        it('401 invalid password', async () => {
            await api()
                .post(SETTINGS.API.POSTS)
                .send(validPost.payload)
                .auth(SETTINGS.LOGIN, SETTINGS.PASSWORD + ' ')
                .expect(HttpStatus.UNAUTHORIZED);
        });
        it('401 invalid login and password', async () => {
            await api()
                .post(SETTINGS.API.POSTS)
                .send(validPost.payload)
                .auth(SETTINGS.LOGIN + ' ', SETTINGS.PASSWORD + ' ')
                .expect(HttpStatus.UNAUTHORIZED);
        });
    });
    describe('200', () => {
        it('200', async () => {

            const res = await api()
                .post(SETTINGS.API.POSTS)
                .auth(SETTINGS.LOGIN, SETTINGS.PASSWORD)
                .send(validPost.payload);

            expect(res.status).toBe(HttpStatus.CREATED);
            expect(Object.keys(res.body)).toHaveLength(7);

            expect(typeof res.body.id).toBe('string');
            expect(typeof res.body.title).toBe('string');
            expect(typeof res.body.content).toBe('string');
            expect(typeof res.body.shortDescription).toBe('string');
            expect(typeof res.body.blogId).toBe('string');
            expect(typeof res.body.blogName).toBe('string');
            expect(typeof res.body.createdAt).toBe('string');

            expect(res.body.title).toBe(validPost.payload.title);
            expect(res.body.shortDescription).toBe(validPost.payload.shortDescription);
            expect(res.body.content).toBe(validPost.payload.content);
            expect(res.body.blogId).toBe(validPost.payload.blogId);
            expect(res.body.createdAt).toBeTruthy();
            const date = new Date(res.body.createdAt);
            expect(date.toISOString()).toBe(res.body.createdAt);
            // @ts-ignore
            expect(date instanceof Date && !isNaN(date)).toBe(true);
        });
        it('200 - Duplicate', async () => {
            const res = await api()
                .post(SETTINGS.API.POSTS)
                .send(validPost.payload)
                .auth(SETTINGS.LOGIN, SETTINGS.PASSWORD)
                .expect(HttpStatus.CREATED);

            expect(Object.keys(res.body)).toHaveLength(7);

            expect(typeof res.body.id).toBe('string');
            expect(typeof res.body.title).toBe('string');
            expect(typeof res.body.shortDescription).toBe('string');
            expect(typeof res.body.blogId).toBe('string');
            expect(typeof res.body.blogName).toBe('string');
            expect(typeof res.body.createdAt).toBe('string');

            expect(res.body.title).toBe(validPost.payload.title);
            expect(res.body.shortDescription).toBe(validPost.payload.shortDescription);
            expect(res.body.blogId).toBe(validPost.payload.blogId);
            expect(res.body.createdAt).toBeTruthy();
            const date = new Date(res.body.createdAt);
            expect(date.toISOString()).toBe(res.body.createdAt);
            // @ts-ignore
            expect(date instanceof Date && !isNaN(date)).toBe(true);
        });
    });
});