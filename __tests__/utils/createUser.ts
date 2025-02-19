import {HttpStatus, SETTINGS} from '../../src/settings';
import request from 'supertest';
import {app} from '../../src/app';
import chalk from 'chalk';
import {PostDBType} from '../../src/posts/types/post-types';

const api = () => request(app);

function getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
}

export const createUser = async (data?: any): Promise<PostDBType> => {
    const randomLogin = 'a' + (getRandomInt(9) * 100 + getRandomInt(9));
    const payload = data ? data : {
        login: randomLogin,
        password: 'validpassword123',
        email: randomLogin + '@gmail.com'
    };
    const res = await api()
        .post(SETTINGS.API.USERS)
        .auth(SETTINGS.LOGIN, SETTINGS.PASSWORD)
        .send(payload);

    expect(res.status).toBe(HttpStatus.CREATED);

    console.log(chalk.bgGreenBright(chalk.whiteBright('  New User has been created  ')));
    console.log(res.body);
    console.log(chalk.bgGreenBright(chalk.blackBright(' '.repeat(30))));
    return res.body;
};