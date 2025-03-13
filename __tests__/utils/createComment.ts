import request from 'supertest';
import {app} from '../../src/app';
import {createPost} from './createPost';
import {HttpStatus, SETTINGS} from '../../src/settings';

export const createComment = async (accessToken: any) => {
    const post = await createPost();
    console.log(post);
    const url = SETTINGS.API.POSTS + '/' + post.id + '/comments';

    const res = await request(app)
        .post(url)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(
            {
                'content': 'stringstringstringst'
            })
        .expect(HttpStatus.CREATED);

    return res.body;

};