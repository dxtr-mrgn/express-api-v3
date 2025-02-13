import {BlogConstructType, BlogInputType} from '../../blogs/types/blog-types';
import {client} from '../../db/mongodb';
import {DeleteResult, ObjectId} from 'mongodb';
import {SETTINGS} from '../../settings';
import {UserConstructType, UserDBType, UsersDBType} from '../types/user-type';

export const userCollection = client.db(SETTINGS.DB_NAME).collection('Users');
console.log('MongoDB Name: ' + SETTINGS.DB_NAME);

export const userRepository = {
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
    async findByLoginOrEmail(loginOrEmail: string) {
        return await this.getUsers({$match: {$or: [{login: loginOrEmail}, {email: loginOrEmail}]}})
    },
    async findByLogin(login: string) {
        return await this.getUsers({$match: {login: login}})
    },
    async findByEmail(email: string) {
        return await this.getUsers({$match: {email: email}})
    },
    async deleteAllUsers() {
        await userCollection.deleteMany({});
    },
    async createUser(newUser: UserConstructType): Promise<any> {
        const res = await userCollection.insertOne(newUser);
        return await this.getUsers([{$match: {_id: new ObjectId(res.insertedId)}}]);
    },
    async findUsers(filterDto: {
        searchLoginTerm: string | null,
        searchEmailTerm: string | null,
        sortBy: string,
        sortDirection: string,
        pageNumber: number,
        pageSize: number,
    }): Promise<UserDBType[]> {
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

        matchFilter;

        aggregateFilter.push({$match: matchFilter});
        aggregateFilter.push({$sort: {[sortBy]: sortDirection === 'asc' ? 1 : -1}});
        aggregateFilter.push({$skip: (pageNumber - 1) * pageSize});
        aggregateFilter.push({$limit: pageSize});

        return this.getUsers(aggregateFilter);
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
    },
    async deleteUser(id: string): Promise<number> {
        const res: DeleteResult = await userCollection.deleteOne({_id: new ObjectId(id)});

        return res.deletedCount;
    }
};
