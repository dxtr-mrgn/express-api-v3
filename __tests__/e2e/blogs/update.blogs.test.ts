import request from 'supertest';
import {app} from '../../../src/app';
import {HttpStatus, SETTINGS} from '../../../src/settings';
import {connectDB, disconnectDB} from '../../../src/db/mongodb';
import {createBlog} from '../../utils/createBlog';
import {clearDB} from '../../utils/clearDB';
import {
    incorrectUrlPattern,
    invalidDescBlog,
    invalidNameBlog,
    invalidUrlBlog,
    missingDescBlog,
    missingNameBlog,
    missingUrlBlog,
    tooLongDescBlog,
    tooLongNameBlog,
    tooLongUrlBlog,
    validBlog
} from '../../datasets/blogs';
import {MongoMemoryServer} from 'mongodb-memory-server';

const api = () => request(app);

describe('PUT /blogs', () => {
    let blog1: any = {};
    let blog2: any = {};
    let blog1IdUrl: string = '';
    let mongoServer: MongoMemoryServer;

    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        await connectDB(mongoServer.getUri());
        await clearDB();

        blog1 = await createBlog();
        blog2 = await createBlog();

        blog1IdUrl = SETTINGS.API.BLOGS + '/' + blog1.id;
    });

    afterAll(async () => {
        await disconnectDB();
        await mongoServer.stop();
    });
    describe('4xx', () => {
        it('404 invalid id', async () => {
            await api()
                .put(SETTINGS.API.BLOGS + '/' + 1234)
                .send(validBlog.payload)
                .auth(SETTINGS.LOGIN, SETTINGS.PASSWORD)
                .expect(HttpStatus.NOT_FOUND);
        });
        it('404 missing id', async () => {
            await api()
                .put(SETTINGS.API.BLOGS + '/')
                .send(validBlog.payload)
                .auth(SETTINGS.LOGIN, SETTINGS.PASSWORD)
                .expect(HttpStatus.NOT_FOUND);
        });
        it('400 invalid Name', async () => {
            await api()
                .put(blog1IdUrl)
                .send(invalidNameBlog.payload)
                .auth(SETTINGS.LOGIN, SETTINGS.PASSWORD)
                .expect(HttpStatus.BAD_REQUEST, invalidNameBlog.error);
        });
        it('400 invalid Desc', async () => {
            await api()
                .put(blog1IdUrl)
                .send(invalidDescBlog.payload)
                .auth(SETTINGS.LOGIN, SETTINGS.PASSWORD)
                .expect(HttpStatus.BAD_REQUEST, invalidDescBlog.error);
        });
        it('400 invalid URL', async () => {
            await api()
                .put(blog1IdUrl)
                .send(invalidUrlBlog.payload)
                .auth(SETTINGS.LOGIN, SETTINGS.PASSWORD)
                .expect(HttpStatus.BAD_REQUEST, invalidUrlBlog.error);
        });
        it('400 missing Name', async () => {
            await api()
                .put(blog1IdUrl)
                .send(missingNameBlog.payload)
                .auth(SETTINGS.LOGIN, SETTINGS.PASSWORD)
                .expect(HttpStatus.BAD_REQUEST, missingNameBlog.error);
        });
        it('400 missing Desc', async () => {
            await api()
                .put(blog1IdUrl)
                .send(missingDescBlog.payload)
                .auth(SETTINGS.LOGIN, SETTINGS.PASSWORD)
                .expect(HttpStatus.BAD_REQUEST, missingDescBlog.error);
        });
        it('400 missing URL', async () => {
            await api()
                .put(blog1IdUrl)
                .send(missingUrlBlog.payload)
                .auth(SETTINGS.LOGIN, SETTINGS.PASSWORD)
                .expect(HttpStatus.BAD_REQUEST, missingUrlBlog.error);
        });
        it('400 too long Name', async () => {
            await api()
                .put(blog1IdUrl)
                .send(tooLongNameBlog.payload)
                .auth(SETTINGS.LOGIN, SETTINGS.PASSWORD)
                .expect(HttpStatus.BAD_REQUEST, tooLongNameBlog.error);
        });
        it('400 too long Desc', async () => {
            await api()
                .put(blog1IdUrl)
                .send(tooLongDescBlog.payload)
                .auth(SETTINGS.LOGIN, SETTINGS.PASSWORD)
                .expect(HttpStatus.BAD_REQUEST, tooLongDescBlog.error);
        });
        it('400 too long URL', async () => {
            await api()
                .put(blog1IdUrl)
                .send(tooLongUrlBlog.payload)
                .auth(SETTINGS.LOGIN, SETTINGS.PASSWORD)
                .expect(HttpStatus.BAD_REQUEST, tooLongUrlBlog.error);
        });
        it('400 incorrect URL pattern', async () => {
            await api()
                .put(blog1IdUrl)
                .send(incorrectUrlPattern.payload)
                .auth(SETTINGS.LOGIN, SETTINGS.PASSWORD)
                .expect(HttpStatus.BAD_REQUEST, incorrectUrlPattern.error);
        });
        it('401 no auth', async () => {
            await api()
                .put(blog1IdUrl)
                .send(validBlog.payload)
                .expect(HttpStatus.UNAUTHORIZED);
        });
    });
    describe('204', () => {
        it('204 - Update a name', async () => {
            blog1.name = 'Updated Name';

            console.log(blog1IdUrl);
            console.log(blog1);

            await api()
                .put(blog1IdUrl)
                .send({
                    name: blog1.name,
                    description: blog1.description,
                    websiteUrl: blog1.websiteUrl
                })
                .auth(SETTINGS.LOGIN, SETTINGS.PASSWORD)
                .expect(HttpStatus.NO_CONTENT);

            console.log('Updated Successfully');
            const res = await api()
                .get(blog1IdUrl)
                .expect(HttpStatus.OK);

            expect(blog1.name).toEqual(res.body.name);
        });
        it('204 - Update a description', async () => {
            blog1.description = 'Updated Desc';

            await api()
                .put(blog1IdUrl)
                .send(blog1)
                .auth(SETTINGS.LOGIN, SETTINGS.PASSWORD)
                .expect(HttpStatus.NO_CONTENT);
            const res = await api()
                .get(blog1IdUrl)
                .expect(HttpStatus.OK);

            expect(blog1.description).toEqual(res.body.description);
        });
        it('204 - Update a URL', async () => {
            blog1.websiteUrl = 'https://1U_6htpDD23G7sy-AstWRa4UV6DPN-YTwEVJABFYvYmN8cryBAA3hihb-3eFqM9GnFr3q.com';

            await api()
                .put(blog1IdUrl)
                .send(blog1)
                .auth(SETTINGS.LOGIN, SETTINGS.PASSWORD)
                .expect(HttpStatus.NO_CONTENT);
            const res = await api()
                .get(blog1IdUrl)
                .expect(HttpStatus.OK);

            expect(blog1.websiteUrl).toEqual(res.body.websiteUrl);
        });
        it('200 - Updated Blog is getting back with all Blogs', async () => {
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
    });
});