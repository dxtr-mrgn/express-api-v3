import {HttpStatus, SETTINGS} from '../../src/settings';
import {defaultBlogResponse} from '../datasets/blogs';
import request from 'supertest';
import {app} from '../../src/app';
import {defaultPostResponse} from '../datasets/posts';
import {defaultUserResponse} from '../datasets/users';
import chalk from 'chalk';

const api = () => request(app);

export const clearDB = async (): Promise<void> => {
    await api()
        .delete(SETTINGS.API.ALL_DATA)
        .expect(HttpStatus.NO_CONTENT);

    await api()
        .get(SETTINGS.API.BLOGS)
        .expect(HttpStatus.OK, {
            ...defaultBlogResponse,
            items: []
        });
    await api()
        .get(SETTINGS.API.POSTS)
        .expect(HttpStatus.OK, {
            ...defaultPostResponse,
            items: []
        });
    await api()
        .get(SETTINGS.API.USERS)
        .auth(SETTINGS.LOGIN, SETTINGS.PASSWORD)
        .expect(HttpStatus.OK, {
            ...defaultUserResponse,
            items: []
        });

    console.log(chalk.bgWhiteBright(chalk.blackBright('DB has been cleared')));
};