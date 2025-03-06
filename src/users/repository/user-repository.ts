import {client} from '../../db/mongodb';
import {Collection, DeleteResult, ObjectId, WithId} from 'mongodb';
import {SETTINGS} from '../../settings';
import {UserType, ViewUserType} from '../types/user-type';

export const userCollection: Collection<UserType> = client
    .db(SETTINGS.DB_NAME)
    .collection<UserType>('Users');

export const userRepository = {
    async deleteAllUsers() {
        await userCollection.deleteMany({});
    },
    async createUser(newUser: UserType): Promise<any> {
        const res = await userCollection.insertOne(newUser);
        return res.insertedId;
    },
    async deleteUser(_id: ObjectId): Promise<number | null> {
        const res: DeleteResult = await userCollection.deleteOne({_id});

        return res.deletedCount;
    },
    async findByLoginOrEmail(loginOrEmail: string): Promise<WithId<UserType> | null> {
        return await userCollection.findOne({
            $or: [
                {login: loginOrEmail},
                {email: loginOrEmail}
            ]
        });
    },
    async findByLogin(login: string): Promise<WithId<UserType> | null> {
        return await userCollection.findOne({'accountData.login': login});
    },
    async findByEmail(email: string): Promise<WithId<UserType> | null> {
        return await userCollection.findOne({'accountData.email': email});
    },
    async findByConfirmationCode(code: string): Promise<WithId<UserType> | null> {
        return await userCollection.findOne({'emailConfirmation.confirmationCode': code});
    },
    async updateUserById(_id: ObjectId, updateData: Object): Promise<boolean> {
        const result = await userCollection.updateOne({_id}, {$set: updateData})
        return result.modifiedCount === 1
    }
};
