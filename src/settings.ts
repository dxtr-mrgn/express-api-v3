import {config} from 'dotenv';

config();

export const SETTINGS = {
    PORT: process.env.PORT || 3005,
    API: {
        BLOGS: '/blogs',
        POSTS: '/posts',
        ALL_DATA: '/testing/all-data'
    },
    LOGIN: 'admin',
    PASSWORD: 'qwerty',
    DB_URL: process.env.MONGO_URL || 'mongodb://localhost:27017',
    DB_NAME: process.env.DB_NAME || 'test',
};

export const enum HttpStatus {
    OK = 200,
    CREATED = 201,
    NO_CONTENT = 204,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    NOT_FOUND = 404
}