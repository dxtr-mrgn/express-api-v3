import {SETTINGS} from '../../src/settings';
import request from 'supertest';
import {app} from '../../src/app';
import chalk from 'chalk';
import {validPost} from '../datasets/posts';
import {getValidBlogId} from './createBlog';
import {ViewPostType} from '../../src/posts/types/post-types';

const api = () => request(app);

export const createPost = async (): Promise<ViewPostType> => {
    validPost.payload.blogId = await getValidBlogId();

    const res = await api()
        .post(SETTINGS.API.POSTS)
        .auth(SETTINGS.LOGIN, SETTINGS.PASSWORD)
        .send(validPost.payload);

    console.log(chalk.bgGreenBright(chalk.whiteBright('  New Post has been created  ')));
    console.log(res.body);
    console.log(chalk.bgGreenBright(chalk.blackBright(' '.repeat(30))));
    return res.body;
};