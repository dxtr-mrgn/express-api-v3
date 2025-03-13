import request from 'supertest';
import {app} from '../../../src/app';
import {HttpStatus, SETTINGS} from '../../../src/settings';
import {connectDB, disconnectDB} from '../../../src/db/mongodb';
import {clearDB} from '../../utils/clearDB';
import {createPost} from '../../utils/createPost';
import {createUser, getToken} from '../../utils/createUser';
import {contentLengthError, contentTypeError} from '../../datasets/comments';
import {MongoMemoryServer} from 'mongodb-memory-server';

const api = () => request(app);

describe('POST / GET /posts/:postId/comments', () => {
    let user1: any = '';
    let user1Token: any = '';
    let user2: any = '';
    let user2Token: any = '';
    let post: any = {};
    let commentUrl: any = '';
    let comment1: any = '';
    let comment2: any = '';
    let mongoServer: MongoMemoryServer;

    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        await connectDB(mongoServer.getUri());
        await clearDB();

        post = await createPost();
        user1 = await createUser();
        user1Token = await getToken(user1);
        user2 = await createUser();
        user2Token = await getToken(user2);

        commentUrl = SETTINGS.API.POSTS + '/' + post.id + '/comments';

    });
    afterAll(async () => {
        await disconnectDB();
        await mongoServer.stop();
    });

    describe('4xx ', () => {
        it('404 Post does not exist', async () => {
            const url = SETTINGS.API.POSTS + '/' + post.id.replace(/...$/, '666') + '/comments';
            console.log(url);
            const res = await api()
                .post(url)
                .set('Authorization', `Bearer ${user1Token}`)
                .send(
                    {
                        'content': 'stringstringstringst'
                    })
                .expect(HttpStatus.NOT_FOUND);
        });
        it('401 Unauthorized', async () => {
            console.log(commentUrl);
            const res = await api()
                .post(commentUrl)
                .send(
                    {
                        'content': 'stringstringstringst'
                    })
                .set('Authorization', `Bearer fakeToken`)
                .expect(HttpStatus.UNAUTHORIZED);
        });
        it('401 Unauthorized', async () => {
            console.log(commentUrl);
            const res = await api()
                .post(commentUrl)
                .send(
                    {
                        'content': 'stringstringstringst'
                    })
                .set('Authorization', `Bearer`)
                .expect(HttpStatus.UNAUTHORIZED);
        });
        it('401 Unauthorized', async () => {
            console.log(commentUrl);
            const res = await api()
                .post(commentUrl)
                .send(
                    {
                        'content': 'stringstringstringstxxx'
                    })
                .expect(HttpStatus.UNAUTHORIZED);
        });
        it('400 Invalid content type', async () => {
            console.log(commentUrl);
            const res = await api()
                .post(commentUrl)
                .set('Authorization', `Bearer ${user1Token}`)
                .send(
                    {
                        'content': []
                    })
                .expect(HttpStatus.BAD_REQUEST, contentTypeError);
        });
        it('400 Too long content', async () => {
            console.log(commentUrl);
            const res = await api()
                .post(commentUrl)
                .set('Authorization', `Bearer ${user1Token}`)
                .send(
                    {
                        'content': 'stringstringstringstxxxstringstringstringstxxxstringstringstringstxxxstringstringstringstxxxstringstringstringstxxxstringstringstringstxxxstringstringstringstxxxstringstringstringstxxxstringstringstringstxxxstringstringstringstxxxstringstringstringstxxxstringstringstringstxxxstringstringstringstxxxstringstringstringstxxxstringstringstringstxxxstringstringstringstxxxstringstringstringstxxx'
                    })
                .expect(HttpStatus.BAD_REQUEST, contentLengthError);
        });
        it('400 Too short content', async () => {
            console.log(commentUrl);
            const res = await api()
                .post(commentUrl)
                .set('Authorization', `Bearer ${user1Token}`)
                .send(
                    {
                        'content': 'XXX'
                    })
                .expect(HttpStatus.BAD_REQUEST, contentLengthError);
        });

    });
    describe('201', () => {
        it('201', async () => {
            console.log(commentUrl);
            const res = await api()
                .post(commentUrl)
                .set('Authorization', `Bearer ${user1Token}`)
                .send(
                    {
                        'content': 'stringstringstringst'
                    })
                .expect(HttpStatus.CREATED);

            expect(Object.keys(res.body)).toHaveLength(4);

            expect(typeof res.body.id).toBe('string');
            expect(typeof res.body.content).toBe('string');
            expect(typeof res.body.commentatorInfo).toBe('object');
            expect(typeof res.body.commentatorInfo.userId).toBe('string');
            expect(typeof res.body.commentatorInfo.userLogin).toBe('string');
            expect(typeof res.body.createdAt).toBe('string');

            expect(res.body.content).toBe('stringstringstringst');

            expect(res.body.commentatorInfo.userId).toBe(user1.id);
            expect(res.body.commentatorInfo.userLogin).toBe(user1.login);

            expect(res.body.createdAt).toBeTruthy();
            const date = new Date(res.body.createdAt);
            expect(date.toISOString()).toBe(res.body.createdAt);
            // @ts-ignore
            expect(date instanceof Date && !isNaN(date)).toBe(true);

            comment1 = res.body;
        });
        it('201 Another User', async () => {
            console.log(commentUrl);
            const res = await api()
                .post(commentUrl)
                .set('Authorization', `Bearer ${user2Token}`)
                .send(
                    {
                        'content': 'stringstringstringst'
                    })
                .expect(HttpStatus.CREATED);

            expect(Object.keys(res.body)).toHaveLength(4);

            expect(typeof res.body.id).toBe('string');
            expect(typeof res.body.content).toBe('string');
            expect(typeof res.body.commentatorInfo).toBe('object');
            expect(typeof res.body.commentatorInfo.userId).toBe('string');
            expect(typeof res.body.commentatorInfo.userLogin).toBe('string');
            expect(typeof res.body.createdAt).toBe('string');

            expect(res.body.content).toBe('stringstringstringst');

            expect(res.body.commentatorInfo.userId).toBe(user2.id);
            expect(res.body.commentatorInfo.userLogin).toBe(user2.login);

            expect(res.body.createdAt).toBeTruthy();
            const date = new Date(res.body.createdAt);
            expect(date.toISOString()).toBe(res.body.createdAt);
            // @ts-ignore
            expect(date instanceof Date && !isNaN(date)).toBe(true);

            comment2 = res.body;
        });
    });
    describe('GET', () => {
        it('404 Post does not exist', async () => {
            const url = SETTINGS.API.POSTS + '/' + post.id.replace(/...$/, '666') + '/comments';
            console.log(url);
            const res = await api()
                .get(url)
                .set('Authorization', `Bearer ${user1Token}`)
                .send(
                    {
                        'content': 'stringstringstringst'
                    })
                .expect(HttpStatus.NOT_FOUND);
        });
        it('200', async () => {
            console.log(commentUrl);
            const res = await api()
                .get(commentUrl)
                .expect(HttpStatus.OK, {
                    pagesCount: 1,
                    page: 1,
                    pageSize: 10,
                    totalCount: 2,
                    items: [comment2, comment1]
                });
        });
    });
});
