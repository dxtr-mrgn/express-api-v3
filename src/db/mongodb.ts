import {Collection, MongoClient} from 'mongodb';
import {SETTINGS} from '../settings';
import {PostDBType} from '../posts/types/post-types';
import {Document} from 'bson';
import {UserDBType} from '../users/types/user-type';
import {BlogDBType} from '../blogs/types/blog-types';
import {CommentDBType} from '../comments/types/comment-type';

interface DBConnection {
    client: MongoClient;
    isConnected: boolean;
}

class DatabaseService {
    private client: MongoClient | null = null;
    private dbConnection: DBConnection | null = null;
    private collections: Map<string, Collection<any>> = new Map();

    async connect(uri: string = SETTINGS.DB_URL): Promise<boolean> {
        try {
            if (this.dbConnection?.isConnected) {
                return true;
            }

            this.client = new MongoClient(uri);
            await this.client.connect();
            await this.client.db('test').command({ping: 1});

            this.dbConnection = {
                client: this.client,
                isConnected: true
            };

            console.log(`Database: Connected to ${uri}`);
            return true;
        } catch (error) {
            console.error('Database: Connection Error', error);
            await this.client?.close();
            this.dbConnection = null;
            this.client = null;
            return false;
        }
    }

    async disconnect(): Promise<void> {
        if (this.dbConnection?.isConnected && this.client) {
            await this.client?.close();
            this.dbConnection = null;
            this.client = null;
            this.collections.clear();
            console.log('Database: Disconnected');
        }
    }

    getCollection<T extends Document = Document>(name: string): Collection<T> {
        if (!this.dbConnection?.isConnected || !this.client) {
            throw new Error(`Database: Connection Error`);
        }
        if (this.collections.has(name)) {
            return this.collections.get(name) as Collection<T>;
        }
        const collection = this.client.db(SETTINGS.DB_NAME).collection<T>(name);
        this.collections.set(name, collection);
        return collection;
    }

    isConnected(): boolean {
        return !!this.dbConnection?.isConnected;
    }
}

const dbService = new DatabaseService();

export const connectDB = (uri?: string) =>
    dbService.connect(uri);

export const disconnectDB = () =>
    dbService.disconnect();

export const getPostsCollection = () =>
    dbService.getCollection<PostDBType>('Posts');

export const getBlogsCollection = () =>
    dbService.getCollection<BlogDBType>('Blogs');

export const getCommentsCollection = () =>
    dbService.getCollection<CommentDBType>('Comments');

export const getUsersCollection = () =>
    dbService.getCollection<UserDBType>('Users');