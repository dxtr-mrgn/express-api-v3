import {BlogConstructType, BlogInputType} from '../../blogs/types/blog-types';
import {client} from '../../db/mongodb';
import {DeleteResult, ObjectId} from 'mongodb';
import {SETTINGS} from '../../settings';
import {UserConstructType, UserDBType, UsersDBType} from '../types/user-type';

export const userCollection = client.db(SETTINGS.DB_NAME).collection('Users');
console.log('MongoDB Name: ' + SETTINGS.DB_NAME);

export const userRepository = {
    async deleteAllUsers() {
        await userCollection.deleteMany({});
    },
    async createUser(newUser: UserConstructType): Promise<any> {
        const res = await userCollection.insertOne(newUser);
        return res.insertedId;
    },
    async deleteUser(id: string): Promise<number> {
        const res: DeleteResult = await userCollection.deleteOne({_id: new ObjectId(id)});

        return res.deletedCount;
    },
    async findByLoginOrEmail(loginOrEmail: string) {
        return (await this.getUsers({$match: {$or: [{login: loginOrEmail}, {email: loginOrEmail}]}}))[0]
    },
    async findByLogin(login: string) {
        return await this.getUsers({$match: {login: login}})
    },
    async findByEmail(email: string) {
        return await this.getUsers({$match: {email: email}})
    },
    async getUsers(filter?: any): Promise<any> {
        const users = await userCollection.aggregate([
            filter,
            {
                $project: {
                    _id: 0,
                    id: '$_id',
                    login: 1,
                    email: 1,
                    passwordHash: 1,
                    passwordSalt: 1,
                    createdAt: 1,
                }
            }]).toArray();

        return users;
    },
};
