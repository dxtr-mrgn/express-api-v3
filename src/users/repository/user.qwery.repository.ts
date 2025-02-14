import {BlogConstructType, BlogInputType} from '../../blogs/types/blog-types';
import {client} from '../../db/mongodb';
import {DeleteResult, ObjectId} from 'mongodb';
import {SETTINGS} from '../../settings';
import {UserConstructType, UserDBType, UsersDBType} from '../types/user-type';
import {userRepository} from './user-repository';

export const userCollection = client.db(SETTINGS.DB_NAME).collection('Users');
console.log('MongoDB Name: ' + SETTINGS.DB_NAME);

export const userQwRepository = {
    async getUsers(filter?: any): Promise<any> {
        const users = await userCollection.aggregate([
            ...filter,
            {
                $project: {
                    _id: 0,
                    id: '$_id',
                    login: 1,
                    email: 1,
                    createdAt: 1,
                }
            }]).toArray();

        return users;
    },
    async findUserById(id: string): Promise<any> {
        return (await this.getUsers([{$match: {_id: new ObjectId(id)}}]))[0];
    },
    async findUsers(filterDto: {
        searchLoginTerm: string | null,
        searchEmailTerm: string | null,
        sortBy: string,
        sortDirection: string,
        pageNumber: number,
        pageSize: number,
    }): Promise<UsersDBType> {
        const filter: any = {};
        let matchFilter = {};
        const aggregateFilter: any = [];
        const {searchLoginTerm, searchEmailTerm, sortBy, sortDirection, pageNumber, pageSize} = filterDto;

        if (searchLoginTerm) {
            filter.email = RegExp(searchLoginTerm, 'i');
            matchFilter = filter
        }
        if (searchEmailTerm) {
            filter.login = RegExp(searchEmailTerm, 'i');
            if (searchLoginTerm) {
                matchFilter = {$or: [...filter]};
            }
        }

        aggregateFilter.push({$match: matchFilter});
        aggregateFilter.push({$sort: {[sortBy]: sortDirection === 'asc' ? 1 : -1}});
        aggregateFilter.push({$skip: (pageNumber - 1) * pageSize});
        aggregateFilter.push({$limit: pageSize});

        const users =  await this.getUsers(aggregateFilter);
        const userCount = await this.getUsersCount(searchLoginTerm, searchEmailTerm);

        return {
            pagesCount: Math.ceil(userCount / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: userCount,
            items: users
        };
    },
    async getUsersCount(searchLoginTerm: string | null, searchEmailTerm: string | null): Promise<number> {
        const filter: any = {};

        if (searchLoginTerm) {
            filter.email = RegExp(searchLoginTerm, 'i');
        }
        if (searchEmailTerm) {
            filter.login = RegExp(searchEmailTerm, 'i');
        }
        return userCollection.countDocuments(filter);
    }
};
