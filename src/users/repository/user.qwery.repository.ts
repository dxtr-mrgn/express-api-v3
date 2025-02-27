import {client} from '../../db/mongodb';
import {Collection, ObjectId, WithId} from 'mongodb';
import {SETTINGS} from '../../settings';
import {UserInfoType, UserType, ViewUsersType, ViewUserType} from '../types/user-type';

export const userCollection: Collection<UserType> = client
    .db(SETTINGS.DB_NAME)
    .collection<UserType>('Users');

interface UserFilterDto {
    searchLoginTerm: string;
    searchEmailTerm: string;
    sortBy: string;
    sortDirection: 'asc' | 'desc';
    pageNumber: number;
    pageSize: number;
}

const toIdString = (id: ObjectId): string => id.toString();

export const userQwRepository = {
    async findUserById(id: string): Promise<ViewUserType | null> {
        try {
            const user: WithId<UserType> | null = await userCollection.findOne({_id: new ObjectId(id)});
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
                userId: toIdString(user.id),
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

        const filter = this.combineSearchFilter(searchLoginTerm, searchEmailTerm);

        const users: WithId<UserType>[] = await userCollection
            .find(filter)
            .sort({[sortBy]: sortDirection === 'asc' ? 1 : -1})
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .toArray();

        const userCount = await userCollection.countDocuments(filter);

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

    mapUser(user: WithId<UserType>): ViewUserType {
        return {
            id: user._id,
            login: user.login,
            email: user.email,
            createdAt: user.createdAt
        };
    },
    mapUsers(users: WithId<UserType>[]): ViewUserType[] {
        return users.map(comment => this.mapUser(comment));
    }
};
