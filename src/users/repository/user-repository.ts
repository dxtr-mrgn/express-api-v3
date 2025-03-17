import {getUsersCollection} from '../../db/mongodb';
import {Collection, DeleteResult, ObjectId} from 'mongodb';
import {UserDBType} from '../types/user-type';


export const userRepository = {
    async getCollection(): Promise<Collection<UserDBType>> {
        return getUsersCollection();
    },

    async deleteAllUsers() {
        const collection = await this.getCollection();
        await collection.deleteMany({});
    },

    async createUser(newUser: Omit<UserDBType, '_id'>): Promise<any> {
        const collection = await this.getCollection();
        const res = await collection.insertOne(newUser as UserDBType);
        return res.insertedId;
    },

    async deleteUser(id: string): Promise<boolean> {
        const collection = await this.getCollection();
        const res: DeleteResult = await collection.deleteOne({_id: new ObjectId(id)});

        return res.deletedCount === 1;
    },

    async findByLoginOrEmail(loginOrEmail: string): Promise<UserDBType | null> {
        const collection = await this.getCollection();
        return await collection.findOne({
            $or: [
                {login: loginOrEmail},
                {email: loginOrEmail}
            ]
        });
    },

    async findByLogin(login: string): Promise<UserDBType | null> {
        const collection = await this.getCollection();
        return await collection.findOne({'login': login});
    },

    async findByEmail(email: string): Promise<UserDBType | null> {
        const collection = await this.getCollection();
        return await collection.findOne({'email': email});
    },

    async findByConfirmationCode(code: string): Promise<UserDBType | null> {
        const collection = await this.getCollection();
        return await collection.findOne({'emailConfirmation.confirmationCode': code});
    },

    async updateUserById(_id: ObjectId, updateData: Object): Promise<boolean> {
        const collection = await this.getCollection();
        const result = await collection.updateOne({_id}, {$set: updateData});
        return result.modifiedCount === 1;
    }
};
