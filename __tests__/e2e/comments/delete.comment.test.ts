import request from 'supertest';
import {app} from '../../../src/app';
import {HttpStatus, SETTINGS} from '../../../src/settings';
import {clearDB} from '../../utils/clearDB';
import {createComment} from '../../utils/createComment';
import {createUser, getToken} from '../../utils/createUser';
import {MongoMemoryServer} from 'mongodb-memory-server';
import {connectDB, disconnectDB} from '../../../src/db/mongodb';

const api = () => request(app);

describe('DELETE /comments/:id', () => {
    let comment: any;
    let user1: any;
    let user2: any;
    let accessToken1: any;
    let accessToken2: any;
    let mongoServer: MongoMemoryServer;

    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        await connectDB(mongoServer.getUri());
        await clearDB();

        user1 = await createUser();
        accessToken1 = await getToken(user1);

        user2 = await createUser();
        accessToken2 = await getToken(user2);

        comment = await createComment(accessToken1);
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
            .delete(url)
            .set('Authorization', `Bearer ${accessToken1}`)
            .expect(HttpStatus.NOT_FOUND);
    });
    it('403', async () => {
        const url = SETTINGS.API.COMMENTS + '/' + comment.id;
        console.log(url);
        const res = await api()
            .delete(url)
            .set('Authorization', `Bearer ${accessToken2}`)
            .expect(HttpStatus.FORBIDDEN);
    });
    it('204', async () => {
        const url = SETTINGS.API.COMMENTS + '/' + comment.id;
        console.log(url);
        const res = await api()
            .delete(url)
            .set('Authorization', `Bearer ${accessToken1}`)
            .expect(HttpStatus.NO_CONTENT);
    });
    it('404', async () => {
        const url = SETTINGS.API.COMMENTS + '/' + comment.id;
        console.log(url);
        const res = await api()
            .delete(url)
            .set('Authorization', `Bearer ${accessToken1}`)
            .expect(HttpStatus.NOT_FOUND);
    });
    it('401', async () => {
        const url = SETTINGS.API.COMMENTS + '/' + comment.id;
        console.log(url);
        const res = await api()
            .delete(url)
            .set('Authorization', `Bearer ${accessToken1}`)
            .expect(HttpStatus.NOT_FOUND);
    });
});
