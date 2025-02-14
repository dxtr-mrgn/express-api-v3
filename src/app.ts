import express, {Request, Response} from 'express';
import {HttpStatus, SETTINGS} from './settings';
import {postRouter} from './posts/controller/post-controller';
import {blogRouter} from './blogs/controller/blog-controller';
import {blogService} from './blogs/service/blog-service';
import {postService} from './posts/service/post-service';
import {userService} from './users/service/user-service';
import {userRouter} from './users/controller/user-controller';
import {authRouter} from './users/controller/auth-controller';


export const app = express();

app.use(express.json());

app.get('/', (req: Request, res: Response): void => {
    res.send({'Version': 'Auth 2.0'});
});

app.delete(SETTINGS.API.ALL_DATA, async (req: Request, res: Response): Promise<void> => {
    await postService.deleteAllPosts();
    await blogService.deleteAllBlogs();
    await userService.deleteAllUsers();
    res.sendStatus(HttpStatus.NO_CONTENT);
});

app.use(SETTINGS.API.POSTS, postRouter);
app.use(SETTINGS.API.BLOGS, blogRouter);
app.use(SETTINGS.API.USERS, userRouter);
app.use(SETTINGS.API.AUTH, authRouter);