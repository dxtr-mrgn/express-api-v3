import {body, param} from 'express-validator';
import {blogCollection} from '../repositories/blog-repository';

export const paramIdValidator = param('id')
    .notEmpty();

export const blogNameValidator = body('name')
    .trim()
    .notEmpty().withMessage('name is required')
    .isString().withMessage('name should be string')
    .custom(value => {
        if (typeof value !== 'string') {
            throw new Error('name should be string');
        }
        if (!isNaN(Number(value))) {
            throw new Error('name should be string');
        }
        return true;
    })
    .isLength({min: 1, max: 15}).withMessage('name should contain 1 - 15 characters');

export const blogDescriptionValidator = body('description')
    .trim()
    .notEmpty().withMessage('description is required')
    .isString().withMessage('description should be string')
    .custom(value => {
        if (typeof value !== 'string') {
            throw new Error('description should be string');
        }
        if (!isNaN(Number(value))) {
            throw new Error('description should be string');
        }
        return true;
    })
    .isLength({min: 1, max: 500}).withMessage('description should contain 1 - 500 characters');

export const blogWebsiteUrlValidator = body('websiteUrl')
    .trim()
    .notEmpty().withMessage('website url is required')
    .isString().withMessage('website url should be string')
    .custom(value => {
        if (typeof value !== 'string') {
            throw new Error('website url should be string');
        }
        if (!isNaN(Number(value))) {
            throw new Error('website url should be string');
        }
        return true;
    })
    .isLength({min: 1, max: 100}).withMessage('website url should contain 1 - 100 characters')
    .matches('^https://([a-zA-Z0-9_-]+\\.)+[a-zA-Z0-9_-]+(\\/[a-zA-Z0-9_-]+)*\\/?$').withMessage('website url must match URL pattern');


export const postTitleValidator = body('title')
    .trim()
    .notEmpty().withMessage('title is required')
    .isString().withMessage('title should be string')
    .custom(value => {
        if (typeof value !== 'string') {
            throw new Error('title should be string');
        }
        if (!isNaN(Number(value))) {
            throw new Error('title should be string');
        }
        return true;
    })
    .isLength({min: 1, max: 30}).withMessage('title should contain 1 - 30 characters');

export const postShortDescriptionValidator = body('shortDescription')
    .trim()
    .notEmpty().withMessage('shortDescription is required')
    .isString().withMessage('shortDescription should be string')
    .custom(value => {
        if (typeof value !== 'string') {
            throw new Error('shortDescription should be string');
        }
        if (!isNaN(Number(value))) {
            throw new Error('shortDescription should be string');
        }
        return true;
    })
    .isLength({min: 1, max: 100}).withMessage('shortDescription should contain 1 - 100 characters');

export const postContentValidator = body('content')
    .trim()
    .notEmpty().withMessage('content is required')
    .isString().withMessage('content should be string')
    .custom(value => {
        if (typeof value !== 'string') {
            throw new Error('content should be string');
        }
        if (!isNaN(Number(value))) {
            throw new Error('content should be string');
        }
        return true;
    })
    .isLength({min: 1, max: 1000}).withMessage('content should contain 1 - 1000 characters');

export const postBlogIdValidator = body('blogId')
    .trim()
    .notEmpty().withMessage('blogId is required')
    .isString().withMessage('blogId should be string')
    .custom(async (value) => { // Make the custom function asynchronous
        const blog: any = (await blogCollection.find({id: value}, {projection: {_id: 0}}).toArray())[0];
        if (!blog) {
            throw new Error('blogId is invalid');
        }
        return true;
    });
