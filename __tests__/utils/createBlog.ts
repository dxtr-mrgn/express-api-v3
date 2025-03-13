import {HttpStatus, SETTINGS} from '../../src/settings';
import {validBlog} from '../datasets/blogs';
import request from 'supertest';
import {app} from '../../src/app';
import {BlogDBType, ViewBlogType} from '../../src/blogs/types/blog-types';
import chalk from 'chalk';
import {toIdString} from '../../src/common/helper';

const api = () => request(app);

export const createBlog = async (): Promise<ViewBlogType> => {
    const res = await api()
        .post(SETTINGS.API.BLOGS)
        .send(validBlog.payload)
        .auth(SETTINGS.LOGIN, SETTINGS.PASSWORD)
        .expect(HttpStatus.CREATED);

    console.log(chalk.bgGreenBright(chalk.whiteBright('  New Blog has been created  ')));
    console.log(res.body);
    console.log(chalk.bgGreenBright(chalk.blackBright(' '.repeat(30))));
    return res.body
};

export const getValidBlogId = async (): Promise<string> => {
    const blog = await createBlog()
    return blog.id
}