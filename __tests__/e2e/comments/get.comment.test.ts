import request from 'supertest';
import {app} from '../../../src/app';
import {HttpStatus, SETTINGS} from '../../../src/settings';
import {connectDB, disconnectDB} from '../../../src/db/mongodb';
import {clearDB} from '../../utils/clearDB';
import {createComment} from '../../utils/createComment';
import {createUser, getToken} from '../../utils/createUser';
import {MongoMemoryServer} from 'mongodb-memory-server';

const api = () => request(app);

describe('GET /comments/:id', () => {
    let comment: any;
    let user: any;
    let accessToken: any;
    let mongoServer: MongoMemoryServer;

    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        await connectDB(mongoServer.getUri());
        await clearDB();

        user = await createUser();
        accessToken = await getToken(user);

        comment = await createComment(accessToken);
        console.log(comment);
    });
    afterAll(async () => {
        await disconnectDB();
        await mongoServer.stop();
    });
    it('404', async () => {
        const url = SETTINGS.API.COMMENTS + '/' + comment.id.replace(/...$/, '666');
        console.log(url);
        const res = await api()
            .get(url)
            .expect(HttpStatus.NOT_FOUND);
    });
    it('200', async () => {
        const url = SETTINGS.API.COMMENTS + '/' + comment.id;
        console.log(url);
        const res = await api()
            .get(url)
            .expect(HttpStatus.OK, comment);

        expect(Object.keys(res.body)).toHaveLength(4);

        expect(typeof res.body.id).toBe('string');
        expect(typeof res.body.content).toBe('string');
        expect(typeof res.body.commentatorInfo).toBe('object');
        expect(typeof res.body.commentatorInfo.userId).toBe('string');
        expect(typeof res.body.commentatorInfo.userLogin).toBe('string');
        expect(typeof res.body.createdAt).toBe('string');

        expect(res.body.content).toBe('stringstringstringst');

        expect(res.body.commentatorInfo.userId).toBe(user.id);
        expect(res.body.commentatorInfo.userLogin).toBe(user.login);

        expect(res.body.createdAt).toBeTruthy();
        const date = new Date(res.body.createdAt);
        expect(date.toISOString()).toBe(res.body.createdAt);
        // @ts-ignore
        expect(date instanceof Date && !isNaN(date)).toBe(true);
    });
});
