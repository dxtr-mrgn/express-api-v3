import request from 'supertest';
import {app} from '../../../src/app';
import {HttpStatus, SETTINGS} from '../../../src/settings';
import {client} from '../../../src/db/mongodb';
import {clearDB} from '../../utils/clearDB';
import {createPost} from '../../utils/createPost';
import {
    invalidBlogIdPost,
    invalidContentPost,
    invalidDescPost,
    invalidTitlePost,
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

describe('PUT /posts/:id', () => {
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
    describe('4xx', () => {
        it('404 - invalid id', async () => {
            await api()
                .put(SETTINGS.API.POSTS + '/' + 1234)
                .send(validPost.payload)
                .auth(SETTINGS.LOGIN, SETTINGS.PASSWORD)
                .expect(HttpStatus.NOT_FOUND);
        });
        it('404 - no id', async () => {
            await api()
                .put(SETTINGS.API.POSTS + '/')
                .send(validPost.payload)
                .auth(SETTINGS.LOGIN, SETTINGS.PASSWORD)
                .expect(HttpStatus.NOT_FOUND);
        });
        it('400 - invalid Title', async () => {
            await api()
                .put(post1IdUrl)
                .send(invalidTitlePost.payload)
                .auth(SETTINGS.LOGIN, SETTINGS.PASSWORD)
                .expect(HttpStatus.BAD_REQUEST, invalidTitlePost.error);
        });
        it('400 - invalid Desc', async () => {
            await api()
                .put(post1IdUrl)
                .send(invalidDescPost.payload)
                .auth(SETTINGS.LOGIN, SETTINGS.PASSWORD)
                .expect(HttpStatus.BAD_REQUEST, invalidDescPost.error);
        });
        it('400 - invalid Content', async () => {
            await api()
                .put(post1IdUrl)
                .send(invalidContentPost.payload)
                .auth(SETTINGS.LOGIN, SETTINGS.PASSWORD)
                .expect(HttpStatus.BAD_REQUEST, invalidContentPost.error);
        });
        it('400 - invalid Blog Id', async () => {
            await api()
                .put(post1IdUrl)
                .send(invalidBlogIdPost.payload)
                .auth(SETTINGS.LOGIN, SETTINGS.PASSWORD)
                .expect(HttpStatus.BAD_REQUEST, invalidBlogIdPost.error);
        });
        it('400 - missing Title', async () => {
            await api()
                .put(post1IdUrl)
                .send(missingTitlePost.payload)
                .auth(SETTINGS.LOGIN, SETTINGS.PASSWORD)
                .expect(HttpStatus.BAD_REQUEST, missingTitlePost.error);
        });
        it('400 - missing Desc', async () => {
            await api()
                .put(post1IdUrl)
                .send(missingDescPost.payload)
                .auth(SETTINGS.LOGIN, SETTINGS.PASSWORD)
                .expect(HttpStatus.BAD_REQUEST, missingDescPost.error);
        });
        it('400 - missing Content', async () => {
            await api()
                .put(post1IdUrl)
                .send(missingContentPost.payload)
                .auth(SETTINGS.LOGIN, SETTINGS.PASSWORD)
                .expect(HttpStatus.BAD_REQUEST, missingContentPost.error);
        });
        it('400 - missing Blog Id', async () => {
            await api()
                .put(post1IdUrl)
                .send(missingIdPost.payload)
                .auth(SETTINGS.LOGIN, SETTINGS.PASSWORD)
                .expect(HttpStatus.BAD_REQUEST, missingIdPost.error);
        });
        it('400 - too long Title', async () => {
            await api()
                .put(post1IdUrl)
                .send(tooLongTitlePost.payload)
                .auth(SETTINGS.LOGIN, SETTINGS.PASSWORD)
                .expect(HttpStatus.BAD_REQUEST, tooLongTitlePost.error);
        });
        it('400 - too long Desc', async () => {
            await api()
                .put(post1IdUrl)
                .send(tooLongDescPost.payload)
                .auth(SETTINGS.LOGIN, SETTINGS.PASSWORD)
                .expect(HttpStatus.BAD_REQUEST, tooLongDescPost.error);

        });
        it('400 - too long Content', async () => {
            await api()
                .put(post1IdUrl)
                .send(tooLongContentPost.payload)
                .auth(SETTINGS.LOGIN, SETTINGS.PASSWORD)
                .expect(HttpStatus.BAD_REQUEST, tooLongContentPost.error);
        });
        it('401 - no auth', async () => {
            await api()
                .put(post1IdUrl)
                .expect(HttpStatus.UNAUTHORIZED);
        });
    });
    describe('204', () => {
        it('204 - Update a name', async () => {
            post1.title = 'Updated Name';

            await api()
                .put(post1IdUrl)
                .send({
                    title: post1.title,
                    shortDescription: post1.shortDescription,
                    content: post1.content,
                    blogId: post1.blogId
                })
                .auth(SETTINGS.LOGIN, SETTINGS.PASSWORD)
                .expect(HttpStatus.NO_CONTENT);

            const res = await api()
                .get(post1IdUrl)
                .expect(HttpStatus.OK);

            expect(post1.title).toEqual(res.body.title);
        });
        it('204 - Update description', async () => {
            post1.shortDescription = 'Updated Desc';

            await api()
                .put(post1IdUrl)
                .send({
                    title: post1.title,
                    shortDescription: post1.shortDescription,
                    content: post1.content,
                    blogId: post1.blogId
                })
                .auth(SETTINGS.LOGIN, SETTINGS.PASSWORD)
                .expect(HttpStatus.NO_CONTENT);
            const res = await api()
                .get(post1IdUrl)
                .expect(HttpStatus.OK);

            expect(post1.shortDescription).toEqual(res.body.shortDescription);
        });
        it('204 - Update Content', async () => {
            post1.content = 'Updated Content';

            await api()
                .put(post1IdUrl)
                .send({
                    title: post1.title,
                    shortDescription: post1.shortDescription,
                    content: post1.content,
                    blogId: post1.blogId
                })
                .auth(SETTINGS.LOGIN, SETTINGS.PASSWORD)
                .expect(HttpStatus.NO_CONTENT);
            const res = await api()
                .get(post1IdUrl)
                .expect(HttpStatus.OK);

            expect(post1.content).toEqual(res.body.content);
        });
        it('204 - Update a Blog Id', async () => {
            post1.blogId = await getValidBlogId();

            await api()
                .put(post1IdUrl)
                .send({
                    title: post1.title,
                    shortDescription: post1.shortDescription,
                    content: post1.content,
                    blogId: post1.blogId
                })
                .auth(SETTINGS.LOGIN, SETTINGS.PASSWORD)
                .expect(HttpStatus.NO_CONTENT);

            const res = await api()
                .get(post1IdUrl)
                .expect(HttpStatus.OK);

            expect(post1.blogId).toEqual(res.body.blogId);
        });
        it('200 - Updated Post is getting back with all Posts', async () => {
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
    });
});