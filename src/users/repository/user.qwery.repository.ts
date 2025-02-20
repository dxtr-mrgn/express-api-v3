import {BlogConstructType, BlogInputType} from '../../blogs/types/blog-types';
import {client} from '../../db/mongodb';
import {DeleteResult, ObjectId} from 'mongodb';
import {SETTINGS} from '../../settings';
import {UserConstructType, UserDBType, UserInfoType, UsersDBType} from '../types/user-type';
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
    async findUserById(id: string): Promise<UserDBType> {
        return (await this.getUsers([{$match: {_id: new ObjectId(id)}}]))[0];
    },
    async getUserInfo(id: string): Promise<UserInfoType> {
        const user = await this.findUserById(id);
        return {
            email: user.email,
            login: user.login,
            userId: user.id
        };
    },
    async findUsers(filterDto: {
        searchLoginTerm: string,
        searchEmailTerm: string,
        sortBy: string,
        sortDirection: string,
        pageNumber: number,
        pageSize: number,
    }): Promise<UsersDBType> {
        const aggregateFilter: any = [];
        const {searchLoginTerm, searchEmailTerm, sortBy, sortDirection, pageNumber, pageSize} = filterDto;

        const filter = this._combineSearchFilter(searchLoginTerm, searchEmailTerm);
        aggregateFilter.push({$match: filter});
        aggregateFilter.push({$sort: {[sortBy]: sortDirection === 'asc' ? 1 : -1}});
        aggregateFilter.push({$skip: (pageNumber - 1) * pageSize});
        aggregateFilter.push({$limit: pageSize});

        const users = await this.getUsers(aggregateFilter);
        const userCount = await this.getUsersCount(searchLoginTerm, searchEmailTerm);

        return {
            pagesCount: Math.ceil(userCount / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: userCount,
            items: users
        };
    },
    async getUsersCount(searchLoginTerm: string, searchEmailTerm: string): Promise<number> {
        const filter = this._combineSearchFilter(searchLoginTerm, searchEmailTerm);
        return userCollection.countDocuments(filter);
    },

    _combineSearchFilter(searchLoginTerm: string, searchEmailTerm: string): any {
        let matchFilter: any = {$or: new Array()};

        if (searchLoginTerm) {
            matchFilter.$or.push({login: RegExp(searchLoginTerm, 'i')});
        }
        if (searchEmailTerm) {
            matchFilter.$or.push({email: RegExp(searchEmailTerm, 'i')});
        } else if (!searchEmailTerm && !searchLoginTerm) {
            matchFilter = {};
        }

        return matchFilter;
    }
};
