import express, {Request, Response} from 'express';
import {HttpStatus, SETTINGS} from './settings';
import {postRouter} from './controllers/post-controller';
import {blogRouter} from './controllers/blog-controller';
import {blogService} from './service/blog-service';
import {postService} from './service/post-service';


export const app = express();

app.use(express.json());

app.get('/', (req: Request, res: Response): void => {
    res.send({'Version': 'BLL 3.0'});
});

app.delete(SETTINGS.API.ALL_DATA, async (req: Request, res: Response): Promise<void> => {
    await postService.deleteAllPosts();
    await blogService.deleteAllBlogs();
    res.sendStatus(HttpStatus.NO_CONTENT);
});

app.use(SETTINGS.API.POSTS, postRouter);
app.use(SETTINGS.API.BLOGS, blogRouter);