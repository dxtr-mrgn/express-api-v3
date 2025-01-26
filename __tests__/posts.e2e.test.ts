import request from 'supertest';
import {app} from '../src/app';
import {HttpStatus, SETTINGS} from '../src/settings';
import {
    invalidBlogIdPost,
    invalidContentPost,
    invalidDescPost,
    invalidTitlePost, missingAllPost,
    missingContentPost,
    missingDescPost,
    missingIdPost,
    missingTitlePost,
    tooLongContentPost,
    tooLongDescPost,
    tooLongTitlePost,
    validPost
} from './datasets/posts';
import {validBlog} from './datasets/blogs';
import {client} from '../src/db/mongodb';

const api = () => request(app);


describe('Posts', () => {
    beforeAll(async () => {
        await api()
            .delete(SETTINGS.API.ALL_DATA)
            .expect(HttpStatus.NO_CONTENT);
        await api()
            .get(SETTINGS.API.POSTS)
            .expect(HttpStatus.OK, []);

        console.log('All the posts have been deleted');

        const blog = await api()
            .post(SETTINGS.API.BLOGS)
            .send(validBlog.payload)
            .auth(SETTINGS.LOGIN, SETTINGS.PASSWORD)
            .expect(HttpStatus.CREATED);

        validPost.payload.blogId = blog.body.id.toString();

    });

    let newPost1: any = {}, newPost2: any = {}, postToUpdate: any = {}, newPost1IdUrl: string = '';
    describe('POST /posts', () => {
        it('Create a Post - 400 invalid Title', async () => {
            await api()
                .post(SETTINGS.API.POSTS)
                .send(invalidTitlePost.payload)
                .auth(SETTINGS.LOGIN, SETTINGS.PASSWORD)
                .expect(HttpStatus.BAD_REQUEST, invalidTitlePost.error);
        });
        it('Create a Post - 400 invalid Desc', async () => {
            await api()
                .post(SETTINGS.API.POSTS)
                .send(invalidDescPost.payload)
                .auth(SETTINGS.LOGIN, SETTINGS.PASSWORD)
                .expect(HttpStatus.BAD_REQUEST, invalidDescPost.error);
        });
        it('Create a Post - 400 invalid Content', async () => {
            await api()
                .post(SETTINGS.API.POSTS)
                .send(invalidContentPost.payload)
                .auth(SETTINGS.LOGIN, SETTINGS.PASSWORD)
                .expect(HttpStatus.BAD_REQUEST, invalidContentPost.error);
        });
        it('Create a Post - 400 invalid Blog Id', async () => {
            await api()
                .post(SETTINGS.API.POSTS)
                .send(invalidBlogIdPost.payload)
                .auth(SETTINGS.LOGIN, SETTINGS.PASSWORD)
                .expect(HttpStatus.BAD_REQUEST, invalidBlogIdPost.error);
        });
        it('Create a Post - 400 missing Title', async () => {
            await api()
                .post(SETTINGS.API.POSTS)
                .send(missingTitlePost.payload)
                .auth(SETTINGS.LOGIN, SETTINGS.PASSWORD)
                .expect(HttpStatus.BAD_REQUEST, missingTitlePost.error);
        });
        it('Create a Post - 400 missing Desc', async () => {
            await api()
                .post(SETTINGS.API.POSTS)
                .send(missingDescPost.payload)
                .auth(SETTINGS.LOGIN, SETTINGS.PASSWORD)
                .expect(HttpStatus.BAD_REQUEST, missingDescPost.error);
        });
        it('Create a Post - 400 missing Content', async () => {
            await api()
                .post(SETTINGS.API.POSTS)
                .send(missingContentPost.payload)
                .auth(SETTINGS.LOGIN, SETTINGS.PASSWORD)
                .expect(HttpStatus.BAD_REQUEST, missingContentPost.error);
        });
        it('Create a Post - 400 missing Blog Id', async () => {
            await api()
                .post(SETTINGS.API.POSTS)
                .send(missingIdPost.payload)
                .auth(SETTINGS.LOGIN, SETTINGS.PASSWORD)
                .expect(HttpStatus.BAD_REQUEST, missingIdPost.error);
        });
        it('Create a Post - 400 too long Title', async () => {
            await api()
                .post(SETTINGS.API.POSTS)
                .send(tooLongTitlePost.payload)
                .auth(SETTINGS.LOGIN, SETTINGS.PASSWORD)
                .expect(HttpStatus.BAD_REQUEST, tooLongTitlePost.error);
        });
        it('Create a Post - 400 too long Desc', async () => {
            await api()
                .post(SETTINGS.API.POSTS)
                .send(tooLongDescPost.payload)
                .auth(SETTINGS.LOGIN, SETTINGS.PASSWORD)
                .expect(HttpStatus.BAD_REQUEST, tooLongDescPost.error);

        });
        it('Create a Post - 400 too long Content', async () => {
            await api()
                .post(SETTINGS.API.POSTS)
                .send(tooLongContentPost.payload)
                .auth(SETTINGS.LOGIN, SETTINGS.PASSWORD)
                .expect(HttpStatus.BAD_REQUEST, tooLongContentPost.error);
        });
        it('Create a Post - 400 empty payload', async () => {
            await api()
                .post(SETTINGS.API.POSTS)
                .send(missingAllPost.payload)
                .auth(SETTINGS.LOGIN, SETTINGS.PASSWORD)
                .expect(HttpStatus.BAD_REQUEST, missingAllPost.error);
        });
        it('Create a Post - 401 no auth', async () => {
            await api()
                .post(SETTINGS.API.POSTS)
                .send(validPost.payload)
                .expect(HttpStatus.UNAUTHORIZED);
        });
        it('Create a Post - 401 invalid login', async () => {
            await api()
                .post(SETTINGS.API.POSTS)
                .send(validPost.payload)
                .auth(SETTINGS.LOGIN + ' ', SETTINGS.PASSWORD)
                .expect(HttpStatus.UNAUTHORIZED);
        });
        it('Create a Post - 401 invalid password', async () => {
            await api()
                .post(SETTINGS.API.POSTS)
                .send(validPost.payload)
                .auth(SETTINGS.LOGIN, SETTINGS.PASSWORD + ' ')
                .expect(HttpStatus.UNAUTHORIZED);
        });
        it('Create a Post - 401 invalid login and password', async () => {
            await api()
                .post(SETTINGS.API.POSTS)
                .send(validPost.payload)
                .auth(SETTINGS.LOGIN + ' ', SETTINGS.PASSWORD + ' ')
                .expect(HttpStatus.UNAUTHORIZED);
        });
        it('Create a Post - 200', async () => {
            const res = await api()
                .post(SETTINGS.API.POSTS)
                .auth(SETTINGS.LOGIN, SETTINGS.PASSWORD)
                .send(validPost.payload);

            expect(res.status).toBe(HttpStatus.CREATED);
            expect(Object.keys(res.body)).toHaveLength(7);

            expect(typeof res.body.id).toBe('string');
            expect(typeof res.body.title).toBe('string');
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

            newPost1 = res.body;
        });
        it('Create a Post - 200 - Duplicate', async () => {
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

            newPost2 = res.body;
        });
    });
    describe('GET /posts', () => {
        it('GET /posts', async () => {
            await api()
                .get(SETTINGS.API.POSTS)
                .expect(HttpStatus.OK, [newPost1, newPost2]);
        });
    });
    describe('GET /posts/:id', () => {
        newPost1IdUrl = SETTINGS.API.POSTS + '/' + newPost1.id;

        it('Get a Post - 404 invalid id', async () => {
            await api()
                .get(SETTINGS.API.POSTS + '/' + 1234)
                .expect(HttpStatus.NOT_FOUND);
        });
        it('Get a Post - 200', async () => {
            newPost1IdUrl = SETTINGS.API.POSTS + '/' + newPost1.id;
            const res = await api()
                .get(newPost1IdUrl)
                .expect(HttpStatus.OK);

            expect(Object.keys(res.body)).toHaveLength(7);

            expect(typeof res.body.id).toBe('string');
            expect(typeof res.body.title).toBe('string');
            expect(typeof res.body.shortDescription).toBe('string');
            expect(typeof res.body.blogId).toBe('string');
            expect(typeof res.body.blogName).toBe('string');
            expect(typeof res.body.createdAt).toBe('string');

            expect(res.body.title).toBe(newPost1.title);
            expect(res.body.shortDescription).toBe(newPost1.shortDescription);
            expect(res.body.blogId).toBe(newPost1.blogId);
            expect(res.body.blogName).toBe(newPost1.blogName);
            expect(res.body.createdAt).toBeTruthy();
            const date = new Date(res.body.createdAt);
            expect(date.toISOString()).toBe(res.body.createdAt);
            // @ts-ignore
            expect(date instanceof Date && !isNaN(date)).toBe(true);

        });
    });
    describe('PUT /posts/:id', () => {
        it('Update a Post - 404 invalid id', async () => {
            await api()
                .put(SETTINGS.API.POSTS + '/' + 1234)
                .send(validPost.payload)
                .auth(SETTINGS.LOGIN, SETTINGS.PASSWORD)
                .expect(HttpStatus.NOT_FOUND);
        });
        it('Update a Post - 404 no id', async () => {
            await api()
                .put(SETTINGS.API.POSTS + '/')
                .send(validPost.payload)
                .auth(SETTINGS.LOGIN, SETTINGS.PASSWORD)
                .expect(HttpStatus.NOT_FOUND);
        });
        it('Update a Post - 400 invalid Title', async () => {
            await api()
                .put(newPost1IdUrl)
                .send(invalidTitlePost.payload)
                .auth(SETTINGS.LOGIN, SETTINGS.PASSWORD)
                .expect(HttpStatus.BAD_REQUEST, invalidTitlePost.error);
        });
        it('Update a Post - 400 invalid Desc', async () => {
            await api()
                .put(newPost1IdUrl)
                .send(invalidDescPost.payload)
                .auth(SETTINGS.LOGIN, SETTINGS.PASSWORD)
                .expect(HttpStatus.BAD_REQUEST, invalidDescPost.error);
        });
        it('Update a Post - 400 invalid Content', async () => {
            await api()
                .put(newPost1IdUrl)
                .send(invalidContentPost.payload)
                .auth(SETTINGS.LOGIN, SETTINGS.PASSWORD)
                .expect(HttpStatus.BAD_REQUEST, invalidContentPost.error);
        });
        it('Update a Post - 400 invalid Blog Id', async () => {
            await api()
                .put(newPost1IdUrl)
                .send(invalidBlogIdPost.payload)
                .auth(SETTINGS.LOGIN, SETTINGS.PASSWORD)
                .expect(HttpStatus.BAD_REQUEST, invalidBlogIdPost.error);
        });
        it('Update a Post - 400 missing Title', async () => {
            await api()
                .put(newPost1IdUrl)
                .send(missingTitlePost.payload)
                .auth(SETTINGS.LOGIN, SETTINGS.PASSWORD)
                .expect(HttpStatus.BAD_REQUEST, missingTitlePost.error);
        });
        it('Update a Post - 400 missing Desc', async () => {
            await api()
                .put(newPost1IdUrl)
                .send(missingDescPost.payload)
                .auth(SETTINGS.LOGIN, SETTINGS.PASSWORD)
                .expect(HttpStatus.BAD_REQUEST, missingDescPost.error);
        });
        it('Update a Post - 400 missing Content', async () => {
            await api()
                .put(newPost1IdUrl)
                .send(missingContentPost.payload)
                .auth(SETTINGS.LOGIN, SETTINGS.PASSWORD)
                .expect(HttpStatus.BAD_REQUEST, missingContentPost.error);
        });
        it('Update a Post - 400 missing Blog Id', async () => {
            await api()
                .put(newPost1IdUrl)
                .send(missingIdPost.payload)
                .auth(SETTINGS.LOGIN, SETTINGS.PASSWORD)
                .expect(HttpStatus.BAD_REQUEST, missingIdPost.error);
        });
        it('Update a Post - 400 too long Title', async () => {
            await api()
                .put(newPost1IdUrl)
                .send(tooLongTitlePost.payload)
                .auth(SETTINGS.LOGIN, SETTINGS.PASSWORD)
                .expect(HttpStatus.BAD_REQUEST, tooLongTitlePost.error);
        });
        it('Update a Post - 400 too long Desc', async () => {
            await api()
                .put(newPost1IdUrl)
                .send(tooLongDescPost.payload)
                .auth(SETTINGS.LOGIN, SETTINGS.PASSWORD)
                .expect(HttpStatus.BAD_REQUEST, tooLongDescPost.error);

        });
        it('Update a Post - 400 too long Content', async () => {
            await api()
                .put(newPost1IdUrl)
                .send(tooLongContentPost.payload)
                .auth(SETTINGS.LOGIN, SETTINGS.PASSWORD)
                .expect(HttpStatus.BAD_REQUEST, tooLongContentPost.error);
        });
        it('Update a Post - 401 no auth', async () => {
            await api()
                .put(newPost1IdUrl)
                .expect(HttpStatus.UNAUTHORIZED);
        });
        it('Get a Post1 body for update', async () => {
            const res = await api()
                .get(newPost1IdUrl)
                .expect(HttpStatus.OK);

            postToUpdate = res.body;
        });
        it('Update a name in the Post - 204', async () => {
            postToUpdate.title = 'Updated Name';

            await api()
                .put(newPost1IdUrl)
                .send(postToUpdate)
                .auth(SETTINGS.LOGIN, SETTINGS.PASSWORD)
                .expect(HttpStatus.NO_CONTENT);
            const res = await api()
                .get(newPost1IdUrl)
                .expect(HttpStatus.OK);

            expect(postToUpdate.title).toEqual(res.body.title);
        });
        it('Update a description in the Post - 204', async () => {
            postToUpdate.shortDescription = 'Updated Desc';

            await api()
                .put(newPost1IdUrl)
                .send(postToUpdate)
                .auth(SETTINGS.LOGIN, SETTINGS.PASSWORD)
                .expect(HttpStatus.NO_CONTENT);
            const res = await api()
                .get(newPost1IdUrl)
                .expect(HttpStatus.OK);

            expect(postToUpdate.shortDescription).toEqual(res.body.shortDescription);
        });
        it('Update a Content in the Post - 204', async () => {
            postToUpdate.content = 'Updated Content';

            await api()
                .put(newPost1IdUrl)
                .send(postToUpdate)
                .auth(SETTINGS.LOGIN, SETTINGS.PASSWORD)
                .expect(HttpStatus.NO_CONTENT);
            const res = await api()
                .get(newPost1IdUrl)
                .expect(HttpStatus.OK);

            expect(postToUpdate.content).toEqual(res.body.content);
        });
        it('Update a Blog Id in the Post - 204', async () => {
            const blog = await api()
                .post(SETTINGS.API.BLOGS)
                .send(validBlog.payload)
                .auth(SETTINGS.LOGIN, SETTINGS.PASSWORD)
                .expect(HttpStatus.CREATED);

            postToUpdate.blogId = blog.body.id.toString();

            await api()
                .put(newPost1IdUrl)
                .send(postToUpdate)
                .auth(SETTINGS.LOGIN, SETTINGS.PASSWORD)
                .expect(HttpStatus.NO_CONTENT);
            const res = await api()
                .get(newPost1IdUrl)
                .expect(HttpStatus.OK);

            expect(postToUpdate.blogId).toEqual(res.body.blogId);
            newPost1 = postToUpdate;
        });
        it('Updated Post is getting back with all Posts', async () => {
            await api()
                .get(SETTINGS.API.POSTS)
                .expect(HttpStatus.OK, [newPost1, newPost2]);
        });
    });
    describe('DELETE /posts/:id', () => {
        it('Delete a Post - 404 invalid id', async () => {
            await api()
                .delete(SETTINGS.API.POSTS + '/' + 1234)
                .auth(SETTINGS.LOGIN, SETTINGS.PASSWORD)
                .expect(HttpStatus.NOT_FOUND);
        });
        it('Delete a Post - 404 no id', async () => {
            await api()
                .delete(SETTINGS.API.POSTS + '/')
                .auth(SETTINGS.LOGIN, SETTINGS.PASSWORD)
                .expect(HttpStatus.NOT_FOUND);
        });
        it('Delete a Post - 401 no auth', async () => {
            await api()
                .delete(newPost1IdUrl)
                .expect(HttpStatus.UNAUTHORIZED);
        });
        it('Delete a Post - 204', async () => {
            await api()
                .delete(newPost1IdUrl)
                .auth(SETTINGS.LOGIN, SETTINGS.PASSWORD)
                .expect(HttpStatus.NO_CONTENT);
        });
        it('Delete a Post second time- 404', async () => {
            await api()
                .delete(newPost1IdUrl)
                .auth(SETTINGS.LOGIN, SETTINGS.PASSWORD)
                .expect(HttpStatus.NOT_FOUND);
        });
        it('Get a deleted Post - 404', async () => {
            await api()
                .get(newPost1IdUrl)
                .expect(HttpStatus.NOT_FOUND);
        });
        it('Deleted Post is not returned with all posts', async () => {
            await api()
                .get(SETTINGS.API.POSTS)
                .expect(HttpStatus.OK, [newPost2]);
        });
    });
    afterAll(async () => {
        await client.close();
    });
});