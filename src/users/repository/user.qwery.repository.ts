import {Collection, ObjectId} from 'mongodb';
import {UserDBType, UserInfoType, ViewUsersType, ViewUserType} from '../types/user-type';
import {getUsersCollection} from '../../db/mongodb';
import {toIdString} from '../../common/helper';

interface UserFilterDto {
    searchLoginTerm: string;
    searchEmailTerm: string;
    sortBy: string;
    sortDirection: 'asc' | 'desc';
    pageNumber: number;
    pageSize: number;
}

export const userQwRepository = {
    async getCollection(): Promise<Collection<UserDBType>> {
        return getUsersCollection();
    },

    async findUserById(id: string): Promise<ViewUserType | null> {
        const collection = await this.getCollection();
        try {
            const user: UserDBType | null = await collection.findOne({_id: new ObjectId(id)});
            return user ? this.mapUser(user) : null;
        } catch (e) {
            console.error('Invalid ObjectId:', e);
            return null;
        }
    },

    async getUserInfo(id: string): Promise<UserInfoType | null> {
        const user = await this.findUserById(id);
        return user
            ? {
                email: user.email,
                login: user.login,
                userId: user.id
            }
            : null;
    },

    async findUsers({
                        searchLoginTerm,
                        searchEmailTerm,
                        sortBy,
                        sortDirection,
                        pageNumber,
                        pageSize,
                    }: UserFilterDto): Promise<ViewUsersType> {
        const collection = await this.getCollection();
        const filter = this.combineSearchFilter(searchLoginTerm, searchEmailTerm);

        const users: UserDBType[] = await collection
            .find(filter)
            .sort({[sortBy]: sortDirection === 'asc' ? 1 : -1})
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .toArray();

        const userCount = await collection.countDocuments(filter);

        return {
            pagesCount: Math.ceil(userCount / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: userCount,
            items: this.mapUsers(users)
        };
    },

    combineSearchFilter(searchLoginTerm: string, searchEmailTerm: string): any {
        const condition: object[] = [];

        if (searchLoginTerm) {
            condition.push({login: new RegExp(searchLoginTerm, 'i')});
        }
        if (searchEmailTerm) {
            condition.push({email: new RegExp(searchEmailTerm, 'i')});
        }
        return condition.length > 0 ? {$or: condition} : {};
    },

    mapUser(user: UserDBType): ViewUserType {
        return {
            id: toIdString(user._id),
            login: user.login,
            email: user.email,
            createdAt: user.createdAt
        };
    },
    mapUsers(users: UserDBType[]): ViewUserType[] {
        return users.map(comment => this.mapUser(comment));
    }
};
