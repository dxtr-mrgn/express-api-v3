import {connectDB, disconnectDB} from '../../../src/db/mongodb';
import request from 'supertest';
import {app} from '../../../src/app';
import {HttpStatus, SETTINGS} from '../../../src/settings';
import {
    incorrectUrlPattern,
    invalidDescBlog,
    invalidNameBlog,
    invalidUrlBlog,
    missingAllBlog,
    missingDescBlog,
    missingNameBlog,
    missingUrlBlog,
    tooLongDescBlog,
    tooLongNameBlog,
    tooLongUrlBlog,
    validBlog
} from '../../datasets/blogs';
import {clearDB} from '../../utils/clearDB';
import {MongoMemoryServer} from 'mongodb-memory-server';

const api = () => request(app);

describe('POST /blogs', () => {
    let mongoServer: MongoMemoryServer;

    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        await connectDB(mongoServer.getUri());
        await clearDB();
    });
    afterAll(async () => {
        await disconnectDB();
        await mongoServer.stop();
    });
    describe('4xx', () => {
        it('400 invalid Name', async () => {
            await api()
                .post(SETTINGS.API.BLOGS)
                .send(invalidNameBlog.payload)
                .auth(SETTINGS.LOGIN, SETTINGS.PASSWORD)
                .expect(HttpStatus.BAD_REQUEST, invalidNameBlog.error);
        });
        it('400 invalid Desc', async () => {
            await api()
                .post(SETTINGS.API.BLOGS)
                .send(invalidDescBlog.payload)
                .auth(SETTINGS.LOGIN, SETTINGS.PASSWORD)
                .expect(HttpStatus.BAD_REQUEST, invalidDescBlog.error);
        });
        it('400 invalid URL', async () => {
            await api()
                .post(SETTINGS.API.BLOGS)
                .send(invalidUrlBlog.payload)
                .auth(SETTINGS.LOGIN, SETTINGS.PASSWORD)
                .expect(HttpStatus.BAD_REQUEST, invalidUrlBlog.error);
        });
        it('400 missing Name', async () => {
            await api()
                .post(SETTINGS.API.BLOGS)
                .send(missingNameBlog.payload)
                .auth(SETTINGS.LOGIN, SETTINGS.PASSWORD)
                .expect(HttpStatus.BAD_REQUEST, missingNameBlog.error);
        });
        it('400 missing Desc', async () => {
            await api()
                .post(SETTINGS.API.BLOGS)
                .send(missingDescBlog.payload)
                .auth(SETTINGS.LOGIN, SETTINGS.PASSWORD)
                .expect(HttpStatus.BAD_REQUEST, missingDescBlog.error);
        });
        it('400 missing URL', async () => {
            await api()
                .post(SETTINGS.API.BLOGS)
                .send(missingUrlBlog.payload)
                .auth(SETTINGS.LOGIN, SETTINGS.PASSWORD)
                .expect(HttpStatus.BAD_REQUEST, missingUrlBlog.error);
        });
        it('400 too long Name', async () => {
            await api()
                .post(SETTINGS.API.BLOGS)
                .send(tooLongNameBlog.payload)
                .auth(SETTINGS.LOGIN, SETTINGS.PASSWORD)
                .expect(HttpStatus.BAD_REQUEST, tooLongNameBlog.error);
        });
        it('400 too long Desc', async () => {
            await api()
                .post(SETTINGS.API.BLOGS)
                .send(tooLongDescBlog.payload)
                .auth(SETTINGS.LOGIN, SETTINGS.PASSWORD)
                .expect(HttpStatus.BAD_REQUEST, tooLongDescBlog.error);
        });
        it('400 too long URL', async () => {
            await api()
                .post(SETTINGS.API.BLOGS)
                .send(tooLongUrlBlog.payload)
                .auth(SETTINGS.LOGIN, SETTINGS.PASSWORD)
                .expect(HttpStatus.BAD_REQUEST, tooLongUrlBlog.error);
        });
        it('400 incorrect URL pattern', async () => {
            await api()
                .post(SETTINGS.API.BLOGS)
                .send(incorrectUrlPattern.payload)
                .auth(SETTINGS.LOGIN, SETTINGS.PASSWORD)
                .expect(HttpStatus.BAD_REQUEST, incorrectUrlPattern.error);
        });
        it('400 empty payload', async () => {
            await api()
                .post(SETTINGS.API.BLOGS)
                .send(missingAllBlog.payload)
                .auth(SETTINGS.LOGIN, SETTINGS.PASSWORD)
                .expect(HttpStatus.BAD_REQUEST, missingAllBlog.error);
        });
        it('401 no auth', async () => {
            await api()
                .post(SETTINGS.API.BLOGS)
                .send(validBlog.payload)
                .expect(HttpStatus.UNAUTHORIZED);
        });
        it('401 invalid login', async () => {
            await api()
                .post(SETTINGS.API.BLOGS)
                .send(validBlog.payload)
                .auth(SETTINGS.LOGIN + ' ', SETTINGS.PASSWORD)
                .expect(HttpStatus.UNAUTHORIZED);
        });
        it('401 invalid password', async () => {
            await api()
                .post(SETTINGS.API.BLOGS)
                .send(validBlog.payload)
                .auth(SETTINGS.LOGIN, SETTINGS.PASSWORD + ' ')
                .expect(HttpStatus.UNAUTHORIZED);
        });
        it('401 invalid login and password', async () => {
            await api()
                .post(SETTINGS.API.BLOGS)
                .send(validBlog.payload)
                .auth(SETTINGS.LOGIN + ' ', SETTINGS.PASSWORD + ' ')
                .expect(HttpStatus.UNAUTHORIZED);
        });
    });
    describe('200', () => {
        it('200', async () => {
            const res = await api()
                .post(SETTINGS.API.BLOGS)
                .send(validBlog.payload)
                .auth(SETTINGS.LOGIN, SETTINGS.PASSWORD)
                .expect(HttpStatus.CREATED);

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
        it('200 - Duplicate', async () => {
            const res = await api()
                .post(SETTINGS.API.BLOGS)
                .send(validBlog.payload)
                .auth(SETTINGS.LOGIN, SETTINGS.PASSWORD)
                .expect(HttpStatus.CREATED);

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
});